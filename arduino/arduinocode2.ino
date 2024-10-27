#include <ESP8266WiFi.h>
#include <FirebaseESP8266.h>
#include <Servo.h>
#include <ArduinoJson.h>
#include <vector>

#define WIFI_SSID "ACTFIBERNET"
#define WIFI_PASSWORD "Tsig@2024"

#define directionPin1 D0  
#define directionPin2 D1
#define stepPin1 D3
#define stepPin2 D4
#define leftSwitchPin D5
#define downSwitchPin D6

long int stepsPerRevolution = 6400;
long int stepDelay = 25;
int flag = 1;

Servo S1;
FirebaseData firebaseData;
FirebaseConfig firebaseConfig;
FirebaseAuth firebaseAuth;

int rackNumbers[9]; // Array to hold the split rack numbers
char Command = '0';

std::vector<String> userIds;
struct UserData {
  String rackNo;
  String quantity;
};
std::vector<UserData> usersData;

void setup() {
  Serial.begin(9600);
  WiFi.begin(WIFI_SSID, WIFI_PASSWORD);

  while (WiFi.status() != WL_CONNECTED) {
    Serial.print("..");
    delay(200);
  }
  Serial.println();
  Serial.println("NodeMCU is Connected!");
  Serial.println(WiFi.localIP());

  firebaseConfig.host = "https://robofetch-428113-default-rtdb.asia-southeast1.firebasedatabase.app";
  firebaseConfig.signer.tokens.legacy_token = "KxzaCogJGrqoQCp9YoY4PjlC2nVdliihZTy6MW1w";

  Firebase.reconnectWiFi(true);
  firebaseData.setBSSLBufferSize(1024, 1024);

  Firebase.begin(&firebaseConfig, &firebaseAuth);

  S1.attach(D8);
  S1.write(0);

  pinMode(directionPin1, OUTPUT);
  pinMode(directionPin2, OUTPUT);
  pinMode(stepPin1, OUTPUT);
  pinMode(stepPin2, OUTPUT);
  pinMode(leftSwitchPin, INPUT_PULLUP);
  pinMode(downSwitchPin, INPUT_PULLUP);

  homing();
  Serial.println("Enter command to start. Use format 'column,row' (e.g., 0,1) or 0 to stop.");
}

void loop() {
  fetchUserData();  // Fetch user data at the beginning of each loop
  
  // Process the fetched data
  for (size_t i = 0; i < userIds.size(); i++) {
    String rackNo = usersData[i].rackNo;
    String quantity = usersData[i].quantity;
    
    Serial.print("Processing User ID: ");
    Serial.println(userIds[i]);
    Serial.print("Rack Number: ");
    Serial.println(rackNo);
    Serial.print("Quantity: ");
    Serial.println(quantity);
    
    splitRackNumbers(rackNo);
  }

  if (Serial.available() > 0) {
    String input = Serial.readStringUntil('\n');
    input.trim();

    if (input.equals("0")) {
      Serial.println("Stopping...");
      return;
    }

    int commaIndex = input.indexOf(',');
    if (commaIndex > 0) {
      String columnStr = input.substring(0, commaIndex);
      String rowStr = input.substring(commaIndex + 1);

      int column = columnStr.toInt();
      int row = rowStr.toInt();

      if (column >= 0 && column <= 2 && row >= 1 && row <= 9) {
        Serial.print("Received Command - Column: ");
        Serial.print(column);
        Serial.print(", Row: ");
        Serial.println(row);
        moveToPosition(row, column);
      } else {
        Serial.println("Invalid input. Please enter a valid column (0-2) and row (1-9).");
      }
    } else {
      Serial.println("Invalid input format. Use 'column,row'.");
    }
  }

  delay(5000);  // Wait for 5 seconds before the next fetch
}

