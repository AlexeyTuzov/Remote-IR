const httpRequest = require('../Utilites/httpRequest.js');

class Fan {
    constructor(log, config, api) {
        this.log = log;
        this.config = config;
        this.api = api;

        this.currentActiveStatus = false;
        this.currentSwing = 0;
        this.currentSpeed = 0;
        this.name = config.name;
        this.IP = config.IP;
        this.uuid = config.UUID;
        this.path = `/commands/ir/localremote/${this.uuid}`;
        this.command = '';
        this.msg = '';

        this.Service = this.api.hap.Service;
        this.Characteristic = this.api.hap.Characteristic;
        this.service = new this.Service.Fanv2(this.name);

        this.service.getCharacteristic(this.Characteristic.Active)
            .onGet(this.onGetActive.bind(this))
            .onSet(this.onSetActive.bind(this));

        this.service.getCharacteristic(this.Characteristic.SwingMode)
            .onGet(this.onGetSwingMode.bind(this))
            .onSet(this.onSetSwingMode.bind(this));

        this.service.getCharacteristic(this.Characteristic.RotationSpeed)
            .onGet(this.onGetSpeed.bind(this))
            .onSet(this.onSetSpeed.bind(this));
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

    onGetSwingMode () {
        return this.Characteristic.SwingMode.SWING_DISABLED;
    }

    onSetSwingMode (value) {
        this.command = '0AFF';
        this.msg = 'Swing mode';
        httpRequest(this.IP, `${this.path}${this.command}`, value, this.currentSwing, this.msg);
        return this.currentSwing;
    }

    onGetSpeed () {
        return this.currentSpeed;
    }

    onSetSpeed (value) {
        this.command = '0BFF';
        this.msg = 'Rotation speed';
        httpRequest(this.IP, `${this.path}${this.command}`, value, this.currentSpeed, this.msg);
        return this.currentSpeed;
    }
}

module.exports = Fan;