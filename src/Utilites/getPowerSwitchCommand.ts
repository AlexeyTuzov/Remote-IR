import {Functions} from "../index";

const getPowerSwitchCommand = (value: boolean, functions: Functions[]): string => {

    if (functions.find(item => item.Name === 'poweron') && functions.find(item => item.Name === 'poweroff')) {
        return value ? '03FF' : '02FF';
    }
    if (functions.find(item => item.Name === 'power' && item.Type === 'toggle')) {
        return value ? '0101' : '0100';
    } else return '01FF';
}

export default getPowerSwitchCommand;