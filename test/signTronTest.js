const TronWeb = require('tronweb');
const ethers = require('ethers');

const tronWeb = new TronWeb({
    fullHost: 'https://api.trongrid.io',
    headers: { "TRON-PRO-API-KEY": '' },
    privateKey: ''
});
const TRX_MESSAGE_HEADER = '\x19TRON Signed Message:\n32';
let privateKey = '4594348e3482b751aa235b8e580efef69db465b3a291c5662ceda6459ed12e39';
// 0xef7af408a9b43f21b595245cfcddeb04e1c6cff41399a5e957c7105199cf430c460b5686f9e6243b43a41fa8bbb74c4f86aa950e7dfa127dee37c41202d7f6871b
// 0xef7af408a9b43f21b595245cfcddeb04e1c6cff41399a5e957c7105199cf430c460b5686f9e6243b43a41fa8bbb74c4f86aa950e7dfa127dee37c41202d7f6871b

// 0x812a342321cb186eaa935bcab346f16782f741ddfacc629fc76ab3c341e427ec29a0740a2c75b5a1244bf03f128be9ac8cfb75cb19f21c83a68d9617eb2092311c
// 0x812a342321cb186eaa935bcab346f16782f741ddfacc629fc76ab3c341e427ec29a0740a2c75b5a1244bf03f128be9ac8cfb75cb19f21c83a68d9617eb2092311c
signTronTest();

async function signTronTest() {
    // var message = "hello world";
    var message = "0xd8d66d0d6831cc428e19b48b80ef7b540f58e16974d9322e754fec7d51904369";
    var messageHex = tronWeb.toHex(message);
    console.log(messageHex);
    var signedStr = await tronWeb.trx.sign(messageHex, privateKey);
    console.log(signedStr, 'signedStr');
    var pub = reconverPublickeyForTron(message, signedStr);
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
