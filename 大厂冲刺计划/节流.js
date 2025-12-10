function throttle(fn , delay){
    let lastTime = 0;
    // 保存外部的 this，防止在回调中丢失
    const context = this;
    return function(...args){
        let nowTime = Date.now();
        if(nowTime - lastTime > delay){
            fn.apply(this , args);
            lastTime = nowTime;
        }

    }

}

