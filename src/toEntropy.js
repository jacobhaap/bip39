function toEntropy(wordlist, mnemonic) {
    if (!wordlist) {
        throw new Error(`Parameter 'wordlist' is required.`);
    } if (!mnemonic) {
        throw new Error(`Parameter 'mnemonic' is required.`);
    }

    const words = mnemonic.split(' ');
    const length = words.length;
    if (length < 1 || length > 46) {
        throw new Error(`Mnemonic must be at least 1 word and no longer than 46 words.`);
    }

    let entropy = '';
    words.forEach(word => {
        const index = wordlist.indexOf(word);
        if (index === -1) {
            throw new Error(`Word '${word}' not found in wordlist.`);
        }
        entropy += index.toString(2).padStart(11, '0');
    });

    const paddedLength = Math.ceil(entropy.length / 8) * 8;
    const paddedEntropy = entropy.padEnd(paddedLength, '0');

    const byteArray = [];
    for (let i = 0; i < paddedEntropy.length; i += 8) {
        byteArray.push(parseInt(paddedEntropy.slice(i, i + 8), 2));
    }

    return Buffer.from(byteArray);
}

module.exports = toEntropy;
