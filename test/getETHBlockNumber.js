// 安装 yarn add ethers

// 引入ethers.js
var ethers = require('ethers');
// 测试网 - ropsten, 主网 - homestead
let provider = ethers.getDefaultProvider('ropsten');
// let testUrl = "https://data-seed-prebsc-1-s1.binance.org:8545/";
// let mainUrl = "https://bsc-dataseed.binance.org/";
// let provider = new ethers.providers.JsonRpcProvider(testUrl);
getEthBlockNumber();

/**
 *  获取最新的区块高度
 */
function getEthBlockNumber() {
    let blockNumberPromise = provider.getBlockNumber();
    blockNumberPromise.then((blockNumber) => {
        console.log(blockNumber);
    });
}