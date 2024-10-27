#define directionPin1 2  // Update these to appropriate Arduino pins
#define directionPin2 3
#define stepPin1 4
#define stepPin2 5
#define leftSwitchPin 6
#define downSwitchPin 7

#include <Servo.h>
Servo S1;

long int stepsPerRevolution = 6400;
long int stepDelay = 25; // Adjust this value for speed control

void setup() {
  S1.attach(9);
  S1.write(0);
  Serial.begin(9600);
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
  if (Serial.available() > 0) {
    String input = Serial.readStringUntil('\n'); // Read until newline
    input.trim(); // Trim whitespace

    if (input.equals("0")) {
      Serial.println("Stopping...");
      return; // Stop command
    }

    int commaIndex = input.indexOf(',');
    if (commaIndex > 0) {
      String columnStr = input.substring(0, commaIndex);
      String rowStr = input.substring(commaIndex + 1);

      int column = columnStr.toInt();
      int row = rowStr.toInt();

      // Validate the input
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
}

void moveToPosition(int row, int column) {
  switch (column) {
    case 0:
      // Column 0
      switch (row) {
        case 1:
          // Row 1: Servo movement only
          S1.write(90);
          delay(1000);
          S1.write(0);
          break;
        case 2:
          delay(2000);
          for (long int i = 0; i < 3 * stepsPerRevolution; i++) {
            rotateMotor1(HIGH);
            rotateMotor2(HIGH);
          }
          delay(2000);
          S1.write(90);
          delay(1000);
          S1.write(0);
          delay(2000);
          for (long int i = 0; i < 3 * stepsPerRevolution; i++) {
            rotateMotor1(LOW);
            rotateMotor2(LOW);
          }
          break;
        case 3:
          delay(2000);
          for (long int i = 0; i < 6 * stepsPerRevolution; i++) {
            rotateMotor1(HIGH);
            rotateMotor2(HIGH);
          }
          delay(2000);
          S1.write(90);
          delay(1000);
          S1.write(0);
          delay(2000);
          for (long int i = 0; i < 6 * stepsPerRevolution; i++) {
            rotateMotor1(LOW);
            rotateMotor2(LOW);
          }
          break;
      }
      break;

    case 1:
      // Column 1
      switch (row) {
        case 1:
          delay(3000);
          for (long int i = 0; i < 5 * stepsPerRevolution; i++) {
            rotateMotor1(LOW);
            rotateMotor2(HIGH);
          }
          delay(2000);
          S1.write(90);
          delay(1000);
          S1.write(0);
          delay(3000);
          for (long int i = 0; i < 5 * stepsPerRevolution; i++) {
            rotateMotor1(HIGH);
            rotateMotor2(LOW);
          }
          break;
        case 2:
          delay(2000);
          for (long int i = 0; i < 5 * stepsPerRevolution; i++) {
            rotateMotor1(LOW);
            rotateMotor2(HIGH);
          }
          delay(2000);
          for (long int i = 0; i < 3 * stepsPerRevolution; i++) {
            rotateMotor1(HIGH);
            rotateMotor2(HIGH);
          }
          delay(2000);
          S1.write(90);
          delay(1000);
          S1.write(0);
          delay(2000);
          for (long int i = 0; i < 3 * stepsPerRevolution; i++) {
            rotateMotor1(LOW);
            rotateMotor2(LOW);
          }
          delay(2000);
          for (long int i = 0; i < 5 * stepsPerRevolution; i++) {
            rotateMotor1(HIGH);
            rotateMotor2(LOW);
          }
          break;
        case 3:
          delay(2000);
          for (long int i = 0; i < 5 * stepsPerRevolution; i++) {
            rotateMotor1(LOW);
            rotateMotor2(HIGH);
          }
          delay(2000);
          for (long int i = 0; i < 6 * stepsPerRevolution; i++) {
            rotateMotor1(HIGH);
            rotateMotor2(HIGH);
          }
          delay(2000);
          S1.write(90);
          delay(1000);
          S1.write(0);
          for (long int i = 0; i < 6 * stepsPerRevolution; i++) {
            rotateMotor1(LOW);
            rotateMotor2(LOW);
          }
          delay(2000);
          for (long int i = 0; i < 5 * stepsPerRevolution; i++) {
            rotateMotor1(HIGH);
            rotateMotor2(LOW);
          }
          break;
      }
      break;

    case 2:
      delay(2000);
      switch (row) {
        case 1:
          // Row 1
          for (long int i = 0; i < 6 * stepsPerRevolution; i++) {
            rotateMotor1(LOW);
            rotateMotor2(HIGH);
          }
          delay(2000);
          S1.write(90);
          delay(1000);
          S1.write(0);
          for (long int i = 0; i < 6 * stepsPerRevolution; i++) {
            rotateMotor1(HIGH);
            rotateMotor2(LOW);
          }
          break;
        case 2:
          delay(2000);
          for (long int i = 0; i < 6 * stepsPerRevolution; i++) {
            rotateMotor1(LOW);
            rotateMotor2(HIGH);
          }
          delay(2000);
          for (long int i = 0; i < 3 * stepsPerRevolution; i++) {
            rotateMotor1(HIGH);
            rotateMotor2(HIGH);
          }
          delay(2000);
          S1.write(90);
          delay(1000);
          S1.write(0);
          for (long int i = 0; i < 3 * stepsPerRevolution; i++) {
            rotateMotor1(LOW);
            rotateMotor2(LOW);
          }
          delay(2000);
          for (long int i = 0; i < 6 * stepsPerRevolution; i++) {
            rotateMotor1(HIGH);
            rotateMotor2(LOW);
          }
          break;
        case 3:
          delay(2000);
          for (long int i = 0; i < 6 * stepsPerRevolution; i++) {
            rotateMotor1(LOW);
            rotateMotor2(HIGH);
          }
          delay(2000);
          for (long int i = 0; i < 6 * stepsPerRevolution; i++) {
            rotateMotor1(HIGH);
            rotateMotor2(HIGH);
          }
          delay(2000);
          S1.write(90);
          delay(1000);
          S1.write(0);
          for (long int i = 0; i < 6 * stepsPerRevolution; i++) {
            rotateMotor1(LOW);
            rotateMotor2(LOW);
          }
          delay(2000);
          for (long int i = 0; i < 6 * stepsPerRevolution; i++) {
            rotateMotor1(HIGH);
            rotateMotor2(LOW);
          }
          break;
      }
      break;
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
  delayMicroseconds(stepDelay); // Use the variable for delay
  digitalWrite(stepPin1, LOW);
  delayMicroseconds(stepDelay); // Use the variable for delay
}

void rotateMotor2(bool state) {
  digitalWrite(directionPin2, state);
  digitalWrite(stepPin2, HIGH);
  delayMicroseconds(stepDelay); // Use the variable for delay
  digitalWrite(stepPin2, LOW);
  delayMicroseconds(stepDelay); // Use the variable for delay
}

void stopMotors() {
  digitalWrite(directionPin1, LOW);
  digitalWrite(directionPin2, LOW);
}