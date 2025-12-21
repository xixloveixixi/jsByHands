function quc(arr){
    // 1、直接set加拓展运算符
    // return [...new Set(arr)];
    // 2、filter判断是否为首次出现
    arr.filter((item , index) => {
        return arr.indexOf(item) === index;
    })
}
console.log(quc([1,2,1,4,5]))