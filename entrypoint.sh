#!/bin/sh

echo "Starting the application..."

cp -R /mnt/app/src /home/app/src/
cp -R /mnt/app/tsconfig.json /home/app/src/
cp -R /mnt/app/package.json /home/app/src/

cd /home/app/src

pnpm start