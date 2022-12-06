// 安装 yarn add ethers

// 引入ethers.js
var ethers = require('ethers');
let url = "https://bsc-testnet.public.blastapi.io";
let provider = new ethers.providers.JsonRpcProvider(url);
// 测试网 - ropsten, 主网 - homestead
// let provider = ethers.getDefaultProvider('homestead');

let CROSS_OUT_ABI = [
    "function crossOut(string to, uint256 amount, address ERC20) public payable returns (bool)",
    "function crossOutII(string to, uint256 amount, address ERC20, bytes data) public payable returns (bool)",
    "function isMinterERC20(address ERC20) public view returns (bool)"
];
let ONE_CLICK_CROSS_OUT_ABI = [
    "function oneClickCrossChain(uint256 feeAmount, uint256 desChainId, string desToAddress, uint256 tipping, string tippingAddress, bytes extend) public"
];
let ERC20_ABI = [
    "function allowance(address owner, address spender) external view returns (uint256)",
    "function approve(address spender, uint256 amount) external returns (bool)"
];
const GWEI_10 = ethers.utils.parseUnits('10', 9);

// 0xc11D9943805e56b630A401D4bd9A29550353EFa1 [Account9]
let privateKey = '4594348E3482B751AA235B8E580EFEF69DB465B3A291C5662CEDA6459ED12E39';
// let privateKey = 'd8cdccd432fd1bb7711505d97c441672c540ccfcdbba17397619702eeef1d403';
let from = getAddressByPrivateKey(privateKey);
// NERVE接收地址
let toAddress = 'TNVTdTSPRnXkDiagy7enti1KL75NU5AxC9sQA';
// 多签合约
// let multyContract = '0xdcb777E7491f03D69cD10c1FeE335C9D560eb5A2';
let multyContract = '0x7d759a3330cec9b766aa4c889715535eed3c0484';

// test();
function test () {
    let decimals;
    let aaa = ethers.utils.parseUnits('10', 8);
    console.log(aaa, 'aaa');
}

// 充值ETH
// crossOutByETH();
// 充值ERC20
// crossOutByERC20();
// 查询token授权额度
// getERC20Allowance();
// 授权token
// approveERC20();

async function crossOutByETH() {
    // 充值的ETH数量
    let value = '0.1';

    privateKey = ethers.utils.hexZeroPad(ethers.utils.hexStripZeros('0x' + privateKey), 32);
    let wallet = new ethers.Wallet(privateKey, provider);
    let amount = ethers.utils.parseEther(value);
    let iface = new ethers.utils.Interface(CROSS_OUT_ABI);
    let data = iface.functions.crossOut.encode([ toAddress, amount, '0x0000000000000000000000000000000000000000' ]);
    console.log(data);
    let nonce = await getNonce(wallet.address);
    let tx = {nonce: nonce, to: multyContract, value: amount, data: data};
    let _tx = {from: from, to: multyContract, value: amount, data: data};
    let failed = await validate(_tx);
    if (failed) {
        console.log('failed: ' + failed);
        return;
    }
    // let sendPromise = wallet.sendTransaction(tx);
    // sendPromise.then((tx) => {
    //     console.log(tx.hash);
    // });
}

// crossOutByERC20();
async function crossOutByERC20() {
    let erc20Address = "0x02e1aFEeF2a25eAbD0362C4Ba2DC6d20cA638151";//BUSD
    // token小数位数
    let tokenDecimals = 18;
    // 充值的token数量
    let sendAmount = '32.15';

    privateKey = ethers.utils.hexZeroPad(ethers.utils.hexStripZeros('0x' + privateKey), 32);
    let wallet = new ethers.Wallet(privateKey, provider);
    let numberOfSendAmount = ethers.utils.parseUnits(sendAmount, tokenDecimals);

    let iface = new ethers.utils.Interface(CROSS_OUT_ABI);
    let data = iface.functions.crossOut.encode([ toAddress, numberOfSendAmount, erc20Address]);
    let nonce = await getNonce(wallet.address);
    let tx = {nonce: nonce, to: multyContract, value: 0, data: data};
    let _tx = {from: from, to: multyContract, value: 0, data: data};
    let failed = await validate(_tx);
    if (failed) {
        console.log('failed: ' + failed);
        return;
    }
    console.log('success');
    console.log('from: ' + from);
    console.log('data: ' + tx.data);
    console.log('data size: ' + tx.data.length);
    /*let sendPromise = wallet.sendTransaction(tx);
    sendPromise.then((tx) => {
        console.log(tx.hash);
    });*/

}

