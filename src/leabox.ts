import chalk from 'chalk';
import {YoutubeAudioPlayer } from './core/youtube-audio-player';

const player: YoutubeAudioPlayer = new YoutubeAudioPlayer();

player.play('https://www.youtube.com/watch?v=lhYAbMbsMJY');