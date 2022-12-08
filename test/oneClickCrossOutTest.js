// 安装 yarn add ethers

// 引入ethers.js
var ethers = require('ethers');
const {BigNumber} = require("ethers/utils");

const CROSS_OUT_ABI = [
    "function crossOutII(string to, uint256 amount, address ERC20, bytes data) public payable returns (bool)"
];
const ONE_CLICK_CROSS_OUT_ABI = [
    "function oneClickCrossChain(uint256 feeAmount, uint256 desChainId, string desToAddress, uint256 tipping, string tippingAddress, bytes extend) public",
    "function addFeeCrossChain(string orderNo, bytes extend) public"
];
// BRG 黑洞地址 0xF3c90eF58eC31805af11CE5FA6d39E395c66441f
const BLACK_HOLE = "0x0000000000000000000000000000000000000000";
const ZERO_ADDRESS = "0x0000000000000000000000000000000000000000";


// tokenCrossTest();
async function tokenCrossTest() {
    let url = "https://bsc-testnet.public.blastapi.io";
    let provider = new ethers.providers.JsonRpcProvider(url);
    // 0xc11D9943805e56b630A401D4bd9A29550353EFa1 [Account9]
    let privateKey = '4594348E3482B751AA235B8E580EFEF69DB465B3A291C5662CEDA6459ED12E39';
    let multyContract = '0xc9Ad179aDbF72F2DcB157D11043D5511D349a44b';
    let erc20Address = "0x02e1aFEeF2a25eAbD0362C4Ba2DC6d20cA638151";//BUSD
    // token小数位数
    let tokenDecimals = 18;
    // 跨链的token数量
    let sendAmount = '6.66';

    let feeAmount = "0.000000000002";
    let desChainId = 104;
    let desToAddress = "0xc11D9943805e56b630A401D4bd9A29550353EFa1";
    let tipping = "0.621";
    let tippingAddress = "0xd16634629c638efd8ed90bb096c216e7aec01a91";

    let hash = await oneClickCrossOut(provider, privateKey, multyContract, sendAmount, feeAmount, tipping, tippingAddress,
        desChainId, desToAddress, erc20Address, tokenDecimals);
    console.log(hash, 'hash');
}

// bnbCrossTest();
async function bnbCrossTest() {
    let url = "https://bsc-testnet.public.blastapi.io";
    let provider = new ethers.providers.JsonRpcProvider(url);
    // 0xc11D9943805e56b630A401D4bd9A29550353EFa1 [Account9]
    let privateKey = '4594348E3482B751AA235B8E580EFEF69DB465B3A291C5662CEDA6459ED12E39';
    let multyContract = '0xc9Ad179aDbF72F2DcB157D11043D5511D349a44b';
    // 跨链的资产数量
    let sendAmount = '0.06';
    let feeAmount = "0.0002";
    let desChainId = 104;
    let desToAddress = "0xc11D9943805e56b630A401D4bd9A29550353EFa1";
    let tipping = "0.00521";
    let tippingAddress = "0xd16634629c638efd8ed90bb096c216e7aec01a91";

    let hash = await oneClickCrossOut(provider, privateKey, multyContract, sendAmount, feeAmount, tipping, tippingAddress,
        desChainId, desToAddress);
    console.log(hash, 'hash');
}

addFeeTest();
async function addFeeTest() {// 注意: 追加手续费在交易发起链
    let url = "https://exchaintestrpc.okex.org";
    let multyContract = '0xf85f03C3fAAC61ACF7B187513aeF10041029A1b2';
    // let url = "https://bsc-testnet.public.blastapi.io";
    // let multyContract = '0xc9Ad179aDbF72F2DcB157D11043D5511D349a44b';
    let provider = new ethers.providers.JsonRpcProvider(url);
    // 0xc11D9943805e56b630A401D4bd9A29550353EFa1 [Account9]
    let privateKey = '4594348E3482B751AA235B8E580EFEF69DB465B3A291C5662CEDA6459ED12E39';
    // 追加的手续费数量
    let feeAmount = '0.04';
    let orderNo = '5d187e9afdb54ed2998adf3f640c378b1803c1396baf498ebb07f08c03a37320';
    let hash = await addFeeCrossChain(provider, privateKey, multyContract, feeAmount, orderNo);
    console.log(hash, 'hash');
}


/**
 * @param provider 网络provider
 * @param privateKey 用户私钥
 * @param multyContract 发起链多签合约
 * @param crossAmount 跨链金额
 * @param feeAmount 手续费金额（发起链主资产）
 * @param tippingAmount 佣金（不超过跨链金额的10%）
 * @param tippingAddress 佣金接收地址
 * @param desChainId 目标链chainId
 * @param desToAddress 目标链接收地址
 * @param erc20 token地址（若有）
 * @param erc20Decimals token精度（若有token地址）
 * @returns 交易hash
 */
