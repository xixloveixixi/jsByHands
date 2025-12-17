 Function.prototype.myCall = function(thisArg = window ,  ...argArray){
            // 1、类型拦截
            if(typeof this !=="function"){
                throw TypeError(`${thisArg} is not a function`);
            }
            // 2、处理thisArg为null或者undefied的情况
            if(thisArg === null || thisArg === undefined){
                thisArg = window
            }else {
                // 3、确保thisArg为obj
                thisArg = Object(thisArg);
            }
            // 4.定制函数
            let fnKey = Symbol('key');
            thisArg[fnKey] = this;
            // 5.执行
            let res = thisArg[fnKey](...argArray);
            // 6.删除
            delete thisArg[fnKey];
            return res;
            

        }

// let fn = () =>{}
// fn.bind()thisArg: unknown
Function.prototype.myBind = function(thisArg){
    // bind是在call的基础上会返回一个函数
    let fn = this;
    return function(...args){
        fn.myCall(thisArg , ...args);

    }

}