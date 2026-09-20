const Tone = require('tone');
// const Util = require('./Util.js');
const { toArray, getParam, lookup, msToS } = require('./Util.js');
const { mtof, toMidi, noteToMidi } = require('./Util.js');
const PolyInstrument = require('./PolyInstrument.js');

class PolySample extends PolyInstrument {
	constructor(engine, s, canvas){
		// Inherit from PolyInstrument
		super(engine, canvas);

		this._bufs = this._engine.getBuffers();
		this._sound;
		this.sound(s);

		// sample variables
		this._speed = [ 1 ];
		this._rev = false;
		this._stretch = [ 0 ];

		// playback start position
		this._pos = [ 0 ];

		this.sample;
		this._note = [ 0, 0 ];
		this._tune = [ 261.6255653 ];

		// this._slide = [ 0 ];
		this._voices = [ 1 ];
		this._detune = [ 0 ];

		this.createSources();

		console.log('=> PolySample()', this);
	}

	createSources(){
		for (let i=0; i<this.numVoices; i++){
			this.sources[i] = new Tone.Player().connect(this.adsrs[i]);
			this.sources[i].autostart = false;
		}
	}

	sourceEvent(c, time, id, num){
		// ramp volume
		let g = 20 * Math.log(getParam(this._gain[0], c) * 0.707);
		let r = msToS(Math.max(0, getParam(this._gain[1], c)));
		this.sources[id].volume.rampTo(g, r, time);


		// let o = getParam(this._note[1], c);
		// let i = getParam(this._note[0], c);
		// let i = toArray(lookup(this._note[0], c))[num];
		// let f = noteToFreq(i, o);

		// get the sample from array
		let b = getParam(this._sound, c);

		if (this.sources[id].buffer){
			// clean-up previous buffer
			this.sources[id].buffer.dispose();
		}

		// if (this._bufs.has(b)){	
		// 	this.sources[id].buffer = this._bufs.get(b);
		// } else {
		// 	// default sample if file does not exist
		// 	this.sources[id].buffer = this._bufs.get('kick_909');
		// }

		if (!this._bufs.has(b)){
			if (this._defaults[b]){
				this._engine.addBufferFromUrl(this._defaults[b], b);
			} else {
				log(`${b} is not a loaded sample and not part of the default samplepack`);
			}
			// don't play if there is no valid buffer loaded
			return;
		} else {
			this.sources[id].buffer = this._bufs.get(b);
		}

		// the duration of the buffer in seconds
		let dur = this.sources[id].buffer.duration;

		// get speed and if 2d array pick randomly
		let s = getParam(this._speed, c);

		// set the playbackrate based on the selected note
		// note as interval / octave coordinate
		// check if note is not 'off'
		let i = toArray(lookup(this._note[0], c))[num];
		if (i !== 'off'){
			// note as interval / octave coordinate
			let o = getParam(this._note[1], c);
			let t = getParam(this._tune, c);

			// reconstruct midi note value with scale, (0, 0) = 36
			let n = toMidi(i, o);
			let r = mtof(n) / t;
			s = s * r;
		}

		// reversing seems to reverse every time the 
		// value is set to true (so after 2 times reverse
		// it becomes normal playback again) no fix yet
		// this.sample.reverse = s < 0.0;

		let l = lookup(this._stretch, c);
		let n = 1;
		if (l){
			n = dur / (60 * 4 / this.bpm()) / l;
		}
		// playbackrate can not be 0 or negative
		this.sources[id].playbackRate = Math.max(Math.abs(s) * n, 0.0001);

		// get the start position
		let p = dur * getParam(this._pos, c);

		// when sample is loaded allow playback to start
		if (this.sources[id].loaded){
			this.sources[id].start(time, p);
		}
	}

	sound(s){
		// load all soundfiles and return as array
		// this._sound = this.checkBuffer(toArray(s));
		this._sound = toArray(s);
	}

	// checkBuffer(a){
	// 	// check if file is part of the loaded samples
	// 	return a.map((s) => {
	// 		if (Array.isArray(s)) {
	// 			return this.checkBuffer(s);
	// 		}
	// 		// error if soundfile does not exist
	// 		else if (!this._bufs.has(s)){
	// 			// set default (or an ampty soundfile?)
	// 			log(`sample ${s} not found`);
	// 			return 'kick_909';
	// 		}
	// 		return s;
	// 	});
	// }

	note(i=0, o=0){
		// set the note as semitone interval and octave offset
		// (0, 0) = MidiNote 36
		this._note = [toArray(i), toArray(o)];
	}

	speed(s){
		// set the speed pattern as an array
		this._speed = toArray(s);
	}

	tune(t=60){
		// set the fundamental midi note for this sample in Hz, MIDI or Notename
		this._tune = toArray(t);
		this._tune = this._tune.map((t) => {
			if (typeof t === 'number'){
				if (Math.floor(t) !== t){
					return t;
				}
				return mtof(t);
			}
			return mtof(noteToMidi(t));
		});
	}

	stretch(s){
		// set the stretch loop bar length
		this._stretch = toArray(s);
	}

	offset(o){
		// set the playback start position as an array
		this._pos = toArray(o);
	}

	delete(){
		// delete super class
		super.delete();
		
		console.log('disposed PolySample()', this._sound);
	}
}
module.exports = PolySample;