const configs = {
    MAILJET_APIKEY: 'cfbafa559d9ddf9246e0a1dbd355331a',
    MAILJET_APISECRET: '07592e7d7ea2f7840618b139d8c9c2c9',
    MONGO_URL: 'mongodb://localhost:27017/BRTApplication',
    MONGO_OPTIONS: {
        useNewUrlParser: true,
        autoIndex: false, // Don't build indexes
        reconnectTries: Number.MAX_VALUE, // Never stop trying to reconnect
        reconnectInterval: 500, // Reconnect every 500ms
        poolSize: 10, // Maintain up to 10 socket connections
        // If not connected, return errors immediately rather than waiting for reconnect
        bufferMaxEntries: 0
    },
    VERSION: 'v1',
    SECRETENTITY: '4sW_udEk5FMqHZGsrPiykafaa973757067sW_uddEk5FsW_udEk5FMqHZGsrPiykafaaMqHZGsrPiykafaatjqebjf',
    ACCESS_KEY: '12384-09875poiuyty-987to890pojrt9arokoyu-2tred;sdfguytr08j87to890pojrt9-2tred;sdfguytr08j-987to890pojrt9-2tred;sdfguytr08j--olalekan',
    CENTRALPAY: {
        merchantId: '',
        bank_code: '',
        customer_id: '',
        description: '',
        amount: '',
        currency: '',
        transaction_id: '',
        response_url: '',
        hash: ''
    },
    BASE_CODE: '*54632*',
    PRODUCT_CODE: '345*'

};
module.exports = configs;
// MONGO_URL: 'mongodb://localhost:27017/webChoice',

// accessKey: 'D1XKQQ4PNG0CIPKN03KQBK0BQHOIA9MH',