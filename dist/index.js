"use strict";
const rxjs_1 = require('rxjs');
function toHexString(byteArray) {
    return byteArray.map(function (byte) {
        return ('0' + (byte & 0xFF).toString(16)).slice(-2);
    }).join('');
}
class ScanError extends Error {
    constructor(driverError) {
        super();
        this.driverError = driverError;
    }
}
exports.ScanError = ScanError;
class ConnectError extends Error {
    constructor(driverError, device) {
        super();
        this.driverError = driverError;
        this.device = device;
    }
}
exports.ConnectError = ConnectError;
;
class DisconnectError extends Error {
    constructor(driverError, device) {
        super();
        this.driverError = driverError;
        this.device = device;
    }
}
exports.DisconnectError = DisconnectError;
;
class ServiceDiscoveryError extends Error {
    constructor(driverError, device) {
        super();
        this.driverError = driverError;
        this.device = device;
    }
}
exports.ServiceDiscoveryError = ServiceDiscoveryError;
class CharacteristicDiscoveryError extends Error {
    constructor(driverError, service) {
        super();
        this.driverError = driverError;
        this.service = service;
    }
}
exports.CharacteristicDiscoveryError = CharacteristicDiscoveryError;
class ReadCharacteristicError extends Error {
    constructor(driverError, ch) {
        super();
        this.driverError = driverError;
        this.ch = ch;
    }
}
exports.ReadCharacteristicError = ReadCharacteristicError;
(function (AdapterFactoryEventType) {
    AdapterFactoryEventType[AdapterFactoryEventType["Added"] = 0] = "Added";
    AdapterFactoryEventType[AdapterFactoryEventType["Removed"] = 1] = "Removed";
})(exports.AdapterFactoryEventType || (exports.AdapterFactoryEventType = {}));
var AdapterFactoryEventType = exports.AdapterFactoryEventType;
function adapterFactoryObservable(adapterFactory) {
    return rxjs_1.Observable.create((obs) => {
        function onAdded(adapter) {
            obs.next({
                adapter: adapter,
                eventType: AdapterFactoryEventType.Added
            });
        }
        function onRemoved(adapter) {
            obs.next({
                adapter: adapter,
                eventType: AdapterFactoryEventType.Removed
            });
        }
        adapterFactory.on('added', onAdded);
        adapterFactory.on('removed', onRemoved);
        return () => {
            adapterFactory.removeListener('added', onAdded);
            adapterFactory.removeListener('removed', onRemoved);
        };
    });
}
exports.adapterFactoryObservable = adapterFactoryObservable;
function openAdapterObservable(adapter, openOptions) {
    return rxjs_1.Observable.create((obs) => {
        adapter.open(openOptions, (error) => {
            if (error) {
                obs.error(error);
                return;
            }
            obs.next(adapter);
            obs.complete();
        });
        return () => {
        };
    });
}
exports.openAdapterObservable = openAdapterObservable;
function closeAdapterObservable(adapter) {
    return rxjs_1.Observable.create((obs) => {
        adapter.close((error) => {
            if (error) {
                obs.error(error);
                return;
            }
            obs.next(adapter);
            obs.complete();
        });
        return () => {
        };
    });
}
exports.closeAdapterObservable = closeAdapterObservable;
function startScanDevicesObservable(adapter, scanOptions) {
    return rxjs_1.Observable.create((obs) => {
        function onDeviceDiscovered(device) {
            obs.next(device);
        }
        adapter.on('deviceDiscovered', onDeviceDiscovered);
        adapter.startScan(scanOptions, (error) => {
            if (error) {
                obs.error(new ScanError(error));
                return;
            }
        });
        return () => {
            adapter.removeListener('deviceDiscovered', onDeviceDiscovered);
        };
    });
}
exports.startScanDevicesObservable = startScanDevicesObservable;
function stopScanDevicesObservable(adapter) {
    return rxjs_1.Observable.create((obs) => {
        adapter.getState((err, state) => {
            if (state.scanning === true) {
                adapter.stopScan((error) => {
                    if (error) {
                        obs.error(error);
                        return;
                    }
                    obs.next();
                    obs.complete();
                });
            }
            else {
                obs.next();
            }
        });
        return () => {
        };
    });
}
exports.stopScanDevicesObservable = stopScanDevicesObservable;
function discoverServicesObservable(adapter, device) {
    return rxjs_1.Observable.create((obs) => {
        adapter.getServices(device.instanceId, (err, services) => {
            if (err) {
                obs.error(new ServiceDiscoveryError(err, device));
                return;
            }
            obs.next(services);
            obs.complete();
        });
        return () => {
        };
    });
}
exports.discoverServicesObservable = discoverServicesObservable;
function discoverCharacteristicObservable(adapter, service) {
    return rxjs_1.Observable.create((obs) => {
        adapter.getCharacteristics(service.instanceId, (err, chars) => {
            if (err) {
                obs.error(new CharacteristicDiscoveryError(err, service));
                return;
            }
            obs.next(chars);
            obs.complete();
        });
        return () => {
        };
    });
}
exports.discoverCharacteristicObservable = discoverCharacteristicObservable;
function readCharacteristicObservable(adapter, characteristic) {
    return rxjs_1.Observable.create((obs) => {
        adapter.readCharacteristicValue(characteristic.instanceId, (err, value) => {
            if (err) {
                obs.error(new ReadCharacteristicError(err, characteristic));
                return;
            }
            obs.next(toHexString(value));
            obs.complete();
        });
        return () => {
        };
    });
}
exports.readCharacteristicObservable = readCharacteristicObservable;
function connectDeviceObservable(adapter, device, options) {
    return rxjs_1.Observable.create((obs) => {
        function onDeviceConnected(connectedDevice) {
            obs.next(connectedDevice);
            obs.complete();
        }
        adapter.on('deviceConnected', onDeviceConnected);
        adapter.connect(device.address, options, (err) => {
            if (err) {
                obs.error(new ConnectError(err, device));
                return;
            }
        });
        return () => {
            adapter.removeListener('deviceConnected', onDeviceConnected);
        };
    });
}
exports.connectDeviceObservable = connectDeviceObservable;
function disconnectDeviceObservable(adapter, device) {
    return rxjs_1.Observable.create((obs) => {
        adapter.disconnect(device.instanceId, (err) => {
            if (err) {
                obs.error(new DisconnectError(err, device));
                return;
            }
            obs.next();
            obs.complete();
        });
        return () => {
        };
    });
}
exports.disconnectDeviceObservable = disconnectDeviceObservable;
//# sourceMappingURL=index.js.map