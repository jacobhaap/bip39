const { getChecksum, verifyChecksum } = require('./src/checksum');
const { toMnemonic, validateMnemonic } = require('./src/mnemonic');
const toEntropy = require('./src/toEntropy');

function bip39() {
    throw new Error(`Function 'bip39' requires a method.`);
};

bip39.core = {
    toMnemonic: function(wordlist, ent) {
        if (!wordlist) {
            throw new Error(`Parameter 'wordlist' is required.`);
        } if (!ent) {
            throw new Error(`Initial Entropy parameter 'ent' is required.`);
        } if (ent.length < 128 || ent.length > 256) {
            throw new Error(`Initial Entropy must be at least 128 bits and no longer than 256 bits.`);
        } if (ent.length % 32 !== 0) {
            throw new Error(`Initial Entropy must be a multiple of 32.`);
        }

        const checksumLength = ent.length / 32;
        const entropy = getChecksum(ent, checksumLength);
        const mnemonic = toMnemonic(wordlist, entropy);
        const valid = validateMnemonic(wordlist, mnemonic, checksumLength);
        if (valid) {
            return mnemonic;
        } else {
            throw new Error(`Invalid mnemonic returned.`)
        }
    },
    toEntropy: toEntropy,
    validate: function(wordlist, mnemonic) {
        if (!wordlist) {
            throw new Error(`Parameter 'wordlist' is required.`);
        } if (!mnemonic) {
            throw new Error(`Parameter 'mnemonic' is required.`);
        }

        const lengths = [ 12, 15, 18, 21, 24 ];
        const words = mnemonic.split(' ').length;
        if (!lengths.includes(words)) {
            throw new Error(`Invalid mnemonic length.`);
        }

        function getChecksumLength(mnemonic) {
            const lengths = { 12: 4, 15: 5, 18: 6, 21: 7, 24: 8 };
            const words = mnemonic.split(' ').length;
            if (lengths[words]) return lengths[words];
            throw new Error(`Invalid mnemonic length.`);
        }
        const checksumLength = getChecksumLength(mnemonic);
        const valid = validateMnemonic(wordlist, mnemonic, checksumLength);
        return valid;
    }
};

bip39.ext = {
    toMnemonic: toMnemonic,
    toEntropy: toEntropy,
    validate: validateMnemonic
};

bip39.ent = {
    checksum: getChecksum,
    verify: verifyChecksum
};

function loadWordlist(language) {
    switch (language) {
        case 'czech':
            return require('./wordlists/czech').czech;
        case 'english':
            return require('./wordlists/english').english;
        case 'french':
            return require('./wordlists/french').french;
        case 'italian':
            return require('./wordlists/italian').italian;
        case 'portuguese':
            return require('./wordlists/portuguese').portuguese;
        case 'spanish':
            return require('./wordlists/spanish').spanish;
        default:
            throw new Error(`Unknown wordlist language: ${language}`);
    }
};

const wordlists = {
    get czech() { return loadWordlist('czech'); },
    get english() { return loadWordlist('english'); },
    get french() { return loadWordlist('french'); },
    get italian() { return loadWordlist('italian'); },
    get portuguese() { return loadWordlist('portuguese'); },
    get spanish() { return loadWordlist('spanish'); }
};

module.exports = { bip39, wordlists };
