#include <ESP8266WiFi.h>
#include <ESP8266HTTPClient.h>
#include <WiFiClient.h>
#include <DHT.h>

// 定义DHT传感器的引脚和类型
#define DHTPIN D2         // DHT的数据引脚连接到ESP8266的D1
#define DHTTYPE DHT11     // 使用DHT11传感器
DHT dht(DHTPIN, DHTTYPE);

// WiFi设置
const char* ssid = "iPhone"; // 更改为你的WiFi名称
const char* password = "1666201454"; // 更改为你的WiFi密码

// 服务器端点
const char* serverUrl = "http://172.20.10.2:8001/monitor/data";

// HC-SR501连接到的针脚
const int sensorPin = D7;

void setup() {
  Serial.begin(115200);
  pinMode(sensorPin, INPUT);
  WiFi.begin(ssid, password);
  dht.begin();

  while (WiFi.status() != WL_CONNECTED) {
    delay(1000);
    Serial.println("Connecting to WiFi...");
  }
}

void loop() {
  // 读取温湿度值
  float h = dht.readHumidity();
  float t = dht.readTemperature();
  
  // 检测人体红外传感器
  bool presenceDetected = digitalRead(sensorPin) == HIGH;

  if (WiFi.status() == WL_CONNECTED) {
    WiFiClient client;
    HTTPClient http;
    http.begin(client, serverUrl);
    http.addHeader("Content-Type", "application/json");

    String httpRequestData = "{\"temperature\":" + String(t) + ", \"humidity\":" + String(h) + ", \"presence\":" + presenceDetected + "}";
    int httpResponseCode = http.POST(httpRequestData);

    Serial.print("HTTP Response code: ");
    Serial.println(httpResponseCode);
    http.end();
  }

  delay(3000); // 3秒后再次检测
}
