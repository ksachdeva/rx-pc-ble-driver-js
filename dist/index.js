"use strict";
const rxjs_1 = require('rxjs');
function toHexString(byteArray) {
    return byteArray.map(function (byte) {
        return ('0' + (byte & 0xFF).toString(16)).slice(-2);
    }).join('');
}
(function (AdapterFactoryEventType) {
    AdapterFactoryEventType[AdapterFactoryEventType["Added"] = 0] = "Added";
    AdapterFactoryEventType[AdapterFactoryEventType["Removed"] = 1] = "Removed";
})(exports.AdapterFactoryEventType || (exports.AdapterFactoryEventType = {}));
var AdapterFactoryEventType = exports.AdapterFactoryEventType;
function adapaterFactoryObservable(adapterFactory) {
    return rxjs_1.Observable.create((obs) => {
        function onAdded(adapter) {
            obs.next({
                adapter,
                eventType: AdapterFactoryEventType.Added
            });
        }
        function onRemoved(adapter) {
            obs.next({
                adapter,
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
exports.adapaterFactoryObservable = adapaterFactoryObservable;
function openAdapaterObservable(adapter, openOptions) {
    return rxjs_1.Observable.create((obs) => {
        adapter.open(openOptions, (error) => {
            if (error) {
                obs.error(error);
                return;
            }
            obs.next(adapter);
        });
        return () => {
        };
    });
}
exports.openAdapaterObservable = openAdapaterObservable;
function startScanDevicesObservable(adapter, scanOptions) {
    return rxjs_1.Observable.create((obs) => {
        function onDeviceDiscovered(device) {
            obs.next(device);
        }
        adapter.on('deviceDiscovered', onDeviceDiscovered);
        adapter.startScan(scanOptions, (error) => {
            if (error) {
                obs.error(error);
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
                obs.error(err);
                return;
            }
            services.forEach((s) => obs.next(s));
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
                obs.error(err);
                return;
            }
            chars.forEach(c => obs.next(c));
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
                obs.error(err);
                return;
            }
            obs.next(toHexString(value));
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
        }
        adapter.on('deviceConnected', onDeviceConnected);
        adapter.connect(device.address, options, (err) => {
            if (err) {
                obs.error(err);
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
                obs.error(err);
                return;
            }
            obs.next();
        });
        return () => {
        };
    });
}
exports.disconnectDeviceObservable = disconnectDeviceObservable;
//# sourceMappingURL=index.js.map