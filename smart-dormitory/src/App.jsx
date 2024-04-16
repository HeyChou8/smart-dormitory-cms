import React, { memo,useEffect,useState } from "react";
import { useRoutes  } from 'react-router-dom'
import routes from "@/router/index";
import BeforeEach from './hoc/beforeEach'
import { px2remTransformer, StyleProvider } from '@ant-design/cssinjs';
// 定义一个函数，用于根据当前视口宽度计算 rootValue
const calculateRootValue = () => {
  const screenWidth = window.innerWidth;
  // 使用视口宽度单位 (vw) 计算基准大小。
  // 例如，我们希望在屏幕宽度为375px时，1rem等于18px，
  // 这意味着rootValue应该是屏幕宽度的4.8% (18 / 375 * 100)。
  // 你可以根据设计需求调整这个百分比。
  return screenWidth * 0.01;
}
const App = memo(() => {
  // 改变ant design的px to rem
  const [rootValue, setRootValue] = useState(calculateRootValue());
  // 使用 useEffect 钩子来添加和移除事件监听器
  useEffect(() => {
    const handleResize = () => {
      // 当窗口大小变化时，重新计算 rootValue 并应用
      setRootValue(calculateRootValue());
      // 这里应用新的 rootValue，你可能需要找到一种方法来更新 StyleProvider 的 transformers 属性
      // 注意：这里的实现依赖于你如何使用 StyleProvider 和 cssinjs，可能需要进一步的逻辑来实际应用新的 rootValue
    };

    // 添加事件监听器
    window.addEventListener('resize', handleResize);
    // 组件卸载时移除事件监听器
    return () => window.removeEventListener('resize', handleResize);
  }, [window.innerWidth]);
  return (
    <StyleProvider transformers={[px2remTransformer({ rootValue })]}>
      <><BeforeEach>{useRoutes(routes)}</BeforeEach></>
    </StyleProvider>
  )
});

export default App;
