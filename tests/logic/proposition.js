import Proposition from "../../src/logic/Proposition";

console.warn("------------ NEW EXECUTION CONTEXT ------------");

console.group(`Basic`);
console.log(`T`, Proposition.TRUE.test());
console.log(`F`, Proposition.FALSE.test());
console.log(`~T`, Proposition.NOT_TRUE.test());
console.log(`~F`, Proposition.NOT_FALSE.test());
console.groupEnd();

console.warn("-----");

console.group(`AND`);
console.log(`FxFxF`, Proposition.AND(false, false, false).test());
console.log(`FxFxT`, Proposition.AND(false, false, true).test());
console.log(`FxTxF`, Proposition.AND(false, true, false).test());
console.log(`FxTxT`, Proposition.AND(false, true, true).test());
console.log(`TxFxF`, Proposition.AND(true, false, false).test());
console.log(`TxFxT`, Proposition.AND(true, false, true).test());
console.log(`TxTxF`, Proposition.AND(true, true, false).test());
console.log(`TxTxT`, Proposition.AND(true, true, true).test());
console.groupEnd();

console.warn("-----");

console.group(`OR`);
console.log(`FxFxF`, Proposition.OR(false, false, false).test());
console.log(`FxFxT`, Proposition.OR(false, false, true).test());
console.log(`FxTxF`, Proposition.OR(false, true, false).test());
console.log(`FxTxT`, Proposition.OR(false, true, true).test());
console.log(`TxFxF`, Proposition.OR(true, false, false).test());
console.log(`TxFxT`, Proposition.OR(true, false, true).test());
console.log(`TxTxF`, Proposition.OR(true, true, false).test());
console.log(`TxTxT`, Proposition.OR(true, true, true).test());
console.groupEnd();

console.warn("-----");

console.group(`NAND`);
console.log(`FxFxF`, Proposition.NAND(false, false, false).test());
console.log(`FxFxT`, Proposition.NAND(false, false, true).test());
console.log(`FxTxF`, Proposition.NAND(false, true, false).test());
console.log(`FxTxT`, Proposition.NAND(false, true, true).test());
console.log(`TxFxF`, Proposition.NAND(true, false, false).test());
console.log(`TxFxT`, Proposition.NAND(true, false, true).test());
console.log(`TxTxF`, Proposition.NAND(true, true, false).test());
console.log(`TxTxT`, Proposition.NAND(true, true, true).test());
console.groupEnd();

console.warn("-----");

console.group(`NOR`);
console.log(`FxFxF`, Proposition.NOR(false, false, false).test());
console.log(`FxFxT`, Proposition.NOR(false, false, true).test());
console.log(`FxTxF`, Proposition.NOR(false, true, false).test());
console.log(`FxTxT`, Proposition.NOR(false, true, true).test());
console.log(`TxFxF`, Proposition.NOR(true, false, false).test());
console.log(`TxFxT`, Proposition.NOR(true, false, true).test());
console.log(`TxTxF`, Proposition.NOR(true, true, false).test());
console.log(`TxTxT`, Proposition.NOR(true, true, true).test());
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