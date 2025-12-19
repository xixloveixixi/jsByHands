function debounce(fn , delay){
    let timer = null;
    return function(...args){
        if(timer){
            clearTimeout(timer);
        }
        timer = setTimeout(() => {
            fn.apply(this , args );
        } , delay)

    }

}

function throttle(fn , delay){
    let lastTime = 0 ; 
    return function(...args){
        let newTime = Date.now();
        if(newTime - lastTime >= delay){
            fn.apply(this , args);
            lastTime = newTime;
        }
    }

}