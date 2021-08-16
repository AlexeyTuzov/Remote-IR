const httpRequest = require('../Utilites/httpRequest.js');

class Humidifier {
    constructor(log, config, api) {
        this.log = log;
        this.config = config;
        this.api = api;

        this.currentActiveStatus = false;
        this.currentHDstate = 0;
        this.name = config.name;
        this.IP = config.IP;
        this.uuid = config.UUID;
        this.path = `/commands/ir/localremote/${this.uuid}`;
        this.command = '';
        this.msg = '';

        this.Service = this.api.hap.Service;
        this.Characteristic = this.api.hap.Characteristic;
        this.service = new this.Service.HumidifierDehumidifier(this.name);

        this.service.getCharacteristic(this.Characteristic.Active)
            .onGet(this.onGetActive.bind(this))
            .onSet(this.onSetActive.bind(this));

        this.service.getCharacteristic(this.Characteristic.CurrentHumidifierDehumidifierState)
            .onGet(this.onGetHDState.bind(this));

        this.service.getCharacteristic(this.Characteristic.TargetHumidifierDehumidifierState)
            .onGet(this.onGetTargetState.bind(this))
            .onSet(this.onSetTargetState.bind(this));
    }

    getServices() {
        return [this.service];
    }

    onGetActive() {
        return this.currentActiveStatus;
    }

    onSetActive(value) {
        this.command = value ? '03FF' : '02FF';
        this.msg = 'Power state';
        httpRequest(this.IP, `${this.path}${this.command}`, value, this.currentActiveStatus, this.msg);
        return this.currentActiveStatus;
    }

    onGetHDState () {
        return this.Characteristic.CurrentHumidifierDehumidifierState.INACTIVE;
    }

    onGetTargetState () {
        console.log(`Target H-D Mode: ${this.Characteristic.TargetHumidifierDehumidifierState.AUTO}`);
        return this.Characteristic.TargetHumidifierDehumidifierState.AUTO;
    }

    onSetTargetState (value) {
        this.command = '04FF';
        this.msg = 'Humidifier-Dehumidifier mode';
        httpRequest(this.IP, this.path, value, this.currentHDstate, this.msg);
        return this.currentHDstate;
    }
}

module.exports = Humidifier;