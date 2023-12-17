#include <ESP8266WiFi.h>
#include <PubSubClient.h>
#include <time.h>
#include <TZ.h>
#include <FS.h>
#include <LittleFS.h>
#include <CertStoreBearSSL.h>
#include <Servo.h>


Servo myservo;
//int led1=16;

const char* ssid = "OnePlus8t";
const char* password = "Zam@1256";

const char* mqtt_server = "d25bcff68c4b4d639a0bc7adad7240f4.s2.eu.hivemq.cloud";
const int stepPin1 = D3;
const int dirPin1 = D4;
const int stepPin2 = D5;
const int dirPin2 = D6;

BearSSL::CertStore certStore;
WiFiClientSecure espClient;
PubSubClient * client;

unsigned long lastMsg = 0;

int value = 0;

void setup_wifi() {
  delay(10);
  // We start by connecting to a WiFi network
  Serial.println();
  Serial.print("Connecting to ");
  Serial.println(ssid);

  WiFi.mode(WIFI_STA);
  WiFi.begin(ssid, password);

  while (WiFi.status() != WL_CONNECTED) {
    delay(500);
    Serial.print(".");
  }

  randomSeed(micros());

  Serial.println("");
  Serial.println("WiFi connected");
  Serial.println("IP address: ");
  Serial.println(WiFi.localIP());
}


void setDateTime() {
  // You can use your own timezone, but the exact time is not used at all.
  // Only the date is needed for validating the certificates.
  configTime(TZ_Europe_Berlin, "pool.ntp.org", "time.nist.gov");

  Serial.print("Waiting for NTP time sync: ");
  time_t now = time(nullptr);
  while (now < 8 * 3600 * 2) {
    delay(100);
    Serial.print(".");
    now = time(nullptr);
  }
  Serial.println();

  struct tm timeinfo;
  gmtime_r(&now, &timeinfo);
  Serial.printf("%s %s", tzname[0], asctime(&timeinfo));
}


void callback(char* topic, byte* payload, unsigned int length) {
  //  Serial.print("Message arrived [");
  //  Serial.print(topic);
  //  Serial.print("] ");
  char msg[500];
  memset(msg, 0, sizeof(msg));  // Clear the msg array
  for (int i = 0; i < length; i++) {
    msg[i] = (char)payload[i];
    //    Serial.print((char)payload[i]);
  }
  Serial.println(msg);

  // Switch on the led11 if the first character is present

  // Switch on the 1 if the first character is present
  if (strcmp(msg, "ON") == 0) {
    digitalWrite(dirPin1, HIGH); // Enables the motor to move in a particular direction
    digitalWrite(dirPin2, HIGH);
    // Makes 200 pulses for making one full cycle rotation
    for (int x = 0; x < 200; x++) {
      digitalWrite(stepPin1, HIGH);
      digitalWrite(stepPin2, HIGH);

      delayMicroseconds(500);
      digitalWrite(stepPin1, LOW);
      digitalWrite(stepPin2, LOW);
      delayMicroseconds(500);
    }
    Serial.println("ON");
    delay(1000); // One second delay

    digitalWrite(dirPin1, LOW); //Changes the rotations direction
    digitalWrite(dirPin2, LOW); //Changes the rotations direction
    // Makes 400 pulses for making two full cycle rotation
    for (int x = 0; x < 400; x++) {
      digitalWrite(stepPin1, HIGH);
      digitalWrite(stepPin2, HIGH);
      delayMicroseconds(500);
      digitalWrite(stepPin1, LOW);
      digitalWrite(stepPin2, LOW);
      delayMicroseconds(500);
    }
    delay(1000);

  } else if (strcmp(msg, "OFF") == 0) {
    digitalWrite(dirPin1, HIGH); // Enables the motor to move in a particular direction
    digitalWrite(dirPin2, HIGH);
    // Makes 200 pulses for making one full cycle rotation
    for (int x = 0; x < 200; x++) {
      digitalWrite(stepPin1, HIGH);
      digitalWrite(stepPin2, HIGH);

      delayMicroseconds(500);
      digitalWrite(stepPin1, LOW);
      digitalWrite(stepPin2, LOW);
      delayMicroseconds(500);
    }
    Serial.println("OFF");
    delay(1000); // One second delay

    digitalWrite(dirPin1, LOW); //Changes the rotations direction
    digitalWrite(dirPin2, LOW); //Changes the rotations direction
    // Makes 400 pulses for making two full cycle rotation
    for (int x = 0; x < 400; x++) {
      digitalWrite(stepPin1, HIGH);
      digitalWrite(stepPin2, HIGH);
      delayMicroseconds(500);
      digitalWrite(stepPin1, LOW);
      digitalWrite(stepPin2, LOW);
      delayMicroseconds(500);
    }
    delay(1000);
  }
  else {
    Serial.println("Dangerous");
  }
}


void reconnect() {
  // Loop until we’re reconnected
  while (!client->connected()) {
    Serial.print("Attempting MQTT connection…");
    String clientId = "ESP8266Client - MyClient";
    // Attempt to connect
    // Insert your password
    if (client->connect(clientId.c_str(), "Mubashir", "Mubbi@hivemq061")) {
      Serial.println("connected");
      // Once connected, publish an announcement…
      //      client->publish("nodemcu/control", "hello world");
      // … and resubscribe
      client->subscribe("nodemcu/control");
    } else {
      Serial.print("failed1, rc = ");
      Serial.print(client->state());
      Serial.println(" try again in 5 seconds");
      // Wait 5 seconds before retrying
      delay(5000);
    }
  }
}


void setup() {
  // Sets the two pins as Outputs
  pinMode(stepPin1, OUTPUT);
  pinMode(dirPin1, OUTPUT);
  pinMode(stepPin2, OUTPUT);
  pinMode(dirPin2, OUTPUT);
  delay(500);
  myservo.attach(D2);
  // When opening the Serial Monitor, select 9600 Baud
  Serial.begin(9600);
  delay(500);

  LittleFS.begin();
  setup_wifi();
  setDateTime();

  pinMode(LED_BUILTIN, OUTPUT); // Initialize the led1_BUILTIN pin as an output
  digitalWrite(LED_BUILTIN, LOW);
  // you can use the insecure mode, when you want to avoid the certificates
  //espclient->setInsecure();

  int numCerts = certStore.initCertStore(LittleFS, PSTR("/certs.idx"), PSTR("/certs.ar"));
  Serial.printf("Number of CA certs read: %d\n", numCerts);
  if (numCerts == 0) {
    Serial.printf("No certs found. Did you run certs-from-mozilla.py and upload the LittleFS directory before running?\n");
    return; // Can't connect to anything w/o certs!
  }

  BearSSL::WiFiClientSecure *bear = new BearSSL::WiFiClientSecure();
  // Integrate the cert store with this connection
  bear->setCertStore(&certStore);

  client = new PubSubClient(*bear);

  client->setServer(mqtt_server, 8883);
  client->setCallback(callback);
}

void loop() {
  if (!client->connected()) {
    reconnect();
  }
  client->loop();


  unsigned long now = millis();
  if (now - lastMsg > 2000) {
    lastMsg = now;
    ++value;
    //    snprintf (msg, MSG_BUFFER_SIZE, "hello world #%ld", value);
    //    Serial.print("Publish message: ");
    //    Serial.println(msg);
    //    client->publish("nodemcu/control", msg);
  }
}
