const axios = require('axios');
const { generateKeyPair, generateSharedSecret, generateHMAC } = require('./crypto.utils');

let sharedSecret;

async function sendAAPublicKey() {
    try {
        const response = await axios.get('http://localhost:3000/init');
        const { boostPublicKey, boostGenerator, boostPrime } = response.data;

        const AA = generateKeyPair(boostPrime, boostGenerator);
        sharedSecret = generateSharedSecret(AA, Buffer.from(boostPublicKey, 'hex'));

        return AA.publicKey;
    } catch (error) {
        console.error('Error sending AA public key:', error.message);
        throw error;
    }
}

async function verifyData(data, hmac) {
    try {
        const calculatedHMAC = generateHMAC(JSON.stringify(data), sharedSecret);
        return calculatedHMAC === hmac ? "Integrity and authenticity verified" : "Integrity or authenticity compromised";
    } catch (error) {
        console.error('Error verifying data:', error.message);
        throw error;
    }
}

module.exports = { sendAAPublicKey, verifyData };