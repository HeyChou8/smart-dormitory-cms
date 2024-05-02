// 定义防抖函数
export const debounce = (func, delay) => {
    let debounceTimer; // 声明一个变量用于存储定时器ID
    return function () { // 返回一个函数
      const context = this; // 缓存当前函数的上下文
      const args = arguments; // 缓存当前函数的参数
      clearTimeout(debounceTimer); // 每次调用前先清除之前的定时器
      debounceTimer = setTimeout(() => func.apply(context, args), delay); // 设置新的定时器，延迟执行函数
    }
  };