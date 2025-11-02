// d:\js手写代码\minivue\miniVueDemo\App.js

import { mountElement } from "./src/h/h.js";
import { effectWatch } from "./src/index.js";
import { diff } from "./src/h/h.js";

export const createApp = (rootComponent) => {
  return {
    mount(rootContainer) {
      let isMounted = false;
      let oldSubTree = null;
      const context = rootComponent.setup();
      
      effectWatch(() => {
        // 关键修复：每次effect触发时都重新计算subTree
        const subTree = rootComponent.render(context);
        
        console.log('effect触发，isMounted:', isMounted);
        
        if (!isMounted) {
          // 首次渲染
          isMounted = true;
          rootContainer.innerHTML = "";
          mountElement(subTree, rootContainer);
          console.log('首次渲染完成', subTree);
        } else {
          // 更新时使用diff算法
          // 注意：diff函数现在返回el元素
          const el = diff(oldSubTree, subTree);
          if (el) {
            // 先清空容器，再添加新元素
            rootContainer.innerHTML = "";
            rootContainer.appendChild(el);
            console.log('更新渲染完成', subTree);
          } else {
            console.log('diff未返回有效元素');
          }
        }
        
        // 保存当前子树作为下次的旧子树
        oldSubTree = subTree;
      });
    },
  };
};