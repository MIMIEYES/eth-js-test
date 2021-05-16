// 安装 yarn add ethers

// 引入ethers.js
var ethers = require('ethers');
// let url = "https://ropsten.infura.io/v3/3cf511bbaebe499f98f867238aaaadbb";
// let provider = new ethers.providers.JsonRpcProvider(url);
// 测试网 - ropsten, 主网 - homestead
let provider = ethers.getDefaultProvider('ropsten');

let CHANGE_ABI = [
    "function createOrSignManagerChange(string txKey, address[] adds, address[]]removes, uint8 count, bytes signatures) public"
];

const GWEI_10 = ethers.utils.parseUnits('10', 9);

// 0xc11D9943805e56b630A401D4bd9A29550353EFa1 [Account9]
// let privateKey = '4594348E3482B751AA235B8E580EFEF69DB465B3A291C5662CEDA6459ED12E39';
let privateKey = 'd8cdccd432fd1bb7711505d97c441672c540ccfcdbba17397619702eeef1d403';
let from = getAddressByPrivateKey(privateKey);
// 多签合约
let multyContract = '0x6758d4C4734Ac7811358395A8E0c3832BA6Ac624';


changeData();

function changeData() {
    let txHash = "c0e3d91ff1d8066a82b8b09f38b80cb047a2fde88b59f4e42dff5df402ea1982";
    let signData = "0x0c074974757d9c57fba3e4a82a4c85493abb5107023fcf61ef585d94d5e7b0b75ed9f76a251ba3db8b44028298b5db478053a518ca51ea533b98633e6e5209831ca3367fd298de4967c1e014a9277010ef571ebc2bbc7c8129c377e89efcb2794a0be9c6d63a83f2ae2d5afd9c311bd23785afb9e8cc9fc0f80e57f625b8ace8241c9a6007c4f5d4b5d89478f6afbca0a15496852cc8764b876c7ebcd15d030794ba7dde3063aeb48eec192d53a1705cd5b794004b57437172c76b468e1c7d61dbf81c85963bb8ece815dc5a36bc1c42d463104ea441bdac3c7aca178fb791f424063c26acd3f35ebc891964fd7fa62ea9ff0ab37e2b4bb7e914a8aa515e06713525f61baa27c67e2841649073e12842627003244bfa7653f391f2be2b70ada85f7dcca8016dbb2b251a49a5d39510b39f2c119bf7b14fc4f1c2de2943213fb8f31c11691b24ca74c00ba90d1824692bae4e1cc4739caaf94bbef96d93e2fe0be3575a171c7e6843f5cb6a88992f37baa1a60567703a82f95aa384f92cc4587584484d6a4a1cab182430ed0ea0ae64728e8b27a8687a5aee43774b2f933117cecadea34b1e605cedd4bcbefcfa4e704fd1e4301dc3b428f1aca5ea6de028fc13c394cb0764ba1be5106d7bc1975c1430eff5ad07745e4cdc02c8ed75b6aa7a77c7fbbba7dcb92169bacfb0705700b1cb5a6a7609af2de7c52ef4c4dca042227672c340430c74161bd75ad46a8ba421d8f24d5020f55649110bcf477a35a6f7cdf7682ec7b9d0b23d5e70666840f847435e2c4592b4522cd036330a1df452fef046fe83d911b06fe31b1eaf12755a62e965e17914e162b172573147fa8eef5fb90ed3a4447420f7f9244a77a32dc97b7beb008e7b6b2e6250175c774be147e157d936699927a14239e91b";
    let adds = ["0x196c4b2b6e947b57b366967a1822f3fb7d9be1a8"];
    let removes = ["0x10c17be7b6d3e1f424111c8bddf221c9557728b0"];
    let iface = new ethers.utils.Interface(CHANGE_ABI);
    let data = iface.functions.createOrSignManagerChange.encode([ txHash, adds, removes, 1, signData ]);
    console.log("data: " + data);
}
async function change() {
    let txHash = "c0e3d91ff1d8066a82b8b09f38b80cb047a2fde88b59f4e42dff5df402ea1982";
    let signData = "0c074974757d9c57fba3e4a82a4c85493abb5107023fcf61ef585d94d5e7b0b75ed9f76a251ba3db8b44028298b5db478053a518ca51ea533b98633e6e5209831ca3367fd298de4967c1e014a9277010ef571ebc2bbc7c8129c377e89efcb2794a0be9c6d63a83f2ae2d5afd9c311bd23785afb9e8cc9fc0f80e57f625b8ace8241c9a6007c4f5d4b5d89478f6afbca0a15496852cc8764b876c7ebcd15d030794ba7dde3063aeb48eec192d53a1705cd5b794004b57437172c76b468e1c7d61dbf81c85963bb8ece815dc5a36bc1c42d463104ea441bdac3c7aca178fb791f424063c26acd3f35ebc891964fd7fa62ea9ff0ab37e2b4bb7e914a8aa515e06713525f61baa27c67e2841649073e12842627003244bfa7653f391f2be2b70ada85f7dcca8016dbb2b251a49a5d39510b39f2c119bf7b14fc4f1c2de2943213fb8f31c11691b24ca74c00ba90d1824692bae4e1cc4739caaf94bbef96d93e2fe0be3575a171c7e6843f5cb6a88992f37baa1a60567703a82f95aa384f92cc4587584484d6a4a1cab182430ed0ea0ae64728e8b27a8687a5aee43774b2f933117cecadea34b1e605cedd4bcbefcfa4e704fd1e4301dc3b428f1aca5ea6de028fc13c394cb0764ba1be5106d7bc1975c1430eff5ad07745e4cdc02c8ed75b6aa7a77c7fbbba7dcb92169bacfb0705700b1cb5a6a7609af2de7c52ef4c4dca042227672c340430c74161bd75ad46a8ba421d8f24d5020f55649110bcf477a35a6f7cdf7682ec7b9d0b23d5e70666840f847435e2c4592b4522cd036330a1df452fef046fe83d911b06fe31b1eaf12755a62e965e17914e162b172573147fa8eef5fb90ed3a4447420f7f9244a77a32dc97b7beb008e7b6b2e6250175c774be147e157d936699927a14239e91b";
    let adds = ['0x196c4b2b6e947b57b366967a1822f3fb7d9be1a8'];
    let removes = ['0x10c17be7b6d3e1f424111c8bddf221c9557728b0'];

    privateKey = ethers.utils.hexZeroPad(ethers.utils.hexStripZeros('0x' + privateKey), 32);
    let wallet = new ethers.Wallet(privateKey, provider);
    let amount = ethers.utils.parseEther(value);
    let iface = new ethers.utils.Interface(CHANGE_ABI);
    let data = iface.functions.createOrSignManagerChange.encode([ txHash, adds, removes, 1, signData ]);
    let nonce = await getNonce(wallet.address);
    let tx = {nonce: nonce, to: multyContract, value: amount, data: data};
    let _tx = {from: from, to: multyContract, value: amount, data: data};
    let failed = await validate(_tx);
    if (failed) {
        console.log('failed: ' + failed);
        return;
    }
    let sendPromise = wallet.sendTransaction(tx);
    sendPromise.then((tx) => {
        console.log(tx.hash);
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

