const crypto = require('crypto');

function getChecksum(entropy, checksumLength) {
    if (!entropy) {
        throw new Error(`Parameter 'entropy' is required.`);
    } if (entropy.length < 16 || entropy.length > 32 || entropy.length % 4 !== 0) {
        throw new Error(`Invalid Entropy Length '${entropy.length * 8}' bits. Must be between 128 and 256 bits, and divisible by 32.`);
    }

    const hash = crypto.createHash('sha256').update(entropy).digest();
    const checksumBits = hash.readUIntBE(0, Math.ceil(checksumLength / 8)).toString(2).padStart(8 * Math.ceil(checksumLength / 8), '0').slice(0, checksumLength);

    const entropyBinary = Array.from(entropy).map(byte => byte.toString(2).padStart(8, '0')).join('');
    const combinedBinary = entropyBinary + checksumBits;

    const paddedLength = Math.ceil(combinedBinary.length / 8) * 8;
    const paddedBinary = combinedBinary.padEnd(paddedLength, '0');

    const byteArray = [];
    for (let i = 0; i < paddedBinary.length; i += 8) {
        byteArray.push(parseInt(paddedBinary.slice(i, i + 8), 2));
    }

    return Buffer.from(byteArray);
}

module.exports = getChecksum;
