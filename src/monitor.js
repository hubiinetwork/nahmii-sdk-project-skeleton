'use strict';

require('dotenv').config();
const debug = require('debug')('src:event-provider');
const nahmii = require('nahmii-sdk');

const nahmiiEvents = new nahmii.NahmiiEventProvider(process.env.API_ROOT);
nahmiiEvents.onNewReceipt(receipt => {
    console.log('New receipt issued!');
    console.log(receipt.toJSON());
});
console.log('Eagerly waiting for new receipts...');