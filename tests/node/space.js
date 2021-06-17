import Console from "../../src/util/Console";

import Space from "./../../src/node/Space";
import Field from "./../../src/node/Field";

Console.NewContext();

const field = new Field([ 10, 10 ]);

const space = new Space();

space.addField(field);