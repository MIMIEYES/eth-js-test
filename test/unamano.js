// 引入ethers.js
var ethers = require('ethers');
const {BufferEncoding} = require("buffer");
const {BigNumber} = require("ethers/utils");


_encoder(5, 0, "hello", 1, 0, 1, "quitAll");// encoderQuitAll
_encoder(5, 0, "hello", 1, 0, 1, "giveUpAll");// encoderGiveUpAll
encoderTransferProjectCandyAsset(5, 0, "hello", 1);
encoderSetProjectStatus(5, 0, "hello4", 1, 2);

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
function encoderTransferProjectCandyAsset(chainId, contractVersion, txKey, pid) {
    let result = '0x' + Buffer.from(txKey, "utf8").toString("hex");
    result += ethers.utils.hexZeroPad(new BigNumber(pid).toHexString(), 32).substring(2);
    result += Buffer.from("transferProjectCandyAsset", "utf8").toString("hex");
    result += ethers.utils.hexZeroPad(new BigNumber(chainId * 2 + contractVersion).toHexString(), 32).substring(2);
    console.log(result, 'encode data');
    console.log(ethers.utils.keccak256(result), 'hash');
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




