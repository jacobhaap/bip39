const crypto = require('crypto');

function getChecksum(ENT, checksumLength) {
    if (!ENT) {
        throw new Error(`Initial Entropy Parameter 'ENT' is required.`);
    } if ((ENT.length + checksumLength) < 11 || (ENT.length + checksumLength) > 506) {
        throw new Error(`ENT + Checksum Combined length must be at least 11 bits and no longer than 506 bits.`);
    } if ((ENT.length + checksumLength) % 11 !== 0) {
        throw new Error(`ENT + Checksum Combined length must be a multiple of 11.`);
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

function verifyChecksum(entropy, checksumLength) {
    if (!entropy) {
        throw new Error(`Parameter 'entropy' is required.`);
    } if (entropy.length < 11 || entropy.length > 506) {
        throw new Error(`Entropy must be at least 11 bits and no longer than 506 bits.`);
    } if (entropy.length % 11 !== 0) {
        throw new Error(`Entropy must be a multiple of 11.`);
    }

    const totalBits = entropy.length;
    const entropyLength = totalBits - checksumLength;
    const entropyBits = entropy.slice(0, entropyLength);
    const actualChecksum = entropy.slice(entropyLength, totalBits);

    const expectedCombinedEntropy = getChecksum(entropyBits, checksumLength);
    const expectedChecksum = expectedCombinedEntropy.slice(entropyLength, totalBits);

    return actualChecksum === expectedChecksum;
}

module.exports = { getChecksum, verifyChecksum };