oneClickCrossOutTest();
async function oneClickCrossOutTest() {
    let multyContract = '0xc9Ad179aDbF72F2DcB157D11043D5511D349a44b';
    let erc20Address = "0x02e1aFEeF2a25eAbD0362C4Ba2DC6d20cA638151";//BUSD
    // token小数位数
    let tokenDecimals = 18;
    // 充值的token数量
    let sendAmount = '32.15';
    // BRG 黑洞地址
    let toAddress = "0xF3c90eF58eC31805af11CE5FA6d39E395c66441f";

    let feeAmount = "0.0001";
    let desChainId = 104;
    let desToAddress = "0xc11D9943805e56b630A401D4bd9A29550353EFa1";
    let tipping = "1.321";
    let tippingAddress = "0xd16634629c638efd8ed90bb096c216e7aec01a91";

    privateKey = ethers.utils.hexZeroPad(ethers.utils.hexStripZeros('0x' + privateKey), 32);
    let wallet = new ethers.Wallet(privateKey, provider);
    let numberOfSendAmount = ethers.utils.parseUnits(sendAmount, tokenDecimals);
    let numberOfFeeAmount = ethers.utils.parseEther(feeAmount);
    let numberOftipping = ethers.utils.parseUnits(tipping, tokenDecimals);

    let ooocFace = new ethers.utils.Interface(ONE_CLICK_CROSS_OUT_ABI);
    let ooocData = ooocFace.functions.oneClickCrossChain.encode(
        [ numberOfFeeAmount, desChainId, desToAddress, numberOftipping, tippingAddress, []]);

    let iface = new ethers.utils.Interface(CROSS_OUT_ABI);
    let data = iface.functions.crossOutII.encode([ toAddress, numberOfSendAmount, erc20Address, ooocData ]);
    let nonce = await getNonce(wallet.address);
    let tx = {nonce: nonce, to: multyContract, value: numberOfFeeAmount, data: data};
    let _tx = {from: from, to: multyContract, value: numberOfFeeAmount, data: data};
    let failed = await validate(_tx);
    if (failed) {
        console.log('failed: ' + failed);
        return;
    }
    console.log('success');
    console.log('from: ' + from);
    console.log('data: ' + tx.data);
    console.log('data size: ' + tx.data.length);
    let sendPromise = wallet.sendTransaction(tx);
    sendPromise.then((tx) => {
        console.log(tx.hash);
    });

}
// approveERC20();
async function approveERC20() {
    // ERC20合约地址 NVT
    let erc20Address = "0xB058887cb5990509a3D0DD2833B2054E4a7E4a55";
    // 被授权的账户
    let spender = multyContract;

    privateKey = ethers.utils.hexZeroPad(ethers.utils.hexStripZeros('0x' + privateKey), 32);
    let wallet = new ethers.Wallet(privateKey, provider);
    let iface = new ethers.utils.Interface(ERC20_ABI);
    let data = iface.functions.approve.encode([ spender,  new ethers.utils.BigNumber('0xffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff')]);
    let nonce = await getNonce(wallet.address);
    let tx = {nonce: nonce, to: erc20Address, data: data};
    let _tx = {from: from, to: erc20Address, data: data};
    let failed = await validate(_tx);
    if (failed) {
        console.log('failed: ' + failed);
        return;
    }
    console.log('success');
    console.log('from: ' + from);
    console.log('data: ' + tx.data);
    console.log('data size: ' + tx.data.length);
    let sendPromise = wallet.sendTransaction(tx);
    sendPromise.then((tx) => {
        console.log(tx.hash);
    });
}
// getERC20Allowance();
function getERC20Allowance() {
    // ERC20合约地址 NVT
    let erc20Address = "0xB058887cb5990509a3D0DD2833B2054E4a7E4a55";
    // token小数位数
    let tokenDecimals = 6;
    // token拥有人
    let owner = from;
    console.log('from: ' + owner);
    // 被授权的账户
    let spender = multyContract;

    let contract = new ethers.Contract(erc20Address, ERC20_ABI, provider);
    let allowancePromise = contract.allowance(owner, spender);
    allowancePromise.then((allowance) => {
        console.log(ethers.utils.formatUnits(allowance, tokenDecimals));
    });
}

// isMinterERC20();
function isMinterERC20() {
    let multyAddress = "0x7d759a3330cec9b766aa4c889715535eed3c0484";
    // ERC20合约地址
    let erc20Address = "0xae7fccff7ec3cf126cd96678adae83a2b303791c";

    let contract = new ethers.Contract(multyAddress, CROSS_OUT_ABI, provider);
    let isMinterPromise = contract.isMinterERC20(erc20Address);
    isMinterPromise.then((isMinter) => {
        console.log(isMinter);
    });
}

function getAddressByPrivateKey(privateKey) {
    let wallet = new ethers.Wallet(ethers.utils.hexZeroPad(ethers.utils.hexStripZeros('0x' + privateKey), 32));
    return wallet.address;
}

async function getNonce(address) {
    return await provider.getTransactionCount(address).then((transactionCount) => {
        return transactionCount;
    });
}

async function validate(tx) {
    return await provider.call(tx).then((result) => {
        console.log('result: ' + result);
        let reason = ethers.utils.toUtf8String('0x' + result.substr(138));
        console.log('reason: ' + reason);
        return reason;
    });
}

