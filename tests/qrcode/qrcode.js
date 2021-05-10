import QRCode from "./../../src/modules/qrcode/QRCode";

const qrc = new QRCode("https://www.google.com", QRCode.OutputType.STRING);

qrc.create({ toTerminal: true }).then(data => console.log(data));