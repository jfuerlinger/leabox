#!/bin/bash

sudo apt-get update -y && sudo apt-get upgrade -y

wget https://nodejs.org/dist/latest-v11.x/node-v11.15.0-linux-armv6l.tar.xz
tar -xf node-v11.15.0-linux-armv6l.tar.xz
sudo cp -R node-v11.15.0-linux-armv6l/* /usr/local/
rm node-v11.15.0-linux-armv6l.tar.xz
rm -R node-v11.15.0-linux-armv6l
node -v

sudo apt-get install git -y

sudo apt-get install libasound2-dev -y

git clone --depth 1 http://git.videolan.org/git/x264
cd x264
./configure --host=arm-unknown-linux-gnueabi --enable-static --disable-opencl
make -j4
sudo make install
cd ..
rm -rf x264
sudo apt-get install libmp3lame-dev -y
git clone git://source.ffmpeg.org/ffmpeg --depth=1
cd ffmpeg
./configure --arch=armel --target-os=linux --enable-gpl --enable-libx264 --enable-libmp3lame --enable-nonfree
make -j4
sudo make install
cd ..
rm -rf ffmpeg

git clone https://github.com/jfuerlinger/leabox

cd leabox

npm install

npm audit fix
