# Project skeleton for `nahmii-sdk`

A simple skeleton for project based on [`nahmii-sdk`](https://github.com/hubiinetwork/nahmii-sdk).

## Installation

After downloading this repo do an npm install.

```
npm install
```

## Basic Setup

In order to interact with nahmii through `nahmii-sdk` some basic nahmii APi credentials in the form of an _app ID_ and an _app secret_ are needed. These credentials are used to generate JWT tokens for the interaction with the nahmii back-end through `nahmii-sdk`. As of now you may reach out to [`support@hubii.com`](mailto:support@hubii.com) in order to obtain this.

In addition you'll need an Ethereum private key and its associated wallet address. This project exemplifies access to these credentials by using [keystore files](https://medium.com/@julien.maffre/what-is-an-ethereum-keystore-file-86c8c5917b97).

For this skeleton a `.env` into the project root directory has been chosen. Copy the existing `.env.template` file and populate the missing values.

```
API_ROOT=api2.dev.hubii.net
APP_ID=
APP_SECRET=''
WALLET_ADDRESS=
WALLET_SECRET=
KEYSTORE_DIR=
```  

## Start monitor

A monitor skeleton is located in `src/monitor.js`. Once started it will wait for the registration of new payments and print their receipts to the console. Start it as follows, preferably in a separate console window:
```
node src/monitor.js
```

## Show nahmii balance and receipts

Core stats to be obtained from nahmii involve a wallet's balance and also possibly its previous receipts. Run the following to output data for both:
```
DEBUG='src:show-stats' node src/show-stats.js
```
The `DEBUG=src:show-stats` prefix allows the output of embedded debug statements to the console. Replacing the prefix by `DEBUG=*` enables debug statements also from certain third party libraries.

## Run a simple deposit workflow

The interaction with nahmii usually involves the deposit of some funds into a contract called the `ClientFund`. There is a a simple workflow of executing a deposit implemented in `src/deposit.js`. Once you've updated it with values of constants `amount` and `currencySymbol` (or set up to pass their values through environment variables `AMOUNT` and `CURRENCY_SYMBOL`, respectively) it is ready to be run as
```
DEBUG=* node src/deposit.js
```

**Note** that once a deposit transaction has been mined a duration of 12 blocks have to elapse before the deposited funds show up as nahmii balance. The reason for this is that deposit transaction may be in a block that subsequently is deemed as stale, effectively rolling back the deposit. After 12 blocks have passed, however, the chances for transaction rollback are below acceptable limits.

## Run a simple payment workflow

With non-zero nahmii balance it is time to trigger a payment. Hence a simple workflow of executing a payment through nahmii is exemplified in `src/pay.js`. Again update the value or provide environment variables equivalents of some constants in it, more specifically `amount`, `currencySymbol` and `recipientAddress`. It may be run as follows
```
DEBUG=* node src/pay.js
```

Once the payment has executed you may revisit the first workflow of obtaining nahmii balance and receipts to verify that your balance has been updated and a the receipt of your payment is returned.
