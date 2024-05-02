const Koa = require('koa');
const KoaRouter = require('@koa/router');
const bodyParser = require('koa-body');
const websockify = require('koa-websocket');
const monitorRouter = new KoaRouter({prefix:'/monitor'})
const app = websockify(new Koa());
const router = new KoaRouter
const axios = require('axios');
let NODEMCU_BASE_URL //硬件端ip地址
const schedule = require('node-schedule');
let isPowerOn = false;
let autoModeSettings = {
    enabled: false,
    temperatureThreshold: 28,
  };
app.use(bodyParser());

// 存储所有活跃的 WebSocket 连接
let connections = [];

monitorRouter.post('/ipreceiver',async(ctx) => {
  const ip = ctx.request.body
  NODEMCU_BASE_URL = `http://${ip.ip}`
  // console.log(NODEMCU_BASE_URL)
})
// 处理 HTTP POST 请求,在pc显示温湿度，人体有无，给硬件端请求
monitorRouter.post('/data', async (ctx) => {
  const data = ctx.request.body;
  // console.log(data)
  // 将接收到的数据发送给所有活跃的 WebSocket 连接
  connections.forEach((ws) => {
    if (ws.readyState === 1) { // 1 表示连接是开放的
      ws.send(JSON.stringify(data));
    }
  });
  ctx.body = { status: 'success', data: data };
});
// 控制灯泡开启
monitorRouter.get('/lightControl/on', async (ctx) => {
    await axios.get(`${NODEMCU_BASE_URL}/light/on`);
    ctx.body = '灯已打开';
  });
// 控制灯泡关闭
monitorRouter.get('/lightControl/off', async (ctx) => {
    await axios.get(`${NODEMCU_BASE_URL}/light/off`);
    ctx.body = '灯已关闭';
  });


// 控制风扇开启
monitorRouter.get('/fanControl/on', async (ctx) => {
     const res =  await axios.get(`${NODEMCU_BASE_URL}/fan/on`);
     ctx.body = '风扇已开启'
    // ctx.body = res.data;
});

// 控制风扇关闭
monitorRouter.get('/fanControl/off', async (ctx) => {
    const res = await axios.get(`${NODEMCU_BASE_URL}/fan/off`);
    ctx.body = '风扇已关闭'
    // ctx.body = res.data; 

});

// 电源状态查询接口
monitorRouter.get('/power/status', ctx => {
    ctx.status = 200;
    ctx.body = { isPowerOn };
  });
  // 使用POST请求关闭电源
monitorRouter.post('/power/off', async (ctx) => {
    // 电源关闭逻辑...
    isPowerOn = false;
    ctx.status = 200;
    ctx.body = { message: '供电已关闭' };
  });
  
  // 使用POST请求打开电源
  monitorRouter.post('/power/on', async (ctx) => {
        // 设置开关按钮的逻辑
    isPowerOn = true;
    ctx.status = 200;
    ctx.body = { message: '供电已开启' };
  });
//   定义一个处理取消定时任务的路由
monitorRouter.post('/power/cancelSchedule', async (ctx) => {
  const { startTime, endTime } = ctx.request.body;

  try {
    const success = await cancelScheduledPowerOff(startTime, endTime);
    if (success) {
      ctx.status = 200;
      ctx.body = { message: '定时供电任务取消成功' };
    } else {
      // 假设取消失败
      ctx.status = 500;
      ctx.body = { message: '定时供电任务取消失败' };
    }
  } catch (error) {
    ctx.status = 500;
    ctx.body = { message: '内部服务器错误', error: error.message };
  }
});
// 定时任务的路由
monitorRouter.post('/power/schedule', async (ctx) => {
    const { startTime, endTime } = ctx.request.body;
  
    // 定时任务开启电源
    schedule.scheduleJob(new Date(startTime), async () => {
      try {
        await axios.get(`${NODEMCU_BASE_URL}/power/on`);
        // 设置开关按钮的逻辑
        isPowerOn = true;
        console.log('已执行定时任务：电源开启');
      } catch (error) {
        console.error('定时任务执行失败：电源开启');
      }
    });
  
    // 定时任务关闭电源
    schedule.scheduleJob(new Date(endTime), async () => {
      try {
        await axios.get(`${NODEMCU_BASE_URL}/power/off`);
        // 设置开关按钮的逻辑
        isPowerOn = false
        console.log('已执行定时任务：电源关闭');
      } catch (error) {
        console.error('定时任务执行失败：电源关闭');
      }
    });
  
    ctx.status = 200;
    ctx.body = '电源控制的定时任务已设置';
  });

// 获取自动模式的初始设置
monitorRouter.get('/autoMode/settings', async (ctx) => {
    ctx.body = autoModeSettings;
  });

  // 更新自动模式的设置
monitorRouter.post('/autoMode/settings', async (ctx) => {
    const { enabled, temperatureThreshold } = ctx.request.body;
  
    // 更新设置
    autoModeSettings.enabled = enabled;
    autoModeSettings.temperatureThreshold = temperatureThreshold;
  
    ctx.body = { message: '自动模式设置已更新' };
  });
  // 自动模式下控制风扇的开关
monitorRouter.post('/controlFan', async (ctx) => {
    const { command } = ctx.request.body;
    let path = command === 'on' ? '/fan/on' : '/fan/off';
  
    try {
      const res = await axios.get(`${NODEMCU_BASE_URL}${path}`);
      ctx.body = { message: `风扇已${command === 'on' ? '开启' : '关闭'}`, data: res.data };
    } catch (error) {
      ctx.status = 500;
      ctx.body = { message: '风扇控制失败', error: error.toString() };
    }
  });
// websocket
app.use(router.routes()).use(router.allowedMethods());

// 设置 WebSocket 路由
app.ws.use((ctx) => {
  // 当有新的 WebSocket 连接时，将其添加到连接列表
  connections.push(ctx.websocket);

  // 当连接关闭时，从列表中移除
  ctx.websocket.on('close', () => {
    connections = connections.filter((ws) => ws !== ctx.websocket);
  });
});

// 
monitorRouter.post('/gasThreshold',async(ctx,next) => {
    const { gasThreshold } = ctx.request.body
    console.log(gasThreshold)
    
})
// 烟雾达到阈值时控制蜂鸣器
monitorRouter.post('/controlBuzzer', async (ctx) => {
  const { command } = ctx.request.body;
  let path = command === 'on' ? '/buzzer/on' : '/buzzer/off'

  try {
    const res = await axios.get(`${NODEMCU_BASE_URL}${path}`);
    ctx.body = { message: `蜂鸣器已${command === 'on' ? '开启' : '关闭'}`, data: res.data }
  } catch (error) {
    // ctx.status = 500;
    ctx.body = { message: '蜂鸣器控制失败', error: error.toString() }
  }
});
app.listen(8002, '0.0.0.0',() => {
  console.log('websocket_8002端口启动成功');
});
module.exports = monitorRouter
