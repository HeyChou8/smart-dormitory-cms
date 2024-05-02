// 定义节流函数
export const throttle = (func, delay) => {
    let lastExecTime = 0; // 声明一个变量存储上次执行函数的时间戳
    return function () { // 返回一个函数
      const context = this; // 缓存当前函数的上下文
      const args = arguments; // 缓存当前函数的参数
      const currentTime = Date.now(); // 获取当前时间戳
      if (currentTime - lastExecTime >= delay) { // 判断距离上次执行函数的时间是否超过设定的间隔时间
        func.apply(context, args); // 如果超过间隔时间，则执行函数
        lastExecTime = currentTime; // 更新上次执行函数的时间戳
      }
    }
  };