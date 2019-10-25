"use strict";
// const stream = require('youtube-audio-stream');
// //const stream = require('youtube-audio-stream');
// const url = 'https://www.youtube.com/watch?v=sX8izWSnK7s';
// const decoder = require('lame').Decoder;
// const Speaker = require('speaker')
exports.__esModule = true;
// stream(url)
//     .pipe(decoder())
//     .pipe(new Speaker());
//const stream = require('youtube-audio-stream');
var stream = require("youtube-audio-stream");
var url = 'https://www.youtube.com/watch?v=sX8izWSnK7s';
//const decoder = require('lame').Decoder;
var lame_1 = require("lame");
var Speaker = require('speaker');
//import * as speaker from 'speaker';
stream(url, [])
    .pipe(lame_1.Decoder())
    .pipe(new Speaker());
