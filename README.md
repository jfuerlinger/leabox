# Lea's Box [D R A F T]

This project is a kind of a [Toniebox](https://tonies.de/toniebox/) port.

# Hardware

1. [Raspberry Pi Zero W](https://electronics.semaf.at/Raspberry-Pi-Zero-W-nur-Board?curr=EUR&gclid=CjwKCAjwlovtBRBrEiwAG3XJ--LvAlaqz9DZxxMFLESknRc7-y4u30wBeKS0E-KI2xG9wMrsksD5ARoCvNUQAvD_BwE)
2. [RFID Kit RC522 13,56MHz](https://www.amazon.de/gp/product/B01M28JAAZ/ref=ppx_yo_dt_b_asin_title_o02_s00?ie=UTF8&psc=1)
3. [USB Sound Adapter 7.1 - DeLock -Virtual 7.1 Sound](https://www.amazon.de/gp/product/B001FA2J3U/ref=ppx_yo_dt_b_asin_title_o01_s00?ie=UTF8&psc=1)

## Wiring

### RFID Kit

| TF522 Modul   | Raspberry Pi  |
| :--: |:----------------------:|
| SDA  | Pin 24 / GPIO8 (CE0)   |
| SCK  | Pin 23 / GPIO11 (SCKL) |
| MOSI | Pin 19 / GPIO10 (MOSI) |
| MISO | Pin 21 / GPIO09 (MISO) |
| IRQ  | ---                    |
| GND  | Pin 6 (GND)            |
| RST  | Pin 22 / GPIO25        |
| 3.3V | Pin 1 (3V3)            |


# Infrastructure

1. [Download](https://downloads.raspberrypi.org/raspbian_lite_latest) most current Raspbian Image
1. Use [BalenaEtcher](https://www.balena.io/etcher/) to write the downloaded image to the SD card
1. Create empty file named ```ssh``` in the root directory of the SD card
1. Create the file `wpa_supplicant.conf` in the root directory of the SD card
   
   ``` sh
    country=AT
    ctrl_interface=DIR=/var/run/wpa_supplicant GROUP=netdev
    update_config=1

    network={
        ssid="YOUR_SSID"
        psk="YOUR_PASSWORD"
    }
     ```
1. Put your SD card into your Raspberry PI and boot the device
1. Connecto to your device:

   `ssh pi@raspberrypi.local`

1. Use default password:

    `raspberry`

1. Change your password after login:

   `passwd`

1. Change the hostname of the device and expand the filesystem

   `sudo raspi-config`

1. Update your packages:
   
   `sudo apt-get update -y && sudo apt-get upgrade -y`

1. Install Node JS: 

   ```
   wget https://nodejs.org/dist/v10.16.3/node-v10.16.3-linux-armv6l.tar.xz
   tar -xf node-v10.16.3-linux-armv6l.tar.xz
   sudo cp -R node-v10.16.3-linux-armv6l/* /usr/local/
   rm node-v10.16.3-linux-armv6l.tar.xz
   rm -R node-v10.16.3-linux-armv6l
   node -v
   ```

1. Install Git:
 
   `sudo apt-get install git`

1. Install libasound2-dev (needed for the npm-speaker module)

   `sudo apt-get install libasound2-dev`

1. Clone the source

   `git clone https://github.com/jfuerlinger/leabox`

1. Download all the npm-modules

   `npm install`


## Ressources

* [Wireless Headless-Setup](https://desertbot.io/blog/headless-raspberry-pi-4-ssh-wifi-setup)


