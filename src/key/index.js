'use strict';

const fs = require('fs');
const path = require('path');
const ethers = require('ethers');

module.exports = {
    privateKeyFromKeystore: async (walletAddress, walletSecret, keystoreDir) => {
            const files = fs.readdirSync(keystoreDir);
            const regex = new RegExp(walletAddress.replace('0x', ''), 'i');
            const matchedFile = files.filter(f => f.match(regex)).shift();
            if (!matchedFile)
                throw new Error(`Unable to find keystore file for wallet ${walletAddress}`);

            const keystore = fs.readFileSync(path.join(keystoreDir, matchedFile));
            const wallet = await ethers.Wallet.fromEncryptedJson(keystore, walletSecret);
            return wallet.privateKey;
    }
};