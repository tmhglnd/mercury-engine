
console.log(`
Mercury Engine by Timo Hoogland (c) 2023
	more info:
	https://www.timohoogland.com
	https://mercury.timohoogland.com
	https://github.com/tmhglnd/mercury

`);

const Tone = require('tone');
const { MercuryInterpreter } = require('./interpreter');

// load extra AudioWorkletProcessors from file
// transformed to inline with browserify brfs
const fs = require('fs');
const fxExtensions = fs.readFileSync('./src/core/effects/Processors.js', 'utf-8');
Tone.getContext().addAudioWorkletModule(URL.createObjectURL(new Blob([ fxExtensions ], { type: 'text/javascript' })));

// Mercury main class controls Tone and loads samples
// also has the interpreter evaluating the code and adding the instruments
// 
class Mercury extends MercuryInterpreter {
	constructor(callback){
		// initalize the constructor of inheriting class
		super();
		// store sample files in buffers
		this.samples = require('./data/samples.json');

		// this.buffers = new Tone.ToneAudioBuffers();
		// add the buffers via function
		// this.addBuffers(['http://localhost:8080/mercury-engine/src/data/samples.json'])

		// effects on main output for Tone
		this.gain = new Tone.Gain(1);
		this.lowPass = new Tone.Filter(18000, 'lowpass');
		this.highPass = new Tone.Filter(5, 'highpass');
		Tone.Destination.chain(this.lowPass, this.highPass, this.gain);

		// a recorder for the sound
		this.recorder = new Tone.Recorder({ mimeType: 'audio/webm' });
		this.gain.connect(this.recorder);

		this.buffers = new Tone.ToneAudioBuffers({
			urls: this.samples,
			baseUrl: "https://raw.githubusercontent.com/tmhglnd/mercury-playground/main/public/assets/samples/",
			onload: () => {
				console.log('Samples loaded', this.buffers);
				// executes a callback from the class constructor
				if (callback){ callback(); }
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
				console.log('Resumed Transport');
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
			Tone.Transport.stop();
			console.log('Stopped Transport');
		} catch {
			console.error('Error stopping Transport');
		}
	}

	// set the bpm and optionally ramp in milliseconds
	bpm(bpm, ramp=0) {
		if (ramp > 0){
			Tone.Transport.bpm.rampTo(bpm, ramp / 1000);
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
		this.bpm(bpm);
	}

	// add files to the buffer from a single File Link
	// an array or file paths, or a json of { name:file, ... }
	async addSamples(uploads){
		// for every file from uploads
		uploads.forEach((f) => {
			let n = f;
			let url = f;
			if (f.name){
				// get the filename from File object
				n = f.name;
				url = URL.createObjectURL(f);
			}
			if (Array.isArray(f)){
				// if array use first value as the name
				n = f[0];
				url = f[1];
			}
			if (n.endsWith('.json')){
				// read from json if loaded is a json file
				this.addBufferFromJson(url);
			} else {
				// otherwise read the soundfile regularly
				this.addBufferFromURL(url, n);
			}
		});
	}

	// add a single file to the buffer from URL
	// use the name as reference in the buffer
	// if name is undefined it will be constructed from the URL
	// 
	addBufferFromURL(url, n){
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
			console.log(`sound added as: ${n}`);
			URL.revokeObjectURL(url);

			// also add soundfiles to menu for easy selection
			// let m = document.getElementById('sounds');
			// let o = document.createElement('option');
			// o.value = o.innerHTML = n;
			// m.appendChild(o);
		}, (e) => {
			console.log(`error adding sound from: ${n}`);
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
		if (t > 0){
			this.lowPass.frequency.rampTo(f, t/1000, Tone.now());
		} else {
			this.lowPass.frequency.setValueAtTime(f, Tone.now());
		}
	}

	// set highpass frequency cutoff and ramptime
	setHighPass(f, t=0){
		if (t > 0){
			this.highPass.frequency.rampTo(f, t/1000, Tone.now());
		} else {
			this.highPass.frequency.setValueAtTime(f, Tone.now());
		}
	}

	// set volume in floatingpoint and ramptime
	setVolume(v, t=0){
		if (t > 0){
			this.gain.gain.rampTo(v, t/1000, Tone.now());
		} else {
			this.gain.gain.setValueAtTime(v, Tone.now());
		}
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
			console.log(`Error starting/stopping recording ${e}`);
		}
	}

	// returns 'started' if the recording has started
	isRecording(){
		return this.recorder.state;
	}
}
module.exports = { Mercury };