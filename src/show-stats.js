'use strict';

require('dotenv').config();
const debug = require('debug')('src:show-stats');
const {privateKeyFromKeystore} = require('./key');
const nahmii = require('nahmii-sdk');

(async () => {

    // --------------------------------------------------------------------
    // Instantiate a nahmii provider
    // --------------------------------------------------------------------
    const provider = await nahmii.NahmiiProvider.from(
        process.env.API_ROOT,
        process.env.APP_ID,
        process.env.APP_SECRET
    );

    try {
        // --------------------------------------------------------------------
        // Obtain the private key to sign transactions, e.g. from a keystore file
        // --------------------------------------------------------------------
        const privateKey = await privateKeyFromKeystore(
            process.env.WALLET_ADDRESS,
            process.env.WALLET_SECRET,
            process.env.KEYSTORE_DIR
        );
        debug(`private key: ${privateKey}`);

        // --------------------------------------------------------------------
        // Instantiate a wallet
        // --------------------------------------------------------------------
        const wallet = new nahmii.Wallet(privateKey, provider);
        debug(`wallet address: ${wallet.address}`);

        // --------------------------------------------------------------------
        // Check balances
        // --------------------------------------------------------------------
        const balances = await wallet.getNahmiiBalance();
        debug(`balances: ${JSON.stringify(balances)}`);

        // --------------------------------------------------------------------
        // Get the wallet's previous receipts
        // --------------------------------------------------------------------
        const walletReceipts = await provider.getWalletReceipts(wallet.address);
        debug(`wallet receipts: ${JSON.stringify(walletReceipts)}`);

    } finally {
        provider.stopUpdate();
    }
})();