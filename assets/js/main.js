var leds = {
    red: {
        on: false,
        color: "red",
        name: "LED1"
    },
    green: {
        on: false,
        color: "green",
        name: "LED2"
    },
    blue: {
        on: false,
        color: "blue",
        name: "LED3"
    }
};
var connection;
var paths = document.getElementsByTagName('path');

for (var i = 0, m = paths.length; i < m; i++) {
    var path = paths[i];
    path.style = "cursor:pointer;fill:#BBB";
    path.addEventListener("click", function(event) {
        var led = leds[event.target.id];
        var ledId = event.target.id;
        // console.log(`leds ${JSON.stringify(leds)}`);
        // console.log(`led ${led}`);
        led.on = !led.on;
        var cmd = `${led.name}.${led.on?'set()':'reset()'};\n`;
        if (led.on) {
            document.getElementById(ledId).style.fill = led.color;
        } else {
            document.getElementById(ledId).style.fill = "#444";
        }
				connection.write(cmd);
        // Puck.write(cmd, function(res) {
        //     console.log(`cmd ${cmd} ${res}`);
        // });
    });
};

function onLine(v) {
    console.log("Received: "+JSON.stringify(v));
}

document.getElementById("connect").addEventListener("click", function(evt) {
	  if (connection) {
	      connection.close();
	      connection = undefined;
	  }
    Puck.connect(function(c) {
        if (!c) {
            alert("Couldn't connect!");
            return;
        }
        connection = c;
        // Handle the data we get back, and call 'onLine'
        // whenever we get a line
        var buf = "";
        connection.on("data", function(d) {
            buf += d;
            var i = buf.indexOf("\n");
            while (i >= 0) {
                onLine(buf.substr(0, i));
                buf = buf.substr(i + 1);
                i = buf.indexOf("\n");
            }
        });
        // First, reset Puck.js
        connection.write("reset();\n", function() {
            connection.write(`setWatch(function() {
							Bluetooth.println(JSON.stringify({button:true}));
						}, BTN, {edge:\"rising\", debounce:50, repeat:true});\n`);
        });
    });
});
