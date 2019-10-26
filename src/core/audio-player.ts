export interface AudioPlayer{
    play(url: string): void;
    
    pause(): void;
    isPaused(): boolean;

    resume(): void;
}