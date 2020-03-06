'use strict';

require('dotenv').config();
const debug = require('debug')('src:deposit');
const {privateKeyFromKeystore} = require('./key');
const nahmii = require('nahmii-sdk');

(async () => {

    const amount = process.env.AMOUNT || '';
    const currencySymbol = process.env.CURRENCY_SYMBOL || ''; // 'ETH', 'NII' or 'TT1' on dev env

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
        // Deposit into nahmii
        // --------------------------------------------------------------------
        const pendingApprovalTx = await wallet.approveTokenDeposit(amount, currencySymbol);
        debug(`approval tx hash: ${pendingApprovalTx.hash}`);
        await provider.getTransactionConfirmation(pendingApprovalTx.hash, 180);

        const pendingCompletionTx = await wallet.completeTokenDeposit(amount, currencySymbol);
        debug(`completion tx hash: ${pendingCompletionTx.hash}`);
        await provider.getTransactionConfirmation(pendingCompletionTx.hash, 180);

    } finally {
        provider.stopUpdate();
    }
})();