"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Switch = void 0;
var httpRequest = require('../Utilites/httpRequest.js');
var Switch = /** @class */ (function () {
    function Switch(platform, accessory) {
        this.platform = platform;
        this.accessory = accessory;
        this.currentActiveStatus = false;
        this.name = this.accessory.context.name;
        this.IP = this.accessory.context.IP;
        this.uuid = this.accessory.context.UUID;
        this.path = "/commands/ir/localremote/" + this.uuid;
        this.command = '';
        this.msg = '';
        this.service = this.accessory.getService(this.platform.Service.Switch) || this.accessory.addService(this.platform.Service.Switch);
        this.service.getCharacteristic(this.platform.Characteristic.On)
            .onGet(this.onGetHandler.bind(this))
            .onSet(this.onSetHandler.bind(this));
    }
    Switch.prototype.getServices = function () {
        return [this.service];
    };
    Switch.prototype.onGetHandler = function () {
        return this.currentActiveStatus;
    };
    Switch.prototype.onSetHandler = function (value) {
        this.command = value ? '03FF' : '02FF';
        this.msg = 'Power state';
        this.currentActiveStatus = httpRequest(this.IP, "" + this.path + this.command, value, this.msg);
    };
    return Switch;
}());
exports.Switch = Switch;
