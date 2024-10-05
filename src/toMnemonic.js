function toMnemonic(wordlist, entropy) {
    if (!wordlist) {
        throw new Error(`Parameter 'wordlist' is required.`);
    } if (!entropy) {
        throw new Error(`Parameter 'entropy' is required.`);
    }

    if (!Buffer.isBuffer(entropy)) {
        throw new Error(`Parameter 'entropy' must be a byte array.`);
    }

    const entropyBinary = Array.from(entropy).map(byte => byte.toString(2).padStart(8, '0')).join('');
    const trimmedBinary = entropyBinary.slice(0, entropyBinary.length - (entropyBinary.length % 11));

    if (trimmedBinary.length < 11 || trimmedBinary.length > 506) {
        throw new Error(`Entropy must be at least 11 bits and no longer than 506 bits.`);
    } if (trimmedBinary.length % 11 !== 0) {
        throw new Error(`Entropy must be a multiple of 11.`);
    }

    const words = [];
    for (let i = 0; i < trimmedBinary.length; i += 11) {
        const index = parseInt(trimmedBinary.slice(i, i + 11), 2);
        words.push(wordlist[index]);
    }
    const mnemonic = words.join(' ');
    return mnemonic;
}

module.exports = toMnemonic;