void fetchUserData() {
  userIds.clear();
  usersData.clear();
  
  // Fetch all user IDs
  if (Firebase.getJSON(firebaseData, "/")) {
    FirebaseJson &json = firebaseData.jsonObject();
    FirebaseJsonData jsonData;
    size_t count = json.iteratorBegin();
    
    String key, value;
    int type;
    
    for (size_t i = 0; i < count; i++) {
      json.iteratorGet(i, type, key, value);
      if (type == FirebaseJson::JSON_OBJECT) {
        userIds.push_back(key);
      }
    }
    json.iteratorEnd();
    
    // Fetch rackNo and quantity for each user
    for (const String &userId : userIds) {
      UserData userData;
      
      if (Firebase.getString(firebaseData, "/" + userId + "/rackNo")) {
        userData.rackNo = firebaseData.stringData();
      } else {
        Serial.println("Failed to get rackNo for user " + userId);
        userData.rackNo = "";
      }
      
      if (Firebase.getString(firebaseData, "/" + userId + "/quantity")) {
        userData.quantity = firebaseData.stringData();
      } else {
        Serial.println("Failed to get quantity for user " + userId);
        userData.quantity = "";
      }
      
      usersData.push_back(userData);
    }
    
    // Print fetched data
    Serial.println("Fetched User Data:");
    for (size_t i = 0; i < userIds.size(); i++) {
      Serial.println("User ID: " + userIds[i]);
      Serial.println("  Rack No: " + usersData[i].rackNo);
      Serial.println("  Quantity: " + usersData[i].quantity);
    }
  } else {
    Serial.println("Failed to fetch user data: " + firebaseData.errorReason());
  }
}

void splitRackNumbers(String rackNo) {
  int index = 0;
  int startIndex = 0;

  while (startIndex < rackNo.length() && index < 9) {
    int commaIndex = rackNo.indexOf(',', startIndex);
    if (commaIndex == -1) {
      // If no more commas, get the last number
      rackNumbers[index++] = rackNo.substring(startIndex).toInt();
      break;
    }
    rackNumbers[index++] = rackNo.substring(startIndex, commaIndex).toInt();
    startIndex = commaIndex + 1;
  }

  // Execute rack commands one by one
  for (int i = 0; i < index; i++) {
    int column = rackNumbers[i] % 3;
    int row = rackNumbers[i] / 3;

    if (column == 0)
      column = 2;
    else
      column -= 1;

    Serial.print("Moving to Column: ");
    Serial.print(column);
    Serial.print(", Row: ");
    Serial.println(row);

    moveToPosition(row, column);  // Move to the specific position
    delay(1000);
  }
  flag = 0;
}

void moveToPosition(int row, int column) {
  // Move motors forward
  for (int i = 0; i < row; i++) {
    moveMotorUp();
  }
  delay(1000);
  for (int i = 0; i < column; i++) {
    moveMotorLeft();
  }
  S1.write(90);
  delay(500);
  S1.write(0);
  delay(500);
  for (int i = 0; i < row; i++) {
    moveMotorDown();
  }
  delay(1000);
  for (int i = 0; i < column; i++) {
    moveMotorRight();
  }
}

void moveMotorUp() {
  for (int j = 0; j < stepsPerRevolution * 3; j++) {
    rotateMotor1(LOW);
    rotateMotor2(HIGH);
  }
}

void moveMotorDown() {
  for (int j = 0; j < stepsPerRevolution * 3; j++) {
    rotateMotor1(HIGH);
    rotateMotor2(LOW);
  }
}

void moveMotorRight() {
  for (int j = 0; j < stepsPerRevolution * 3; j++) {
    rotateMotor1(LOW);
    rotateMotor2(LOW);
  }
}

void moveMotorLeft() {
  for (int j = 0; j < stepsPerRevolution * 3; j++) {
    rotateMotor1(HIGH);
    rotateMotor2(HIGH);
  }
}

void homing() {
  while (digitalRead(leftSwitchPin) == LOW) {
    rotateMotor1(LOW);
    rotateMotor2(LOW);
  }
  stopMotors();
  delay(2000);
}

void rotateMotor1(bool state) {
  digitalWrite(directionPin1, state);
  digitalWrite(stepPin1, HIGH);
  delayMicroseconds(stepDelay);
  digitalWrite(stepPin1, LOW);
  delayMicroseconds(stepDelay);
}

void rotateMotor2(bool state) {
  digitalWrite(directionPin2, state);
  digitalWrite(stepPin2, HIGH);
  delayMicroseconds(stepDelay);
  digitalWrite(stepPin2, LOW);
  delayMicroseconds(stepDelay);
}

void stopMotors() {
  digitalWrite(directionPin1, LOW);
  digitalWrite(directionPin2, LOW);
}