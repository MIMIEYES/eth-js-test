const TronWeb = require('TronWeb');
const {BigNumber} = require("ethers/utils");
// const ethers = require('ethers');

let tronWeb;
let multiCallAddress;
testnet();
const ERC20NameTypes = ['string'];
const ERC20SymbolTypes = ['string'];
const ERC20DecimalsTypes = ['uint8'];
const ERC20BalanceOfTypes = ['uint256'];

// console.log(tronWeb.address.toHex('TXCWs4vtLW2wYFHfi7xWeiC9Kuj2jxpKqJ'));

function testnet() {
    tronWeb = new TronWeb({
        fullHost: 'https://api.shasta.trongrid.io',
        headers: {"TRON-PRO-API-KEY": ''},
        privateKey: ''
    });
    multiCallAddress = 'TCmNMtJQiPpSKiGuXUj4vcJAGKqJstmsBD';
}

function mainnet() {
    tronWeb = new TronWeb({
        fullHost: 'https://api.trongrid.io',
        headers: {"TRON-PRO-API-KEY": '76f3c2b5-357a-4e6c-aced-9e1c42179717'},
        privateKey: ''
    });
    multiCallAddress = 'TCNYd8L5hBey9FwPpvgtvDaY2cHjMFVLZu';
}

function addressToTron(ethAddress) {
    if (!ethAddress) {
        return "EMPTY ADDRESS!"
    }
    return tronWeb.address.fromHex(ethAddress);
}

function addressToHex(tronAddress) {
    if (!tronAddress) {
        return "EMPTY ADDRESS!"
    }
    return tronWeb.address.toHex(tronAddress);
}

// testStr();
function testStr() {
    let str = 'crossOutII()';
    str = str.trim();
    str = str.substring(str.indexOf('(') + 1, str.length - 1);
    console.log(str, 'strstr');
    let arr = str.split(',');
    console.log(arr.length, 'split');
    if (!arr[0]) {
        console.log('empty str');
    }
    console.log(typeof (arr[0]), 'split1');
}

/*estimateEnergyUsed(
    'TTaJsdnYPsBjLLM1u2qMw1e9fLLoVKnNUX',
    'TYVxuksybZdbyQwoR25V2YUgXYAHikcLro',
    'crossOutII(string,uint256,address,bytes)',
    0,
    ['TNVTdTSPRnXkDiagy7enti1KL75NU5AxC9sQA', 1000, 'TXCWs4vtLW2wYFHfi7xWeiC9Kuj2jxpKqJ', '0x']
);*/

/*estimateEnergyUsed(
    'TTaJsdnYPsBjLLM1u2qMw1e9fLLoVKnNUX',
    'TXCWs4vtLW2wYFHfi7xWeiC9Kuj2jxpKqJ',
    'transfer(address,uint256)',
    0,
    ['TV3nb5HYFe2xBEmyb3ETe93UGkjAhWyzrs', 100]
);*/

async function triggerConstantContract(sender, contractAddress, functionDes, value, args) {
    if (!sender) {
        sender = 'T9yD14Nj9j7xAB4dbGeiX9h8unkKHxuWwb';
    }
    let senderHex = addressToHex(sender);
    let contractAddressCall = addressToHex(contractAddress);
    functionDes = functionDes.trim();
    let types = functionDes.substring(functionDes.indexOf('(') + 1, functionDes.length - 1).split(',');
    let params = [];
    for (let i = 0, length = types.length; i < length; i++) {
        let _type = types[i].trim();
        if (!_type) {
            continue;
        }
        params.push({type: _type, value: args[i]});
    }
    const transaction = await tronWeb.transactionBuilder.triggerConstantContract(
        contractAddressCall,
        functionDes,
        {callValue: value},
        params,
        senderHex);
    // console.log(transaction);
    return transaction;
}

async function estimateEnergyUsed(sender, contractAddress, functionDes, value, args) {
    let tx = await triggerConstantContract(sender, contractAddress, functionDes, value, args);
    if (!tx) {
        return 0;
    }
    return tx.energy_used;
}

async function getTokenInfo(contractAddress) {
    let name = await getERC20Name(contractAddress);
    let symbol = await getERC20Symbol(contractAddress);
    let decimals = await getERC20Decimals(contractAddress);
    let result = {
        name: name,
        symbol: symbol,
        decimals: decimals
    };
    return result;
}

async function contractCall(contractAddress, functionDes, args, returnTypes) {
    let tx = await triggerConstantContract(null, contractAddress, functionDes, 0, args);
    let constantResult = tx.constant_result;
    if (!constantResult) {
        return;
    }
    let output = '0x' + constantResult[0];
    console.log(output, 'output');
    const result = tronWeb.utils.abi.decodeParams(returnTypes, output);
    return result;
}

async function contractCallByABI(contractAddress, functionDes, args, funABI) {
    let tx = await triggerConstantContract(null, contractAddress, functionDes, 0, args);
    let constantResult = tx.constant_result;
    if (!constantResult) {
        return;
    }
    let output = '0x' + constantResult[0];
    // console.log(output, 'output');
    const result = tronWeb.utils.abi.decodeParamsV2ByABI(funABI, output);
    return result;
}

async function getERC20Name(contractAddress) {
    let result = await contractCall(contractAddress, 'name()', [], ERC20NameTypes);
    if (!result || result.length == 0) {
        return;
    }
    return result[0];
}

async function getERC20Symbol(contractAddress) {
    let result = await contractCall(contractAddress, 'symbol()', [], ERC20SymbolTypes);
    if (!result || result.length == 0) {
        return;
    }
    return result[0];
}

