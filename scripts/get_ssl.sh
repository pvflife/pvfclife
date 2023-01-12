#!/bin/bash -e

COMPOSE="/usr/local/bin/docker-compose"
DOCKER="/usr/bin/docker"
REGIS_DOMAIN=""
NAME_DIRECTORY="/root/pvfclife/certbot/conf/live/"
DIRECTORY_KEY="/root/pvfclife/certbot/conf/live/mykey"

function get_ssl {
  echo "===> Prepare"
  rm -rf certbot
  rm -rf ./conf.d/default.conf
  cp -a ./conf.d/pre-nginx.conf.template ./conf.d/default.conf
  echo "===> Stop container"
  $COMPOSE down
  echo "===> Start nginx"
  $COMPOSE up -d nginx
  echo "===> Get domains"
  COUNT=0
  while read line; do
    if [ $COUNT -eq 0 ]
    then
      NAME_DIRECTORY+="${line}"
    fi
    REGIS_DOMAIN+=" -d ${line}"
    COUNT=$(( $COUNT + 1 ))
  done < domains.txt
  echo "===> Get certificate"
  $COMPOSE run --rm certbot certonly --webroot --webroot-path=/var/www/certbot --email admin@pvfclife.click --agree-tos --no-eff-email $REGIS_DOMAIN
}

function get_key {
  if [ -d "$NAME_DIRECTORY" ] 
  then
    rm -rf $DIRECTORY_KEY
    mkdir $DIRECTORY_KEY
    cp -R $NAME_DIRECTORY/. $DIRECTORY_KEY
  fi
}

function main {
  cd ~/pvfclife

  get_ssl

  get_key
}

main