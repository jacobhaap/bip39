const crypto = require('crypto');

function getChecksum(ENT, checksumLength) {
    if (!ENT) {
        throw new Error(`Initial Entropy Parameter 'ENT' is required.`);
    }

    const hash = crypto.createHash('sha256').update(ENT).digest();
    const checksum = hash.readUIntBE(0, Math.ceil(checksumLength / 8)).toString(2).padStart(8 * Math.ceil(checksumLength / 8), '0').slice(0, checksumLength);

    const binaryENT = Array.from(ENT).map(byte => byte.toString(2).padStart(8, '0')).join('');
    const combinedEntropy = binaryENT + checksum;

    const paddedLength = Math.ceil(combinedEntropy.length / 8) * 8;
    const paddedBinary = combinedEntropy.padEnd(paddedLength, '0');

    const byteArray = [];
    for (let i = 0; i < paddedBinary.length; i += 8) {
        byteArray.push(parseInt(paddedBinary.slice(i, i + 8), 2));
    }

    const entropy = Buffer.from(byteArray);
    return entropy;
}

module.exports = getChecksum;
