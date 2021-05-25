import Util from "./util/package";
import Event from "./event/package";
import Watchable from "./event/watchable/package";
import Logic from "./logic/package";

import Registry from "./Registry";
import AgencyBase from "./AgencyBase";

export default {
    Util,
    Event,
    Watchable,	// Pulled up because it is, in practice, a core module
    Logic,

    Registry,
    AgencyBase,
}