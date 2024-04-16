#include <ESP8266WiFi.h>
#include <ESP8266WebServer.h>
#include <DHT.h>
#include <ESP8266HTTPClient.h>
#include <WiFiClient.h>

// WiFi设置
const char* ssid = "iPhone";        // WiFi名称
const char* password = "1666201454";// WiFi密码

// Web服务器和DHT传感器的设置
ESP8266WebServer server(80);        // 实例化Web服务器对象，监听80端口
#define DHTPIN D2                   // DHT传感器的数据引脚
#define DHTTYPE DHT11               // DHT传感器的类型（DHT11）
DHT dht(DHTPIN, DHTTYPE);           // 实例化DHT传感器对象

// 控制引脚设置
const int ledPin = D1;              // LED引脚
const int fanPin = D5;              // 风扇控制引脚
const int sensorPin = D7;           // 人体红外传感器引脚

// 服务器端点URL
const char* serverUrl = "http://172.20.10.2:8001/monitor/data";

void setup() {
  Serial.begin(115200);             // 开始串行通信，设置波特率为115200
  WiFi.begin(ssid, password);       // 连接到WiFi网络
  while (WiFi.status() != WL_CONNECTED) {
    delay(500);
    Serial.print(".");
  }
  Serial.println("\nWiFi connected.");
  Serial.println("IP address: ");
  Serial.println(WiFi.localIP());

  dht.begin();                      // 初始化DHT传感器
  pinMode(ledPin, OUTPUT);          // 设置LED引脚为输出模式
  pinMode(fanPin, OUTPUT);          // 设置风扇控制引脚为输出模式
  pinMode(sensorPin, INPUT);        // 设置人体红外传感器引脚为输入模式

  // 定义Web服务器的路由
  server.on("/light/on", []() {
    digitalWrite(ledPin, HIGH);
    server.send(200, "text/plain", "Light is ON");
  });
  server.on("/light/off", []() {
    digitalWrite(ledPin, LOW);
    server.send(200, "text/plain", "Light is OFF");
  });
  server.on("/fan/on", []() {
    digitalWrite(fanPin, LOW);
    server.send(200, "text/plain", "Fan is ON");
  });
  server.on("/fan/off", []() {
    digitalWrite(fanPin, HIGH);
    server.send(200, "text/plain", "Fan is OFF");
  });
  server.begin();                   // 启动Web服务器
  Serial.println("HTTP server started");
}

void loop() {
  server.handleClient();            // 处理来自客户端的请求

  float h = dht.readHumidity();     // 读取湿度值
  float t = dht.readTemperature();  // 读取温度值
  bool presenceDetected = digitalRead(sensorPin) == HIGH; // 读取人体红外传感器状态

  if (WiFi.status() == WL_CONNECTED) {
    WiFiClient client;
    HTTPClient http;
    http.begin(client, serverUrl);
    http.addHeader("Content-Type", "application/json");

    // 创建JSON格式的请求数据
    String httpRequestData = "{\"temperature\":" + String(t) + ",\"humidity\":" + String(h) + ",\"presence\":" + String(presenceDetected) + "}";
    int httpResponseCode = http.POST(httpRequestData); // 发送POST请求
    Serial.print("HTTP Response code: ");
    Serial.println(httpResponseCode);
    http.end(); // 结束HTTP连接
  }

  delay(1000); // 等待1秒后再次循环
}
