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

// 服务器端点URL
const char* serverUrl = "http://172.20.10.2:8001/monitor/data";

// HC-SR501人体红外传感器的引脚
const int sensorPin = D7;           // 定义用于HC-SR501的引脚

void setup() {
  Serial.begin(115200);             // 开始串行通信，设置波特率为115200
  WiFi.begin(ssid, password);       // 连接到WiFi网络
  while (WiFi.status() != WL_CONNECTED) {
    delay(500);                     // 如果未连接，则等待0.5秒
    Serial.print(".");              // 打印"."表示正在尝试连接
  }
  Serial.println("\nWiFi connected."); // 连接成功后打印消息

  dht.begin();                      // 初始化DHT传感器

  pinMode(D1, OUTPUT);              // 将D1引脚设置为输出（用于LED）
  pinMode(sensorPin, INPUT);        // 将人体红外传感器的引脚设置为输入

  // 定义Web服务器的路由
  server.on("/light/on", []() {     // 当访问/light/on路径时
    digitalWrite(D1, HIGH);         // 点亮LED
    server.send(200, "text/plain", "Light is ON"); // 发送响应
  });
  server.on("/light/off", []() {    // 当访问/light/off路径时
    digitalWrite(D1, LOW);          // 关闭LED
    server.send(200, "text/plain", "Light is OFF"); // 发送响应
  });
  server.begin();                   // 启动Web服务器
  Serial.println("HTTP server started"); // 打印消息表示服务器启动
}

void loop() {
  server.handleClient();            // 处理来自客户端的请求

  float h = dht.readHumidity();     // 读取湿度值
  float t = dht.readTemperature();  // 读取温度值

  bool presenceDetected = digitalRead(sensorPin) == HIGH; // 读取人体红外传感器状态

  if (WiFi.status() == WL_CONNECTED) { // 如果WiFi连接正常
    WiFiClient client;                // 创建WiFiClient对象
    HTTPClient http;                  // 创建HTTPClient对象
    http.begin(client, serverUrl);    // 初始化HTTP连接
    http.addHeader("Content-Type", "application/json"); // 设置HTTP头

    // 创建JSON格式的请求数据
    String httpRequestData = "{\"temperature\":" + String(t) + ",\"humidity\":" + String(h) + ",\"presence\":" + String(presenceDetected) + "}";
    int httpResponseCode = http.POST(httpRequestData); // 发送POST请求

    Serial.print("HTTP Response code: ");
    Serial.println(httpResponseCode); // 打印HTTP响应码

    http.end(); // 结束HTTP连接
  }

  delay(1000); // 等待3秒后再次循环
}
