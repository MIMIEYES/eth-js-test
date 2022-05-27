const TronWeb = require('tronweb');
const ethers = require('ethers');

// const tronWeb = new TronWeb({
//     fullHost: 'https://api.trongrid.io',
//     headers: { "TRON-PRO-API-KEY": '' },
//     privateKey: ''
// });
const tronWeb = new TronWeb({
    fullHost: 'https://api.shasta.trongrid.io',
    privateKey: ''
});
let tx = {
    "visible": false,
    "txID": "8e29b0e4a8731bec30565ceaa1f50b7e07e2d947969f8c93b482df12cb7d66fd",
    "raw_data": {
        "contract": [
            {
                "parameter": {
                    "value": {
                        "data": "38615bb000000000000000000000000000000000000000000000000000000000000000800000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000e00000000000000000000000000000000000000000000000000000000000000025544e56546454535046506f76327842414d52536e6e664577586a4544545641415346456836000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000002461396535646435352d316235372d346239632d386536352d66666532653764646665373400000000000000000000000000000000000000000000000000000000",
                        "owner_address": "41c11d9943805e56b630a401d4bd9a29550353efa1",
                        "contract_address": "41f723e62e48f4e0a5160ebaf69a60d7244e462a05",
                        "call_value": 1000000
                    },
                    "type_url": "type.googleapis.com/protocol.TriggerSmartContract"
                },
                "type": "TriggerSmartContract"
            }
        ],
        "ref_block_bytes": "e4ad",
        "ref_block_hash": "9d75f073a9620d64",
        "expiration": 1653015168000,
        "fee_limit": 150000000,
        "timestamp": 1653015109812
    },
    "raw_data_hex": "0a02e4ad22089d75f073a9620d6440808887fb8d305ab403081f12af030a31747970652e676f6f676c65617069732e636f6d2f70726f746f636f6c2e54726967676572536d617274436f6e747261637412f9020a1541c11d9943805e56b630a401d4bd9a29550353efa1121541f723e62e48f4e0a5160ebaf69a60d7244e462a0518c0843d22c40238615bb000000000000000000000000000000000000000000000000000000000000000800000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000e00000000000000000000000000000000000000000000000000000000000000025544e56546454535046506f76327842414d52536e6e664577586a4544545641415346456836000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000002461396535646435352d316235372d346239632d386536352d6666653265376464666537340000000000000000000000000000000000000000000000000000000070b4c183fb8d30900180a3c347"
};
const TRX_MESSAGE_HEADER = '\x19TRON Signed Message:\n32';
let privateKey = '4594348e3482b751aa235b8e580efef69db465b3a291c5662ceda6459ed12e39';
// 0xef7af408a9b43f21b595245cfcddeb04e1c6cff41399a5e957c7105199cf430c460b5686f9e6243b43a41fa8bbb74c4f86aa950e7dfa127dee37c41202d7f6871b
// 0xef7af408a9b43f21b595245cfcddeb04e1c6cff41399a5e957c7105199cf430c460b5686f9e6243b43a41fa8bbb74c4f86aa950e7dfa127dee37c41202d7f6871b

// 0x812a342321cb186eaa935bcab346f16782f741ddfacc629fc76ab3c341e427ec29a0740a2c75b5a1244bf03f128be9ac8cfb75cb19f21c83a68d9617eb2092311c
// 0x812a342321cb186eaa935bcab346f16782f741ddfacc629fc76ab3c341e427ec29a0740a2c75b5a1244bf03f128be9ac8cfb75cb19f21c83a68d9617eb2092311c
// signTronTest();

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

// ethSignTest();
async function ethSignTest() {
    var signed = await tronWeb.trx.sign(tx, privateKey);
    console.log(JSON.stringify(signed));
    let msgHash = '8451a5d57cceb9c761cee31d2cd2435b2b2759ba25c62d6567e72e3e188b0c64';
    msgHash = msgHash.replace(/^0x/, '');
    privateKey = privateKey.replace(/^0x/, '');
    // let sign = tronWeb.utils.crypto.ECKeySign(tronWeb.utils.code.hexStr2byteArray(msgHash), tronWeb.utils.code.hexStr2byteArray(privateKey));
    let sign = tronWeb.utils.crypto.ECKeySign(Buffer.from(msgHash, 'hex'), Buffer.from(privateKey, 'hex'));
    console.log(sign);
}

let tx1 = {
    "visible": false,
    "txID": "d684cb9f6f41dfc7e290e8de84a14cc6dc333f827a7f61d21da68f4280ff938c",
    "raw_data": {
        "contract": [
            {
                "parameter": {
                    "value": {
                        "data": "38615bb000000000000000000000000000000000000000000000000000000000000000800000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000e00000000000000000000000000000000000000000000000000000000000000025544e56546454535046506f76327842414d52536e6e664577586a4544545641415346456836000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000002466306230623063622d323230362d343230642d623462362d38626136306135316139643900000000000000000000000000000000000000000000000000000000",
                        "owner_address": "41c11d9943805e56b630a401d4bd9a29550353efa1",
                        "contract_address": "41f723e62e48f4e0a5160ebaf69a60d7244e462a05",
                        "call_value": 1000000
                    },
                    "type_url": "type.googleapis.com/protocol.TriggerSmartContract"
                },
                "type": "TriggerSmartContract"
            }
        ],
        "ref_block_bytes": "ef38",
        "ref_block_hash": "772c7da077194ab4",
        "expiration": 1653471637372,
        "fee_limit": 150000000,
        "timestamp": 1653471435993
    },
    "raw_data_hex": "0a02ef382208772c7da077194ab440d886d3d48f305ab403081f12af030a31747970652e676f6f676c65617069732e636f6d2f70726f746f636f6c2e54726967676572536d617274436f6e747261637412f9020a1541c11d9943805e56b630a401d4bd9a29550353efa1121541f723e62e48f4e0a5160ebaf69a60d7244e462a0518c0843d22c40238615bb000000000000000000000000000000000000000000000000000000000000000800000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000e00000000000000000000000000000000000000000000000000000000000000025544e56546454535046506f76327842414d52536e6e664577586a4544545641415346456836000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000002466306230623063622d323230362d343230642d623462362d3862613630613531613964390000000000000000000000000000000000000000000000000000000070d9b9cfd48f30900180a3c347"
}

getSignWeightTest();
async function getSignWeightTest() {
    if (typeof tx1.raw_data.contract[0].Permission_id !== 'number') {
        tx1.raw_data.contract[0].Permission_id = 0;
    }
    console.log(JSON.stringify(tx1));
    // var result = await tronWeb.trx.getSignWeight(tx1);
    // console.log(JSON.stringify(result));
}

// sendTx();
async function sendTx() {
    var result = await tronWeb.trx.getSignWeight(tx1);
    // tx1.txID = result.transaction.txid;
    tx1 = result.transaction.transaction;
    const signedtxn = await tronWeb.trx.sign(tx1, privateKey);
    console.log(JSON.stringify(signedtxn));
    const receipt = await tronWeb.trx.sendRawTransaction(signedtxn);
    console.log(JSON.stringify(receipt));
}

