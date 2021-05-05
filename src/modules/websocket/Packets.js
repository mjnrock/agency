export const Json = {
    packer: function(event, ...args) {
        return JSON.stringify({
            payload: {
                type: event,
                data: args,
            },
            timestamp: Date.now(),
        });
    },
    unpacker: function(json) {        
        let obj = JSON.parse(json);

        while(typeof obj === "string" || obj instanceof String) {
            obj = JSON.parse(obj);
        }

        return obj.payload;
    },
};

export default {
    Json,
};