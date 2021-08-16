const httpRequest = require('../Utilites/httpRequest.js');

class Switch {
    constructor(log, config, api) {
        this.log = log;
        this.config = config;
        this.api = api;

        this.currentActiveStatus = false;
        this.name = config.name;
        this.IP = config.IP;
        this.uuid = config.UUID;
        this.path = `/commands/ir/localremote/${this.uuid}`;
        this.command = '';
        this.msg = '';

        this.Service = this.api.hap.Service;
        this.Characteristic = this.api.hap.Characteristic;
        this.service = new this.Service.Switch(this.name);
        this.service.getCharacteristic(this.Characteristic.On)
            .onGet(this.onGetHandler.bind(this))
            .onSet(this.onSetHandler.bind(this));
    }

    getServices() {
        return [this.service];
    }

    onGetHandler() {
        return this.currentActiveStatus;
    }

    onSetHandler(value) {
        this.command = value ? '03FF' : '02FF';
        this.msg = 'Power state';
        httpRequest(this.IP, `${this.path}${this.command}`, value, this.currentActiveStatus, this.msg);
        return this.currentActiveStatus;
    }
}

module.exports = Switch;