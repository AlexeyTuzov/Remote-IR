import httpRequest from "./httpRequest";
import {RCInfo, Functions} from './interfaces';

const getFunctions = async (IP: string, UUID: string): Promise<Functions[]> => {
    let functions: Functions[] = [];
    try {
        let RCInfo: RCInfo = JSON.parse(await httpRequest(IP, `/data/${UUID}`));
        RCInfo.Functions?.forEach( (func: Functions) => functions.push(func));
    } catch (e: any) {
        console.log(e.stack);
    }
    return functions;
}

export default getFunctions;
