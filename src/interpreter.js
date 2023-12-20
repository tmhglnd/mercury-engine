
const Tone = require('tone');
const Mercury = require('mercury-lang');
const TL = require('total-serialism').Translate;
const { normalize, multiply } = require('total-serialism').Utility;

const MonoSample = require('./core/MonoSample.js');
const MonoMidi = require('./core/MonoMidi.js');
const MonoSynth = require('./core/MonoSynth.js');
const MonoInput = require('./core/MonoInput.js');
const PolySynth = require('./core/PolySynth.js');
const PolySample = require('./core/PolySample.js');
const Tempos = require('./data/genre-tempos.json');
const Util = require('./core/Util.js');

class MercuryInterpreter {
	constructor({ hydra, p5canvas } = {}){
		// cross-fade time
		this.crossFade;
		
		// arrays with the current and previous instruments for crossfade
		this._sounds = [];
		this.sounds = [];

		// storage of latest evaluated code
		this._code = '';

		// parsetree storage
		this.parse;
		this.tree;
		this.errors;

		// Hydra and P5 canvas
		this.canvas = hydra;
		this.p5canvas = p5canvas;
	}

	getSounds(){
		return this.sounds;
	}
	
	transferCounts(_s, s){
		// transfer the time of the previous sound to the new sound object
		// to preserve continuity when re-evaluating code
		// this works only for instruments that have a name()
		_s.map((prev) => {
			s.map((cur) => {
				if (cur._name === prev._name){
					cur._count = prev._count;
					cur._beatCount = prev._beatCount;
				}
			});
		});
	}
	
	startSounds(s, f=0){
		// fade in new sounds
		s.map((_s) => {
			if (_s){ _s.fadeIn(f); }
		});
	}
	
	removeSounds(s, f=0) {
		// fade out and delete after fade
		s.map((_s) => {
			if (_s){ _s.fadeOut(f); }
		});
		// empty array to trigger garbage collection
		s.length = 0;
	}

	makeLoops(s){
		// make the loops for all the instruments
		s.map((_s) => {
			if (_s){ _s.makeLoop(); }
		});
	}

	setCrossFade(f){
		// set the crossFade in milliseconds
		this.crossFade = Number(f) / 1000;
		Util.log(`Crossfade set to: ${f}ms`);
	}

	getCode(){
		// return the last evaluated code
		return this._code;
	}

