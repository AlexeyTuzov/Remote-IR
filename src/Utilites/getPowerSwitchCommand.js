"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var getPowerSwitchCommand = function (value, functions) {
    if (functions.find(function (item) { return item.Name === 'poweron'; }) && functions.find(function (item) { return item.Name === 'poweroff'; })) {
        return value ? '03FF' : '02FF';
    }
    if (functions.find(function (item) { return item.Name === 'power' && item.Type === 'toggle'; })) {
        return value ? '0101' : '0100';
    }
    else
        return '01FF';
};
exports.default = getPowerSwitchCommand;
