import { RfidController } from "./rfid-controller";
import { distinctUntilChanged, skip } from "rxjs/operators";

//import { parentPort, workerData } from 'worker_threads';
const worker = require('worker_threads');

const rfidController: RfidController = new RfidController();

rfidController
    .getObservable()
    .pipe(
        distinctUntilChanged() // only pass changes
        , skip(1) // skip first emit because its the info, that there was no rfid chip found

    ).subscribe({
        next(id) {
            worker.parentPort.postMessage({ id });
        },
        error(err) { logger.error('something wrong occurred: ' + err); },
        complete() { logger.info('done'); }
    });