Reactive Extensions for pc-ble-driver-js library

pc-ble-driver-js library provides javascript APIs to access the Bluetooth Low Energy devices using nrf5X boards. Since almost all the
operations/APIs are asynchronous in nature, a callback argument is provided in their exposed APIs. However, this creates writing code that is
difficult to maintain and suffer from the callback hell problem.

This library makes use of RxJS (Reactive Extensions for JavaScript) to wrap pc-ble-driver-js and provide following features :

* Provide higher level functions for accessing Bluetooth low energy devices
* Functions return Observables that help with
    * Writing the asynchronus code in more maintainable way
    * Enable the Functional Reactive programming
    * Provide the possibility of better error handling which often happens because of connectivity issues over wireless
    
