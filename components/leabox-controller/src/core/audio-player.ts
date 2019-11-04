export interface AudioPlayer{
    play(url: string): void;
    isPlaying(): boolean;

    stop();
    
    pause(): void;
    isPaused(): boolean;

    resume(): void;
}