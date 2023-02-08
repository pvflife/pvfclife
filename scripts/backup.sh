#!/bin/bash -e

function check_and_install_package() {
  REQUIRED_PKG=$1
  PKG_OK=$(dpkg-query -W --showformat='${Status}\n' $REQUIRED_PKG|grep "install ok installed")
  echo Checking for $REQUIRED_PKG: $PKG_OK
  if [ "" = "$PKG_OK" ]; then
    echo "No $REQUIRED_PKG. Setting up $REQUIRED_PKG."
    sudo apt-get --yes install $REQUIRED_PKG
  fi
}

function main {
  cd ~/

  cp -a ~/pvfclife/Backend/uploads/* ~/backup
  
  rm -rf backup.zip

  check_and_install_package "zip"
  
  zip -r backup.zip backup

  check_and_install_package "sshpass"

  sshpass -p "Httv1234" scp -o StrictHostKeyChecking=no -o UserKnownHostsFile=/dev/null backup.zip root@139.99.64.150:. 
}

main