
const base58 = require('bs58');
const bip39 = require('bip39');
const web3 = require('@solana/web3.js');
const ed25519Keys = require('ed25519-hd-key');

async function solanaTrustWalletMnemonic(mnemonic) {
    return await solanaMnemonic(mnemonic, `m/44'/501'/0'`, 'trustWallet');
}

async function solanaOfficialMnemonic(mnemonic) {
    return await solanaMnemonic(mnemonic, `m/44'/501'/0'/0'`, 'official');
}

async function solanaMnemonic(mnemonic, derivePath, mark) {
    const seed = await bip39.mnemonicToSeed(mnemonic);
    const derivedSeed = ed25519Keys.derivePath(derivePath, seed.toString('hex')).key;
    const keypair = web3.Keypair.fromSeed(derivedSeed);
    return base58.encode(keypair.secretKey);
}

function getSolanaAddrFromSolanaSecretKey(solanaSecretKey) {
    let keypair = web3.Keypair.fromSecretKey(base58.decode(solanaSecretKey));
    return keypair.publicKey.toString();
}

function getSolanaPubFromSolanaSecretKey(solanaSecretKey) {
    let keyBuffer = base58.decode(solanaSecretKey);
    let pubKeyBuffer = keyBuffer.slice(32, 64);
    return base58.encode(pubKeyBuffer);
}

function getSolanaAddrFromSolanaPub(solanaPub) {
    let pub = new web3.PublicKey(base58.decode(solanaPub), false)
    return pub.toString();
}

function getEvmPriFromSolanaSecretKey(solanaSecretKey) {
    let keyBuffer = base58.decode(solanaSecretKey);
    let evmPri = keyBuffer.slice(0, 32);
    return evmPri.toString('hex');
}

function getSolanaSecretKeyFromEvmPri(evmPri) {
    let pub = ed25519Keys.getPublicKey(Buffer.from(evmPri, "hex"), false);
    let solanaSecretKey = evmPri + pub.toString('hex');
    return base58.encode(Buffer.from(solanaSecretKey, 'hex'));
}

function getSolanaAddrFromEvmPri(evmPri) {
    let ed25519Pub = ed25519Keys.getPublicKey(Buffer.from(evmPri, "hex"), false);
    let solanaPub = new web3.PublicKey(ed25519Pub);
    return solanaPub.toString();
}

/**============================================================[test]========================================================================*/

function testSolanaSecretKey(solanaSecretKey) {
    console.log('getSolanaAddrFromSolanaSecretKey', getSolanaAddrFromSolanaSecretKey(solanaSecretKey));
    let solanaPub = getSolanaPubFromSolanaSecretKey(solanaSecretKey);
    console.log('getSolanaPubFromSolanaSecretKey', solanaPub);
    console.log('getSolanaAddrFromSolanaPub', getSolanaAddrFromSolanaPub(solanaPub));
    let evmPri = getEvmPriFromSolanaSecretKey(solanaSecretKey);
    console.log('getEvmPriFromSolanaSecretKey', evmPri);
    console.log('getSolanaSecretKeyFromEvmPri', getSolanaSecretKeyFromEvmPri(evmPri));
    console.log('getSolanaAddrFromEvmPri', getSolanaAddrFromEvmPri(evmPri));
}

async function testOfficialMnemonic() {
    let mnemonic = 'kick grunt tray glad various track metal horror jacket dance oak pink';
    let solanaSecretKey = await solanaOfficialMnemonic(mnemonic);
    console.log('solanaOfficialMnemonic', solanaSecretKey);
    testSolanaSecretKey(solanaSecretKey);
}

async function testTrustWalletMnemonic() {
    let mnemonic = 'kick grunt tray glad various track metal horror jacket dance oak pink';
    let solanaSecretKey = await solanaTrustWalletMnemonic(mnemonic);
    console.log('solanaTrustWalletMnemonic', solanaSecretKey);
    testSolanaSecretKey(solanaSecretKey);
}

async function test() {
    await testOfficialMnemonic();
    console.log('-------------------------------------------\n')
    await testTrustWalletMnemonic();
}


test();
testSolanaSecretKey('5jXpLnAhdgxZvodesgLvPNW2j8QNZDtL5S2qzhCU8eLN64tuJpZisLvKWq325kdm5KZHNZJFmzDAAuGab3o7sgaW')

