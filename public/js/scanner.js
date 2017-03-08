document.getElementById("scan").addEventListener("click", function(evt) {
	navigator.bluetooth.requestDevice({filters:[{namePrefix: "Puck.js"}]})
	  .then(function(device) {
	    console.log(device);
	    return device.gatt.connect();
	  })
	  .then(function(server) {
	    console.log(server);
	    return server.getPrimaryService(BluetoothUUID.canonicalUUID(0x180F));
	  })
	  .then(function(service) {
	    // Step 4: get the Characteristic
			console.log(`service ${JSON.stringify(service)}`);
	    return service.getCharacteristic(0x2A29);
	  })
	  .then(function(characteristic) {
			console.log(`characteristic ${JSON.stringify(characteristic)}`);
	    // Step 5: Write to the characteristic
	    var data = new Uint8Array([0xbb, 0x25, 0x05, 0x44]);
	    return characteristic.readValue();
	  })
	  .catch(function(error) {
	     // And of course: error handling!
			 console.log(`error ${JSON.stringify(error)}`);
	     console.error('Connection failed!', error);
	});
});
