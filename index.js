const { getChecksum, verifyChecksum } = require('./src/checksum');
const { toMnemonic, validateMnemonic } = require('./src/mnemonic');
const toEntropy = require('./src/toEntropy');
const wordlist = require('./wordlists/wordlist');

function bip39() {
    throw new Error(`Function 'bip39' requires a method.`);
}

bip39.core = {
    toMnemonic: function(wordlist, ENT) {
        if (!wordlist) {
            throw new Error(`Parameter 'wordlist' is required.`);
        } if (!ENT) {
            throw new Error(`Initial Entropy Parameter 'ENT' is required.`);
        } if (ENT.length < 128 || ENT.length > 256) {
            throw new Error(`Initial Entropy must be at least 128 bits and no longer than 256 bits.`);
        } if (ENT.length % 32 !== 0) {
            throw new Error(`Initial Entropy must be a multiple of 32.`);
        }

        const checksumLength = ENT.length / 32;
        const entropy = getChecksum(ENT, checksumLength);
        const mnemonic = toMnemonic(wordlist, entropy);
        const valid = validateMnemonic(wordlist, mnemonic, checksumLength);
        if (valid) {
            return mnemonic;
        } else {
            throw new Error(`Invalid mnemonic returned.`)
        }
    },
    toEntropy: toEntropy,
    validate: validateMnemonic
};

bip39.ext = {
    toMnemonic: toMnemonic,
    toEntropy: toEntropy,
    validate: validateMnemonic
};

bip39.ent = {
    checksum: getChecksum,
    verify: verifyChecksum
}

bip39.wordlist = wordlist;

module.exports = bip39;
