// 安装 yarn add ethers

// 引入ethers.js
var ethers = require('ethers');
// let url = "https://ropsten.infura.io/v3/3cf511bbaebe499f98f867238aaaadbb";
let url = "http://18.167.142.95:26659";
let provider = new ethers.providers.JsonRpcProvider(url);
// 测试网 - ropsten, 主网 - homestead
// let provider = ethers.getDefaultProvider('ropsten');

let aaa = ethers.utils.parseEther('0.00000002');
// console.log(ethers.utils.formatEther(aaa.mul('100000').toString()).toString());
/**
 * 获取当前ETH网络的平均gas价格
 */
getGasPrice();
function getGasPrice() {
    provider.getGasPrice().then((gasPrice) => {
        // gasPrice is a BigNumber; convert it to a decimal string
        gasPriceString = gasPrice.toString();
        console.log("Current gas price: " + ethers.utils.formatEther(gasPriceString).toString());
        // ethers.utils.bigNumberify()
        console.log(ethers.utils.formatEther(gasPrice.mul('33594').toString()).toString());
        console.log(ethers.utils.formatEther(gasPrice.mul('100000').toString()).toString());
    });
    //0.00000002
    //0.0000000005
}



/*
    gasprice * gaslimit = gaslimit * nvtusd * nvtnumber * 1e18 / (ethusd * gasLimit)
    gasprice * gaslimit = nvtusd * nvtnumber * 1e18 / ethusd
    eth = nvtusd * nvtnumber * 1e18 / ethusd
    eth * ethusd = nvtnumber * nvtusd * 1e18
    eth * ethusd * 1e8 = nvtnumber * 1e8 * nvtusd * 1e18
    eth * ethusd * 1e8 / (nvtusd * 1e18) = nvtnumber * 1e8
    eth * ethusd / (nvtusd * 1e10) = nvtamount
 */
/**
 * 用于: 提现页面 - 手续费 - 高级选项
 *
 * 根据以太坊金额换算nvt金额
 *
 * @param nvtUSD        nvt的USDT价格
 * @param ethNumber     eth数量
 * @param ethUSD        eth的USDT价格
 */
// calNvtByEth('0.145', '0.00022870707069', '378.8765');
function calNvtByEth(nvtUSD, ethNumber, ethUSD) {
    let ethAmount = ethers.utils.parseEther(ethNumber);
    console.log('ethAmount: ' + ethAmount.toString());
    let nvtUSDBig = ethers.utils.parseUnits(nvtUSD, 6);
    let ethUSDBig = ethers.utils.parseUnits(ethUSD, 6);
    let result = ethAmount.mul(ethUSDBig).div(ethers.utils.parseUnits(nvtUSDBig.toString(), 10));
    console.log('result: ' + result.toString());
    console.log('result format: ' + ethers.utils.formatUnits(result, 8));
    let numberStr = ethers.utils.formatUnits(result, 8).toString();
    let ceil = Math.ceil(numberStr);
    console.log('ceil: ' + ceil);
    let finalResult = ethers.utils.parseUnits(ceil.toString(), 8);
    console.log('finalResult: ' + finalResult);
    return finalResult.toString();
}

/**
 *  用于: 提现页面 - 手续费 - 中
 */
// calNVTOfWithdrawTest();
async function calNVTOfWithdrawTest() {
    // 获取当前以太坊网络的gasPrice
    // let gasPrice = await getGasPrice();
    let gasPrice = '1000000000';
    let result = calNVTOfWithdraw('0.145', gasPrice, '378.8765', true);
}

/**
 *  用于: 提现页面 - 手续费 - 高级选项 - 默认ETH金额
 *  默认ETH金额
 */
// calDefaultETHOfWithdrawTest();
async function calDefaultETHOfWithdrawTest() {
    // 获取当前以太坊网络的gasPrice
    let gasPrice = await getGasPrice();
    let result = calDefaultETHOfWithdraw(gasPrice, true);
}

/**
 *
 * @param nvtUSD    nvt的USDT价格
 * @param gasPrice  当前ETH网络的平均gas价格
 * @param ethUSD    eth的USDT价格
 * @param isToken   是否token资产
 */
function calNVTOfWithdraw(nvtUSD, gasPrice, ethUSD, isToken) {
    let gasLimit;
    if (isToken) {
        gasLimit = new ethers.utils.BigNumber('210000');
    } else {
        gasLimit = new ethers.utils.BigNumber('190000');
    }
    let nvtUSDBig = ethers.utils.parseUnits(nvtUSD, 6);
    let ethUSDBig = ethers.utils.parseUnits(ethUSD, 6);
    let result = ethUSDBig.mul(gasPrice).mul(gasLimit).div(ethers.utils.parseUnits(nvtUSDBig.toString(), 10));
    console.log('result: ' + result.toString());
    let numberStr = ethers.utils.formatUnits(result, 8).toString();
    let ceil = Math.ceil(numberStr);
    console.log('ceil: ' + ceil);
    let finalResult = ethers.utils.parseUnits(ceil.toString(), 8);
    console.log('finalResult: ' + finalResult);
    return finalResult;
}

/**
 * @param gasPrice  当前ETH网络的平均gas价格
 * @param isToken   是否token资产
 */
// calDefaultETHOfWithdraw('1089081289', true);
function calDefaultETHOfWithdraw(gasPrice, isToken) {
    let gasLimit;
    if (isToken) {
        gasLimit = new ethers.utils.BigNumber('210000');
    } else {
        gasLimit = new ethers.utils.BigNumber('190000');
    }
    let result = gasLimit.mul(gasPrice);
    let finalResult = ethers.utils.formatEther(result);
    console.log('finalResult: ' + finalResult);
    return finalResult;
}

// 除以10的n次幂
// ethers.utils.formatUnits(balance, tokenDecimals)
// 乘以10的n次幂
// ethers.utils.parseUnits(value, tokenDecimals)
// new 一个大数字
// new ethers.utils.BigNumber('0xffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff')

// calGasPriceOfWithdraw('0.145', '500000000', '378.8765', true);
function calGasPriceOfWithdraw(nvtUSD, nvtAmount, ethUSD, isToken) {
    let gasLimit;
    if (isToken) {
        gasLimit = new ethers.utils.BigNumber('210000');
    } else {
        gasLimit = new ethers.utils.BigNumber('190000');
    }
    let nvtNumber = ethers.utils.formatUnits(nvtAmount, 8);
    console.log('nvtNumber: ' + nvtNumber.toString());
    let nvtUSDBig = ethers.utils.parseUnits(nvtUSD, 6);
    let ethUSDBig = ethers.utils.parseUnits(ethUSD, 6);
    let result = nvtUSDBig.mul(ethers.utils.parseUnits(nvtNumber, 18)).div(ethUSDBig.mul(gasLimit));
    console.log('result: ' + result.toString());
    console.log('result format: ' + ethers.utils.formatUnits(result, 9));
    return ethers.utils.formatUnits(result, 9);
}

/**
 * 当前ETH网络的平均gas价格
 */
async function getGasPrice() {
    return await provider.getGasPrice().then((gasPrice) => {
        return gasPrice;
    });
}

