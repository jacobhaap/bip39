# BIP39
> A lightweight modified implementation of BIP39.

This library supports a lightweight implementation of the [BIP39 standard for mnemonic phrases](https://github.com/bitcoin/bips/blob/master/bip-0039.mediawiki). In this implementation, two functions are supported: **toMnemonic**, and **toEntropy**. To get started, install the library:
```bash
npm install @iacobus/bip39
```
**Diversions from the standard:** This library diverges from the established BIP39 standard in a few ways, primarily in regards to entropy handling and mnemonic length. While mnemonic phrases in full compliance with the standard can be generated using this library if the entropy provided to the `toMnemonic` function already contains a checksum, it is also possible to generated phrases that fall outside the scope of the standard.
 - **Entropy Encoding:** The standard states that entropy must be a multiple of 32 bits, allowing an initial entropy length (ENT) between 128 and 256 bits. In this library, these requirements are relaxed, only requiring entropy to be a multiple of 11, with an expected length between 11 and 506 bits. Relaxing these requirements allow for a greater range of mnemonic phrase lengths to be generated[^1].
- **Lack of Checksum:** The standard states a checksum is generated by taking the first few bits of the SHA-256 hash of the entropy, and appending it to the end[^2]. The decision was made here to omit an internal checksum function, instead delegating the task to users of the library so that raw entropy and entropy with a checksum can be processed equally.
- **Mnemonic Length:** As the standard permits entropy between 128 and 256 bits, with a checksum of length `ENT / 32` appended, this makes for a range of 132 to 264 bits permissible for use in mnemonic generation. Adding the requirement that entropy be a multiple of 32 bits, this allows for mnemonic lengths based on multiples of 32 bits between 12 and 24 words (most commonly 12, 18, and 24). With the adjusted requirements in this library, mnemonics based on entropy of any multiple of 11 between 11 bits and 506 bits are possible, meaning any mnemonic length between 1 and 46 can be generated.

As a note, this library only provides wordlists, and functions to convert between entropy and mnemonics. Since no internal entropy generator is present, all entropy must be obtained externally for use in the `toMnemonic` function. Additionally, no functionality for key derivation/"obtaining a seed" is present.

## Wordlists
Currently, wordlists from the BIP39 standard that use the Latin alphabet are included: **Czech**, **English**, **French**, **Italian**, **Portuguese**, and **Spanish**. The non-Latin wordlists for Japanese, Korean, Chinese (Simplified), and Chinese (Traditional) are not included. Each wordlist can be imported as `wordlist`, or the name of the wordlist.
```js
// Import as "wordlist"
const { wordlist } = require('@iacobus/bip39/wordlists/english');

// Import as the name of the wordlist
const { english } = require('@iacobus/bip39/wordlists/english');

```

It is also possible to import a bundle of all the wordlists as `wordlist`, where each wordlist can be accessed as a property of the wordlist bundle, such as `wordlist.czech`.
```js
// Import all wordlists
const wordlist = require('@iacobus/bip39/wordlist');

```

## toMnemonic
The `toMnemonic` function accepts entropy (bits) at a multiple of 11 as input, and returns a mnemonic phrase based on the chosen wordlist.
```js
toMnemonic(wordlist, entropy);
```
This function expects a `wordlist` parameter (e.g.. the BIP39 English wordlist), and an `entropy` parameter.

*Example use:*
```js
const { toMnemonic } = require('@iacobus/bip39');
const { wordlist } = require('@iacobus/bip39/wordlists/english');

const entropy = "110010010001100010001101000011110101010100011110110100110111100001010100001101111100000110011111100001011111110011011101010100011101";

const mnemonic = toMnemonic(wordlist, entropy);
console.log(mnemonic);

// Sample Output:
// simple settle duck pretty unfold rotate express wealth panel copper dance photo

```

## toEntropy
The `toEntropy` function accepts a mnemonic phrase as input (must be called with the same wordlist the phrase contains words from), and returns entropy.
```js
toEntropy(wordlist, mnemonic);
```
This function expects a `wordlist` parameter, and a `mnemonic` parameter (a mnemonic phrase).

*Example Use:*
```js
const { toEntropy } = require('@iacobus/bip39');
const { wordlist } = require('@iacobus/bip39/wordlists/english');

const mnemonic = "simple settle duck pretty unfold rotate express wealth panel copper dance photo";

const entropy = toEntropy(wordlist, mnemonic);
console.log(entropy);

// Sample Output:
// 110010010001100010001101000011110101010100011110110100110111100001010100001101111100000110011111100001011111110011011101010100011101

```

[^1]: *The minimum entropy length of 11 bits is necessary to obtain at least one word, as no word from any wordlist can be obtained with less than 11 bits. The maximum entropy length of 512 bits is necessary to avoid exceeding 512 bits in length, with 506 being the highest multiple of 11 below 512.*
[^2]: *To create a checksum, the first `ENT / 32` bits of the SHA-256 hash of the entropy is taken (e.g.. 128 / 32 = 4). These bits becomes the checksum, and are appended to the end of the initial entropy.*
