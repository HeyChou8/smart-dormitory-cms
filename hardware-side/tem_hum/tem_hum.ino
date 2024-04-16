#include <ESP8266WiFi.h>
#include <ESP8266HTTPClient.h>
#include <WiFiClient.h> // 引入WiFiClient库
#include <DHT.h>

#define DHTPIN D1         // DHT11的数据引脚连接到ESP8266的D4
#define DHTTYPE DHT11     // 使用DHT11传感器
const char* ssid = "iPhone";
const char* password = "1666201454";
const char* serverName = "http://172.20.10.2:8001/monitor/data";

DHT dht(DHTPIN, DHTTYPE);

void setup() {
  Serial.begin(115200);
  WiFi.begin(ssid, password);
  dht.begin();

  while (WiFi.status() != WL_CONNECTED) {
    delay(1000);
    Serial.println("Connecting to WiFi...");
  }
}

void loop() {
  float h = dht.readHumidity();
  float t = dht.readTemperature();

  if (isnan(h) || isnan(t)) {
    Serial.println("Failed to read from DHT sensor!");
    return;
  }

  if (WiFi.status() == WL_CONNECTED) {
    WiFiClient client; // 创建WiFiClient实例
    HTTPClient http;
    
    http.begin(client, serverName); // 使用新的API
    http.addHeader("Content-Type", "application/json");
    
    String httpRequestData = "{\"temperature\":\"" + String(t) + "\", \"humidity\":\"" + String(h) + "\"}";
    int httpResponseCode = http.POST(httpRequestData);
    
    Serial.print("HTTP Response code: ");
    Serial.println(httpResponseCode);
    
    http.end();
  }
  delay(5000); // 每5秒发送一次数据
}
