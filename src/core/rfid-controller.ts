import { Observable, Subscriber } from 'rxjs';
const Mfrc522 = require('mfrc522-rpi');
const SoftSPI = require('rpi-softspi');

import { RfidEncoder } from './rfid-encoder';
import { shallowEqualArrays } from 'shallow-equal';
import { default as shortid } from 'shortid';

const logger = require('./logger');

// import { parentPort, workerData } from 'worker_threads';

// const worker = require('worker_threads');

export class RfidController {

    static EMPTY_TAG: string = 'n/a';

    private _mfrc522: any;

    constructor() {
        const softSPI = new SoftSPI(
            {
                clock: 23, // pin number of SCLK
                mosi: 19, // pin number of MOSI
                miso: 21, // pin number of MISO
                client: 24 // pin number of CS
            });

        // GPIO 24 can be used for buzzer bin (PIN 18), Reset pin is (PIN 22).
        // I believe that channing pattern is better for configuring pins which are optional methods to use.
        this._mfrc522 = new Mfrc522(softSPI)
            .setResetPin(22)
            .setBuzzerPin(18);
    }

    getObservable(): Observable<string> {

        logger.info('Scanning...');
        logger.info('Please put chip or keycard in the antenna inductive zone!');

        return new Observable(subscriber => {

            setInterval(() => {
                this.readRfidTag(subscriber);
            }, 30000);

        });
    }

    private async readRfidTag(subscriber: Subscriber<string>) {
        logger.info('scanning');

        // reset card
        this._mfrc522.reset();

        // Scan for cards
        logger.info('findCard() ...');

        let response = this._mfrc522.findCard();
        logger.info('[DONE]');

        console.log(response);
        if (!response.status) {

            subscriber.next(RfidController.EMPTY_TAG);
            return;
        }
        logger.debug('Card detected, CardType: ' + response.bitSize);

        // Get the UID of the card
        response = this._mfrc522.getUid();
        if (!response.status) {
            logger.warn('UID Scan Error');
            return;
        }
        // If we have the UID, continue
        const uid = response.data;
        logger.debug(
            'Card read UID: %s %s %s %s',
            uid[0].toString(16),
            uid[1].toString(16),
            uid[2].toString(16),
            uid[3].toString(16)
        );

        // Select the scanned card
        const memoryCapacity = this._mfrc522.selectCard(uid);
        logger.debug('Card Memory Capacity: ' + memoryCapacity);

        // This is the default key for authentication
        const key = [0xff, 0xff, 0xff, 0xff, 0xff, 0xff];

        // Authenticate on Block 8 with key and uid
        if (!this._mfrc522.authenticate(8, key, uid)) {
            logger.warn('Authentication Error');
            return;
        }

        const dataFromChip = this._mfrc522.getDataForBlock(8);
        // Dump Block 8
        logger.debug('Block: 8 Data: ' + dataFromChip);

        const emptyHex = [
            0xff,
            0xff,
            0xff,
            0xff,
            0xff,
            0xff,
            0xff,
            0xff,
            0xff,
            0xff,
            0xff,
            0xff,
            0xff,
            0xff,
            0xff,
            0xff,
        ];

        const emptyDec = [
            0,
            0,
            0,
            0,
            0,
            0,
            0,
            0,
            0,
            0,
            0,
            0,
            0,
            0,
            0,
            0
        ];

        let id;
        if (shallowEqualArrays(dataFromChip, emptyHex) || shallowEqualArrays(dataFromChip, emptyDec)) {
            logger.info('Empty chip.');
            id = shortid.generate();
            logger.info('New id: ' + id);

            this._mfrc522.writeDataToBlock(8, RfidEncoder.encodeId(id));
            logger.info(`New Id '${id}' written.`);
        } else {
            logger.info('Non empty chip.');
            id = RfidEncoder.decodeId(dataFromChip);
            logger.info(`Id on chip: '${id}`);
        }

        subscriber.next(id);

        // Stop
        this._mfrc522.stopCrypto();
    }
}