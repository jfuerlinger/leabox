const youtube = require('./core/youtube-audio-player-js');

const player = new youtube.YoutubeAudioPlayerJs();

player.play('https://www.youtube.com/watch?v=W3n72p9kAbg');

console.log('test');