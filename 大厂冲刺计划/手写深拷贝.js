function deepCopy(obj){
    // 1.类型不为对象的直接返回
    if(obj === null || typeof obj !== 'object'){
        return obj;
    }
    // 2.递归遍历
    // 使用constructor创建更加准确
    let newObj = new obj.constructor();
    for(let key in obj){
        if(obj.hasOwnProperty(key)){
            newObj[key] = deepCopy(obj[key]);
        }
    }
    return newObj;

}