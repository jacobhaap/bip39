const crypto = require('crypto');

function getChecksum(entropy) {
    if (!entropy) {
        throw new Error(`Parameter 'entropy' is required.`);
    } if (entropy.length < 16 || entropy.length > 32 || entropy.length % 4 !== 0) {
        throw new Error(`Invalid Entropy Length '${entropy.length * 8}' bits. Must be between 128 and 256 bits, and divisible by 32.`);
    }

    const hash = crypto.createHash('sha256').update(entropy).digest();
    const checksumLength = entropy.length * 8 / 32;
    const checksum = parseInt(hash.toString('hex'), 16).toString(2).padStart(256, '0').slice(0, checksumLength);

    const entropyBinary = Array.from(entropy).map(byte => byte.toString(2).padStart(8, '0')).join('');
    return entropyBinary + checksum;
}

module.exports = getChecksum;
