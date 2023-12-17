const mqtt = require("mqtt");

let options = {
  host: "d25bcff68c4b4d639a0bc7adad7240f4.s2.eu.hivemq.cloud",
  port: 8883,
  protocol: "mqtts",
  username: "Mubashir",
  password: "Mubbi@hivemq061",
};

let client = mqtt.connect(options);

client.on("connect", function () {
  console.log("Connected");
  client.subscribe("nodemcu/control");
});

client.on("error", function (error) {
  console.log(error);
});

client.on("message", function (topic, message) {
  console.log("Received message: ", topic, message.toString());
  if (message.toString() == "ON") {
    console.log("Turning LED ON");
  } else if (message.toString() == "OFF") {
    console.log("Turning LED OFF");
  }
});

function controlLED(command) {
  client.publish("nodemcu/control", command);
}

for (i = 0; i <= 2; i++) {
  
  controlLED("1");
}
