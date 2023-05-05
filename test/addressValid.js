// 安装 yarn add ethers

// 引入ethers.js
var ethers = require('ethers');

let correctAccount = '0xfaF436543661419DE222536e518833ce5a1Ed4Dc';
let incorrectAccount = '0x8E5FG8859D2BD4CAaE529587051703a774Ee751';
console.log(valid(correctAccount));
// console.log(valid(incorrectAccount));
// console.log(valid(null));
// crossOut(string,uint256,address)
// console.log(ethers.utils.keccak256(ethers.utils.solidityPack('crossOut(string,uint256,address)')));

/**
 * @param account 账户
 */
function valid(account) {
    try {
        ethers.utils.getAddress(account);
        return true;
    } catch (error) { }
    return false;
}
console.log(ethers.utils.hexZeroPad('0x123', 24));
console.log(new ethers.utils.BigNumber(5).toHexString());
console.log(ethers.utils.hexStripZeros(new ethers.utils.BigNumber(5).toHexString()));
console.log(ethers.utils.hexStripZeros(new ethers.utils.BigNumber('0x77').toHexString()));
console.log(new ethers.utils.BigNumber('0x77').toString() == 119);
//0x3078646437636265646465373331653738653862386534623263323132626334326661376330396430335f30
// 000000000000000000000000dd7cbedde731e78e8b8e4b2c212bc42fa7c09d03
// 01
// 00000000000000000000000000000000000000000000000000000000000000f1
let txKey = '0xdd7cbedde731e78e8b8e4b2c212bc42fa7c09d03_0';
let address = '0xdd7cbedde731e78e8b8e4b2c212bc42fa7c09d03';
let version = 2234234;
console.log(padTest(address, version));
function padTest(address, version) {
    version = version + '';
    return address.substring(2) + version.padStart(24, '0');
    // dd7cbedde731e78e8b8e4b2c212bc42fa7c09d03000000000000000000000000
    // dd7cbedde731e78e8b8e4b2c212bc42fa7c09d03000000000000000002234234
}
let adds = ['0xdd7cbedde731e78e8b8e4b2c212bc42fa7c09d03'];
console.log(ethers.utils.hexlify(ethers.utils.toUtf8Bytes(txKey)))
let removes;
encoderAdminUpdate(119, 3, txKey, adds, removes);
async function encoderAdminUpdate(nativeChainId, contractVersion, txKey, adds, removes) {
    let result = ethers.utils.hexlify(ethers.utils.toUtf8Bytes(txKey));
    if (adds) {
        for (var i=0;i<adds.length;i++){
            result += ethers.utils.hexZeroPad(adds[i], 32).substring(2)
        }
    }
    result += ethers.utils.hexZeroPad(new ethers.utils.BigNumber('1').toHexString(), 1).substring(2);
    if (removes) {
        for (var i=0;i<removes.length;i++){
            result += ethers.utils.hexZeroPad(removes[i], 32).substring(2)
        }
    }
    result += ethers.utils.hexZeroPad(new ethers.utils.BigNumber(nativeChainId * 2 + contractVersion).toHexString(), 32).substring(2);
    console.log(result, 'encode data');
    let hash = ethers.utils.keccak256(result);
    console.log(hash, 'hash');

    // const walletType = 'ethereum';
    // const provider = new ethers.providers.Web3Provider(window[walletType]);
    // const jsonRpcSigner = provider.getSigner();
    // let signBytes = ethers.utils.arrayify(hash);
    // const signature = await jsonRpcSigner.signMessage(signBytes);
    // console.log(signature, 'signature');
    // return signature;
}
