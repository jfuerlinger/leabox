// const stream = require('youtube-audio-stream');
// //const stream = require('youtube-audio-stream');
// const url = 'https://www.youtube.com/watch?v=sX8izWSnK7s';
// const decoder = require('lame').Decoder;
// const Speaker = require('speaker')

// stream(url)
//     .pipe(decoder())
//     .pipe(new Speaker());


//const stream = require('youtube-audio-stream');


import  * as stream from 'youtube-audio-stream';

const url = 'https://www.youtube.com/watch?v=sX8izWSnK7s';

//const decoder = require('lame').Decoder;
import { Decoder as decoder } from 'lame';


const Speaker = require('speaker')
//import * as speaker from 'speaker';

stream(url, [])
    .pipe(decoder())
    .pipe(new Speaker());