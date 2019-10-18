"use strict";
const Mfrc522 = require("mfrc522-rpi");
const SoftSPI = require("rpi-softspi");

//import { utf8ByteArrayToString, stringToUtf8ByteArray } from 'utf8-string-bytes';
//import { shallowEqualArrays } from "shallow-equal";
const utf8ByteArrayToString = require('utf8-string-bytes').utf8ByteArrayToString;
const stringToUtf8ByteArray = require('utf8-string-bytes').stringToUtf8ByteArray;

const shallowEqualArrays = require('shallow-equal').shallowEqualArrays;

const shortid = require('shortid');

const Observable = require('rxjs').Observable;

const rfidController = new Observable(subscriber => {

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
  
      mfrc522.writeDataToBlock(8, encodeId(id, 16));
      console.log(`New Id '${id}' written.`);
  
      // console.log("Block 8 looked like this:");
      // console.log(mfrc522.getDataForBlock(8));
  
      //console.log('id on chip: ' + decodeId(mfrc522.getDataForBlock(8)));
  
    } else {
      console.log('Non empty chip.')
      id = decodeId(dataFromChip);
      console.log(`Id on chip: '${id}`);
    }
  
    subscriber.next(id);

    //# Stop
    mfrc522.stopCrypto();
  }, 500);

});


rfidController.subscribe({
  next(id) { console.log(`got id '${id}`); },
  error(err) { console.error('something wrong occurred: ' + err); },
  complete() { console.log('done'); }
});



// //# This loop keeps checking for chips. If one is near it will get the UID and authenticate
// console.log("scanning...");
// console.log("Please put chip or keycard in the antenna inductive zone!");
// console.log("Press Ctrl-C to stop.");

// const softSPI = new SoftSPI({
//   clock: 23, // pin number of SCLK
//   mosi: 19, // pin number of MOSI
//   miso: 21, // pin number of MISO
//   client: 24 // pin number of CS
// });

// // GPIO 24 can be used for buzzer bin (PIN 18), Reset pin is (PIN 22).
// // I believe that channing pattern is better for configuring pins which are optional methods to use.
// const mfrc522 = new Mfrc522(softSPI).setResetPin(22).setBuzzerPin(18);

// setInterval(function () {
//   //# reset card
//   mfrc522.reset();

//   //# Scan for cards
//   let response = mfrc522.findCard();
//   if (!response.status) {
//     console.log("No Card");
//     return;
//   }
//   console.log("Card detected, CardType: " + response.bitSize);

//   //# Get the UID of the card
//   response = mfrc522.getUid();
//   if (!response.status) {
//     console.log("UID Scan Error");
//     return;
//   }
//   //# If we have the UID, continue
//   const uid = response.data;
//   console.log(
//     "Card read UID: %s %s %s %s",
//     uid[0].toString(16),
//     uid[1].toString(16),
//     uid[2].toString(16),
//     uid[3].toString(16)
//   );

//   //# Select the scanned card
//   const memoryCapacity = mfrc522.selectCard(uid);
//   console.log("Card Memory Capacity: " + memoryCapacity);

//   //# This is the default key for authentication
//   const key = [0xff, 0xff, 0xff, 0xff, 0xff, 0xff];

//   //# Authenticate on Block 8 with key and uid
//   if (!mfrc522.authenticate(8, key, uid)) {
//     console.log("Authentication Error");
//     return;
//   }

//   const dataFromChip = mfrc522.getDataForBlock(8);
//   //# Dump Block 8
//   console.log("Block: 8 Data: " + dataFromChip);

//   const emptyHex = [
//     0xff,
//     0xff,
//     0xff,
//     0xff,
//     0xff,
//     0xff,
//     0xff,
//     0xff,
//     0xff,
//     0xff,
//     0xff,
//     0xff,
//     0xff,
//     0xff,
//     0xff,
//     0xff,
//   ];

//   const emptyDec = [
//     0,
//     0,
//     0,
//     0,
//     0,
//     0,
//     0,
//     0,
//     0,
//     0,
//     0,
//     0,
//     0,
//     0,
//     0,
//     0
//   ];

//   if (shallowEqualArrays(dataFromChip, emptyHex) || shallowEqualArrays(dataFromChip, emptyDec)) {
//     //  if(true) {
//     console.log('Empty chip.');
//     const id = shortid.generate();
//     console.log('New id: ' + id);

//     mfrc522.writeDataToBlock(8, encodeId(id, 16));
//     console.log(`New Id '${id}+ 'written.`);

//     // console.log("Block 8 looked like this:");
//     // console.log(mfrc522.getDataForBlock(8));

//     //console.log('id on chip: ' + decodeId(mfrc522.getDataForBlock(8)));

//   } else {
//     console.log('Non empty chip.')
//     console.log(`Id on chip: '${decodeId(dataFromChip)}`);
//   }

//   //# Stop
//   mfrc522.stopCrypto();
// }, 500);

function encodeId(id, length = 16) {
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

function decodeId(content) {
  const lengthOfPayload = content[0];
  const payload = content.slice(1, lengthOfPayload + 1);
  return utf8ByteArrayToString(payload);
}