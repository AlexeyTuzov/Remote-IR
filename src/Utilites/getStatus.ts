import httpRequest from "./httpRequest";
import {RCInfo} from './interfaces';

const getStatus = async (IP: string, UUID: string): Promise<number> => {
    let status: number = 0;
    try {
        let RCInfo: RCInfo = JSON.parse(await httpRequest(IP, `/data/${UUID}`));
        status = +RCInfo.Status[0];
    } catch (e: any) {
        console.log(e.stack);
    }
    return status;
}

export default getStatus;
