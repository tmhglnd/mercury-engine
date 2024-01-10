
console.log(`
Mercury Engine by Timo Hoogland (c) 2023
	more info:
	https://www.timohoogland.com
	https://github.com/tmhglnd/mercury-playground
	https://github.com/tmhglnd/mercury-engine

`);

const Tone = require('tone');
const Util = require('./core/Util.js');
const { MercuryInterpreter } = require('./interpreter');
const { WebMidi } = require("webmidi");

// load extra AudioWorkletProcessors from file
// transformed to inline with browserify brfs
const fs = require('fs');
const fxExtensions = fs.readFileSync('./src/core/effects/Processors.js', 'utf-8');
Tone.getContext().addAudioWorkletModule(URL.createObjectURL(new Blob([ fxExtensions ], { type: 'text/javascript' })));

// Mercury main class controls Tone and loads samples
// also has the interpreter evaluating the code and adding the instruments
// 
class Mercury extends MercuryInterpreter {
	constructor({ onload, onmidi, hydra, p5canvas } = {}){
		// initalize the constructor of inheriting class with 
		// optionally a hydra and p5 canvas
		super({ hydra, p5canvas });

		// store sample files in buffers
		this.samples = JSON.parse(fs.readFileSync('./src/data/samples.json', 'utf-8'));

		// this.buffers = new Tone.ToneAudioBuffers();
		// add the buffers via function
		// this.addBuffers(['http://localhost:8080/mercury-engine/src/data/samples.json'])

		// setting parameters
		this.bpm;
		this.volume;
		this.lowPass;
		this.highPass;

		// effects on main output for Tone
		this.gain = new Tone.Gain(1);
		this.lowPassF = new Tone.Filter(18000, 'lowpass');
		this.highPassF = new Tone.Filter(5, 'highpass');
		Tone.Destination.chain(this.lowPassF, this.highPassF, this.gain);

		// an RMS meter for reactive visuals
		this.meter;

		// a recorder for the sound
		this.recorder = new Tone.Recorder({ mimeType: 'audio/webm' });
		this.gain.connect(this.recorder);

		// default settings
		this.setBPM(100);
		this.setVolume(1);
		this.setHighPass(18000);
		this.setLowPass(5);
		this.setCrossFade(250);

		// get the base url and add to the sample locations
		this.baseUrl = this.samples['_base'];
		delete this.samples['_base'];
		Object.keys(this.samples).forEach((s) => {
			this.samples[s] = this.baseUrl + this.samples[s];
		});
		// load the buffers from the github
		this.buffers = new Tone.ToneAudioBuffers({
			urls: this.samples,
			onload: () => {
				// console.log('Samples loaded', this.buffers);
				// executes a callback from the class constructor
				// if a callback is provided
				if (onload){ onload(); }
			}
		});
		// this.buffers = new Tone.ToneAudioBuffers();
		// this.addBuffers('https://raw.githubusercontent.com/tmhglnd/mercury-engine/main/src/data/samples.json', () => {
		// 	console.log('Samples loaded', this.buffers._buffers.keys());
		// });

		// the midi status, inputs and outputs
		this.midi = { enabled: false, inputs: [], outputs: [] };

		// WebMIDI Setup if supported by the browser
		// Else `midi` not supported in the Mercury code
		WebMidi.enable((error) => {
			if (error) {
				console.error(`WebMIDI not enabled: ${error}`);
			} else {
				this.midi.enabled = true;

				console.log(`WebMIDI enabled`);
				if (WebMidi.inputs.length < 1){
					console.log(`No MIDI device detected`);
				} else {
					this.midi.inputs = WebMidi.inputs;
					this.midi.outputs = WebMidi.outputs;
					
					WebMidi.inputs.forEach((device, index) => {
						console.log(`in ${index}: ${device.name}`);
					});
					WebMidi.outputs.forEach((device, index) => {
						console.log(`out ${index}: ${device.name}`);
					});
				}
				// execute a callback when midi is loaded if provided
				if (onmidi) { onmidi(); }
			}
		});
	}

	// resume webaudio and transport
	resume(){
		try {
			Tone.start();

			if (Tone.Transport.state !== 'started'){
				Tone.Transport.timeSignature = [4, 4];
				// a bit latency on start for safety
				Tone.Transport.start('+0.1');
				// console.log('Resumed Transport');
			}
		} catch {
			console.error('Error starting Transport');
		}
	}

	// stop the transport and all the sounds
	silence(){
		try {
			// fade out and remove code after 100ms
			this.removeSounds(this.sounds, 0.1);
			// Stops instead of pause so restarts at 0
			Tone.Transport.stop(Tone.now()+0.1);
			return true;
			// console.log('Stopped Transport');
		} catch {
			console.error('Error stopping Transport');
			return false;
		}
	}

	// set the bpm and optionally ramp in milliseconds
	setBPM(bpm, ramp=0) {
		this.bpm = bpm;
		let t = Util.divToS(ramp, bpm);
		if (t > 0){
			Tone.Transport.bpm.rampTo(bpm, t);
		} else {
			Tone.Transport.bpm.setValueAtTime(bpm, Tone.now());
		}
	}

	// return the current bpm
	getBPM(){
		return Tone.Transport.bpm.value;
	}

	// generate a random bpm between 75 and 150
	randomBPM(){
		let bpm = Math.floor(Math.random() * 75) + 75.0;
		this.setBPM(bpm);
	}

