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

![The Mercury playground in the browser](media/screenshot.png)

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

Include latest or specific version of bundled es5 version through url in index.html 

```html
<script src="https://unpkg.com/mercury-engine@1.0.0/build/mercury.min.js"></script>
```

Use in a html `<script>` like so:

```js
const { Mercury } = MercuryEngine;

const Engine = new Mercury();
```

# Usage

```js
// include the package
const { Mercury } = require('mercury-engine');

// initialize the engine and included a callback function
const Engine = Mercury(() => {
	console.log('This callback is called when samples are loaded!');
});

// resume the transport and start the webaudio
// this has to be done from a user interaction (click/key) to allow sound
// to play from the browser window
Engine.resume()

// Evaluate a mercury code file by providing an object with {file:<code>}
// This also resumes the transport if .resume() was not called yet
Engine.code({ file: `
	set tempo 100
	new sample kick_909 time(1/4)
	new sample hat_909 time(1/4 1/8) gain(0.6)
	new synth saw note(0 0) time(1/16) shape(1 80)
`});

// stop the transport and silence the audio
Engine.silence();

// start the recording of the sound
Engine.record(true);

// returns 'started' if the recording is on
Engine.isRecording()

// stop the recording and download the file myRecording.webm
Engine.record(false, 'myRecording');

// set the BPM without adding `set tempo` to the Mercury code
Engine.setBPM(140);

// set the volume without adding `set volume` to the Mercury code
Engine.setVolume(0.5);

// add your own samples from for example a url like raw github or freesound
// the url can also contain a .json file that references multiple samples and 
// the sample name
Engine.addSamples();
```

## 🔋 Powered By

- Mercury was granted funding from [**Creative Industries Fund NL**](https://stimuleringsfonds.nl/en/)
- Mercury was granted in-kind funding from [**Creative Coding Utrecht**](https://creativecodingutrecht.nl/)

## 📄 Licenses

- Main Source - [The GNU GPL v.3 License](https://choosealicense.com/licenses/gpl-3.0/) (c) Timo Hoogland 2019-2023
- Sound Files - Individually licensed, listed under [media/README.md](https://github.com/tmhglnd/mercury/blob/master/mercury_ide/media/README.md)
- Documentation - [The CC BY-SA 4.0 License](https://creativecommons.org/licenses/by-sa/4.0/) (c) Timo Hoogland 2019-2023
- Examples - [The CC BY-SA 4.0 License](https://creativecommons.org/licenses/by-sa/4.0/) (c) Timo Hoogland 2019-2023

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.