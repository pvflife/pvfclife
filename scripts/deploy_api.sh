#!/bin/bash -e

COMPOSE="/usr/local/bin/docker-compose"
DOCKER="/usr/bin/docker"

function create_env {
  echo "===> Create .env"
  cp -a ./Backend/.env.example ./Backend/.env
}

function deploy {
  echo "===> Stop container"
  $COMPOSE down
  echo "===> Build images"
  $COMPOSE build api
  echo "===> Deploy"
  $COMPOSE up -d admin api client nginx
}

function clean_up {
  echo "===> Clean up"
  $DOCKER rmi $($DOCKER images --filter "dangling=true" -q --no-trunc)
}

function main {
  cd ~/pvfclife

  create_env

  deploy

  clean_up
}

main