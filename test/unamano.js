// 引入ethers.js
var ethers = require('ethers');
const {BufferEncoding} = require("buffer");
const {BigNumber} = require("ethers/utils");
const {isHexable} = require("ethers/utils/bytes");

// 0x68656c6c6f174AEdE666339bf92a9bB938bda5A5f62B53CF6A000000000000000000000000000000000000000000000000000000002faf08007472616e736665724173736574000000000000000000000000000000000000000000000000000000000000000a encode data
// ca0c87bfaef2903fc5d94eac96f6afdb7a0f6d6afdabb00fb36315fb8306b65c hash

// encoderTransferAsset(5, 0, 'hello', '0x174AEdE666339bf92a9bB938bda5A5f62B53CF6A', '800000000');
// _encoder(5, 0, "hello", 1, 0, 1, "quitAll");// encoderQuitAll
// _encoder(5, 0, "hello", 1, 0, 1, "giveUpAll");// encoderGiveUpAll
// encoderTransferProjectCandyAsset(1, 0, "1", 0);
// console.log(Buffer.from('0', "utf8").toString("hex"), '00000');
// console.log(Buffer.from('1', "utf8").toString("hex"), '11111');
// console.log(Buffer.from('2', "utf8").toString("hex"), '22222');
console.log(ethers.utils.parseEther('2.3').toString(), '22222');
// encoderSetProjectStatus(5, 0, "hello4", 1, 2);
// strTest();
// 0x3100000000000000000000000000000000000000000000000000000000000000007472616e7366657250726f6a65637443616e647941737365740000000000000000000000000000000000000000000000000000000000000002
// 0x3100000000000000000000000000000000000000000000000000000000000000007472616e7366657250726f6a65637443616e647941737365740000000000000000000000000000000000000000000000000000000000000002
// let ccc = testPrikey();
// console.log(ccc, 'ccc');
// console.log(ethers.utils.toUtf8String('0x405004f905654214d16f097affb67a659be323dd7ba0ee26b9bbaffb35b0b947'), 'ccc');

// let qwe = ethers.utils.arrayify('0x405004f905654214d16f097affb67a659be323dd7ba0ee26b9bbaffb35b0b947');
// console.log(!!(qwe.toHexString), 'ccc');
// console.log(isArrayish(qwe), 'isArrayish');
//
// var HexCharacters = '0123456789abcdef';
// var result = [];
// for (var i = 0; i < qwe.length; i++) {
//     var v = qwe[i];
//     result.push(HexCharacters[(v & 0xf0) >> 4] + HexCharacters[v & 0x0f]);
// }
// var asd = '0x' + result.join('');
// console.log(asd, 'asd');
//
// function isArrayish(value) {
//     if (!value || parseInt(String(value.length)) != value.length || typeof (value) === 'string') {
//         return false;
//     }
//     for (var i = 0; i < value.length; i++) {
//         var v = value[i];
//         if (v < 0 || v >= 256 || parseInt(String(v)) != v) {
//             return false;
//         }
//     }
//     return true;
// }
//
// let hash = '0x405004f905654214d16f097affb67a659be323dd7ba0ee26b9bbaffb35b0b947';
// let hashBytes = Buffer.from(hash, "utf8");
// console.log(hashBytes.toString('hex'), 'hash2utf8tohex');
// testPrikey();
let hash = '0x405004f905654214d16f097affb67a659be323dd7ba0ee26b9bbaffb35b0b947';
let hash1 = '0x307834303530303466393035363534323134643136663039376166666236376136353962653332336464376261306565323662396262616666623335623062393437';
// console.log(ethers.utils.toUtf8String(hash1), 'hash1');
// console.log(ethers.utils.toUtf8String(hash), 'hash');

let data = 'hello';
console.log(ethers.utils.hexlify(ethers.utils.toUtf8Bytes(data)), 'ethers');
console.log('0x' + Buffer.from(data, "utf8").toString("hex"), 'buffer');

function testPrikey() {
    let wallet = new ethers.Wallet(ethers.utils.hexZeroPad(ethers.utils.hexStripZeros('0xa572b95153b10141ff06c64818c93bd0e7b4025125b83f15a89a7189248191ca'), 32));
    let hash = '0x405004f905654214d16f097affb67a659be323dd7ba0ee26b9bbaffb35b0b947';
    let hash1 = '0x307834303530303466393035363534323134643136663039376166666236376136353962653332336464376261306565323662396262616666623335623062393437';
    console.log(wallet.signMessage(ethers.utils.arrayify(hash)), 'hash');
    console.log(wallet.signMessage(ethers.utils.arrayify(hash1)), 'hash1');

    // // let hashBytes2 = Buffer.from(hash, "hex");
    // let signResult2 = wallet.signMessage(ethers.utils.arrayify(hash));
    // console.log(signResult2, 'signResult2');
    // let ddd = wallet.signMessage('hash');
    // console.log(ddd, 'ddd');
    // let data = '0x1232354234';

    // ethers.utils.isHexable(hash)
    // let value = hash;
    // var match = value.match(/^(0x)?[0-9a-fA-F]*$/);
    // console.log(match, 'valid HexString');
    // let dataHex = hash;
    // console.log(ethers.utils.isHexString(dataHex), 'isHexString');
    // if (ethers.utils.isHexString(dataHex)) {
    //     return wallet.signMessage(ethers.utils.arrayify(dataHex));
    // } else {
    //     return wallet.signMessage(dataHex);
    // }

}

