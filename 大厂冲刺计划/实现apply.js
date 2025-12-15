Function.prototype.myApply = function(thisArg , argArr){
    // 1、this类型判断
    if(typeof this !== 'function'){
        throw new  TypeError('this must be function')
    }
    // 2、thisArg的处理，分为nullundefied以及其他
    if(thisArg === null || thisArg === undefined){
        thisArg = globalThis; //兼容多环境
    }else {
        thisArg = Object(thisArg);
    }
    // 3、设置fn属性
    let fnKey = Symbol('key');
    thisArg[fnKey] = this;
    // 4、执行
    let res = null;
    // todo1:判断argArr的类型，如果为null的话不能使用展开运算符
    if(argArr === null || argArr === undefined){
         res = thisArg[fnKey]();//不传参
    }else {
         res = thisArg[fnKey](...argArr);
    }
    // todo2：删除属性
    delete thisArg[fnKey];
    // 5、返回
    return res;


}

// const fn = () => {

// }
// fn.apply()