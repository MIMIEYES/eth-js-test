const TronWeb = require('tronweb');

const tronWeb = new TronWeb({
    fullHost: 'https://api.trongrid.io',
    headers: { "TRON-PRO-API-KEY": '' },
    privateKey: ''
});

function addressToTron(ethAddress) {
    if (!ethAddress) {
        return "EMPTY ADDRESS!"
    }
    return tronWeb.address.fromHex(ethAddress);
}
window.addressToTron = addressToTron;