async function getERC20Decimals(contractAddress) {
    let result = await contractCall(contractAddress, 'decimals()', [], ERC20DecimalsTypes);
    if (!result || result.length == 0) {
        return;
    }
    return result[0];
}

async function sendTrx(privateKey, to, value) {
    const tradeobj = await tronWeb.transactionBuilder.sendTrx(to, value, tronWeb.address.fromPrivateKey(privateKey), 1);
    const signedtxn = await tronWeb.trx.sign(tradeobj, privateKey);
    const receipt = await tronWeb.trx.sendRawTransaction(signedtxn);
    return receipt;
}


async function sendERC20Token(privateKey, to, value, contractAddress, feeLimit) {
    if (!feeLimit) {
        feeLimit = 100000000;
    }
    var parameter = [{type: 'address', value: to}, {type: 'uint256', value: value}];
    var options = {
        feeLimit: feeLimit
    };
    var from = tronWeb.address.fromPrivateKey(privateKey);
    const transaction = await tronWeb.transactionBuilder.triggerSmartContract(addressToHex(contractAddress), "transfer(address,uint256)", options,
        parameter, addressToHex(from));
    let tradeobj = transaction.transaction;
    const signedtxn = await tronWeb.trx.sign(tradeobj, privateKey);
    const receipt = await tronWeb.trx.sendRawTransaction(signedtxn);
    return receipt;
}

async function getBalance(address) {
    let balance = await tronWeb.trx.getBalance(address);
    return balance;
}

async function getERC20Balance(address, contractAddress) {
    let result = await contractCall(contractAddress, 'balanceOf(address)', [address], ERC20BalanceOfTypes);
    if (!result || result.length == 0) {
        return;
    }
    let balance = result[0];
    return balance.toString();
}

async function getGasLimitWithNetwork_sendTrx(from, to, value) {
    return 2000000;
}

async function getGasLimit_sendERC20(from, to, value, contractAddress) {
    let energyUsed = await estimateEnergyUsed(from, contractAddress, 'transfer(address,uint256)', 0, [to, value]);
    if (!energyUsed || energyUsed == 0) {
        return 0;
    }
    return energyUsed * 280;
}

async function multiCallOfBalances(multiCallAddress, user, tokens) {
    let result = await contractCallByABI(multiCallAddress, 'getBalance(address,address[])', [user, tokens], {
        "outputs": [{
            "name": "info",
            "type": "uint256[]"
        }],
        "constant": true,
        "inputs": [{"name": "_user", "type": "address"}, {"name": "_tokens", "type": "address[]"}],
        "name": "getBalance",
        "stateMutability": "view",
        "type": "function"
    });
    if (!result || result.length == 0) {
        return;
    }
    let arr = result[0];
    let values = [];
    for (let i = 0; i < arr.length; i++) {
        values.push(arr[i].toString());
    }
    return values;
}

test();

async function test() {
    /*let contract = await tronWeb.contract().at('TCNYd8L5hBey9FwPpvgtvDaY2cHjMFVLZu');
    try {
        let result = await contract.getBalance2(user,tokens).call({from: addressToHex('T9yD14Nj9j7xAB4dbGeiX9h8unkKHxuWwb')});
        return result;
    } catch (e) {
        console.log(e);
    }*/
    // let result = await getTokenInfo('TXCWs4vtLW2wYFHfi7xWeiC9Kuj2jxpKqJ');
    // let result = await sendERC20Token('4594348E3482B751AA235B8E580EFEF69DB465B3A291C5662CEDA6459ED12E39', 'TG8o48ycgUCB7UJd46cSnxSJybWwTHmRpm', 100000, 'TXCWs4vtLW2wYFHfi7xWeiC9Kuj2jxpKqJ', 10000000);
    // let result = await sendTrx('4594348E3482B751AA235B8E580EFEF69DB465B3A291C5662CEDA6459ED12E39', 'TG8o48ycgUCB7UJd46cSnxSJybWwTHmRpm', 100000);
    // let result = await getBalance('TG8o48ycgUCB7UJd46cSnxSJybWwTHmRpm');
    // let result = await getERC20Balance('TG8o48ycgUCB7UJd46cSnxSJybWwTHmRpm', 'TXCWs4vtLW2wYFHfi7xWeiC9Kuj2jxpKqJ');
    // let result = await multiCallOfBalances('TCNYd8L5hBey9FwPpvgtvDaY2cHjMFVLZu', addressToHex('TMZBDFxu5WE8VwYSj2p3vVuBxxKMSqZDc8'), [addressToHex('TDndaG9V79f3dVuVQHvGZjx3VWN9XxzGe9'),addressToHex('TPZddNpQJHu8UtKPY1PYDBv2J5p5QpJ6XW'),addressToHex('THSjCwmYVeK1oLR3TdnXhP7vcU9xVssR3m')]);
    // let result = await multiCallOfBalances(multiCallAddress, 'TTaJsdnYPsBjLLM1u2qMw1e9fLLoVKnNUX', ['T9yD14Nj9j7xAB4dbGeiX9h8unkKHxuWwb', 'TXCWs4vtLW2wYFHfi7xWeiC9Kuj2jxpKqJ', 'TEzJjjC4NrLrYFthGFHzQon5zrErNw1JN9', 'TYMQT8152SicTSDuNEob6t6QRLfet1xrMn']);
    let result = await estimateEnergyUsed('TTaJsdnYPsBjLLM1u2qMw1e9fLLoVKnNUX', 'TEzJjjC4NrLrYFthGFHzQon5zrErNw1JN9', 'transfer(address,uint256)', '0', ['TFzEXjcejyAdfLSEANordcppsxeGW9jEm2', '1']);
    console.log(result);
}

// window.addressToTron = addressToTron;
