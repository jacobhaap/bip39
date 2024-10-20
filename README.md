# BIP39
![NPM Version](https://img.shields.io/npm/v/%40iacobus%2Fbip39) ![NPM License](https://img.shields.io/npm/l/%40iacobus%2Fbip39) ![NPM Unpacked Size](https://img.shields.io/npm/unpacked-size/%40iacobus%2Fbip39)

> An extended implementation of BIP39.

This library supports a lightweight implementation of the [BIP39 standard for mnemonic phrases](https://github.com/bitcoin/bips/blob/master/bip-0039.mediawiki). To get started, install the library:
```bash
npm install @iacobus/bip39
```
Included in this library is a series of wordlists, and the `bip39` function, which supports the following methods:
 - **`bip39.core`**: Supports creation and validation of mnemonic phrases in compliance with the BIP39 standard.
 - **`bip39.ext`**: An extended version of BIP39, supporting creation and validation of mnemonic phrases that are non-compliant with the BIP39 standard.
 - **`bip39.ent`**: Supports converting mnemonic phrases to entropy, adding a checksum to initial entropy, and verifying checksums.

---

**Diversions from the standard:** This library diverges from the established BIP39 standard in a few ways, primarily in regards to entropy handling and mnemonic length.  While mnemonic phrases in full compliance with the standard can be generated using `bip39.core`, using `bip39.ext` supports generating phrases that fall outside the scope of the standard.
 - **Entropy Encoding:** The standard states that entropy must be a multiple of 32 bits, allowing an initial entropy length (ENT) between 128 and 256 bits. In this library, these requirements are relaxed, only requiring entropy to be a multiple of 11, with an expected length between 11 and 506 bits. Relaxing these requirements for `bip39.ext` allow for a greater range of mnemonic phrase lengths to be generated[^1].
- **Lack of Checksum:** The standard states a checksum is generated by taking the first few bits of the SHA-256 hash of the entropy, and appending it to the end[^2]. For `bip39.ext.toMnemonic`, the decision was made to omit an internal checksum function, instead delegating the task to the user of the library so that raw entropy and entropy with a checksum can be processed equally (a checksum can be obtained for non-compliant entropy using `bip39.ent.checksum`).
- **Mnemonic Length:** As the standard permits entropy between 128 and 256 bits, with a checksum of length `ENT / 32` appended, this makes for a range of 132 to 264 bits permissible for use in mnemonic generation. Adding the requirement that entropy be a multiple of 32 bits, this allows for mnemonic lengths based on multiples of 32 bits between 12 and 24 words (most commonly 12, 18, and 24). With the adjusted requirements in this library, mnemonics based on entropy of any multiple of 11 between 11 bits and 506 bits are possible with `bip39.ext.toMnemonic`, meaning any mnemonic length between 1 and 46 can be generated.

[^1]: *The minimum entropy length of 11 bits is necessary to obtain at least one word, as no word from any wordlist can be obtained with less than 11 bits. The maximum entropy length of 512 bits is necessary to avoid exceeding 512 bits in length, with 506 being the highest multiple of 11 below 512.*
[^2]: *To create a checksum, the first `ENT / 32` bits of the SHA-256 hash of the entropy is taken (e.g.. 128 / 32 = 4). These bits becomes the checksum, and are appended to the end of the initial entropy.*

As a note, this library only provides wordlists, functions for mnemonic generation and validation, checksum generation and verification, and mnemonic to entropy conversions. Since no internal entropy generator is present, all entropy must be obtained externally.

## Wordlists
Currently, wordlists from the BIP39 standard that use the Latin alphabet are included: **Czech**, **English**, **French**, **Italian**, **Portuguese**, and **Spanish**. The non-Latin wordlists for Japanese, Korean, Chinese (Simplified), and Chinese (Traditional) are not included. Each wordlist can be imported as `wordlist`, or the name of the wordlist.
```js
// Import as "wordlist"
const { wordlist } = require('@iacobus/bip39/wordlists/english');

// Import as the name of the wordlist
const { english } = require('@iacobus/bip39/wordlists/english');

```

It is also possible to import a bundle of all the wordlists as `wordlists`, where each wordlist can be accessed as a property of the wordlist bundle, such as `wordlists.czech`.
```js
// Import wordlists bundle
const { wordlists } = require('@iacobus/bip39');

// Get the Czech and English wordlists
const czech = wordlists.czech;
const english = wordlists.english;

```

## toMnemonic
Mnemonic phrases can be obtained from entropy based on a provided wordlist, using the `toMnemonic` method of either the `bip39.core` or `bip39.ext`.

### bip39.core.toMnemonic
The `toMnemonic` method of `bip39.core` generates mnemonic phrases in compliance with the BIP39 standard.
```js
bip39.core.toMnemonic(wordlist, ent);
```
This expects a `wordlist` parameter (e.g.. the BIP39 English wordlist), and an `ent` parameter for initial entropy (entropy without a checksum). The initial entropy must be between 128 and 256 bits in length, and be divisible by 32. Creating and appending a checksum based on the initial entropy is handled internally, along with internal validation before returning the mnemonic.

*Example use, using a wordlist form the "wordlists" bundle:*
```js
const { bip39, wordlists } = require('@iacobus/bip39');

const wordlist = wordlists.english;

const entropy = "01000010011011110110010101101001011011100110011100100000010000010011001100110010001100010010000001001101010000010101100000100001";

const mnemonic = bip39.core.toMnemonic(wordlist, entropy);
console.log(mnemonic);

// Sample Output:
// draw kite fog system improve calm smoke economy cake head figure drastic

```

### bip39.ext.toMnemonic
The `toMnemonic` method of `bip39.ext` generates mnemonic phrases non-compliant with the BIP39 standard.
```js
bip39.ext.toMnemonic(wordlist, entropy);
```
This expects a `wordlist` parameter, and `entropy` parameter. The entropy must be between 11 and 506 bits in length, and divisible by 11. Since this extension of `toMnemonic` is non-compliant with the BIP39 standard, a wider range of mnemonic lengths than ordinarily permitted can be generated. There is no internal handling for a checksum, and there is no internal validation before the mnemonic is returned.

*Example use, with a mnemonic length of 17 (no checksum):*
```js
const { bip39 } = require('@iacobus/bip39');
const { wordlist } = require('@iacobus/bip39/wordlists/english');

const entropy = "0101100101101111011101010010000001101010011101010111001101110100001000000110110001101111011100110111010000100000011101000110100001100101001000000110011101100001011011010110010100100001000";

const mnemonic = bip39.ext.toMnemonic(wordlist, entropy);
console.log(mnemonic);

// Sample Output:
// floor knife elite stay fire ring like mistake inflict patient brown speak faith crisp mad protect canal

```

## validate
Mnemonic phrases can be validated  based on a provided wordlist (and checksum length for the extended version), using the `validate` method of either `bip39.core` or `bip39.ext`.

### bip39.core.validate
The `validate` method of `bip39.core` checks the validity of a mnemonic phrase, based on a provided wordlist, for mnemonic phrases generated in compliance with the BIP39 standard.
```js
bip39.core.validate(wordlist, mnemonic);
```
This expects a `wordlist` parameter, and a `mnemonic` parameter that must contain a compliant mnemonic phrase. This will check the validity of the provided mnemonic phrase, and then return a true or false value, where true means the phrase has passed validation, and false means the validation has failed.

*Example use:*
```js
const { bip39 } = require('@iacobus/bip39');
const { wordlist } = require('@iacobus/bip39/wordlists/english');

const mnemonic = "draw kite fog system improve calm smoke economy cake head figure drastic";

const valid = bip39.core.validate(wordlist, mnemonic);
console.log(valid);

// Sample Output:
// true
```

### bip39.ext.validate
The validate method of bip39.ext checks the validity of a mnemonic phrase, based on a provided wordlist, for mnemonic phrases generated outside of compliance of the BIP39 standard.
```js
bip39.ext.validate(wordlist, mnemonic, checksumLength);
```
This expects a `wordlist` parameter, a `mnemonic` parameter that must contain a mnemonic phrase, and a `checksumLength` parameter that is expected to be a number equal to the length (in bits) of the checksum. This will check the validity of the provided mnemonic phrase, and then return a true or false value, where true means the phrase has passed validation, and false means the validation has failed.

*Example use, with a mnemonic length of 14 and a 5 bit checksum:*
```js
const { bip39 } = require('@iacobus/bip39');
const { wordlist } = require('@iacobus/bip39/wordlists/english');

const mnemonic = "embody clock brand tattoo afford crawl random mistake jaguar across bubble suspect black above";

const valid = bip39.ext.validate(wordlist, mnemonic, 5);
console.log(valid);

// Sample Output:
// true

```

## bip39.ent
Methods for converting mnemonics to entropy, obtaining a checksum, and verifying a checksum, are available under `bip39.ent` as `toEntropy`, `checksum`, and `verify`. These are not specific to either compliance or non-compliance with the BIP39 standard, and therefore work for both cases.

### Converting a Mnemonic to Entropy
Entropy (bits) can be obtained from a mnemonic phrase, based on a provided wordlist, using the `toEntropy` method of `bip39.ent`.
```js
bip39.ent.toEntropy(wordlist, mnemonic);
```
This expects a `wordlist` parameter, and a `mnemonic` parameter that must contain a mnemonic phrase. This will convert the words of the mnemonic back to the entropy used to generate the phrase, including any checksum if present, returning the entropy (bits) in the output.

*Example use:*
```js
const { bip39 } = require('@iacobus/bip39');
const { wordlist } = require('@iacobus/bip39/wordlists/english');

const mnemonic = "draw kite fog system improve calm smoke economy cake head figure drastic";

const entropy = bip39.ent.toEntropy(wordlist, mnemonic);
console.log(entropy);

// Sample Output:
// 010000100110111101100101011010010110111001100111001000000100000100110011001100100011000100100000010011010100000101011000001000010010

```

### Obtaining a Checksum
A checksum can be obtained and appended to initial entropy using the `checksum` method of `bip39.ent`.
```js
bip39.ent.checksum(ent, checksumLength);
```
This expects an `ent` parameter for the initial entropy in bits, and a `checksumLength` parameter which expects the length of the checksum in bits as a number. A checksum of the specified `checksumLength` will be generated based on the provided initial entropy, and will return the entropy with checksum appended in the output.

*Example use, with a checksum length of 5:*
```js
const { bip39 } = require('@iacobus/bip39');

const ent = "01001000011001010110110001101100011011110010000001000110011001010110110001101100011011110111011100100000010010000111010101101101011000010110111000000";
const entropy = bip39.ent.checksum(ent, 5);
console.log(entropy);

// Sample Output:
// 0100100001100101011011000110110001101111001000000100011001100101011011000110110001101111011101110010000001001000011101010110110101100001011011100000000100

```

### Verifying a Checksum
An entropy string containing a checksum can be verified using the `verify` method of `bip39.ent`.
```js
bip39.ent.verify(entropy, checksumLength);
```
This expects an `entropy` parameter, which must contain an entropy string containing a checksum, and a `checksumLength` parameter, which expects the length of the checksum in bits as a number. This will attempt to verify the checksum in the given entropy string based on the checksum length, and then return a true or false value, where true means the checksum has passed verification, and false means the verification failed.

*Example use:*
```js
const { bip39 } = require('@iacobus/bip39');

const entropy = "0100100001100101011011000110110001101111001000000100011001100101011011000110110001101111011101110010000001001000011101010110110101100001011011100000000100";

const verified = bip39.ent.verify(entropy, 5);
console.log(verified);

// Sample Output:
// true

```
