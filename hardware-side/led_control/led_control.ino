//#include <ESP8266WiFi.h>
//#include <PubSubClient.h>
//
//// WiFi的SSID和密码
//const char* ssid = "iPhone";
//const char* password = "1666201454";
//
//// MQTT Broker的地址和端口
//const char* mqtt_server = "broker.hivemq.com";
//
//WiFiClient espClient;
//PubSubClient client(espClient);
//
//// 用于控制LED灯的GPIO引脚
//const int ledPin = D1;
//
//void setup_wifi() {
//  delay(10);
//  Serial.println();
//  Serial.print("Connecting to ");
//  Serial.println(ssid);
//
//  WiFi.begin(ssid, password);
//
//  while (WiFi.status() != WL_CONNECTED) {
//    delay(500);
//    Serial.print(".");
//  }
//
//  Serial.println("");
//  Serial.println("WiFi connected");
//  Serial.println("IP address: ");
//  Serial.println(WiFi.localIP());
//}
//
//void callback(char* topic, byte* payload, unsigned int length) {
//  String messageTemp;
//  for (int i = 0; i < length; i++) {
//    messageTemp += (char)payload[i];
//  }
//  Serial.print("Message arrived [");
//  Serial.print(topic);
//  Serial.print("] ");
//  Serial.println(messageTemp);
//
//  if (messageTemp == "1") {
//    digitalWrite(ledPin, HIGH);
//    Serial.println("LED turned on");
//  } else if (messageTemp == "0") {
//    digitalWrite(ledPin, LOW);
//    Serial.println("LED turned off");
//  }
//}
//
//void testLED() {
//  for (int i = 0; i < 3; i++) {
//    digitalWrite(ledPin, HIGH);
//    delay(500);
//    digitalWrite(ledPin, LOW);
//    delay(500);
//  }
//}
//
//void setup() {
//  Serial.begin(115200);
//  pinMode(ledPin, OUTPUT);     
//  testLED();                   // 测试LED灯
//  setup_wifi();                
//  client.setServer(mqtt_server, 1883);
//  client.setCallback(callback);
//}
//
//void reconnect() {
//  while (!client.connected()) {
//    Serial.print("Attempting MQTT connection...");
//    if (client.connect("ESP8266Client")) {
//      Serial.println("connected");
//      client.subscribe("pc/lightControl");
//    } else {
//      Serial.print("failed, rc=");
//      Serial.print(client.state());
//      Serial.println(" try again in 5 seconds");
//      delay(5000);
//    }
//  }
//}
//
//void loop() {
//  if (!client.connected()) {
//    reconnect();
//  }
//  client.loop();
//}




//void setup() {
//  pinMode(D1, OUTPUT); // 设置D1引脚为输出模式
//}
//
//void loop() {
//  digitalWrite(D1, HIGH); // 点亮LED灯
//  delay(1000);            // 等待一秒
//  digitalWrite(D1, LOW);  // 熄灭LED灯
//  delay(1000);            // 等待一秒
//}




//#include <ESP8266WiFi.h>
//#include <PubSubClient.h>
//
//// WiFi的SSID和密码
//const char* ssid = "iPhone";
//const char* password = "1666201454";
//
//// MQTT Broker的地址和端口
//const char* mqtt_server = "broker.hivemq.com";
//
//WiFiClient espClient;
//PubSubClient client(espClient);
//
//// 用于控制内置LED灯的GPIO引脚, 修改为内置LED的引脚
//const int ledPin = 2; // 大多数NodeMCU v3板上内置LED连接到GPIO 2
//
//void setup_wifi() {
//  delay(10);
//  // 启动串口和WiFi连接
//  Serial.println();
//  Serial.print("Connecting to ");
//  Serial.println(ssid);
//
//  // 尝试连接WiFi
//  WiFi.begin(ssid, password);
//
//  // 等待WiFi连接
//  while (WiFi.status() != WL_CONNECTED) {
//    delay(500);
//    Serial.print(".");
//  }
//
//  // 连接成功后打印IP地址
//  Serial.println("");
//  Serial.println("WiFi connected");
//  Serial.println("IP address: ");
//  Serial.println(WiFi.localIP());
//}
//
//void callback(char* topic, byte* payload, unsigned int length) {
//  // MQTT消息处理
//  String messageTemp;
//  for (int i = 0; i < length; i++) {
//    messageTemp += (char)payload[i];
//  }
//  Serial.print("Message arrived [");
//  Serial.print(topic);
//  Serial.print("] ");
//  Serial.println(messageTemp);
//
//  // 根据消息控制LED
//  if (messageTemp == "1") {
//    digitalWrite(ledPin, LOW); // 点亮LED
//    Serial.println("LED turned on");
//  } else if (messageTemp == "0") {
//    digitalWrite(ledPin, HIGH); // 熄灭LED
//    Serial.println("LED turned off");
//  }
//}
//
//void testLED() {
//  // 在启动时测试LED灯，确认硬件工作正常
//  for (int i = 0; i < 3; i++) {
//    digitalWrite(ledPin, HIGH); // 点亮LED
//    delay(500);                 // 等待500毫秒
//    digitalWrite(ledPin, LOW);  // 熄灭LED
//    delay(500);                 // 等待500毫秒
//  }
//}
//
//void setup() {
//  // 初始化串口，设置LED引脚，测试LED，连接WiFi和MQTT
//  Serial.begin(115200);
//  pinMode(ledPin, OUTPUT);     
//  testLED();                   // 测试内置LED灯
//  setup_wifi();                // 连接WiFi
//  client.setServer(mqtt_server, 1883);
//  client.setCallback(callback); // 设置MQTT消息回调
//}
//
//void reconnect() {
//  // 在失去连接时尝试重新连接MQTT
//  while (!client.connected()) {
//    Serial.print("Attempting MQTT connection...");
//    // 尝试连接，订阅主题
//    if (client.connect("ESP8266Client")) {
//      Serial.println("connected");
//      client.subscribe("pc/lightControl"); // 订阅主题
//    } else {
//      Serial.print("failed, rc=");
//      Serial.print(client.state());
//      Serial.println(" try again in 5 seconds");
//      delay(5000); // 等待5秒后重试
//    }
//  }
//}
//
//void loop() {
//  // 主循环，确保设备保持连接，并处理消息
//  if (!client.connected()) {
//    reconnect();
//  }
//  client.loop(); // 处理接收到的消息和发送消息
//}


#include <ESP8266WiFi.h>
#include <ESP8266WebServer.h>

const char* ssid = "iPhone";
const char* password = "1666201454";

ESP8266WebServer server(80);

void setup() {
  Serial.begin(115200);
  WiFi.begin(ssid, password);
  while (WiFi.status() != WL_CONNECTED) {
    delay(500);
    Serial.print(".");
  }
  Serial.println("");
  Serial.println("WiFi connected.");

  pinMode(D1, OUTPUT); // LED pin as output

  // Define routes
  server.on("/light/on", []() {
    digitalWrite(D1, HIGH);
    server.send(200, "text/plain", "Light is ON");
  });

  server.on("/light/off", []() {
    digitalWrite(D1, LOW);
    server.send(200, "text/plain", "Light is OFF");
  });

  server.begin();
  Serial.println("HTTP server started");
}

void loop() {
  server.handleClient();
}