function strTest() {
    let str = 'Have an extensive background in information security, blockchain, and system design. They perform in-depth security assessments for decentralised systems. Sigma Prime also maintains the Lighthouse Ethereum consensus client.\n' +
        'As one of the most experienced teams in the space, ConsenSys Diligence is at the cutting edge of offensive cryptography, blockchain technology, and cryptoeconomic incentive analysis.\n' +
        'Has helped secure some of the world’s most targeted organizations and products. They combine high-end security research with a real-world attacker mentality to reduce risk and fortify code.';
    console.log(str, "00000000");
    let str1 = str.replace(new RegExp("(\n|\r|(\r\n)|(\u0085)|(\u2028)|(\u2029))","g"), "xxx");
    console.log(str1, "11111111");
}

/**
 * 退出所有质押 or 紧急退出所有质押
 * @param chainId 当前网络nativeId
 * @param contractVersion 写死 0
 * @param txKey 工单id
 * @param pid 项目在挖矿池中的id
 * @param index 指定退出的质押列表的起始位置
 * @param length 退出的总数
 * @param method quitAll-退出所有质押 giveUpAll-紧急退出所有质押
 * @private
 */
function _encoder(chainId, contractVersion, txKey, pid, index, length, method) {
    let result = '0x' + Buffer.from(txKey, "utf8").toString("hex");
    result += ethers.utils.hexZeroPad(new BigNumber(pid).toHexString(), 32).substring(2);
    result += ethers.utils.hexZeroPad(new BigNumber(index).toHexString(), 32).substring(2);
    result += ethers.utils.hexZeroPad(new BigNumber(length).toHexString(), 32).substring(2);
    result += Buffer.from(method, "utf8").toString("hex");
    result += ethers.utils.hexZeroPad(new BigNumber(chainId * 2 + contractVersion).toHexString(), 32).substring(2);
    console.log(result, 'encode data');
    console.log(ethers.utils.keccak256(result), 'hash');
}

/**
 * 转出项目方所有糖果
 * @param chainId 当前网络nativeId
 * @param contractVersion 写死 0
 * @param txKey 工单id
 * @param pid 项目在挖矿池中的id
 */
async function encoderTransferProjectCandyAsset(chainId, contractVersion, txKey, pid) {
    let result = '0x' + Buffer.from(txKey, "utf8").toString("hex");
    result += ethers.utils.hexZeroPad(new BigNumber(pid).toHexString(), 32).substring(2);
    result += Buffer.from("transferProjectCandyAsset", "utf8").toString("hex");
    result += ethers.utils.hexZeroPad(new BigNumber(chainId * 2 + contractVersion).toHexString(), 32).substring(2);
    console.log(result, 'encode data');
    let hash = ethers.utils.keccak256(result).substring(2);
    console.log(hash, 'hash');
    let wallet = new ethers.Wallet(ethers.utils.hexZeroPad(ethers.utils.hexStripZeros('0x' + 'xxx'), 32));
    let hashBytes = Buffer.from(hash, "hex");
    let signResult = await wallet.signMessage(hashBytes);
    console.log(signResult, 'signResult');
}

/**
 * 暂停项目 or 恢复项目
 * @param chainId 当前网络nativeId
 * @param contractVersion 写死 0
 * @param txKey 工单id
 * @param pid 项目在挖矿池中的id
 * @param status 1-恢复项目 2-暂停项目
 */
function encoderSetProjectStatus(chainId, contractVersion, txKey, pid, status) {
    let result = '0x' + Buffer.from(txKey, "utf8").toString("hex");
    result += ethers.utils.hexZeroPad(new BigNumber(pid).toHexString(), 32).substring(2);
    result += Buffer.from("setProjectStatus", "utf8").toString("hex");
    result += ethers.utils.hexZeroPad(new BigNumber(status).toHexString(), 1).substring(2);
    result += ethers.utils.hexZeroPad(new BigNumber(chainId * 2 + contractVersion).toHexString(), 32).substring(2);
    console.log(result, 'encode data');
    console.log(ethers.utils.keccak256(result), 'hash');
}

function encoderTransferAsset(chainId, contractVersion, txKey, toAddress, amount) {
    let result = ethers.utils.hexlify(ethers.utils.toUtf8Bytes(txKey));
    result += toAddress.substring(2);
    result += ethers.utils.hexZeroPad(new BigNumber(amount).toHexString(), 32).substring(2);
    result += Buffer.from("transferAsset", "utf8").toString("hex");
    result += ethers.utils.hexZeroPad(new BigNumber(chainId * 2 + contractVersion).toHexString(), 32).substring(2);
    console.log(result, 'encode data');
    let hash = ethers.utils.keccak256(result).substring(2);
    console.log(hash, 'hash');
    return hash;
}






