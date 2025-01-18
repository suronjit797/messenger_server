import EventModel from "./event.model";
import globalService from "../../global/global.service";

// global services
const globalServices = globalService(EventModel);

// rest services
const eventServices = { ...globalServices };

export default eventServices;
