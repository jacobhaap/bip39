const crypto = require('crypto');

function getChecksum(ENT, checksumLength) {
    if (!ENT) {
        throw new Error(`Initial Entropy Parameter 'ENT' is required.`);
    } if ((ENT.length + checksumLength) < 11 || (ENT.length + checksumLength) > 506) {
        throw new Error(`ENT + Checksum Combined Length must be at least 11 bits and no longer than 506 bits.`);
    } if ((ENT.length + checksumLength) % 11 !== 0) {
        throw new Error(`ENT + Checksum Combined Length must be a multiple of 11.`);
    }

    const byteArray = [];
    for (let i = 0; i < ENT.length; i += 8) {
        byteArray.push(parseInt(ENT.slice(i, i + 8), 2));
    }

    const hash = crypto.createHash('sha256').update(Buffer.from(byteArray)).digest();
    const checksum = Array.from(hash)
        .map(byte => byte.toString(2).padStart(8, '0'))
        .join('')
        .slice(0, checksumLength);

    const combinedEntropy = ENT + checksum;

    return combinedEntropy;
}

module.exports = getChecksum;
