const httpRequest = require('../Utilites/httpRequest.js');

class AirPurifier {
    constructor(log, config, api) {
        this.log = log;
        this.config = config;
        this.api = api;

        this.currentActiveStatus = false;
        this.currentState = 0;
        this.currentSpeed = 0;
        this.name = config.name;
        this.IP = config.IP;
        this.uuid = config.UUID;
        this.path = `/commands/ir/localremote/${this.uuid}`;
        this.command = '';
        this.msg = '';

        this.Service = this.api.hap.Service;
        this.Characteristic = this.api.hap.Characteristic;
        this.service = new this.Service.AirPurifier(this.name);

        this.service.getCharacteristic(this.Characteristic.Active)
            .onGet(this.onGetActive.bind(this))
            .onSet(this.onSetActive.bind(this));

        this.service.getCharacteristic(this.Characteristic.CurrentAirPurifierState)
            .onGet(this.onGetCurrentState.bind(this));

        this.service.getCharacteristic(this.Characteristic.TargetAirPurifierState)
            .onGet(this.onGetTargetState.bind(this))
            .onSet(this.onSetTargetState.bind(this));

        this.service.getCharacteristic(this.Characteristic.RotationSpeed)
            .onGet(this.onGetRotationSpeed.bind(this))
            .onSet(this.onSetRotationSpeed.bind(this));
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

    onGetCurrentState () {
        return this.Characteristic.CurrentAirPurifierState.INACTIVE;
    }

    onGetTargetState () {
        console.log(`Target Air Purifier Mode: ${this.Characteristic.TargetAirPurifierState.AUTO}`);
        return this.Characteristic.TargetAirPurifierState.AUTO;
    }

    onSetTargetState (value) {
        this.command = '04FF';
        this.msg = 'Current Air Purifier state';
        httpRequest(this.IP, this.path, value, this.currentState, this.msg);
        return this.currentState;
    }

    onGetRotationSpeed () {
        return this.currentSpeed;
    }

    onSetRotationSpeed (value) {
        this.command = '0BFF';
        this.msg = 'Rotation speed';
        httpRequest(this.IP, this.path, value, this.currentSpeed, this.msg);
        return this.currentSpeed;
    }
}

module.exports = AirPurifier;