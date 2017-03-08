document.getElementById("scan").addEventListener("click", function(evt) {
	var namePrefix = "Puckjs";
	var optionalServices = [
		BluetoothUUID.canonicalUUID(0x180F),
		BluetoothUUID.canonicalUUID(0x180A),
		BluetoothUUID.canonicalUUID(0x1809),
		BluetoothUUID.canonicalUUID(0x1800)
	];
	var options = {filters:[{namePrefix:namePrefix}], optionalServices:optionalServices};
	console.log(`options ${options}`);
	navigator.bluetooth.requestDevice(options)
	  .then(function(device) {
	    console.log(device);
	    return device.gatt.connect();
	  })
	  .then(function(server) {
	    console.log(server);
	    return server.getPrimaryService();
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
