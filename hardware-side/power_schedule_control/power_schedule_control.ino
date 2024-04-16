#include <ESP8266WiFi.h>
#include <ESP8266WebServer.h>

const char* ssid = "iPhone";
const char* password = "1666201454";
ESP8266WebServer server(80);

const int relayPin = D5; // 继电器连接的GPIO端口

void setup() {
  Serial.begin(115200);
  pinMode(relayPin, OUTPUT);
  digitalWrite(relayPin, LOW); // 默认关闭

  WiFi.begin(ssid, password);
  while (WiFi.status() != WL_CONNECTED) {
    delay(500);
    Serial.print(".");
  }
  Serial.println("");
  Serial.print("Connected to WiFi network with IP Address: ");
  Serial.println(WiFi.localIP());

  server.on("/power/on", []() {
    digitalWrite(relayPin, LOW);
    server.send(200, "text/plain", "Power ON");
  });

  server.on("/power/off", []() {
    digitalWrite(relayPin, HIGH);
    server.send(200, "text/plain", "Power OFF");
  });

  server.begin();
}

void loop() {
  server.handleClient();
}
