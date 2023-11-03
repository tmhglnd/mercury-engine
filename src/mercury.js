
console.log('Mercury Engine Package Included');

const Tone = require('tone');
const { MercuryInterpreter } = require('./interpreter');
// const MercuryLang = require('mercury-lang');

class Mercury extends MercuryInterpreter {
	constructor(){
		super();
		// store sample files in buffers
		this.samples;
		// this.buffers = new Tone.ToneAudioBuffers({
		// 	urls: this.samples,
		// 	onload: () => {
		// 		console.log('Loaded samples');
		// 	}
		// });

		// effects on main output for Tone
		this.gain = new Tone.Gain(1);
		this.lowPass = new Tone.Filter(18000, 'lowpass');
		this.highPass = new Tone.Filter(5, 'highpass');
		Tone.Destination.chain(this.lowPass, this.highPass, this.gain);

		// a recorder for the sound
		this.recorder = new Tone.Recorder({ mimeType: 'audio/webm' });
		this.gain.connect(this.recorder);
	}

	// resume webaudio and transport
	resume(){
		try {
			Tone.start();

			if (Tone.Transport.state !== 'started'){
				Tone.Transport.timeSignature = [4, 4];
				// a bit latency for safety
				Tone.Transport.start('+0.1');
				console.log('Resumed Tone Transport');
			}
		} catch {
			console.error('Error starting ToneJS');
		}
	}

	// stop the transport and all the sounds
	silence(){
		try {
			// fade out and remove code after 100ms
			this.removeSounds(this.sounds, 0.1);
			// Stops instead of pause so restarts at 0
			Tone.Transport.stop();
			console.log('Stopped Tone Transport');
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

	// add audiofiles to the buffer
	addBuffers(uploads){
		// for every file from uploads
		for (let f of uploads){
			// remove extension 
			let n = f.name.replace(/\.\w+/g, '');
			// replace whitespace with _
			n = n.replace(/[-\s]+/g, '_');
			// remove leading/trailing whitespace and to lower case
			n = n.toLowerCase().trim();
			// add to ToneAudioBuffers
			let url = URL.createObjectURL(f);
			this.buffers.add(n, url, () => {
				// log(`${f.name} added as ${n}`);
				URL.revokeObjectURL(url);
				// also add soundfiles to menu for easy selection
				// let m = document.getElementById('sounds');
				// let o = document.createElement('option');
				// o.value = o.innerHTML = n;
				// m.appendChild(o);
			}, () => {
				// log(`error adding sound ${f.name}`);
			});
		}
	}

	// get all the contents of the buffers
	get buffers(){
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
	async record(on, file){
		if (on){
			// star the recording
			this.recorder.start();
		} else {
			// stop the recording and return blob
			const recording = await this.recorder.stop();
			const url = URL.createObjectURL(recording);
			// download via anchor element
			const anchor = document.createElement('a');
			anchor.download = `${f}.webm`;
			anchor.href = url;
			anchor.click();
		}
	}

	// returns 'started' if the recording has started
	isRecording(){
		return this.recorder.state;
	}
}
module.exports = { Mercury };