import { AudioPlayer } from "./audio-player";

import { default as chalk } from 'chalk';
import * as ffmpeg from 'fluent-ffmpeg';

const log = console.log;


//const decoder = require('node-lame').Decoder;
//import { Lame } from 'lame';
//var lame = require('lame');

//const speaker = require('speaker');
//import * as speaker from 'speaker';

const decoder = require('lame').Decoder
const speaker = require('speaker')

import { default as YoutubeAudioStream } from '@isolution/youtube-audio-stream';

export class YoutubeAudioPlayer implements AudioPlayer {

    // private streamPromise: YoutubeAudioStream;

    play(url: string): void {

        //let x: speaker.default;
        new YoutubeAudioStream(url)
            .then((stream) => {
                stream.emitter.on('error', (err) => {
                    console.log(err);
                });

                stream
                    .pipe(decoder());
                    //.pipe(speaker.default);
            });
        // .catch((err) => {
        //     console.log(err);
        // });
        log(chalk.green(`Playing file '${url}' ...`));
    }

    pause(): void {
        throw new Error("Method not implemented.");
    }

    isPaused(): boolean {
        throw new Error("Method not implemented.");
    }

    resume(): void {
        throw new Error("Method not implemented.");
    }

}