	// add files to the buffer from a single File Link
	// an array or file paths, or a json of { name:file, ... }
	// optional callback function called when all files are loaded
	addBuffers(uploads, callback){
		// make sure uploades is an array to iterate over
		uploads = Array.isArray(uploads)? uploads : [uploads];

		let promises = [];

		// for every file from uploads
		uploads.forEach((file) => {
			let n = file;
			let url = file;
			if (file.name){
				// get the filename from File object
				n = file.name;
				url = URL.createObjectURL(file);
			}
			if (Array.isArray(file)){
				// if array use first value as the name
				n = file[0];
				url = file[1];
			}
			if (n.endsWith('.json')){
				// read from json if loaded is a json file
				promises.push(Promise.resolve(this.addBufferFromJson(url)));
			} else {
				// otherwise read the soundfile regularly
				promises.push(Promise.resolve(this.addBufferFromURL(url, n)));
			}
		});

		Promise.all(promises).then((values, reject) => {
			if (callback) { callback(); }
		});
	}

	// add a single file to the buffer from URL
	// use the name as reference in the buffer
	// if name is undefined it will be constructed from the URL
	// 
	async addBufferFromURL(url, n){
		// get file name from url string
		n = n.split('\\').pop().split('/').pop();
		// remove extension 
		n = n.replace(/\.\w+/g, '');
		// replace whitespaces with _
		n = n.replace(/[\s]+/g, '_');
		// remove leading/trailing whitespace
		n = n.trim().replace(/[\s]+/g, '_');

		// add to ToneAudioBuffers
		this.buffers.add(n, url, () => {
			Util.log(`sound added as: ${n}`);
			URL.revokeObjectURL(url);

			// also add soundfiles to menu for easy selection
			// let m = document.getElementById('sounds');
			// let o = document.createElement('option');
			// o.value = o.innerHTML = n;
			// m.appendChild(o);
		}, (e) => {
			Util.log(`error adding sound from: ${n}`);
		});
	}

	async addBufferFromJson(url){
		// get the json file via fetch
		let response = await fetch(url);
		let files = await response.json();
		// if there is a _base use that as the start of the url
		let base = files['_base'];
		delete files['_base'];

		Object.keys(files).forEach((f) => {
			if (Array.isArray(files[f])){
				let idx = 0;
				files[f].forEach((i) => {
					// when array is used increment the filename with _x
					let u = (base)? base + i : i;
					let n = (idx > 0)? f + '_' + idx : f;
					this.addBufferFromURL(u, n);
					idx++;
				});
			} else {
				if (base){
					files[f] = base + files[f];
				}
				this.addBufferFromURL(files[f], f);
			}
		});
	}

	// get all the contents of the buffers
	getBuffers(){
		return this.buffers;
	}

	// set lowpass frequency cutoff and ramptime
	setLowPass(f, t=0){
		this.lowPass = (f === 'default')? 18000 : f;
		t = Util.divToS(t, this.bpm);
		if (t > 0){
			this.lowPassF.frequency.rampTo(this.lowPass, t, Tone.now());
		} else {
			this.lowPassF.frequency.setValueAtTime(this.lowPass, Tone.now());
		}
	}

	// set highpass frequency cutoff and ramptime
	setHighPass(f, t=0){
		this.highPass = (f === 'default')? 5 : f;
		t = Util.divToS(t, this.bpm);
		if (t > 0){
			this.highPassF.frequency.rampTo(this.highPass, t, Tone.now());
		} else {
			this.highPassF.frequency.setValueAtTime(this.highPass, Tone.now());
		}
	}

	// set volume in floatingpoint and ramptime
	setVolume(v, t=0){
		this.volume = (v === 'default')? 1 : v;
		t = Util.divToS(t, this.bpm);
		if (t > 0){
			this.gain.gain.rampTo(this.volume, t, Tone.now());
		} else {
			this.gain.gain.setValueAtTime(this.volume, Tone.now());
		}
	}

	// get the volume as float between 0-1
	getVolume(){
		return this.gain.gain.value;
	}

	// a recording function
	// default starts recording, a false/0 stops recording
	// optionally add a filename to the downloading file
	async record(start=true, file='recoring'){
		try {
			if (start){
				// star the recording
				this.recorder.start();
			} else {
				// stop the recording and return blob
				const recording = await this.recorder.stop();
				const url = URL.createObjectURL(recording);
				// download via anchor element
				const anchor = document.createElement('a');
				anchor.download = `${file}.webm`;
				anchor.href = url;
				anchor.click();
			}
		} catch(e) {
			Util.log(`Error starting/stopping recording ${e}`);
		}
	}

	// returns 'started' if the recording has started
	isRecording(){
		return this.recorder.state;
	}

	// add a Tone RMS meter to use for signal analysis
	addMeter(smooth=0.7){
		this.meter = new Tone.Meter(smooth);
		this.meter.normalRange = true;
		this.gain.connect(this.meter);
	}

	// return the meter value as float betwee 0-1
	getMeter(){
		return this.meter.getValue();
	}

	// get the webaudio context Mercury is producing sound on
	// getContext(){
	// 	return Tone.getContext();
	// }

	// get the destination output Mercury is sending sound to
	// getDestination(){
	// 	return Tone.getDestination();
	// }
}
module.exports = { Mercury };