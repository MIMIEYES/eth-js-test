// 安装 yarn add ethers

// 引入ethers.js
var ethers = require('ethers');
// let url = "https://ropsten.infura.io/v3/3cf511bbaebe499f98f867238aaaadbb";
// let provider = new ethers.providers.JsonRpcProvider(url);
// 测试网 - ropsten, 主网 - homestead
let provider = ethers.getDefaultProvider('ropsten');
const GWEI_10 = ethers.utils.parseUnits('10', 9);

// 0xc11D9943805e56b630A401D4bd9A29550353EFa1 [Account9]
let priKey = '4594348E3482B751AA235B8E580EFEF69DB465B3A291C5662CEDA6459ED12E39';
let from = '0xc11D9943805e56b630A401D4bd9A29550353EFa1';
// [Account10]
let toAddress = '0xde03261F1bd05bA98Ba1517E4F54A02e63810986';
// 以太坊金额
let value = '0.01';

console.log(ethers.utils.parseEther('0.02'));

// sendETH(priKey, toAddress, value);
// speedUpSendETH(priKey, toAddress, value);

/**
 *
 * @param privateKey 账户私钥
 * @param toAddress 转入地址
 * @param value 转入金额
 */
async function sendETH(privateKey, toAddress, value) {
    privateKey = ethers.utils.hexZeroPad(ethers.utils.hexStripZeros('0x' + privateKey), 32);
    let wallet = new ethers.Wallet(privateKey, provider);
    let amount = ethers.utils.parseEther(value);
    let nonce = await getNonce(wallet.address);
    let tx = {
        from: from,
        nonce: nonce,
        to: toAddress,
        value: amount,
        data: null
    };
    let failed = await validate(tx);
    if (failed) {
        console.log('failed sendETH');
        console.log(failed);
        return failed;
    }
    let sendPromise = wallet.sendTransaction(tx);
    sendPromise.then((tx) => {
        console.log(tx.hash);
    });
}

async function validate(tx) {
    return await provider.call(tx).then((result) => {
        let reason = ethers.utils.toUtf8String('0x' + result.substr(138));
        return reason;
    });
}

/**
 * 加速发送交易
 *
 * @param privateKey
 * @param toAddress
 * @param value
 */
async function speedUpSendETH(privateKey, toAddress, value) {
    privateKey = ethers.utils.hexZeroPad(ethers.utils.hexStripZeros('0x' + privateKey), 32);
    let wallet = new ethers.Wallet(privateKey, provider);
    let amount = ethers.utils.parseEther(value);
    let nonce = await getNonce(wallet.address);
    let gasPrice = await getGasPrice();
    gasPrice = gasPrice.add(GWEI_10);
    let tx = {nonce: nonce, to: toAddress, value: amount, gasPrice: gasPrice};
    let sendPromise = wallet.sendTransaction(tx);
    sendPromise.then((tx) => {
        console.log(tx.hash);
    });
}

async function getNonce(address) {
    return await provider.getTransactionCount(address).then((transactionCount) => {
        return transactionCount;
    });
}

async function getGasPrice() {
    return await provider.getGasPrice().then((gasPrice) => {
        return gasPrice;
    });
}

function getAddressByPrivateKey(privateKey) {
    let wallet = new ethers.Wallet(ethers.utils.hexZeroPad(ethers.utils.hexStripZeros('0x' + privateKey), 32));
    return wallet.address;
}



