import {Observable, Subscriber} from 'rxjs';
import {
  Adapter,
  AdapterFactory,
  AdapterOpenOptions,
  ScanParameters,
  ConnectionOptions,
  Device,
  Service,
  Characteristic
} from 'pc-ble-driver-js';

function toHexString(byteArray) {
  return byteArray.map(function(byte) {
    return ('0' + (byte & 0xFF).toString(16)).slice(-2);
  }).join('');
}

export class ScanError extends Error {
  constructor(public driverError: any) {
    super();
  }
}

export class ConnectError extends Error {
  constructor(public driverError: any, public device: Device) {
    super();
  }
};

export class DisconnectError extends Error {
  constructor(public driverError: any, public device: Device) {
    super();
  }
};

export class ServiceDiscoveryError extends Error {
  constructor(public driverError: any, public device: Device) {
    super();
  }
}

export class CharacteristicDiscoveryError extends Error {
  constructor(public driverError: any, public service: Service) {
    super();
  }
}

export class ReadCharacteristicError extends Error {
  constructor(public driverError: any, public ch: Characteristic) {
    super();
  }
}

export enum AdapterFactoryEventType {
  Added,
  Removed
}

export interface AdapterEvent {
  adapter: Adapter;
  eventType: AdapterFactoryEventType;
}

export function adapterFactoryObservable(
  adapterFactory: AdapterFactory): Observable<AdapterEvent> {

  return Observable.create((obs: Subscriber<AdapterEvent>) => {

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

export function openAdapterObservable(adapter: Adapter,
  openOptions?: AdapterOpenOptions): Observable<Adapter> {

  return Observable.create((obs: Subscriber<Adapter>) => {

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

export function closeAdapterObservable(adapter: Adapter) {
  return Observable.create((obs: Subscriber<Adapter>) => {

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

export function startScanDevicesObservable(adapter: Adapter,
  scanOptions: ScanParameters): Observable<Device> {

  return Observable.create((obs: Subscriber<Device>) => {

    function onDeviceDiscovered(device: Device) {
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


export function stopScanDevicesObservable(adapter: Adapter): Observable<void> {
  return Observable.create((obs: Subscriber<void>) => {

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
      } else {
        obs.next();
      }
    });

    return () => {

    };
  });
}

export function discoverServicesObservable(adapter: Adapter, device: Device): Observable<Service[]> {
  return Observable.create((obs: Subscriber<Service[]>) => {
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

export function discoverCharacteristicObservable(adapter: Adapter,
  service: Service): Observable<Characteristic[]> {

  return Observable.create((obs: Subscriber<Characteristic[]>) => {
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

export function readCharacteristicObservable(adapter: Adapter,
  characteristic: Characteristic): Observable<String> {

  return Observable.create((obs: Subscriber<string>) => {

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

export function connectDeviceObservable(adapter: Adapter, device: Device,
  options: ConnectionOptions): Observable<Device> {

  return Observable.create((obs: Subscriber<Device>) => {

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

export function disconnectDeviceObservable(adapter: Adapter, device: Device): Observable<void> {

  return Observable.create((obs: Subscriber<void>) => {
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
