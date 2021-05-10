import qrcode from "qrcode";

export class QRCode {
    static get Generator() {
        return qrcode;
    }

    static OutputType = {
        DATA_URL: `toDataURL`,
        CANVAS: `toCanvas`,
        STRING: `toString`,
        FILE: `toFile`,
        FILE_STREAM: `toFileStream`,
        BUFFER: `toBuffer`,
    };

    constructor(data, type = QRCode.OutputType.DATA_URL) {
        this.type = type;
        this.data = data;
    }

    async create({ toTerminal = false } = {}) {
        if(toTerminal) {
            return await qrcode[ this.type ](this.data, { type: "terminal" }).then(data => data);
        }

        return await qrcode[ this.type ](this.data).then(data => data);
    }
};

export default QRCode;