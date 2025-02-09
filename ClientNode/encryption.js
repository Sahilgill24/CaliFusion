const crypto = require('crypto');

const algorithm = 'aes-256-cbc';
const key = Buffer.from("mypasswith32chars>>AES_256_bytes".padEnd(32, " "), "utf-8"); // Ensure exactly 32 bytes
const iv = crypto.randomBytes(16); // Initialization Vector

function encrypt(text) {
    let cipher = crypto.createCipheriv(algorithm, key, iv);
    let encrypted = Buffer.concat([cipher.update(text, 'utf-8'), cipher.final()]);
    return { iv: iv.toString('hex'), encryptedData: encrypted.toString('hex') };
}

function decrypt(encryptedObject) {
    let iv = Buffer.from(encryptedObject.iv, 'hex');
    let encryptedText = Buffer.from(encryptedObject.encryptedData, 'hex');
    let decipher = crypto.createDecipheriv(algorithm, key, iv);
    let decrypted = Buffer.concat([decipher.update(encryptedText), decipher.final()]);
    return decrypted.toString('utf-8');
}

// Example usage
const encrypted = encrypt("Hello World");
console.log("Encrypted:", encrypted.encryptedData);

const decrypted = decrypt(encrypted);
console.log("Decrypted:", decrypted);

module.exports = { encrypt, decrypt };
