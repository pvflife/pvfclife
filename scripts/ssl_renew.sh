#!/bin/bash

COMPOSE="/usr/local/bin/docker-compose"
DOCKER="/usr/bin/docker"

NAME_DIRECTORY="/root/pvfclife/certbot/conf/live/"
DIRECTORY_KEY="/root/pvfclife/certbot/conf/live/mykey"

function renew_ssl {
  $COMPOSE run --rm certbot renew
  while read line; do
    if [ $COUNT -eq 0 ]
    then
      NAME_DIRECTORY+="${line}"
    fi
    COUNT=$(( $COUNT + 1 ))
  done < domains.txt

  if [ -d "$NAME_DIRECTORY" ] 
  then
    rm -rf $DIRECTORY_KEY
    mkdir $DIRECTORY_KEY
    cp -R $NAME_DIRECTORY/. $DIRECTORY_KEY
  fi
  $COMPOSE down
  $COMPOSE up -d nginx admin client api
}

function main {
  cd ~/pvfclife

  renew_ssl
}

main