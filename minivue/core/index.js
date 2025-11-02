// 不能把effectWatch之类的给用户直接看到，我们写一个createapp
import { effectWatch } from "../miniVueDemo/App.js";
// 移除import导入语句，使用全局effectWatch函数
function createApp(rootComponent) {
  return {
    mount(rootContainer) {
      const context = rootComponent.setup();
      // 使用全局effectWatch
      effectWatch(() => {
        rootContainer.innerHTML = '';
        const element = rootComponent.render(context);
        rootContainer.append(element);
      });
    },
  };
}

// 暴露给全局
window.createApp = createApp;