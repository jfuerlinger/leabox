import { AudioPlayer } from './audio-player';
import { default as chalk } from 'chalk';

const logger = require('./logger');
const log = console.log;

const stream = require('youtube-audio-stream');
const decoder = require('lame').Decoder;
const speaker = require('speaker');

const appInsights = require("applicationinsights");
const appInsightsClient = new appInsights.TelemetryClient();

export class YoutubeAudioPlayer implements AudioPlayer {

    private decoder: any;
    private speaker: any;

    play(url: string): void {
        appInsightsClient.trackEvent({ name: 'youtube-player:play', properties: { url: url } });

        const logMessage = `Playing file '${url}' ...`;
        logger.info(logMessage);
        log(chalk.green(logMessage));
        

        this.decoder =
            stream(url, [])
                .pipe(decoder());

        this.speaker =
            this.decoder
                .pipe(new speaker());
    }

    isPlaying(): boolean {
        return true;
    }

    stop() {
        appInsightsClient.trackEvent({ name: 'youtube-player:stop', properties: { } });

        const logMessage = `stop()`;
        logger.info(logMessage);
        log(chalk.green(logMessage));

        if (this.speaker) {
            this.speaker.end();
        }

        if (this.decoder) {
            this.decoder.end();
        }
    }

    pause(): void {
        appInsightsClient.trackEvent({ name: 'youtube-player:pause', properties: { } });

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
        appInsightsClient.trackEvent({ name: 'youtube-player:resume', properties: { } });

        const logMessage = `resume()`;
        logger.info(logMessage);
        log(chalk.green(logMessage));
        throw new Error('Method not implemented.');
    }
}