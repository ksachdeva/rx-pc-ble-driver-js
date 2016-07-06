Reactive Extensions for pc-ble-driver-js library

[pc-ble-driver-js](https://github.com/NordicSemiconductor/pc-ble-driver-js) library provides javascript APIs to access the Bluetooth Low Energy devices using nrf5X boards.

Since almost all the operations/APIs are asynchronous in nature, a callback argument is provided in their exposed APIs. However, this results in code that is difficult to maintain and suffer from the callback hell problem.

This library makes use of [RxJS](https://github.com/ReactiveX/rxjs) (Reactive Extensions for JavaScript) to wrap pc-ble-driver-js and provide following features :

* Provide higher level functions for accessing Bluetooth low energy devices
* Functions return Observable that helps with
    * Writing the asynchronous code in a cleaner and maintainable way
    * Using the Functional Reactive programming (FRP) style
    * Enabling the possibility of better error handling which often happens because of connectivity issues over wireless


## Example

[pc-ble-driver-js-examples](https://github.com/ksachdeva/pc-ble-driver-js-examples/tree/master/nrf5x_apps_rxjs/example1) repository has an example that shows how to use this module.
