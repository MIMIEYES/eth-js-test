// 安装 yarn add ethers

// 引入ethers.js
var ethers = require('ethers');
// let url = "https://ropsten.infura.io/v3/3cf511bbaebe499f98f867238aaaadbb";
// let provider = new ethers.providers.JsonRpcProvider(url);
// 测试网 - ropsten, 主网 - homestead
let provider = ethers.getDefaultProvider('ropsten');
const GWEI_10 = ethers.utils.parseUnits('10', 9);

test();

async function test() {
    let ethFee = await getSpeedUpFee(33594);
    console.log('eth speed up fee is ' + ethFee);
    let erc20Fee = await getSpeedUpFee(100000);
    console.log('erc20 speed up fee is ' + erc20Fee);
}
/**
 * 获取加速的手续费
 *
 * @param privateKey
 * @param toAddress
 * @param value
 */
async function getSpeedUpFee(gasLimit) {
    let gasPrice = await getGasPrice();
    gasPrice = gasPrice.add(GWEI_10);
    return ethers.utils.formatEther(gasPrice.mul(gasLimit).toString()).toString();
}


async function getGasPrice() {
    return await provider.getGasPrice().then((gasPrice) => {
        return gasPrice;
    });
}
/*
1. 通过公钥获取以太坊地址的函数实现要替换
2. 发送eth交易的函数要替换，增加了私钥的兼容适配、获取最新nonce
3. 发送erc20交易的函数要替换，增加了私钥的兼容适配、获取最新nonce
4. 增加了加速发送eth交易、erc20交易的函数
5. 增加了计算加速手续费的函数，eth交易、erc20交易通用，eth传参33594, erc20传参100000
 */



