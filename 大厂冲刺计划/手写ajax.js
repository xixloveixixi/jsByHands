function myAjax(url){
    return new Promise((resolve , reject) => {
        const xhr = new XMLHttpRequest();
        xhr.open('GET' , url , true);
        xhr.onreadystatechange = function(){
            if(xhr.readyState === 4){
                if(xhr.status === 200){
                    resolve(JSON.stringify(xhr.statusText));
                }else {
                    reject(xhr.statusText)
                }
            }
        }
        xhr.send()

    })

}