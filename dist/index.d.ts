import { Observable } from 'rxjs';
import { Adapter, AdapterFactory, AdapterOpenOptions, ScanParameters, ConnectionOptions, Device, Service, Characteristic } from 'pc-ble-driver-js';
export declare class ScanError extends Error {
    driverError: any;
    constructor(driverError: any);
}
export declare class ConnectError extends Error {
    driverError: any;
    device: Device;
    constructor(driverError: any, device: Device);
}
export declare class DisconnectError extends Error {
    driverError: any;
    device: Device;
    constructor(driverError: any, device: Device);
}
export declare class ServiceDiscoveryError extends Error {
    driverError: any;
    device: Device;
    constructor(driverError: any, device: Device);
}
export declare class CharacteristicDiscoveryError extends Error {
    driverError: any;
    service: Service;
    constructor(driverError: any, service: Service);
}
export declare class ReadCharacteristicError extends Error {
    driverError: any;
    ch: Characteristic;
    constructor(driverError: any, ch: Characteristic);
}
export declare enum AdapterFactoryEventType {
    Added = 0,
    Removed = 1,
}
export interface AdapterEvent {
    adapter: Adapter;
    eventType: AdapterFactoryEventType;
}
export declare function adapterFactoryObservable(adapterFactory: AdapterFactory): Observable<AdapterEvent>;
export declare function openAdapterObservable(adapter: Adapter, openOptions?: AdapterOpenOptions): Observable<Adapter>;
export declare function closeAdapterObservable(adapter: Adapter): any;
export declare function startScanDevicesObservable(adapter: Adapter, scanOptions: ScanParameters): Observable<Device>;
export declare function stopScanDevicesObservable(adapter: Adapter): Observable<void>;
export declare function discoverServicesObservable(adapter: Adapter, device: Device): Observable<Service[]>;
export declare function discoverCharacteristicObservable(adapter: Adapter, service: Service): Observable<Characteristic[]>;
export declare function readCharacteristicObservable(adapter: Adapter, characteristic: Characteristic): Observable<String>;
export declare function connectDeviceObservable(adapter: Adapter, device: Device, options: ConnectionOptions): Observable<Device>;
export declare function disconnectDeviceObservable(adapter: Adapter, device: Device): Observable<void>;
