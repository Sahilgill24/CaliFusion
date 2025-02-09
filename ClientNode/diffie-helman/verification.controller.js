const { generateKeyPair, generateHMAC } = require('./crypto.utils');

const boostKeyPair = generateKeyPair();

function shareKeys() {
    return {
        boostPublicKey: boostKeyPair.publicKey,
        boostPrivateKey: boostKeyPair.privateKey,
        boostGenerator: boostKeyPair.generator,
        boostPrime: boostKeyPair.prime,
        boostDiffieHellman: boostKeyPair.diffieHellman,
    };
}

function hmacDigest(data, secretKey) {
    return generateHMAC(JSON.stringify(data), secretKey);
}

module.exports = { shareKeys, hmacDigest };