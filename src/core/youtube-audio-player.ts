import { AudioPlayer } from './audio-player';
import { default as chalk } from 'chalk';

const logger = require('./logger');
const log = console.log;

const stream = require('youtube-audio-stream');
const decoder = require('lame').Decoder;
const speaker = require('speaker');

const appInsights = require('applicationinsights');
const appInsightsClient = new appInsights.TelemetryClient();

export class YoutubeAudioPlayer implements AudioPlayer {

    private _decoder: any;
    private _speaker: any;
    private _isPlaying: boolean;

    constructor() {
        this._isPlaying = false;
    }

    play(url: string): void {
        appInsightsClient.trackEvent({ name: 'youtube-player:play', properties: { url: url } });

        const logMessage = `Playing file '${url}' ...`;
        logger.info(logMessage);
        log(chalk.green(logMessage));

        if (!this._isPlaying) {

            this._decoder =
                stream(url, [])
                    .pipe(decoder());

            this._speaker =
                this._decoder
                    .pipe(new speaker());

            this._isPlaying = true;
        } else {
            logger.warn('The player is currently playing!');
        }
    }

    isPlaying(): boolean {
        return this._isPlaying;
    }

    stop() {
        appInsightsClient.trackEvent({ name: 'youtube-player:stop', properties: {} });

        const logMessage = `stop()`;
        logger.info(logMessage);
        log(chalk.green(logMessage));

        if (!this._isPlaying) {
            return;
        }

        if (this._speaker) {
            this._speaker.end();
        }

        if (this._decoder) {
            this._decoder.end();
        }

        this._isPlaying = false;
    }

    pause(): void {
        appInsightsClient.trackEvent({ name: 'youtube-player:pause', properties: {} });

        const logMessage = `pause()`;
        logger.info(logMessage);
        log(chalk.green(logMessage));
        throw new Error('Method not implemented.');
    }

    isPaused(): boolean {
        const logMessage = `isPaused()`;
        logger.info(logMessage);
        log(chalk.green(logMessage));
        throw new Error('Method not implemented.');
    }

    resume(): void {
        appInsightsClient.trackEvent({ name: 'youtube-player:resume', properties: {} });

        const logMessage = `resume()`;
        logger.info(logMessage);
        log(chalk.green(logMessage));
        throw new Error('Method not implemented.');
    }
}