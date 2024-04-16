#include <ESP8266WiFi.h>
#include <ESP8266WebServer.h>

// WiFi设置
const char* ssid = "iPhone";
const char* password = "1666201454";

// 创建一个Web服务器对象，端口号为80
ESP8266WebServer server(80);

// 定义PWM引脚
const int fanPin = D5; // GPIO5

void setup() {
  Serial.begin(115200);
  pinMode(fanPin, OUTPUT);

  // 连接WiFi
  WiFi.begin(ssid, password);
  while (WiFi.status() != WL_CONNECTED) {
    delay(500);
    Serial.print(".");
  }
  Serial.println("");
  Serial.println("Connected to WiFi. IP address: ");
  Serial.println(WiFi.localIP());

  // 设置路由
  server.on("/fan/on", HTTP_GET, []() {
    Serial.println("Received /fan/on request");
    digitalWrite(fanPin, LOW); // 低电平触发继电器，打开风扇
    server.send(200, "text/plain", "fan is on");
  });
  
  server.on("/fan/off", HTTP_GET, []() {
    Serial.println("Received /fan/off request");
    digitalWrite(fanPin, HIGH); // 高电平释放继电器，关闭风扇
    server.send(200, "text/plain", "fan is off");
  });

  // 启动服务器
  server.begin();
  Serial.println("HTTP server started");
}

void loop() {
  server.handleClient();
}

//const int relayPin = D1; // 使用继电器连接的GPIO引脚
//
//void setup() {
//  pinMode(relayPin, OUTPUT);
//  digitalWrite(relayPin, LOW); // 打开继电器（闭合），LED灯亮
//}
//
//void loop() {
//  digitalWrite(relayPin, HIGH); // 尝试设置为高电平
//  delay(1000); // 等待1秒
//  digitalWrite(relayPin, LOW); // 再设置为低电平
//  delay(1000); // 等待1秒
//}
