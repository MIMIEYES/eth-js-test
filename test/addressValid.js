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