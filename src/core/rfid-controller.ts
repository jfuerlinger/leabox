import { Observable } from 'rxjs';
const Mfrc522 = require('mfrc522-rpi');
const SoftSPI = require('rpi-softspi');

import { RfidEncoder } from './rfid-encoder';
import { shallowEqualArrays } from 'shallow-equal';
import { default as shortid } from 'shortid';

const logger = require('./logger');

export class RfidController {

    static EMPTY_TAG: string = 'n/a';

    getObservable(): Observable<string> {
        return new Observable(subscriber => {

            logger.info('Scanning...');
            logger.info('Please put chip or keycard in the antenna inductive zone!');

            const softSPI = new SoftSPI(
                {
                    clock: 23, // pin number of SCLK
                    mosi: 19, // pin number of MOSI
                    miso: 21, // pin number of MISO
                    client: 24 // pin number of CS
                });

            // GPIO 24 can be used for buzzer bin (PIN 18), Reset pin is (PIN 22).
            // I believe that channing pattern is better for configuring pins which are optional methods to use.
            const mfrc522 = new Mfrc522(softSPI).setResetPin(22).setBuzzerPin(18);

            setInterval(function () {

                // reset card
                mfrc522.reset();

                // Scan for cards
                let response = mfrc522.findCard();

                if (!response.status) {
                    subscriber.next(RfidController.EMPTY_TAG);
                    return;
                }
                logger.debug('Card detected, CardType: ' + response.bitSize);

                // Get the UID of the card
                response = mfrc522.getUid();
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
                const memoryCapacity = mfrc522.selectCard(uid);
                logger.debug('Card Memory Capacity: ' + memoryCapacity);

                // This is the default key for authentication
                const key = [0xff, 0xff, 0xff, 0xff, 0xff, 0xff];

                // Authenticate on Block 8 with key and uid
                if (!mfrc522.authenticate(8, key, uid)) {
                    logger.warn('Authentication Error');
                    return;
                }

                const dataFromChip = mfrc522.getDataForBlock(8);
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

                    mfrc522.writeDataToBlock(8, RfidEncoder.encodeId(id));
                    logger.info(`New Id '${id}' written.`);
                } else {
                    logger.info('Non empty chip.');
                    id = RfidEncoder.decodeId(dataFromChip);
                    logger.info(`Id on chip: '${id}`);
                }

                subscriber.next(id);

                // Stop
                mfrc522.stopCrypto();
            }, 1000);

        });
    }

}