# Lea's Box

This project is some kind of a port of Tonies box

# Hardware

1. ([Raspberry Pi Zero W](https://electronics.semaf.at/Raspberry-Pi-Zero-W-nur-Board?curr=EUR&gclid=CjwKCAjwlovtBRBrEiwAG3XJ--LvAlaqz9DZxxMFLESknRc7-y4u30wBeKS0E-KI2xG9wMrsksD5ARoCvNUQAvD_BwE)
1. 

# Infrastructure

1. [Download](https://downloads.raspberrypi.org/raspbian_lite_latest) most current Raspbian Image
1. Use [BelenaEtcher](https://www.balena.io/etcher/) to write the downloaded image to the SD card
1. Create empty file named ```ssh``` in the root directory of the SD card
1. ``` sh
country=AT
ctrl_interface=DIR=/var/run/wpa_supplicant GROUP=netdev
update_config=1

network={
    ssid="YOUR_SSID"
    psk="YOUR_PASSWORD"
}
  ```


## Ressources

* [Headless-Setup](https://desertbot.io/blog/headless-raspberry-pi-4-ssh-wifi-setup)
