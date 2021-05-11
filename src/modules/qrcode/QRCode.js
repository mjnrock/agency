import qrcode from "qrcode";

export class QRCode {
    static get Generator() {
        return qrcode;
    };

    static OutputType = {
        DATA_URL: `toDataURL`,
        CANVAS: `toCanvas`,
        STRING: `toString`,
        FILE: `toFile`,
        FILE_STREAM: `toFileStream`,
        BUFFER: `toBuffer`,
    };

    constructor(data, type = QRCode.OutputType.DATA_URL, opts = {}) {
        this.type = type;
        this.data = data;
        this.config = {
            errorCorrectionLevel: "H",
            ...opts,
        };
    }

    async create({ toTerminal = false, ...opts } = {}) {
        if(toTerminal) {
            return await qrcode[ this.type ](this.data, { type: "terminal", ...this.config, ...opts }).then(data => data);
        }

        return await qrcode[ this.type ](this.data, { ...this.config, ...opts }).then(data => data);
    }
};

export default QRCode;