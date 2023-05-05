const TronWeb = require('TronWeb');

let tronWeb = new TronWeb({
        fullHost: 'https://api.trongrid.io',
        headers: {"TRON-PRO-API-KEY": '76f3c2b5-357a-4e6c-aced-9e1c42179717'},
        privateKey: ''
    });

const privateKey = "???";

const textstring = "We, the managers of the contracts TYmgxoiPetfE2pVWur9xp7evW4AuZCzfBm, are requesting the assistance of Tether to recover the USDt funds currently stuck on these contracts and return them to the address TEZFeWmzL5wjZx3rKP79gXMCtHdyfWbrRk. Signed, 1683259470948.";

let address = tronWeb.address.fromPrivateKey(privateKey);

let hex = Buffer.from(textstring, 'ascii').toString('hex');

tronWeb.trx.sign(hex,privateKey).then((result) => {console.log({address:address,message:textstring,hex:hex,signature:result})});




