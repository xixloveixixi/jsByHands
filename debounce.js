export const debounce = (fn , wait = 1000) => {
        let timer = null;
    return () => {
            // 在规定时间调用了就要清除
            clearTimeout(timer);
            // 重新开始
            setTimeout(() => {
                fn();
            } , wait)

    }

}