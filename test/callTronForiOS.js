const TronWeb = require('TronWeb');
const {BigNumber} = require("ethers/utils");
const ERC20NameTypes = ['string'];
const ERC20SymbolTypes = ['string'];
const ERC20DecimalsTypes = ['uint8'];
const ERC20BalanceOfTypes = ['uint256'];
let tronWeb;


function addressToHex(tronAddress) {
    if (!tronAddress) {
        return "EMPTY ADDRESS!"
    }
    return tronWeb.address.toHex(tronAddress);
}

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

async function contractCall(contractAddress, functionDes, args, returnTypes) {
    let tx = await triggerConstantContract(null, contractAddress, functionDes, 0, args);
    let constantResult = tx.constant_result;
    if (!constantResult) {
        return;
    }
    let output = '0x' + constantResult[0];
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
    const result = tronWeb.utils.abi.decodeParamsV2ByABI(funABI, output);
    return result;
}

var tronTool = {
    testnet() {
        tronWeb = new TronWeb({
            fullHost: 'https://api.shasta.trongrid.io',
            headers: {"TRON-PRO-API-KEY": ''},
            privateKey: ''
        });
    },
    mainnet(url = 'https://api.trongrid.io', apiKey = '76f3c2b5-357a-4e6c-aced-9e1c42179717') {
        tronWeb = new TronWeb({
            fullHost: url,
            headers: {"TRON-PRO-API-KEY": apiKey},
            privateKey: ''
        });
    },
    addressToTron(ethAddress) {
        if (!ethAddress) {
            return "EMPTY ADDRESS!"
        }
        return tronWeb.address.fromHex(ethAddress);
    },

    addressToEth(tronAddress) {
        if (!tronAddress) {
            return "EMPTY ADDRESS!"
        }
        let hex = tronWeb.address.toHex(tronAddress);
        return '0x' + hex.substring(2);
    },

    async estimateEnergyUsed(sender, contractAddress, functionDes, value, args) {
        let tx = await triggerConstantContract(sender, contractAddress, functionDes, value, args);
        if (!tx) {
            return 0;
        }
        return tx.energy_used;
    },

    async getTokenInfo(contractAddress) {
        let name = await this.getERC20Name(contractAddress);
        let symbol = await this.getERC20Symbol(contractAddress);
        let decimals = await this.getERC20Decimals(contractAddress);
        let result = {
            name: name,
            symbol: symbol,
            decimals: decimals
        };
        return result;
    },

    async getERC20Name(contractAddress) {
        let result = await contractCall(contractAddress, 'name()', [], ERC20NameTypes);
        if (!result || result.length == 0) {
            return;
        }
        return result[0];
    },

    async getERC20Symbol(contractAddress) {
        let result = await contractCall(contractAddress, 'symbol()', [], ERC20SymbolTypes);
        if (!result || result.length == 0) {
            return;
        }
        return result[0];
    },

    async getERC20Decimals(contractAddress) {
        let result = await contractCall(contractAddress, 'decimals()', [], ERC20DecimalsTypes);
        if (!result || result.length == 0) {
            return;
        }
        return result[0];
    },

    async sendTrx(privateKey, to, value) {
        const tradeobj = await tronWeb.transactionBuilder.sendTrx(to, value, tronWeb.address.fromPrivateKey(privateKey), 1);
        const signedtxn = await tronWeb.trx.sign(tradeobj, privateKey);
        const receipt = await tronWeb.trx.sendRawTransaction(signedtxn);
        return receipt;
    },

    async sendERC20Token(privateKey, to, value, contractAddress, feeLimit) {
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
    },

    async getBalance(address) {
        let balance = await tronWeb.trx.getBalance(address);
        return balance;
    },

    async getERC20Balance(address, contractAddress) {
        let result = await contractCall(contractAddress, 'balanceOf(address)', [address], ERC20BalanceOfTypes);
        if (!result || result.length == 0) {
            return;
        }
        let balance = result[0];
        return balance.toString();
    },

    async getGasLimitWithNetwork_sendTrx(from, to, value) {
        return 2000000;
    },

    async getGasLimit_sendERC20(from, to, value, contractAddress) {
        let energyUsed = await this.estimateEnergyUsed(from, contractAddress, 'transfer(address,uint256)', 0, [to, value]);
        if (!energyUsed || energyUsed == 0) {
            return 0;
        }
        return energyUsed * 280;
    },

    async getBalances(multiCallAddress, user, tokens) {
        let result = await contractCallByABI(multiCallAddress, 'getBalance(address,address[])', [user, tokens], {"outputs":[{"name":"info","type":"uint256[]"}],"constant":true,"inputs":[{"name":"_user","type":"address"},{"name":"_tokens","type":"address[]"}],"name":"getBalance","stateMutability":"view","type":"function"});
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
}

module.exports = tronTool;
// window.tronTool = tronTool;
