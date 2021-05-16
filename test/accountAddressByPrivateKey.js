// 安装 yarn add ethers

// 引入ethers.js
var ethers = require('ethers');
// let url = "https://ropsten.infura.io/v3/3cf511bbaebe499f98f867238aaaadbb";
// let provider = new ethers.providers.JsonRpcProvider(url);
// 测试网 - ropsten, 主网 - homestead
let provider = ethers.getDefaultProvider('ropsten');

// 0xc11D9943805e56b630A401D4bd9A29550353EFa1 [Account9]
// 00b96a42a2abe7e99225035262f8b456ed86d19e15c7ab281ce81abff9db75116f
// 008a19c84c6755801f90280706033ecc299edf8dea24693142822db795681de5
let priKey = '008a19c84c6755801f90280706033ecc299edf8dea24693142822db795681de5';
console.log(getAddressByPrivateKey(priKey));

/**
 * @param 压缩公钥
 * @returns 以太坊地址
 */
function getAddressByPrivateKey(privateKey) {
    let wallet = new ethers.Wallet(ethers.utils.hexZeroPad(ethers.utils.hexStripZeros('0x' + priKey), 32));
    console.log(wallet.publicKey);
    console.log(ethers.utils.computePublicKey(wallet.publicKey, true));

    return wallet.address;
}



