import { LeaBoxController } from "../leabox-controller";

export interface CommandProcessor {
    init(): void;
    start(): void;
    stop(): void;
    isProcessing(): boolean;
}