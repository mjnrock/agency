export const Json = () => ({
    pack: function(event, ...args) {
        return JSON.stringify({
            type: event,
            payload: args,
            timestamp: Date.now(),
        });
    },
    unpack: function({ data: json }) {
        let obj = JSON.parse(json);

        while(typeof obj === "string" || obj instanceof String) {
            obj = JSON.parse(obj);
        }

        return obj;
    },
});

/**
 * NOTE:    **ALL** arguments will get cast as a string
 * This will encode the inner data according to the @encoding,
 *  but will convert the result into a UTF-8 buffer.  On the
 *  other side, the UTF-8 buffer will be converted to a string,
 *  then enc
 */
export const StringBuffer = ({ encoding = "utf8", spacer = ":" } = {}) => ({
    pack: function(event, ...args) {
        return Buffer.from([ event, ...args ].join(spacer).toString(), encoding);
    },
    unpack: function(buffer) {
        if(buffer instanceof Buffer) {
            const str = Buffer.from(buffer, encoding).toString(encoding);
            const [ event, ...args ] = str.split(spacer);

            return {
                type: event,
                data: args,
            };
        }

        return new String();
    },
});

export default {
    Json,
    Json,
    StringBuffer,
};