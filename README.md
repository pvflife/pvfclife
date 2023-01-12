# Connecting to the VPS

To connect your VPS server, you can use your server IP, you can create a root password and enter the server with your IP address and password credentials.

## Connection

### For MAC OS / Linux

```bash
ssh root@<server ip address> 
```

### For Windows

1. Open the PuTTY app.
2. Enter your IP address.
3. Open the following section:
Connection - SSH - Auth
4. Browse the folders and choose your private key.

## First Configuration

```bash
rm -rf pvfclife
```

### Upload source or Clone source

#### Upload

##### Upload file
At terminal of local device:

```bash
scp <path_source> root@<server ip address>:.
```

##### Unzip file
At terminal of VPS:

```bash
sudo apt-get install unzip &&
unzip <file.zip> -d pvfclife
```

#### Clone via Github

##### Clone source
At terminal of VPS:

```bash
git clone https://github.com/pvflife/pvfclife.git
```

### Pre-install

```bash
cd pvfclife
```

#### Install Docker, Docker compose

```bash
bash ./scripts/docker_install.sh
```

#### Get ssl (Should be run this command 5 times/ week)

```bash
bash ./scripts/get_ssl.sh
```

#### Deploy

```bash
bash ./scripts/deploy.sh
```

## Add new domain
Open file domains.txt in local and add domain in last line.

### Adding domain

```
pvfclife.click
admin.pvfclife.click
api.pvfclife.click
<example.com>
```

###  Start at [First Configuration](#first-configuration)

## Update ssl when ssl expried

```bash
bash ./scripts/ssl_renew.sh
```
