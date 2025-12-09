// 防抖就是多次点击但是智慧执行最后一次
function debounce(fn , delay){
    let timer = null;
    return function (...args){
        if(timer){
            clearTimeout(timer);
        }
        timer = setTimeout(() => {
            fn.apply(this , args);
        } , delay)

    }

}