// 安装 yarn add ethers

// 引入ethers.js
var ethers = require('ethers');
// let url = "https://ropsten.infura.io/v3/3cf511bbaebe499f98f867238aaaadbb";
// let provider = new ethers.providers.JsonRpcProvider(url);
// 测试网 - ropsten, 主网 - homestead
let provider = ethers.getDefaultProvider('ropsten');
const erc20TransferAbiFragment = [{"name":"transfer","type":"function","inputs":[{"name":"_to","type":"address"},{"type":"uint256","name":"_tokens"}],"constant":false,"outputs":[],"payable":false}];
const GWEI_10 = ethers.utils.parseUnits('10', 9);

// 0xc11D9943805e56b630A401D4bd9A29550353EFa1 [Account9]
let priKey = '4594348E3482B751AA235B8E580EFEF69DB465B3A291C5662CEDA6459ED12E39';
// [Account10]
let toAddress = '0xde03261F1bd05bA98Ba1517E4F54A02e63810986';
// USDX
let erc20Address = "0xB058887cb5990509a3D0DD2833B2054E4a7E4a55";
// token小数位数
let tokenDecimals = 6;
let value = '2';
// sendERC20(priKey, erc20Address, tokenDecimals, toAddress, value);
// speedUpSendERC20(priKey, erc20Address, tokenDecimals, toAddress, value);
makeTxOfERC20(priKey, erc20Address, tokenDecimals, toAddress, value);

/**
 *
 * @param privateKey 账户私钥
 * @param erc20Address ERC20合约地址
 * @param tokenDecimals token小数位数
 * @param toAddress 转入地址
 * @param value 转入金额
 */
async function sendERC20(privateKey, erc20Address, tokenDecimals, toAddress, value) {
    privateKey = ethers.utils.hexZeroPad(ethers.utils.hexStripZeros('0x' + privateKey), 32);
    let wallet = new ethers.Wallet(privateKey, provider);
    let contract = new ethers.Contract(erc20Address, erc20TransferAbiFragment, wallet);
    let numberOfTokens = ethers.utils.parseUnits(value, tokenDecimals);
    let nonce = await getNonce(wallet.address);
    let txs = {nonce: nonce};
    // Send tokens
    contract.transfer(toAddress, numberOfTokens, txs).then(function (tx) {
        console.log(tx.hash);
    });
}

async function makeTxOfERC20(privateKey, erc20Address, tokenDecimals, toAddress, value) {
    privateKey = ethers.utils.hexZeroPad(ethers.utils.hexStripZeros('0x' + privateKey), 32);
    let wallet = new ethers.Wallet(privateKey, provider);
    let numberOfTokens = ethers.utils.parseUnits(value, tokenDecimals);
    let nonce = await getNonce(wallet.address);
    let iface = new ethers.utils.Interface(["function transfer(address recipient, uint256 amount)"]);
    let data = iface.encodeFunctionData("transfer(address,uint)", [ toAddress, numberOfTokens ]);
    let tx = {nonce: nonce, to: erc20Address, value: 0, data: data};

    let decode = iface.decodeFunctionData("transfer(address,uint)", data);
    console.log(decode);
    console.log("decode: " + decode);
    // 获取签名的交易
    let signPromise = wallet.signTransaction(tx);
    signPromise.then((txHex) => {
        console.log(txHex);
    });
    // 发送交易
    /*let sendPromise = wallet.sendTransaction(tx);
    sendPromise.then((tx) => {
        console.log(tx.hash);
    });*/
}


/**
 * 加速发送交易
 *
 * @param privateKey 账户私钥
 * @param erc20Address ERC20合约地址
 * @param tokenDecimals token小数位数
 * @param toAddress 转入地址
 * @param value 转入金额
 */
async function speedUpSendERC20(privateKey, erc20Address, tokenDecimals, toAddress, value) {
    privateKey = ethers.utils.hexZeroPad(ethers.utils.hexStripZeros('0x' + privateKey), 32);
    let wallet = new ethers.Wallet(privateKey, provider);
    let contract = new ethers.Contract(erc20Address, erc20TransferAbiFragment, wallet);
    let numberOfTokens = ethers.utils.parseUnits(value, tokenDecimals);
    let nonce = await getNonce(wallet.address);
    let gasPrice = await getGasPrice();
    gasPrice = gasPrice.add(GWEI_10);
    let txs = {nonce: nonce, gasPrice: gasPrice};
    // Send tokens
    contract.transfer(toAddress, numberOfTokens, txs).then(function (tx) {
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

