var tronTool = require('./callTronForiOS');
tronTool.testnet();
// test();
async function test() {
    console.log(tronTool.addressToTron('0xc11d9943805e56b630a401d4bd9a29550353efa1'));
    console.log(await tronTool.getERC20Balance('TTaJsdnYPsBjLLM1u2qMw1e9fLLoVKnNUX', 'TXCWs4vtLW2wYFHfi7xWeiC9Kuj2jxpKqJ'));
}

let b;
let c = tronTool.getERC20Balance('TTaJsdnYPsBjLLM1u2qMw1e9fLLoVKnNUX', 'TXCWs4vtLW2wYFHfi7xWeiC9Kuj2jxpKqJ').then(a => {
    b = a;
    console.log(a, 'a');
});
JSON.stringify()
console.log(b, 'b');
console.log(c, 'c');
