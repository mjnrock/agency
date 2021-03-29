import Bitwise from "./Bitwise";

/**
 * This adds "lookup" functions to an enumeration object
 */
export function MaskedEnumerator(items = {}) {
    let obj = {
        ...items,
    };

    obj.flagToName = (flag) => {
        for(let name in obj) {
            if(obj[ name ] === flag) {
                return name;
            }
        }

        return null;
    }
    obj.maskToNames = (mask) => {
        let names = [];

        for(let name in obj) {
            if(Bitwise.has(mask, obj[ name ])) {
                names.push(name);
            }
        }

        return names;
    }

    return Object.freeze(obj);
};

export default MaskedEnumerator;