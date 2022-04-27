const TronWeb = require('tronweb');
const ethers = require('ethers');

const tronWeb = new TronWeb({
    fullHost: 'https://api.trongrid.io',
    headers: { "TRON-PRO-API-KEY": '' },
    privateKey: ''
});
const TRX_MESSAGE_HEADER = '\x19TRON Signed Message:\n32';
let privateKey = '4594348e3482b751aa235b8e580efef69db465b3a291c5662ceda6459ed12e39';

signTest();

async function signTest() {
    var message = "hello world";
    var messageHex = tronWeb.toHex(message);
    var signedStr = await tronWeb.trx.sign(messageHex, privateKey);
    console.log(signedStr, 'signedStr');
    var pub = reconverPubkey(message, signedStr);
    console.log(pub, 'pub');
}

function reconverPublickeyForTron(message, signature) {
    var messageHex = tronWeb.toHex(message);
    const messageBytes = [
        ...ethers.utils.toUtf8Bytes(TRX_MESSAGE_HEADER),
        ...ethers.utils.arrayify(messageHex)
    ];
    const msgHash = ethers.utils.keccak256(messageBytes);
    const msgHashBytes = ethers.utils.arrayify(msgHash);
    const recoveredPubKey = ethers.utils.recoverPublicKey(
        msgHashBytes,
        signature
    );
    if (recoveredPubKey.startsWith('0x04')) {
        const compressPub = ethers.utils.computePublicKey(recoveredPubKey, true);
        let pub = compressPub.slice(2);
        return pub;
    } else {
        throw 'Sign error';
    }
}
