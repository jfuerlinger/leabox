# Lea's Box

This project is some kind of a port of Tonies box

# Hardware

1. [Raspberry Pi Zero W](https://electronics.semaf.at/Raspberry-Pi-Zero-W-nur-Board?curr=EUR&gclid=CjwKCAjwlovtBRBrEiwAG3XJ--LvAlaqz9DZxxMFLESknRc7-y4u30wBeKS0E-KI2xG9wMrsksD5ARoCvNUQAvD_BwE)
1. 

# Infrastructure

1. [Download](https://downloads.raspberrypi.org/raspbian_lite_latest) most current Raspbian Image
1. Use [BelenaEtcher](https://www.balena.io/etcher/) to write the downloaded image to the SD card
1. Create empty file named ```ssh``` in the root directory of the SD card
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

1. Update your packages:
   
   `sudo apt-get update -y && sudo apt-get upgrade -y`

1. Install Node JS: 

   ```
   wget https://nodejs.org/dist/v10.16.3/node-v10.16.3-linux-armv6l.tar.xz
   tar -xf node-v10.16.3-linux-armv6l.tar.xz
   sudo cp -R node-v10.16.3-linux-armv6l/* /usr/local/
   rm -R node-v10.16.3-linux-armv6l
   ```

1. Install Git:
 
   `sudo apt-get install git`

1. Clone the source

   `git clone https://github.com/jfuerlinger/leabox`

## Ressources

* [Wireless Headless-Setup](https://desertbot.io/blog/headless-raspberry-pi-4-ssh-wifi-setup)


