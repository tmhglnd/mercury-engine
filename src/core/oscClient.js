// // Include this module to setup an OSC client when running
// // Mercury via a localhost and you want to send/receive OSC messages

// // Empty object to store/update all received oscMessages
// window.oscMessages = {};
// // Is there a client connected?
// window.ioClient = false;

// class OscClient {
// 	constructor(){
// 		// Setup osc connection for when running mercury as localhost
// 		try {
// 			const io = require('socket.io-client');
// 			const socket = io();
		
// 			socket.on('connected', (id) => {
// 				window.ioClient = true;
// 				console.log(`Connected for OSC: ${id}`);
// 			});
// 			socket.on('osc', (msg) => {
// 				console.log(`Received: ${msg}`);
// 				if (msg[0] === '/mercury-code'){
// 					try {
// 						cm.set(msg[1]);
// 						cm.evaluate();
// 					} catch (e) {
// 						log(`Unable to execute code`);
// 					}
// 				} else {
// 					let address = msg.shift();
// 					let details = msg;
// 					// store the osc message values in the object
// 					window.oscMessages[address] = details;
		
// 					// emit an event to the listener if there is one
// 					// let event = new CustomEvent(address, { detail: details });
// 					// window.dispatchEvent(event);
// 				}
// 			});
// 			window.emit = (msg) => {
// 				socket.emit('message', msg);
// 			}
// 		} catch (e) {
// 			console.log('Unable to use OSC connection. Clone Mercury from github and run as localhost');
// 		}
// 	}
// }
// module.exports = { OscClient }