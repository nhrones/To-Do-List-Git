import { initDom } from './dom.js';

let pin = ''
try {
pin = process.env.PIN;
} catch {
   pin = 'Nope!'
}
console.log('pin: ', pin)

// initialize all DOM elements and event handlers 
await initDom();
