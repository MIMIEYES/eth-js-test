const TronWeb = require('TronWeb');

let tronWeb;
let multiCallAddress;


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

function addressToHex(tronAddress) {
    if (!tronAddress) {
        return "EMPTY ADDRESS!"
    }
    return tronWeb.address.toHex(tronAddress);
}

async function getBalances(multiCallAddress, user, tokens) {
    let funABI = {
        "outputs": [{"name": "info", "type": "uint256[]"}],
        "constant": true,
        "inputs": [{"name": "_user", "type": "address"}, {"name": "_tokens", "type": "address[]"}],
        "name": "getBalance",
        "stateMutability": "view",
        "type": "function"
    };
    let senderHex = addressToHex('T9yD14Nj9j7xAB4dbGeiX9h8unkKHxuWwb');
    let contractAddressCall = addressToHex(multiCallAddress);
    let params = [];
    params.push({type: 'address', value: user});
    params.push({type: 'address[]', value: tokens});
    const tx = await tronWeb.transactionBuilder.triggerConstantContract(
        contractAddressCall,
        'getBalance(address,address[])',
        {},
        params,
        senderHex);

    let constantResult = tx.constant_result;
    if (!constantResult) {
        return;
    }
    let output = '0x' + constantResult[0];
    const result = tronWeb.utils.abi.decodeParamsV2ByABI(funABI, output);
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

mainnetTest();
testnetTest();

async function mainnetTest() {
    mainnet();
    let userAddress = 'TMZBDFxu5WE8VwYSj2p3vVuBxxKMSqZDc8';
    // token='T9yD14Nj9j7xAB4dbGeiX9h8unkKHxuWwb' 视为查询用户的trx余额
    let tokenAddresses = ['T9yD14Nj9j7xAB4dbGeiX9h8unkKHxuWwb', 'TDndaG9V79f3dVuVQHvGZjx3VWN9XxzGe9','TPZddNpQJHu8UtKPY1PYDBv2J5p5QpJ6XW','THSjCwmYVeK1oLR3TdnXhP7vcU9xVssR3m'];
    let result = await getBalances(multiCallAddress, userAddress, tokenAddresses);
    console.log(result, 'mainnetTest');
}

async function testnetTest() {
    testnet();
    let userAddress = 'TTaJsdnYPsBjLLM1u2qMw1e9fLLoVKnNUX';
    // token='T9yD14Nj9j7xAB4dbGeiX9h8unkKHxuWwb' 视为查询用户的trx余额
    let tokenAddresses = ['T9yD14Nj9j7xAB4dbGeiX9h8unkKHxuWwb', 'TXCWs4vtLW2wYFHfi7xWeiC9Kuj2jxpKqJ', 'TEzJjjC4NrLrYFthGFHzQon5zrErNw1JN9', 'TYMQT8152SicTSDuNEob6t6QRLfet1xrMn'];
    let result = await getBalances(multiCallAddress, userAddress, tokenAddresses);
    console.log(result, 'testnetTest');
}

