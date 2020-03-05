# Project skeleton for `nahmii-sdk`

A simple skeleton for project based on [`nahmii-sdk`](https://github.com/hubiinetwork/nahmii-sdk).

## Installation

After downloading this repo do an npm install.

```
npm install
```

## Basic Setup

In order to interact with nahmii through `nahmii-sdk` some basic nahmii APi credentials in the form of an _app ID_ and an _app secret_ are needed. These credentials are used to generate JWT tokens for the interaction with the nahmii back-end through `nahmii-sdk`. As of now you may reach out to `support@hubii.com` in order to obtain this.

In addition you'll need an Ethereum private key and its associated wallet address. This project examplifies access through this by using keystore files.

For this skeleton a `.env` into the project root directory has been chosen. Copy the existing `.env.template` file and populate the values.

```
API_ROOT=api2.dev.hubii.net
APP_ID=
APP_SECRET=''
WALLET_ADDRESS=
WALLET_SECRET=
KEYSTORE_DIR=
```  

## Start monitor

A monitor skeleton is located in `src/event-provider.js`. Once started it will wait for new payment receipts and print them to the console. Start it as follows, preferably in a separate console window:
```
node src/event-provider.js
```

## Run simple payment workflow

A simple workflow of executing a payment through nahmii is examplified in `src/index.js`. We advice that you open this file in your IDE and uncomment features to try out. Once ready to take it for a spin it may be run as
```
DEBUG=* node src/index.js
```
The `DEBUG=*` prefix allows the output of embedded debug statements to the console, including ones from certain third party libraries.