import AgencyBase from "./../src/AgencyBase";

class Cat extends AgencyBase {
    constructor() {
        super();
        
        this.cats  =5;
        this._cats  =5;
    }    
}

const cat = new Cat();

console.log(cat);
console.log(cat.id);
console.log(cat.cats);
console.log(cat.ownKeys);

console.log("----- iterator -----");
for(let [ key, value ] of cat) {
    console.log(key, value);
}

console.log("----- keys -----");
for(let entry of cat._keys) {
    console.log(entry);
}

console.log("----- values -----");
for(let entry of cat._values) {
    console.log(entry);
}

console.log("----- entries -----");
for(let entry of cat._entries) {
    console.log(entry);
}