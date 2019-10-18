import { Observable } from 'rxjs';

//const Mfrc522 = require("mfrc522-rpi");
import { Mfrc522 } from 'mfrc522-rpi';

//const SoftSPI = require("rpi-softspi");
import { SoftSPI } from 'rpi-softspi';

//const utf8ByteArrayToString = require('utf8-string-bytes').utf8ByteArrayToString;
//const stringToUtf8ByteArray = require('utf8-string-bytes').stringToUtf8ByteArray;
import { utf8ByteArrayToString, stringToUtf8ByteArray } from 'utf8-string-bytes';

//const shallowEqualArrays = require('shallow-equal').shallowEqualArrays;
import { shallowEqualArrays } from 'shallow-equal';

//const shortid = require('shortid');
import { shortid } from 'shortid';



export class RfidController {
    getObservable(): Observable<string> {
        return new Observable(subscriber => {

            console.log("Scanning...");
            console.log("Please put chip or keycard in the antenna inductive zone!");

            const softSPI = new SoftSPI({
                clock: 23, // pin number of SCLK
                mosi: 19, // pin number of MOSI
                miso: 21, // pin number of MISO
                client: 24 // pin number of CS
            });

            // GPIO 24 can be used for buzzer bin (PIN 18), Reset pin is (PIN 22).
            // I believe that channing pattern is better for configuring pins which are optional methods to use.
            const mfrc522 = new Mfrc522(softSPI).setResetPin(22).setBuzzerPin(18);

            setInterval(function () {
                //# reset card
                mfrc522.reset();

                //# Scan for cards
                let response = mfrc522.findCard();
                if (!response.status) {
                    //console.log("No Card");
                    return;
                }
                console.log("Card detected, CardType: " + response.bitSize);

                //# Get the UID of the card
                response = mfrc522.getUid();
                if (!response.status) {
                    console.log("UID Scan Error");
                    return;
                }
                //# If we have the UID, continue
                const uid = response.data;
                console.log(
                    "Card read UID: %s %s %s %s",
                    uid[0].toString(16),
                    uid[1].toString(16),
                    uid[2].toString(16),
                    uid[3].toString(16)
                );

                //# Select the scanned card
                const memoryCapacity = mfrc522.selectCard(uid);
                console.log("Card Memory Capacity: " + memoryCapacity);

                //# This is the default key for authentication
                const key = [0xff, 0xff, 0xff, 0xff, 0xff, 0xff];

                //# Authenticate on Block 8 with key and uid
                if (!mfrc522.authenticate(8, key, uid)) {
                    console.log("Authentication Error");
                    return;
                }

                const dataFromChip = mfrc522.getDataForBlock(8);
                //# Dump Block 8
                console.log("Block: 8 Data: " + dataFromChip);

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
                    //  if(true) {
                    console.log('Empty chip.');
                    id = shortid.generate();
                    console.log('New id: ' + id);

                    mfrc522.writeDataToBlock(8, this.encodeId(id, 16));
                    console.log(`New Id '${id}' written.`);

                    // console.log("Block 8 looked like this:");
                    // console.log(mfrc522.getDataForBlock(8));

                    //console.log('id on chip: ' + decodeId(mfrc522.getDataForBlock(8)));

                } else {
                    console.log('Non empty chip.')
                    id = this.decodeId(dataFromChip);
                    console.log(`Id on chip: '${id}`);
                }

                subscriber.next(id);

                //# Stop
                mfrc522.stopCrypto();
            }, 500);

        });
    }

    private encodeId(id: string): number[] {
        const template = [
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

        const encodedId = stringToUtf8ByteArray(id);

        template[0] = encodedId.length;

        for (let i = 1; i < encodedId.length + 1; i++) {
            template[i] = encodedId[i - 1];
        }

        return template;
    }

    private decodeId(content: number[]): string {
        const lengthOfPayload = content[0];
        const payload = content.slice(1, lengthOfPayload + 1);
        return utf8ByteArrayToString(payload);
    }
}