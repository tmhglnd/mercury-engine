⚠️ **WORK IN PROGRESS, EXPERIMENTAL USE ONLY** ⚠️

# 🌕 Mercury Engine

**The engine (core) of the Mercury Live Coding Environment for the browser**

This Package does not include the browser editor and user interface. This package allows you to include the Mercury webaudio engine into your own web projects and generate sound from the Mercury code. This engine is used in the [Mercury-Playground](https://github.com/tmhglnd/mercury-playground), a browser based version of the environment.

Mercury currently has 2 versions:

* Web version running in the browser (Windows/Mac/Linux) [go to this repo](https://github.com/tmhglnd/mercury-playground)
* Original version running in Max8 (Windows/Mac only) [go to this repo](https://github.com/tmhglnd/mercury)

[**🚀 Start Sketching Online!** (recommended for beginners)](https://mercury.timohoogland.com/)

**👾 Or code with the latest full version in Max8:** 

<!-- [![GitHub release (latest SemVer)](https://img.shields.io/github/v/release/tmhglnd/mercury)](https://github.com/tmhglnd/mercury/releases)

[**📟 Build a local app from the browser version with Electron**](https://github.com/tmhglnd/mercury-app) -->

[**🙏 Support Mercury by becoming a Patron**](https://www.patreon.com/bePatron?u=9649817) 

[**💬 Join the Mercury Community on Discord**](https://discord.gg/vt59NYU)

<!-- ![The Mercury playground in the browser](media/screenshot.png) -->

# 🚀 Install

## Install in node_modules

```
$ npm install mercury-engine
```

```js
const { Mercury } = require('mercury-engine');

const Engine = new Mercury();
```

## Include in html

Include latest or a specific version of distribution (minified, es5) through url in script index.html 

Recommended for most cases:

```html
<script src="https://unpkg.com/mercury-engine/dist/mercury.min.es5.js"></script>
```

Other options:

```html
<script src="https://unpkg.com/mercury-engine/dist/mercury.js"></script>
<script src="https://unpkg.com/mercury-engine@1.0.0/dist/mercury.min.js"></script>
<script src="https://unpkg.com/mercury-engine@1.0.0/dist/mercury.min.es5.js"></script>
```

Load the engine in the `<script>` code like so:

```js
const { Mercury } = MercuryEngine;

const Engine = new Mercury();
```

# Usage

### Include and initialize

Include the package

```js
const { Mercury } = require('mercury-engine');
```

Initialize the engine and include a callback function through { onload: }

```js
const Engine = Mercury({
	onload: () => {
		console.log('This callback is called when samples are loaded!');
	}
});
```

### Resume, evaluate and silence

Resume the transport and start the webaudio. This has to be done from a user interaction (click or keypress) to allow sound to play from the browser window.

```js
Engine.resume();
```

Evaluate a mercury code file by providing a string of code. This also resumes the transport if .resume() was not called yet.

```js
Engine.code(`
	set tempo 100
	new sample kick_909 time(1/4)
	new sample hat_909 time(1/4 1/8) gain(0.6)
	new synth saw note(0 0) time(1/16) shape(1 80)
`);
```

Stop the transport and silence the audio

```js
Engine.silence();
```

Return the last succesfully evaluated code. If code is evaluated that resulted in an error it is not stored.

```js
Engine.getCode();
```

### Recording

Start the recording of the sound

```js
Engine.record(true);
```

Returns 'started' if the recording is on

```js
Engine.isRecording();
```

Stop the recording and download the file `myRecording.webm`

```js
Engine.record(false, 'myRecording');
```

### Settings

Set the BPM without using `set tempo` in the Mercury code

```js
Engine.setBPM(140);
```

Set a randomized BPM

```js
Engine.randomBPM();
```

Set the volume without using `set volume` in the Mercury code. Volume in floating amplitude 0 to 1.

```js
Engine.setVolume(0.5);
```

Set the crossFade between 2 code evaluations without using `set crossFade` in the Mercury code. Time in milliseconds.

```js
Engine.setCrossFade(500);
```

Set the HighPass Filter cutoff frequency without using `set highPass` in the Mercury code.

```js
Engine.setHighPass(400);
```

Set the LowPass Filter cutoff frequency without using `set lowPass` in the Mercury code.

```js
Engine.setLowPass(5000);
```

Get the value for any of the settings

```js
console.log(Engine.bpm);
console.log(Engine.volume);
console.log(Engine.crossFade);
console.log(Engine.highPass);
console.log(Engine.lowPass);
```

### Samples

Add your own samples from for example a url like raw github or freesound. The url can also contain a .json file that references multiple samples and the sample name.

```js
Engine.addBuffers();
```

Get the content of all the loaded Buffers, this is returned as a ToneAudioBuffers class

```js
Engine.getBuffers();
```

### Customized log function

Replace the log() function in the engine for a custom log fuction to for example display errors in HTML elements

```js
Engine.log = (print) => {
	let p = JSON.stringify(print).replace(/\,/g, ' ').replace(/\"/g, '');
	document.getElementById('log-div').innerHTML += `${p}<br>`;
}
```

## 📋 To Do

- [ ] Include OSC communcation options via socket.io
- [ ] Use engine in the Mercury-playground instead of the other code-base
- [ ] Allow control of parameters via DOM elements

## 🔋 Powered By

- Mercury was granted funding from [**Creative Industries Fund NL**](https://stimuleringsfonds.nl/en/)
- Mercury was granted in-kind funding from [**Creative Coding Utrecht**](https://creativecodingutrecht.nl/)

## 📄 Licenses

- Main Source - [The GNU GPL v.3 License](https://choosealicense.com/licenses/gpl-3.0/) (c) Timo Hoogland 2019-2023
- Sound Files - Individually licensed, listed under [media/README.md](https://github.com/tmhglnd/mercury/blob/master/mercury_ide/media/README.md)
- Documentation - [The CC BY-SA 4.0 License](https://creativecommons.org/licenses/by-sa/4.0/) (c) Timo Hoogland 2019-2023
- Examples - [The CC BY-SA 4.0 License](https://creativecommons.org/licenses/by-sa/4.0/) (c) Timo Hoogland 2019-2023

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.