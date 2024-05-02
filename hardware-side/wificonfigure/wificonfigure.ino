#include <ESP8266WiFi.h>
#include <ESP8266WebServer.h>

const char* apSSID = "ESP8266_AP";   // 热点模式的 SSID
const char* apPassword = "12345678"; // 热点模式的密码

ESP8266WebServer server(80);

bool connectToWiFi(const char* ssid, const char* password) {
  Serial.print("Attempting to connect to WiFi SSID: ");
  Serial.println(ssid);
  
  WiFi.begin(ssid, password);

  // 等待连接完成，最多等待10秒
  int attempts = 0;
  while (WiFi.status() != WL_CONNECTED && attempts < 5) {
    delay(1000);
    attempts++;
  }

  if (WiFi.status() == WL_CONNECTED) {
    Serial.println("WiFi connected successfully!");
    Serial.print("IP Address: ");
    Serial.println(WiFi.localIP());
    return true;
  } else {
    Serial.println("Failed to connect to WiFi.");
    return false;
  }
}

void handleRoot() {
  Serial.println("Handling root page request...");
  
  String html = "<html>"
                "<head>"
                "<meta charset='UTF-8'>"
                "<meta http-equiv='X-UA-Compatible' content='IE=edge'>" // 确保在IE浏览器中使用最新模式
                "<meta name='viewport' content='width=device-width, initial-scale=1.0'>" // 响应式设计支持
                "<title>WiFi 配置</title>"
                "<style>"
                "body { font-family: Arial, sans-serif; background-color: #f4f4f4; margin: 40px; text-align: center; }"
                "h1 { color: #5a5a5a; }"
                ".field { margin-top: 20px; display: block; width: 60%; margin-left: auto; margin-right: auto; text-align: left; }"
                "input, button { width: 100%; padding: 10px; display: block; }"
                "input { border: 1px solid #ddd; margin-top: 5px; }"
                "button { width: 20%; background-color: #0084ff; color: white; border: none; cursor: pointer; margin-top: 20px; margin-left: auto; margin-right: auto; }" // 缩短按钮宽度并水平居中
                "button:hover { background-color: #0056b3; }"
                "</style>"
                "</head>"
                "<body>"
                "<h1>WiFi 连接配置</h1>"
                "<div class='field'>"
                "<label for='ssid'>网络SSID:</label>"
                "<input type='text' id='ssid' name='ssid' placeholder='请输入网络名称'>"
                "</div>"
                "<div class='field'>"
                "<label for='password'>密码:</label>"
                "<input type='password' id='password' name='password' placeholder='请输入密码'>"
                "</div>"
                "<button onclick='connectWiFi()'>连接</button>"
                "<script>"
                "function connectWiFi() {"
                "  var ssid = document.getElementById('ssid').value;"
                "  var password = document.getElementById('password').value;"
                "  var url = '/connect?ssid=' + encodeURIComponent(ssid) + '&password=' + encodeURIComponent(password);"
                "  fetch(url)"
                "    .then(response => response.text())"
                "    .then(text => document.body.innerHTML = text)"
                "    .catch(err => console.error('Error:', err));"
                "}"
                "</script>"
                "</body></html>";
   server.sendHeader("Content-Type", "text/html; charset=UTF-8"); // 设置响应头以确保正确的字符编码
  server.send(200, "text/html", html);

}

void handleConnect() {
  Serial.println("Handling connect request...");
  
  String ssid = server.arg("ssid");
  String password = server.arg("password");

  bool connected = false;
  int attempts = 0;
  while (!connected && attempts < 3) { // 最多尝试连接3次
    connected = connectToWiFi(ssid.c_str(), password.c_str());
    attempts++;
  }

  String message;
  if (connected) {
    message = "连接 " + ssid + " 成功!";
  } else {
    message = "连接" + ssid + "失败.请检查你的密码.";
  }
  
  server.send(200, "text/plain", message);
}

void setup() {
  Serial.begin(115200);
  delay(100);

  Serial.println("Starting...");

  // 开启 AP 模式
  WiFi.mode(WIFI_AP_STA);
  WiFi.softAP(apSSID, apPassword);

  // 尝试连接已保存的 WiFi 网络
  if (!connectToWiFi("", "")) {
    Serial.println("No saved WiFi found. Entering AP mode for configuration.");
  }

  // 将服务器路由设置为处理根路径和连接路径
  server.on("/", HTTP_GET, handleRoot);
  server.on("/connect", HTTP_GET, handleConnect);

  // 启动服务器
  server.begin();

  Serial.println("Server started");
}

void loop() {
  server.handleClient();
}
