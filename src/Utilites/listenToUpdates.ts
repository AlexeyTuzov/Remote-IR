import {emitter} from "./UDPserver";
import getStatus from "./getStatus";
import getFunctions from "./getFunctions";

const listenToUpdates = (RC: any, ID: string, UUID: string, IP: string): void => {
    const STATUS_UPDATE_EXPRESSION = String.raw`LOOK\.?in:Updated!${ID}:87:FE:${UUID}`;
    emitter.on('updated_status', async (msg: string) => {
        if (msg.match(RegExp(STATUS_UPDATE_EXPRESSION))) {
            RC.currentActiveStatus = await getStatus(IP, UUID);
        }
    });

    const DATA_UPGRADE_EXPRESSION = String.raw`LOOK\.?in:Updated!${ID}:data:${UUID}$`;
    emitter.on('updated_data', async (msg: string) => {
        if (msg.match(RegExp(DATA_UPGRADE_EXPRESSION))) {
            RC.functions = await getFunctions(IP, UUID);
        }
    });
}

export default listenToUpdates;