async function oneClickCrossOut(
                provider,
                privateKey,
                multyContract,
                crossAmount,
                feeAmount,
                tippingAmount,
                tippingAddress,
                desChainId,
                desToAddress,
                erc20,
                erc20Decimals
                ) {
    let isToken = false;
    if (erc20) isToken = true;
    if (!tippingAmount) tippingAmount = 0;
    if (!tippingAddress) tippingAddress = '';

    privateKey = ethers.utils.hexZeroPad(ethers.utils.hexStripZeros('0x' + privateKey), 32);
    let wallet = new ethers.Wallet(privateKey, provider);
    let from = wallet.address;
    let numberOfFeeAmount = ethers.utils.parseEther(feeAmount);
    let numberOfCrossAmount;
    let numberOfTippingAmount;
    let etherTransfer = new BigNumber(0);
    let tokenTransfer = new BigNumber(0);
    if (isToken) {
        numberOfCrossAmount = ethers.utils.parseUnits(crossAmount, erc20Decimals);
        numberOfTippingAmount = ethers.utils.parseUnits(tippingAmount, erc20Decimals);
        tokenTransfer = tokenTransfer.add(numberOfCrossAmount).add(numberOfTippingAmount);
        etherTransfer = etherTransfer.add(numberOfFeeAmount);
    } else {
        numberOfCrossAmount = ethers.utils.parseEther(crossAmount);
        numberOfTippingAmount = ethers.utils.parseEther(tippingAmount);
        etherTransfer = etherTransfer.add(numberOfCrossAmount).add(numberOfFeeAmount).add(numberOfTippingAmount);
    }

    let ooocFace = new ethers.utils.Interface(ONE_CLICK_CROSS_OUT_ABI);
    let ooocData = ooocFace.functions.oneClickCrossChain.encode(
        [ numberOfFeeAmount, desChainId, desToAddress, numberOfTippingAmount, tippingAddress, []]);

    let iface = new ethers.utils.Interface(CROSS_OUT_ABI);
    let data;
    if (isToken) {
        data = iface.functions.crossOutII.encode([ BLACK_HOLE, tokenTransfer, erc20, ooocData ]);
    } else {
        data = iface.functions.crossOutII.encode([ BLACK_HOLE, 0, ZERO_ADDRESS, ooocData ]);
    }
    let nonce = await getNonce(provider, from);
    let tx = {nonce: nonce, to: multyContract, value: etherTransfer, data: data};
    let _tx = {from: from, to: multyContract, value: etherTransfer, data: data};
    let failed = await validate(provider, _tx);
    if (failed) {
        console.log('failed: ' + failed);
        return;
    }
    let txResponse = await wallet.sendTransaction(tx);
    return txResponse.hash;
}

/**
 * @param provider 网络provider
 * @param privateKey 用户私钥
 * @param multyContract 发起链多签合约
 * @param feeAmount 手续费金额（发起链主资产）
 * @param orderNo BRG网络orderNo
 * @returns 交易hash
 */
async function addFeeCrossChain(
                provider,
                privateKey,
                multyContract,
                feeAmount,
                orderNo) {
    privateKey = ethers.utils.hexZeroPad(ethers.utils.hexStripZeros('0x' + privateKey), 32);
    let wallet = new ethers.Wallet(privateKey, provider);
    let from = wallet.address;
    let numberOfFeeAmount = ethers.utils.parseEther(feeAmount);
    let etherTransfer = new BigNumber(0);
    etherTransfer = etherTransfer.add(numberOfFeeAmount);

    let ooocFace = new ethers.utils.Interface(ONE_CLICK_CROSS_OUT_ABI);
    let ooocData = ooocFace.functions.addFeeCrossChain.encode([ orderNo, []]);

    let iface = new ethers.utils.Interface(CROSS_OUT_ABI);
    let data = iface.functions.crossOutII.encode([ BLACK_HOLE, 0, ZERO_ADDRESS, ooocData ]);
    let nonce = await getNonce(provider, from);
    let tx = {nonce: nonce, to: multyContract, value: etherTransfer, data: data};
    let _tx = {from: from, to: multyContract, value: etherTransfer, data: data};
    let failed = await validate(provider, _tx);
    if (failed) {
        console.log('failed: ' + failed);
        return;
    }
    let txResponse = await wallet.sendTransaction(tx);
    return txResponse.hash;
}

async function getNonce(provider, address) {
    return await provider.getTransactionCount(address).then((transactionCount) => {
        return transactionCount;
    });
}

async function validate(provider, tx) {
    return await provider.call(tx).then((result) => {
        console.log('result: ' + result);
        let reason = ethers.utils.toUtf8String('0x' + result.substr(138));
        console.log('reason: ' + reason);
        return reason;
    });
}

