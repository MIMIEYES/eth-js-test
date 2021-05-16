// 安装 yarn add ethers

// 引入ethers.js
var ethers = require('ethers');
// 测试网 - ropsten, 主网 - homestead
// let provider = ethers.getDefaultProvider('ropsten');
let testUrl = "https://data-seed-prebsc-1-s1.binance.org:8545/";
let mainUrl = "https://bsc-dataseed.binance.org/";
let url = "http://18.167.142.95:26659";
let provider = new ethers.providers.JsonRpcProvider(url);
// let provider = new ethers.providers.JsonRpcProvider(testUrl);
let acount = '0xf173805F1e3fE6239223B17F0807596Edc283012';
getEthBalance(acount);

/**
 * @param account 账户
 */
function getEthBalance(account) {
    let balancePromise = provider.getBalance(account);
    balancePromise.then((balance) => {
        console.log(ethers.utils.formatEther(balance));
    });
}