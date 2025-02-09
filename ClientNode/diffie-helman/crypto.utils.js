const crypto = require('crypto');

function generateKeyPair(prime, generator) {
    const diffieHellman = prime && generator
        ? crypto.createDiffieHellman(prime, 'hex', generator, 'hex')
        : crypto.createDiffieHellman(2048);
    diffieHellman.generateKeys();
    return {
        publicKey: diffieHellman.getPublicKey(),
        privateKey: diffieHellman.getPrivateKey(),
        generator: diffieHellman.getGenerator(),
        prime: diffieHellman.getPrime(),
        diffieHellman,
    };
}

function generateSharedSecret(keyPair, publicKey) {
    return keyPair.diffieHellman.computeSecret(publicKey);
}

function generateHMAC(data, secretKey) {
    const hmac = crypto.createHmac('sha256', secretKey);
    hmac.update(data);
    return hmac.digest('hex');
}

module.exports = { generateKeyPair, generateSharedSecret, generateHMAC };