	code(file=''){
		// parse and evaluate the inputted code
		let c = (!file)? this._code : file;
		
		let t = Tone.Transport.seconds;
				
		// is this necessary?
		// as an asyncronous function with promise
		// let parser = new Promise((resolve) => {
		// 	return resolve(Mercury(c));
		// });
		// this.parse = await parser;
		this.parse = Mercury(c);
		
		console.log(`Evaluated code in: ${((Tone.Transport.seconds-t) * 1000).toFixed(3)}ms`);

		this.tree = this.parse.parseTree;
		this.errors = this.parse.errors;

		// let l = document.getElementById('console-log');
		// l.innerHTML = '';
		// handle .print and .errors
		this.errors.forEach((e) => {
			Util.log(e);
		});
		if (this.errors.length > 0){
			// return if the code contains any syntax errors
			Util.log(`Could not run because of syntax error`);
			Util.log(`Please see Help for more information`);
			// return the parsetree also if there are errors
			return this.parse;
		}
		// if no errors the last evaluated code is stored
		this._code = c;

		this.tree.print.forEach((p) => {
			Util.log(p);
		});

		// set timer to check evaluation time
		t = Tone.Transport.seconds;

		// Handle all the global settings here
		const globalMap = {
			'crossFade' : (args) => {
				// set crossFade time in ms
				this.setCrossFade(args[0]);
			},
			'tempo' : (args) => {
				let t = args[0];
				if (isNaN(t)){
					t = Tempos[args[0].toLowerCase()];
					if (t === undefined){
						Util.log(`tempo ${args[0]} is not a valid genre or number`);
						return;
					}
					args[0] = t;
				}
				this.setBPM(...args);
				// engine.setBPM(...args);
				// log(`set bpm to ${bpm}`);
			}, 
			'silence' : (mute) => {
				if (mute){ 
					// engine.silence(); 
					this.silence(); 
				}
			},
			'scale' : (args) => {
				let s = TL.scaleNames();
				let scl = Array.isArray(args[0])? args[0][0] : args[0];
				let rt = Array.isArray(args[1])? args[1][0] : args[1];
	
				if (scl.match(/(none|null|off)/)){
					TL.setScale('chromatic');
					TL.setRoot('c');
					// document.getElementById('scale').innerHTML = '';
					return;
				}
	
				if (s.indexOf(scl) > -1){
					TL.setScale(scl);
				} else {
					Util.log(`${scl} is not a valid scale`);
				}
				if (rt){
					TL.setRoot(rt);
				}
				// let tmpS = TL.getScale().scale;
				// let tmpR = TL.getScale().root;
				// document.getElementById('scale').innerHTML = `scale = ${tmpR} ${tmpS}`;
				// Util.log(`set scale to ${tmpR} ${tmpS}`);
			},
			'amp' : (args) => {
				this.setVolume(...args);
				// engine.setVolume(...args);
			},
			'highPass' : (args) => {
				this.setHighPass(...args);
				// engine.setHiPass(...args);
			},
			'lowPass' : (args) => {
				this.setLowPass(...args);
				// engine.setLowPass(...args);
			}
		}

		// Handling all the different instrument types here
		const objectMap = {
			'sample' : (obj) => {		
				let inst = new MonoSample(this, obj.type, this.canvas);
				objectMap.applyFunctions(obj.functions, inst, obj.type);
				return inst;
			},
			'loop' : (obj) => {		
				let inst = new MonoSample(this, obj.type, this.canvas);
				objectMap.applyFunctions(obj.functions, inst, obj.type);
				return inst;
			},
			'synth' : (obj) => {		
				console.log(obj);
				let inst = new MonoSynth(this, obj.type, this.canvas);
				objectMap.applyFunctions(obj.functions, inst, obj.type);
				return inst;
			},
			'polySynth' : (obj) => {
				let inst = new PolySynth(this, obj.type, this.canvas);
				objectMap.applyFunctions(obj.functions, inst, obj.type);
				return inst;
			},
			'polySample' : (obj) => {
				let inst = new PolySample(this, obj.type, this.canvas);
				objectMap.applyFunctions(obj.functions, inst, obj.type);
				return inst;
			},
			'midi' : (obj) => {
				if (!this.midi.enabled){
					Util.log(`WebMIDI is not started. Please load the package and check your browser compatibility`);
					return null;
				}
				let inst = new MonoMidi(this, obj.type, this.canvas);
				objectMap.applyFunctions(obj.functions, inst, obj.type);
				return inst;
			},
			'input' : (obj) => {
				let inst = new MonoInput(this, obj.type, this.canvas);
				objectMap.applyFunctions(obj.functions, inst, obj.type);
				return inst;
			},
			'applyFunctions' : (args, inst, type) => {
				// apply arguments to instrument if part of instrument
				Object.keys(args).forEach((a) => {
					if (inst[a]){
						inst[a](...args[a]);
					} else {
						console.log(`${a}() is not a function of ${type}`);
					}
				});
				return inst;
			}
		}

		// copy current sounds over to past
		this._sounds = this.sounds.slice();
		// empty new sounds array
		this.sounds = [];

		// handle .global
		Object.keys(this.tree.global).forEach((g) => {
			if (globalMap[g]){
				globalMap[g](this.tree.global[g]);
			}
		});

		// handle .objects
		for (let o in this.tree.objects){
			let type = this.tree.objects[o].object;
			if (objectMap[type]){
				this.sounds.push(objectMap[type](this.tree.objects[o]));
			} else {
				Util.log(`Instrument named '${type}' is not supported`);
			}
		}

		// start new loops;
		this.makeLoops(this.sounds);
		this.transferCounts(this._sounds, this.sounds);

		console.log(`Instruments added in: ${((Tone.Transport.seconds - t) * 1000).toFixed(3)}ms`);		
		
		// when all loops started fade in the new sounds and fade out old
		if (!this.sounds.length){
			this.startSounds(this.sounds);
		}
		this.startSounds(this.sounds, this.crossFade);
		this.removeSounds(this._sounds, this.crossFade);

		this.resume();

		// if p5js canvas is included in the html page
		if (this.p5canvas){ 
			// hide canvas and noLoop			
			this.p5canvas.hide(); 
		
			// handle .display to p5
			tree.display.forEach((p) => {
				// restart canvas if view is used
				let n = multiply(normalize(p), 255);
				this.p5canvas.sketch.fillCanvas(n);
				this.p5canvas.display();
			});
		}
		// return the parsetree to see from outside
		return this.parse;
	}
}
module.exports = { MercuryInterpreter }