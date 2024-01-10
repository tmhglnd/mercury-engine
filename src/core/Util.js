const { noteToMidi, toScale, mtof } = require('total-serialism').Translate;

// replace defaults with incoming parameters
function mapDefaults(params, defaults){
	defaults.splice(0, params.length, ...params);
	return defaults.map(p => toArray(p));
}

// convert amplitude to dBFS scale
function atodb(a=0){
	return 20 * Math.log(a);
}

// convert dbFS to amplitude
function dbtoa(db=0){
	return 10 ** (db/20);
}

// clip a value between a specified range
function clip(v, l, h){
	return Math.max(l, Math.min(h, v));
}

// make sure the output is a number, else output a default value
function assureNum(v, d=1){
	return isNaN(v) ? d : v;
}

// lookup a value from array with wrap index
function lookup(a, i){
	return a[i % a.length];
}

// get random value from array
function randLookup(a){
	if (Array.isArray(a)){
		return a[Math.floor(Math.random() * a.length)];
	}
	return a;
}

// is argument random?
// return random value between lo and hi range
// else return input
function isRandom(a, l=0, h=1){
	if (String(a).match(/rand(om)?/g)){
		return Math.random() * (h - l) + l;
	}
	return a;
}

// get parameter from 1 or 2d array
function getParam(a, i){
	// also check if value is an osc-address, then use last received value
	// return randLookup(getOSC(lookup(a, i)));
	return evalExpr(randLookup(lookup(getOSC(a), i)));
	// return randLookup(lookup(getOSC(a), i));
}

// retrieve received messages via osc as arguments or pass through
function getOSC(a){
	// only take first value from array to check if an osc-address
	let osc = a[0];
	if (typeof osc !== 'string'){
		// pass through
		return a;
	} else if (osc.match(/^\/[^`'"\s]+/g)){
		if (!window.oscMessages[osc]){
			log(`No message received on address ${osc}`);
			return [0];
		}
		return window.oscMessages[osc];
	}
	// pass through
	return a;
}

// global functions for string expressions in eval()
// very experimental currently
window.cos = Math.cos;
window.sin = Math.sin;
window.floor = Math.floor;
window.ceil = Math.ceil;
window.round = Math.round;
window.mod = Math.mod;
window.pow = Math.pow;
window.sqrt = Math.sqrt;
window.pi = Math.PI;
window.twopi = Math.PI * 2;

// check if the string is formatted as an expression, then evaluate it
function evalExpr(a){
	let expr = a;
	if (typeof expr !== 'string'){
		return a;
	} else if (expr.match(/^\{[^{}]+\}$/g)){
		let result = 0;
		// console.log('evaluate this expression:', eval(expr));
		try {
			result = eval(expr);
		} catch (e){
			log(`Unable to evaluate expression: ${expr}`);
		}
		return result;
	}
	// pass through
	return a;
}

// convert to array if not an array
function toArray(a){
	return Array.isArray(a) ? a : [a];
}

// convert milliseconds to seconds
function msToS(ms){
	return ms / 1000.0;
}

// parse division formats to Tone Loop intervals in seconds
function formatRatio(d, bpm){
	if (String(d).match(/\d+\/\d+/)){
		return eval(String(d)) * 4.0 * 60 / bpm;
	} else if (!isNaN(Number(d))){
		return Number(d) * 4.0 * 60 / bpm;
	} else {
		log(`${d} is not a valid time value`);
		return 60 / bpm;
	}
}

// convert division format to seconds based on bpm
function divToS(d, bpm){
	if (String(d).match(/\d+\/\d+/)){
		return eval(String(d)) * 4.0 * 60 / bpm;
	} else if (!isNaN(Number(d))){
		return Number(d) / 1000;
	} else {
		log(`${d} is not a valid time value`);
		return 0.1;
	}
}

// convert division format to frequency in Hz based on bpm
function divToF(d, bpm){
	return 1.0 / divToS(d, bpm)
}

// convert note value to a frequency 
function noteToFreq(i, o){
	if (isNaN(i)){
		let _i = noteToMidi(i);
		if (!_i){
			log(`${i} is not a valid number or name`);
			i = 0;
		} else {
			i = _i - 48;
		}
	}
	// reconstruct midi note value, (0, 0) = 36
	// let n = i + (o * 12) + 36;
	let n = toScale(i + o * 12 + 36);

	// calculate frequency in 12-TET A4 = 440;
	// let f = Math.pow(2, (n - 69)/12) * 440;
	return mtof(n);
}

function assureWave(w){
	let waveMap = {
		sine : 'sine',
		saw : 'sawtooth',
		square : 'square',
		triangle : 'triangle',
		tri : 'triangle',
		rect : 'square',
		fm: 'fmsine',
		am: 'amsine',
		pwm: 'pwm',
		organ: 'sine4',
	}
	if (waveMap[w]){
		w = waveMap[w];
	} else {
		log(`${w} is not a valid waveshape`);
		// default wave if wave does not exist
		w = 'sine';
	}
	return w;
}

// convert note and octave (int/float/name) to a midi value
function toMidi(n=0, o=0){
	if (isNaN(n)){
		let _n = noteToMidi(n);
		if (!_n){
			log(`${n} is not a valid number or name`);
			n = 0;
		} else {
			n = _n - 36;
		}
	}
	return toScale(n + o * 12 + 36);
}

// the log message is used to log to the console but also
// sends a custom event that can be listened for to print the 
// content at some other place in the window, for example using a div
function log(msg){
	console.log(msg);
	if (window){
		let print = new CustomEvent('mercuryLog', { detail: msg });
		window.dispatchEvent(print);
	}
}

module.exports = { mapDefaults, atodb, dbtoa, clip, assureNum, lookup, randLookup, isRandom, getParam, toArray, msToS, formatRatio, divToS, divToF, toMidi, mtof, noteToMidi, noteToFreq, assureWave, log }