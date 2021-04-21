import Proposition from "../../src/logic/Proposition";

console.warn("------------ NEW EXECUTION CONTEXT ------------");

console.group(`Basic`);
console.log(`T`, Proposition.TRUE.test());
console.log(`F`, Proposition.FALSE.test());
console.log(`~T`, Proposition.NTRUE.test());
console.log(`~F`, Proposition.NFALSE.test());
console.groupEnd();

console.warn("-----");

console.group(`AND`);
console.log(`FxF`, Proposition.AND(false, false).test());
console.log(`FxT`, Proposition.AND(false, true).test());
console.log(`TxF`, Proposition.AND(true, false).test());
console.log(`TxT`, Proposition.AND(true, true).test());
console.groupEnd();

console.warn("-----");

console.group(`OR`);
console.log(`FxF`, Proposition.OR(false, false).test());
console.log(`FxT`, Proposition.OR(false, true).test());
console.log(`TxF`, Proposition.OR(true, false).test());
console.log(`TxT`, Proposition.OR(true, true).test());
console.groupEnd();

console.warn("-----");

console.group(`NAND`);
console.log(`FxF`, Proposition.NAND(false, false).test());
console.log(`FxT`, Proposition.NAND(false, true).test());
console.log(`TxF`, Proposition.NAND(true, false).test());
console.log(`TxT`, Proposition.NAND(true, true).test());
console.groupEnd();

console.warn("-----");

console.group(`NOR`);
console.log(`FxF`, Proposition.NOR(false, false).test());
console.log(`FxT`, Proposition.NOR(false, true).test());
console.log(`TxF`, Proposition.NOR(true, false).test());
console.log(`TxT`, Proposition.NOR(true, true).test());
console.groupEnd();

console.warn("-----");

console.group(`XOR`);
console.log(`FxFxF`, Proposition.XOR(false, false, false).test());
console.log(`FxFxT`, Proposition.XOR(false, false, true).test());
console.log(`FxTxF`, Proposition.XOR(false, true, false).test());
console.log(`FxTxT`, Proposition.XOR(false, true, true).test());
console.log(`TxFxF`, Proposition.XOR(true, false, false).test());
console.log(`TxFxT`, Proposition.XOR(true, false, true).test());
console.log(`TxTxF`, Proposition.XOR(true, true, false).test());
console.log(`TxTxT`, Proposition.XOR(true, true, true).test());
console.groupEnd();

console.warn("-----");

console.group(`XNOR`);
console.log(`FxFxF`, Proposition.XNOR(false, false, false).test());
console.log(`FxFxT`, Proposition.XNOR(false, false, true).test());
console.log(`FxTxF`, Proposition.XNOR(false, true, false).test());
console.log(`FxTxT`, Proposition.XNOR(false, true, true).test());
console.log(`TxFxF`, Proposition.XNOR(true, false, false).test());
console.log(`TxFxT`, Proposition.XNOR(true, false, true).test());
console.log(`TxTxF`, Proposition.XNOR(true, true, false).test());
console.log(`TxTxT`, Proposition.XNOR(true, true, true).test());
console.groupEnd();

console.warn("-----");

console.group(`NXOR`);
console.log(`FxFxF`, Proposition.NXOR(false, false, false).test());
console.log(`FxFxT`, Proposition.NXOR(false, false, true).test());
console.log(`FxTxF`, Proposition.NXOR(false, true, false).test());
console.log(`FxTxT`, Proposition.NXOR(false, true, true).test());
console.log(`TxFxF`, Proposition.NXOR(true, false, false).test());
console.log(`TxFxT`, Proposition.NXOR(true, false, true).test());
console.log(`TxTxF`, Proposition.NXOR(true, true, false).test());
console.log(`TxTxT`, Proposition.NXOR(true, true, true).test());
console.groupEnd();

console.warn("-----");

console.group(`NXNOR`);
console.log(`FxFxF`, Proposition.NXNOR(false, false, false).test());
console.log(`FxFxT`, Proposition.NXNOR(false, false, true).test());
console.log(`FxTxF`, Proposition.NXNOR(false, true, false).test());
console.log(`FxTxT`, Proposition.NXNOR(false, true, true).test());
console.log(`TxFxF`, Proposition.NXNOR(true, false, false).test());
console.log(`TxFxT`, Proposition.NXNOR(true, false, true).test());
console.log(`TxTxF`, Proposition.NXNOR(true, true, false).test());
console.log(`TxTxT`, Proposition.NXNOR(true, true, true).test());
console.groupEnd();