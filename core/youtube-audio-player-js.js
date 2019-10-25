//import { AudioPlayer } from "./audio-player";

import { default as chalk } from 'chalk';
//import * as ffmpeg from 'fluent-ffmpeg';

const log = console.log;


//const decoder = require('node-lame').Decoder;
//import { Lame } from 'lame';
//var lame = require('lame');

//const speaker = require('speaker');
//import * as speaker from 'speaker';

//const decoder = require('lame').Decoder
//const speaker = require('speaker')

//import { default as YoutubeAudioStream } from '@isolution/youtube-audio-stream';

const stream = require('youtube-audio-stream');
//const stream = require('youtube-audio-stream');
const url = 'https://www.youtube.com/watch?v=sX8izWSnK7s';
const decoder = require('lame').Decoder;
const Speaker = require('speaker')


export class YoutubeAudioPlayerJs {

    // private streamPromise: YoutubeAudioStream;

    play(url) {

        //let x: speaker.default;
        // new YoutubeAudioStream(url)
        //     .then((stream) => {
        //         stream.emitter.on('error', (err) => {
        //             console.log(err);
        //         });

        //         // stream
        //         //     .pipe(decoder())
        //         //     .pipe(speaker());
        //     })
        // .catch((err) => {
        //     console.log(err);
        // });
        log(chalk.green(`Playing file '${url}' ...`));
        stream(url)
            .pipe(decoder())
            .pipe(new Speaker());

    }

    pause() {
        throw new Error("Method not implemented.");
    }

    isPaused() {
        throw new Error("Method not implemented.");
    }

    resume() {
        throw new Error("Method not implemented.");
    }

}