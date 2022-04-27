// 安装 yarn add ethers

// 引入ethers.js
var ethers = require('ethers');
// let url = "https://ropsten.infura.io/v3/3cf511bbaebe499f98f867238aaaadbb";
// let provider = new ethers.providers.JsonRpcProvider(url);
// 测试网 - ropsten, 主网 - homestead
let provider = ethers.getDefaultProvider('ropsten');

// 0xc11D9943805e56b630A401D4bd9A29550353EFa1 [Account9]
let publicKey = '0369b20002bc58c74cb6fd5ef564f603834393f53bed20c3314b4b7aba8286a7e0';
console.log(getUncompressedPublickey(publicKey));

/**
 * @param 压缩公钥
 * @returns 以太坊地址
 */
function getAddress(publicKey) {
    return ethers.utils.computeAddress(ethers.utils.hexZeroPad(ethers.utils.hexStripZeros('0x' + publicKey), 33));
}

function getUncompressedPublickey(publicKey) {
    return ethers.utils.computePublicKey(ethers.utils.hexZeroPad(ethers.utils.hexStripZeros('0x' + publicKey), 33), false);
}



