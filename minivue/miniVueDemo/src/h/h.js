export function diff(n1, n2) {
        console.log(n1 , n2)

        // 进行安全检查
          if (!n1 || !n2) {
    console.warn('diff: n1或n2不存在');
    return;
  }
//   获取el的引用
        let el = (n1.el || n2.el);//防止虚拟DOM节点可能没有正确地引用到实际的DOM元素
          if (!el) {
    console.warn('diff: 无法获取DOM元素引用');
    return;
  }
    // 将el引用复制给n2，确保后续更新能找到DOM元素
  n2.el = el;
  // 对比新旧子树，进行最小化更新
  // 对比tag
  // tag不一致销毁重建
  if (n1.tag !== n2.tag) {
    el.replaceWith(document.createElement(n2.tag));
  }else {
 // 对比props
    // n1有，n2有，但是不一样
    const n1Props = n1.props || {};
    const n2Props = n2.props || {};
    // 对比props
    for(let key in n1Props){
        if(n2Props[key] !== n1Props[key]){
            el.setAttribute(key , n2Props[key]);
        }
    }
    // n2有，n1没有，需要添加
    for(let key in n2Props){
        if(!n1Props[key]){
            console.log(`[diff] 添加新属性: ${key}=${n2Props[key]}`);
            el.setAttribute(key , n2Props[key]);
        }
    }
    // n1有，n2没有，需要删除
    for(let key in n1Props){
        if(!n2Props[key]){
            console.log(`[diff] 删除旧属性: ${key}`);
            el.removeAttribute(key);
        }
    }
    // 对比children
    const n1Children = n1.children || [];
    const n2Children = n2.children || [];
    // 比较暴力的解法
    // n2Children为string
    if(typeof n2Children === 'string'){
        // 如果n1也是string
        if(typeof n1Children === 'string'){
            // 如果不等于
            if(n1Children !== n2Children){
                el.textContent = n2Children;
            }
        }else if(Array.isArray(n1Children)){
              // 如果n1Children为数组，n2Children为string
              el.textContent = n2Children;
        
        }
    }else if(Array.isArray(n2Children)){
        if(typeof n1Children === 'string'){
            el.innerHTML = '';
            mountElement(n2Children, el);
        }else if(Array.isArray(n1Children)){
            // 如果n1Children为数组，n2Children为数组
            let len = Math.min(n1Children.length , n2Children.length);
            for(let i = 0 ; i < len ; i++){
                diff(n1Children[i] , n2Children[i]);
            }
            // 如果n2Children比n1Children多，需要添加
            if(n2Children.length > n1Children.length){
                for(let i = len ; i < n2Children.length ; i++){
                    mountElement(n2Children[i] , n1.el);
                }
            }
            // 如果n1Children比n2Children多，需要删除
            if(n1Children.length > n2Children.length){
                for(let i = len ; i < n1Children.length ; i++){
                    n1Children[i].el.remove();
                }
            }
        }
    }
  }
  return el;
   
}



// 虚拟DOM


export function mountElement(vnode , container){
    const {tag , props , children} = vnode;
    const el =vnode.el =  document.createElement(tag);
    if(props){
        for(let key in props){
            el.setAttribute(key , props[key]);
        }
    }
    if(children) {
    if(typeof children === 'string') {
      // 如果children是字符串，直接创建文本节点
      const textNode = document.createTextNode(children);
      el.appendChild(textNode);
    } else if(Array.isArray(children)) {
      // 只有当children是数组时才调用forEach
      children.forEach(v => {
        if(typeof v === 'string') {
          const textNode = document.createTextNode(v);
          el.appendChild(textNode);
        } else {
          mountElement(v, el);
        }
      });
    } else {
      // 处理单个对象类型的children
      mountElement(children, el);
    }
  }
    container.appendChild(el);


}