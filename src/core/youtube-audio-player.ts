import { AudioPlayer } from './audio-player';
import { default as chalk } from 'chalk';

const log = console.log;

const stream = require('youtube-audio-stream');
const decoder = require('lame').Decoder;
const Speaker = require('speaker');

export class YoutubeAudioPlayer implements AudioPlayer {

    play(url: string): void {

        log(chalk.green(`Playing file '${url}' ...`));

        stream(url, [])
            .pipe(decoder())
            .pipe(new Speaker());
    }

    pause(): void {
        throw new Error('Method not implemented.');
    }

    isPaused(): boolean {
        throw new Error('Method not implemented.');
    }

    resume(): void {
        throw new Error('Method not implemented.');
    }
}