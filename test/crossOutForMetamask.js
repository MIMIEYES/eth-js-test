// 安装 yarn add ethers

// 引入ethers.js
var ethers = require('ethers');
// let url = "https://ropsten.infura.io/v3/3cf511bbaebe499f98f867238aaaadbb";
// let provider = new ethers.providers.JsonRpcProvider(url);
// 测试网 - ropsten, 主网 - homestead
let provider = ethers.getDefaultProvider('ropsten');

let CROSS_OUT_ABI = [
    "function crossOut(string to, uint256 amount, address ERC20) public payable returns (bool)"
];
let ERC20_ABI = [
    "function allowance(address owner, address spender) external view returns (uint256)",
    "function approve(address spender, uint256 amount) external returns (bool)"
];

const GWEI_10 = ethers.utils.parseUnits('10', 9);

// 0xc11D9943805e56b630A401D4bd9A29550353EFa1 [Account9]
let privateKey = '4594348E3482B751AA235B8E580EFEF69DB465B3A291C5662CEDA6459ED12E39';
let from = getAddressByPrivateKey(privateKey);
// 多签合约
let multyContract = '0xdcb777E7491f03D69cD10c1FeE335C9D560eb5A2';


// 充值ETH
crossOutByETH();
// 充值ERC20
crossOutByERC20();
// 授权token
approveERC20();
// 查询token授权额度
getERC20Allowance();

async function crossOutByETH() {
    // 充值的ETH数量
    let value = '0.1';
    // NERVE接收地址
    let toAddress = 'TNVTdTSPRnXkDiagy7enti1KL75NU5AxC9sQA';

    let amount = ethers.utils.parseEther(value);
    let iface = new ethers.utils.Interface(CROSS_OUT_ABI);
    let data = iface.functions.crossOut.encode([ toAddress, amount, '0x0000000000000000000000000000000000000000' ]);
    let transactionParameters = {
        to: multyContract,
        // from: ethereum.selectedAddress,
        from: from,
        value: amount.toHexString(),
        data: data
    };
    let failed = await validate(transactionParameters);
    if (failed) {
        console.log('failed crossOutByETH');
        console.log(failed);
        return failed;
    }
    console.log('sucess crossOutByETH');
    console.log(transactionParameters);
    return transactionParameters;
}

async function crossOutByERC20() {
    // ERC20合约地址 NVT
    let erc20Address = "0x25EbbAC2CA9DB0c1d6F0fc959BbC74985417BaB0";
    // token小数位数
    let tokenDecimals = 8;
    // 充值的token数量
    let value = '20';
    // NERVE接收地址
    let toAddress = 'TNVTdTSPRnXkDiagy7enti1KL75NU5AxC9sQA';

    let numberOfTokens = ethers.utils.parseUnits(value, tokenDecimals);
    let iface = new ethers.utils.Interface(CROSS_OUT_ABI);
    let data = iface.functions.crossOut.encode([ toAddress, numberOfTokens, erc20Address ]);
    let transactionParameters = {
        to: multyContract,
        // from: ethereum.selectedAddress,
        from: from,
        value: '0x00',
        data: data
    };
    let failed = await validate(transactionParameters);
    if (failed) {
        console.log('failed crossOutByERC20');
        console.log(failed);
        return failed;
    }
    console.log('sucess crossOutByERC20');
    console.log(transactionParameters);
    return transactionParameters;
}

async function approveERC20() {
    // ERC20合约地址 NVT
    let erc20Address = "0x25EbbAC2CA9DB0c1d6F0fc959BbC74985417BaB0";
    // 被授权的账户
    let spender = multyContract;

    let iface = new ethers.utils.Interface(ERC20_ABI);
    let data = iface.functions.approve.encode([ spender, new ethers.utils.BigNumber('0xffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff') ]);
    let transactionParameters = {
        to: erc20Address,
        // from: ethereum.selectedAddress,
        from: from,
        value: '0x00',
        data: data
    };
    let failed = await validate(transactionParameters);
    if (failed) {
        console.log('failed approveERC20');
        console.log(failed);
        return failed;
    }
    console.log('sucess approveERC20');
    console.log(transactionParameters);
    return transactionParameters;
}

function getERC20Allowance() {
    // ERC20合约地址 NVT
    let erc20Address = "0x25EbbAC2CA9DB0c1d6F0fc959BbC74985417BaB0";
    // token小数位数
    let tokenDecimals = 8;
    // token拥有人
    let owner = from;
    // 被授权的账户
    let spender = multyContract;

    let contract = new ethers.Contract(erc20Address, ERC20_ABI, provider);
    let allowancePromise = contract.allowance(owner, spender);
    allowancePromise.then((allowance) => {
        // console.log(ethers.utils.formatUnits(allowance, tokenDecimals));
        console.log(allowance);
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
        let reason = ethers.utils.toUtf8String('0x' + result.substr(138));
        return reason;
    });
}

/*const transactionParameters = {
    nonce: '0x00', // ignored by MetaMask
    gasPrice: '0x09184e72a000', // customizable by user during MetaMask confirmation.
    gas: '0x2710', // customizable by user during MetaMask confirmation.
    to: '0x0000000000000000000000000000000000000000', // Required except during contract publications.
    from: ethereum.selectedAddress, // must match user's active address.
    value: '0x00', // Only required to send ether to the recipient from the initiating external account.
    data:
        '0x7f7465737432000000000000000000000000000000000000000000000000000000600057', // Optional, but used for defining smart contract creation and interaction.
    chainId: 3, // Used to prevent transaction reuse across blockchains. Auto-filled by MetaMask.
};*/
