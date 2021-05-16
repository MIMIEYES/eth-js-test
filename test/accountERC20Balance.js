// 安装 yarn add ethers

// 引入ethers.js
var ethers = require('ethers');
// let url = "https://ropsten.infura.io/v3/3cf511bbaebe499f98f867238aaaadbb";
// let provider = new ethers.providers.JsonRpcProvider(url);
let url = "http://18.167.142.95:26659";
let provider = new ethers.providers.JsonRpcProvider(url);
// 测试网 - ropsten, 主网 - homestead
// let provider = ethers.getDefaultProvider('ropsten');
const erc20BalanceAbiFragment = [{"constant":true,"inputs":[{"name":"","type":"address"}],"name":"balanceOf","outputs":[{"name":"","type":"uint256"}],"type":"function"}];

// 0xc11D9943805e56b630A401D4bd9A29550353EFa1 [Account9]
let account = '0xf173805F1e3fE6239223B17F0807596Edc283012';
let tokenDecimals = 6;
// USDX
let erc20Address = "0xb6D685346106B697E6b2BbA09bc343caFC930cA3";
getERC20Balance(erc20Address, tokenDecimals, account);

/**
 * @param erc20Address ERC20合约地址
 * @param tokenDecimals token小数位数
 * @param account 账户
 */
function getERC20Balance(erc20Address, tokenDecimals, account) {
    let contract = new ethers.Contract(erc20Address, erc20BalanceAbiFragment, provider);
    let balancePromise = contract.balanceOf(account);
    balancePromise.then((balance) => {
        console.log(ethers.utils.formatUnits(balance, tokenDecimals));
    });
}

