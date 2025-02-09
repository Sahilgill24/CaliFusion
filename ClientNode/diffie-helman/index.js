const express = require('express');
const axios = require('axios');
const { shareKeys, hmacDigest } = require('./verification.controller');
const { sendAAPublicKey, verifyData } = require('./aa.controller');
const { generateSharedSecret } = require('./crypto.utils');

const appBoost = express();
const appAA = express();
const PORT_BOOST = 3000;
const PORT_AA = 3001;

let boostPublicKey, boostPrivateKey, boostGenerator, boostPrime, AAPublicKey, sharedSecret, boostDiffieHellman;

appBoost.get('/init', (req, res) => {
    ({ boostPublicKey, boostPrivateKey, boostGenerator, boostPrime, boostDiffieHellman } = shareKeys());
    res.send({ boostPublicKey, boostGenerator, boostPrime });
});

appAA.get('/fetchAAPublicKey', async (req, res) => {
    AAPublicKey = await sendAAPublicKey();
    res.send({ AAPublicKey: AAPublicKey.toString('hex') });

    sharedSecret = generateSharedSecret({
        publicKey: boostPublicKey,
        privateKey: boostPrivateKey,
        generator: boostGenerator,
        prime: boostPrime,
        diffieHellman: boostDiffieHellman,
    }, AAPublicKey);
});

const data = { name: 'Boost User 1', phone: '1234567890' };

appBoost.get('/fetchData', (req, res) => {
    const hmac = hmacDigest(data, sharedSecret);
    res.send({ data, hmac });
});

appAA.get('/verifyData', async (req, res) => {
    const response = await axios.get('http://localhost:3000/fetchData');
    const { data, hmac } = response.data;
    const verified = await verifyData(data, hmac);
    res.send({ verified });
});

appBoost.listen(PORT_BOOST, () => console.log(`Boost server running on http://localhost:${PORT_BOOST}`));
appAA.listen(PORT_AA, () => console.log(`AA server running on http://localhost:${PORT_AA}`));
