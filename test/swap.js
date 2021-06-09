// 安装 yarn add ethers

// 引入ethers.js
var ethers = require('ethers');
// let url = "https://ropsten.infura.io/v3/3cf511bbaebe499f98f867238aaaadbb";
// let provider = new ethers.providers.JsonRpcProvider(url);
let url = "https://bsc-dataseed.binance.org/";
let provider = new ethers.providers.JsonRpcProvider(url);
const farmAbiFragment = [
    {"inputs":[{"internalType":"uint256","name":"","type":"uint256"},{"internalType":"address","name":"","type":"address"}],"name":"userInfo","outputs":[{"internalType":"uint256","name":"amount","type":"uint256"},{"internalType":"uint256","name":"rewardDebt","type":"uint256"}],"stateMutability":"view","type":"function"}
];
const lpAbiFragment = [
    {"constant":true,"inputs":[],"name":"totalSupply","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},
    {"constant":true,"inputs":[],"name":"getReserves","outputs":[{"internalType":"uint112","name":"_reserve0","type":"uint112"},{"internalType":"uint112","name":"_reserve1","type":"uint112"},{"internalType":"uint32","name":"_blockTimestampLast","type":"uint32"}],"payable":false,"stateMutability":"view","type":"function"}
];

let userAddress = "0x5a78059280E7B4E5494d18B44fbaef5228BA8598";

let farmsContract = "0x73feaa1eE314F8c655E354234017bE2193C9E24E";
let lpContract = "0x853784b7bde87d858555715c0123374242db7943";
let NULS_BUSD_ID = 319;

let myNuls = "32243.08522409";
let myBusd = "29248.560478434499580279";
let nulsPrice = "0.56";

async function getUserLp(farmsContract, NULS_BUSD_ID, userAddress) {
    let contract = new ethers.Contract(farmsContract, farmAbiFragment, provider);
    return await contract.userInfo(NULS_BUSD_ID, userAddress).then((info) => {
        // console.log(info.amount.toString());
        return info.amount.toString();
    });
}

async function getTotalSupplyOfLp(lpContract) {
    let contract = new ethers.Contract(lpContract, lpAbiFragment, provider);
    return await contract.totalSupply().then((totalSupply) => {
        // console.log(totalSupply.toString());
        return totalSupply.toString();
    });
}

async function getReservesOfLp(lpContract) {
    let contract = new ethers.Contract(lpContract, lpAbiFragment, provider);
    return await contract.getReserves().then((reserves) => {
        // console.log(reserves._reserve0.toString());
        // console.log(reserves._reserve1.toString());
        return reserves;
    });
}

calResult();
async function calResult() {
    let myLp = await getUserLp(farmsContract, NULS_BUSD_ID, userAddress);
    // myLp = ethers.utils.formatEther(myLp);
    console.log("当前NULS价格: "+nulsPrice+" USDT/NULS");
    console.log();
    let totalSupply = await getTotalSupplyOfLp(lpContract);
    console.log("LP总流通量: " + ethers.utils.formatEther(totalSupply));
    let yz = new ethers.utils.BigNumber(ethers.utils.parseEther(myLp)).div(new ethers.utils.BigNumber(totalSupply));
    let reserves = await getReservesOfLp(lpContract);
    let _nuls = reserves._reserve0;
    let _busd = reserves._reserve1;

    let usdNumber = _busd.mul(new ethers.utils.BigNumber(ethers.utils.parseUnits('1', 8 + 4)));
    let nulsNumber = _nuls.mul(new ethers.utils.BigNumber(ethers.utils.parseUnits('1', 18)));
    let _price = usdNumber.div(nulsNumber);
    nulsPrice = ethers.utils.formatUnits(_price, 4);
    console.log("流动池计算出的NULS价格: " + nulsPrice+" USDT/NULS");

    console.log("流动池的 NULS: " + ethers.utils.formatUnits(_nuls, 8));
    console.log("流动池的 USD: " + ethers.utils.formatEther(_busd));
    console.log();
    console.log("我提供了 NULS: " + myNuls);
    console.log("我提供了 USD: " + myBusd);
    console.log();
    let nowNuls = _nuls.mul(yz).div(new ethers.utils.BigNumber(ethers.utils.parseUnits('1', 18)));
    let nowBusd = _busd.mul(yz).div(new ethers.utils.BigNumber(ethers.utils.parseUnits('1', 18)));
    console.log("我能换出的 NULS: " + ethers.utils.formatUnits(nowNuls, 8));
    console.log("我能换出的 USD: " + ethers.utils.formatUnits(nowBusd, 18));
    console.log();

    let zero = new ethers.utils.BigNumber('0');
    let dNuls = nowNuls.sub(new ethers.utils.BigNumber(ethers.utils.parseUnits(myNuls, 8)));
    let flagNuls = dNuls.lt(zero) ? '少' : '多';
    let dBusd = nowBusd.sub(new ethers.utils.BigNumber(ethers.utils.parseUnits(myBusd, 18)));
    let flagBusd = dBusd.lt(zero) ? '少' : '多';

    let nuls2usd = dNuls.abs().mul(new ethers.utils.BigNumber(ethers.utils.parseUnits(nulsPrice, 4))).div(new ethers.utils.BigNumber(ethers.utils.parseUnits('1', 4)));
    console.log("NULS "+flagNuls+"了: "+ethers.utils.formatUnits(dNuls, 8)+"，折算成 USD: " + ethers.utils.formatUnits(nuls2usd, 8));
    console.log("BUSD "+flagBusd+"了: " + ethers.utils.formatUnits(dBusd, 18));
    console.log();

    let finalAward = dBusd.add(nuls2usd.mul(new ethers.utils.BigNumber(ethers.utils.parseUnits('1', 10))));
    console.log("金本位实际收益: " + ethers.utils.formatUnits(finalAward, 18));
}



