import AgencyBase from "../AgencyBase";

export class NetworkController extends AgencyBase {
	constructor(network, entity, cache) {
		super();
		
		this.eid = typeof entity === "object" ? (entity.id || entity._id || entity.__id || entity.uuid) : entity;
		this.dispatch = cache.dispatcher.dispatch;
		this.broadcast = cache.dispatcher.broadcast;
		this.receiver = ({ callback, filter } = {}) => {
            const data = network.__connections.get(entity);

            if(!data) {
                return -1;  // Cache record does not exist
            }
            
            let wasUpdated = false;
            if(typeof callback === "function") {
                data.receiver.__callback = callback;
                wasUpdated = true;
            }
            if(typeof filter === "function") {
                data.receiver.__filter = filter;
                wasUpdated = true;
            }

            if(wasUpdated) {
                network.__connections.set(entity, data);

                return true;
            }

            return false;
        };
		this.leave = () => network.removeListener(entity);
	}
};

export default NetworkController;