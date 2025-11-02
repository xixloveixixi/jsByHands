// 普通版本:>手动指令打
// let a = 10;
// let b ;
// b = a;
// console.log(b);//10
// a = 20;
// console.log(b)//20
// v2当中则是把更新的相关代码进行了封装，利用更新代码进行封装,然后调用
// vue3：通过reactive声明变量，通过effect进行依赖收集，当数据发生改变之后effect更新所有的依赖

import { mountElement } from "./h/h";

// 我们现在就是要实现一个vue3响应式

// class Dep {
//   constructor() {
//     this.effects = new Set(); //依赖不能重复+可以使用一些方法
//     this.val = 0;
//   }
//   // 1、添加依赖:使用add方法添加到effects当中
//   depend(effect) {
//     this.effects.add(effect);
//   }
//   // 2、触发依赖
//   notice() {
//     // 执行收集的依赖
//     this.effects.forEach((effect) => {
//       effect();
//     });
//   }
// }
// function effectWatch(effect) {
//   effect(); //最开始执行一次
//   // 这里面的effect应该传入depend
//   dep.depend(effect);
// }
// let dep = new Dep();
// let b;
// effectWatch(() => {
//   b = dep.val + 10;
//   console.log(b);
// });
// // 值发生变更
// dep.val = 20;
// dep.notice();

// 我们对代码进行改进，不手动调用notice和depend，在get和set方法中使用
// 设置全局的curEffect便于后面再get里面调用回调函数
// 移除所有export语句，改为全局变量
// 全局变量，存储当前活跃的副作用函数
let curEffect = null;
// 存储对象和依赖的映射关系
let targetMap = new Map();

class Dep {
    // 1、初始化，初始化依赖
  constructor() {
     // 使用Set存储副作用函数，避免重复
    this.effects = new Set();
    this._val = 0;
  }
  // 2、添加依赖:使用add方法添加到effects当中
  depend() {
    if (curEffect) {
      this.effects.add(curEffect);
    }
  }
  // 3、触发依赖:使用forEach方法遍历effects，执行每个副作用函数
  notice() {
    this.effects.forEach((effect) => {
      effect();
    });
  }
}

function findDep(target, key) {
  let depMap = targetMap.get(target);
  if (!depMap) {
    depMap = new Map();
    targetMap.set(target, depMap);
  }
  let dep = depMap.get(key);
  if (!dep) {
    dep = new Dep();
    depMap.set(key, dep);
  }
  return dep;
}

export const effectWatch = (effect) => {
  curEffect = effect;
  effect();
  curEffect = null;
}
// 创建响应式对象
function reactive(raw) {
  return new Proxy(raw, {
    //    拦截get操作，进行依赖收集
    get(target, key) {
      let dep = findDep(target, key);
      dep.depend();
      return Reflect.get(target, key);
    },
    // 拦截set操作，触发依赖更新
    set(target, key, value) {
      Reflect.set(target, key, value);
      let dep = findDep(target, key);
      dep.notice();
      return true;
    },
  });
}
// const user = reactive({
//   age: 19,
// });

 const App = {
  // 1、渲染函数：渲染组件的模板，返回渲染后的元素
  render(context) {
    // 定义不同类型的 children 用于测试
    let children = null;
    
    // 根据 testCase 选择不同的测试场景
    if (context.testCase === 'text-to-text') {
      // 测试场景1: 文本到文本的更新
      children = `年龄: ${context.age}`;
    } else if (context.testCase === 'text-to-array') {
      // 测试场景2: 文本到数组的更新
      children = [
        { tag: 'span', props: {}, children: ['当前年龄:'] },
        { tag: 'strong', props: {}, children: [String(context.age)] }
      ];
    } else if (context.testCase === 'array-to-text') {
      // 测试场景3: 数组到文本的更新
      children = `最新年龄是 ${context.age}`;
    } else if (context.testCase === 'array-to-array') {
      // 测试场景4: 数组到数组的更新（长度变化）
      children = [
        { tag: 'span', props: {}, children: ['Age:'] },
        { tag: 'strong', props: {}, children: [String(context.age)] },
        ...(context.showExtra ? [{ tag: 'em', props: {}, children: [' 岁'] }] : [])
      ];
    } else {
      // 默认测试场景
      children = [String(context.age)];
    }
    
    return {
      tag: 'div',
      props: { 'data-test': context.testCase },
      children: children
    };
  },
  // 2、setup函数:定义响应式参数，返回定义的参数
 setup() {
    const state = reactive({
      age: 20,
      showExtra: false,
      testCase: 'text-to-text' // 默认测试场景
    });
    window.state = state;
    return state;
  }
};

const user = reactive({
  age: 19,
});
effectWatch(() => {
  console.log(user.age); // 只读取，不修改
});

// 测试响应式
user.age = 20; // 这会触发上面的effect重新执行


export default App;