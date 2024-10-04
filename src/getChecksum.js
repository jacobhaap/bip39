const crypto = require('crypto');

function getChecksum(entropy) {
    if (!entropy) {
        throw new Error(`Parameter 'entropy' is required.`);
    } if (entropy.length < 128 || entropy.length > 256 || entropy.length % 32 !== 0) {
        throw new Error(`Invalid Entropy Length '${entropy.length}'. Must be between 128 and 256 bits, and divisible by 32.`);
    }

    const hash = crypto.createHash('sha256').update(entropy, 'binary').digest('hex');
    const checksumLength = entropy.length / 32;
    const checksum = parseInt(hash, 16).toString(2).padStart(256, '0').slice(0, checksumLength);

    return entropy + checksum;
}

module.exports = getChecksum;
