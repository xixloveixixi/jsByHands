const SERVER_URL = "test.json"
// 创建请求
const xhr = new XMLHttpRequest();
// 设置超时时间
const timeout = 1000;
// 成功的回调函数
function onSuccess(res){
  console.log("Success:" ,  res)
}
// 失败的回调函数
function onError(res){
  console.log("Error:" , res)
}

// 监听状态：包括ajax的和http的
xhr.onreadystatechange = () => {
  if (xhr.readyState !== 4) return;
  if ((xhr.status >= 200 && xhr.status < 300) || xhr.status === 304) {
   onSuccess(xhr.response);
  }else {
    onError(xhr.response)
  }
};
// 错误的情况
xhr.onerror = function() {
 onError("错啦"+xhr.response);
};2
// 超时的情况
xhr.ontimeout = function(){
  onError("超时啦"+xhr.response);
}
// 先open
xhr.open("GET", SERVER_URL, true);
// 设置请求头
xhr.setRequestHeader("Accept", "application/json");
// 设置请求类型
xhr.responseType = "json";
// 发送请求
xhr.send(null);