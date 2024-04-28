// const necc = require('@noble/secp256k1');
import * as necc from '@noble/secp256k1';

const _0n = BigInt(0);
const _1n = BigInt(1);
const _2n = BigInt(2);
const _3n = BigInt(3);
const _8n = BigInt(8);
const _Pn = BigInt('0xfffffffffffffffffffffffffffffffffffffffffffffffffffffffefffffc2f');

function mod(a, b = _Pn) {
    const result = a % b;
    return result >= _0n ? result : b + result;
}

function add(X1, Y1, Z1, X2, Y2, Z2) {
    if (X2 === _0n || Y2 === _0n)
        return 0;
    if (X1 === _0n || Y1 === _0n)
        return 1;
    const Z1Z1 = mod(Z1 * Z1);
    const Z2Z2 = mod(Z2 * Z2);
    const U1 = mod(X1 * Z2Z2);
    const U2 = mod(X2 * Z1Z1);
    const S1 = mod(mod(Y1 * Z2) * Z2Z2);
    const S2 = mod(mod(Y2 * Z1) * Z1Z1);
    const H = mod(U2 - U1);
    const r = mod(S2 - S1);
    if (H === _0n) {
        if (r === _0n) {
            return double(X1, Y1, Z1);
        }
        else {
            return 2;
        }
    }
    const HH = mod(H * H);
    const HHH = mod(H * HH);
    const V = mod(U1 * HH);
    const X3 = mod(r * r - HHH - _2n * V);
    const Y3 = mod(r * (V - X3) - S1 * HHH);
    const Z3 = mod(Z1 * Z2 * H);
    return [X3, Y3, Z3];
}

function double(X1, Y1, Z1) {
    const A = mod(X1 * X1);
    const B = mod(Y1 * Y1);
    const C = mod(B * B);
    const x1b = X1 + B;
    const D = mod(_2n * (mod(x1b * x1b) - A - C));
    const E = mod(_3n * A);
    const F = mod(E * E);
    const X3 = mod(F - _2n * D);
    const Y3 = mod(E * (D - X3) - _8n * C);
    const Z3 = mod(_2n * Y1 * Z1);
    return [X3, Y3, Z3];
}

function invert(number, modulo = _Pn) {
    if (number === _0n || modulo <= _0n) {
        throw new Error(`invert: expected positive integers`);
    }
    let a = mod(number, modulo);
    let b = modulo;
    let x = _0n, y = _1n, u = _1n, v = _0n;
    while (a !== _0n) {
        const q = b / a;
        const r = b % a;
        const m = x - u * q;
        const n = y - v * q;
        b = a, a = r, x = u, y = v, u = m, v = n;
    }
    const gcd = b;
    if (gcd !== _1n)
        throw new Error('invert: does not exist');
    return mod(x, modulo);
}

function toAffine(x, y, z, invZ) {
    const is0 = x === _0n && y === _1n && z === _0n;
    if (invZ == null)
        invZ = is0 ? _8n : invert(z);
    const iz1 = invZ;
    const iz2 = mod(iz1 * iz1);
    const iz3 = mod(iz2 * iz1);
    const ax = mod(x * iz2);
    const ay = mod(y * iz3);
    const zz = mod(z * iz1);
    if (is0)
        return [_0n, _0n];
    if (zz !== _1n)
        throw new Error('invZ was invalid');
    return [ax, ay];
}

let p = "cc8a4bc64d897bddc5fbc2f670f7a8ba0b386779106cf1223c6fc5d7cd6fc115";
let tweak = "2ca01ed85cf6b6526f73d39a1111cd80333bfdc00ce98992859848a90a6f0258";

// let pArray = Buffer.from(p, "hex").valueOf();
// let tweakArray = Buffer.from(tweak, "hex").valueOf();
// const P = necc.utils.pointAddScalar(p, tweak, true);
// let result = p.slice(1)
// console.log("result", result);

let P = necc.Point.fromHex(p);
let t = necc.Point.fromPrivateKey(tweak);
console.log('P.x', P.x);
console.log('P.y', P.y);
console.log('t.x', t.x);
console.log('t.y', t.y);
console.log('P.tohex false: ', P.toHex(false));
console.log('P.tohex true: ', P.toHex(true));
console.log('P.tohexX: ', P.toHexX());
console.log('t.tohex true: ', t.toHex(true));
console.log('t.tohexX: ', t.toHexX());
const tweaked = P.add(t);
if (tweaked.equals(necc.Point.ZERO)) throw new Error('Tweaked point at infinity');
const Q = tweaked.toRawBytes(true).slice(1);
console.log(Buffer.from(Q).toString('hex'));

let addRe = add(P.x, P.y, _1n, t.x, t.y, _1n);
console.log('addRe===', addRe);
console.log('addRe.0===', addRe[0].toString(16));
console.log('addRe.1===', addRe[1].toString(16));
console.log('addRe.2===', addRe[2].toString(16));
let toAffineRe = toAffine(addRe[0], addRe[1], addRe[2], null);
console.log('toAffine===', toAffineRe);
console.log('toAffine.0===', toAffineRe[0].toString(16));
console.log('toAffine.1===', toAffineRe[1].toString(16));



