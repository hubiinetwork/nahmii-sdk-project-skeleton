'use strict';

require('dotenv').config();
const debug = require('debug')('src:pay');
const {privateKeyFromKeystore} = require('./key');
const ethers = require('ethers');
const nahmii = require('nahmii-sdk');

(async () => {

    const amount = process.env.AMOUNT || '';
    const currencySymbol = process.env.CURRENCY_SYMBOL || ''; // 'ETH', 'NII' or 'TT1' on dev env
    const recipientAddress = process.env.RECIPIENT_ADDRESS || '';

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
        // Get the currency/token definition
        // --------------------------------------------------------------------
        const currencyDefinitions = await provider.getSupportedTokens();
        const currencyDefinition = currencyDefinitions.find(t => currencySymbol === t.symbol);
        debug(`currency definition: ${JSON.stringify(currencyDefinition)}`);

        // --------------------------------------------------------------------
        // Define a monetary amount
        // --------------------------------------------------------------------
        const monetaryAmount = nahmii.MonetaryAmount.from(
            ethers.utils.parseUnits(amount, currencyDefinition.decimals), currencyDefinition.currency
        );
        debug(`monetary amount: ${JSON.stringify(monetaryAmount)}`);

        // --------------------------------------------------------------------
        // Instantiate a payment
        // --------------------------------------------------------------------
        const payment = new nahmii.Payment(monetaryAmount, wallet.address, recipientAddress, wallet);
        debug(`unsigned payment: ${JSON.stringify(payment)}`);

        // --------------------------------------------------------------------
        // Sign the payment
        // --------------------------------------------------------------------
        await payment.sign();
        debug(`signed payment: ${JSON.stringify(payment)}`);

        // --------------------------------------------------------------------
        // Register the payment, i.e. effectuate it
        // --------------------------------------------------------------------
        const paymentResponse = await payment.register();
        debug(`payment registration response: ${JSON.stringify(paymentResponse)}`);

    } finally {
        provider.stopUpdate();
    }
})();