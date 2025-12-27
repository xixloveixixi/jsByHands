class myPromise {
    static PENDING = 'PENDING';
    static FULFILLED = 'FULFILLED';
    static REJECTED = 'REJECTED';

    constructor(func) {
        this.status = myPromise.PENDING;
        this.result = null;
        this.onFulfilledCallbacks = [];
        this.onRejectedCallbacks = [];
        
        // ✅ 1. 这里传入的是实例方法（负责改状态）
        func(this._resolve.bind(this), this.reject.bind(this));
    }

    // ✅ 2. 实例方法：负责改变当前 Promise 的状态
    // 建议改个名比如 _resolve，不要和静态方法搞混
    _resolve(result) {
        if (this.status === myPromise.PENDING) {
            this.status = myPromise.FULFILLED;
            this.result = result;
            queueMicrotask(() => {
                this.onFulfilledCallbacks.forEach((cb) => cb(this.result));
            })
        }
    }

    reject(result) {
        if (this.status === myPromise.PENDING) {
            this.status = myPromise.REJECTED;
            this.result = result;
            queueMicrotask(() => {
                this.onRejectedCallbacks.forEach((cb) => cb(this.result));
            })
        }
    }

    then(onFulfilled, onRejected) {
        onFulfilled = typeof onFulfilled === 'function' ? onFulfilled : val => val;
        onRejected = typeof onRejected === 'function' ? onRejected : err => { throw err };

        if (this.status === myPromise.FULFILLED) {
            queueMicrotask(() => {
                onFulfilled(this.result);
            })
        } else if (this.status === myPromise.REJECTED) {
            queueMicrotask(() => {
                onRejected(this.result);
            })
        } else {
            this.onFulfilledCallbacks.push((res) => onFulfilled(res));
            this.onRejectedCallbacks.push((res) => onRejected(res));
        }
    }

    // ✅ 3. 静态方法：负责包装值（完全不同的逻辑）
    static resolve(value) {
        // 如果已经是 Promise，直接返回
        if (value instanceof myPromise) return value;
        // 如果是普通值，返回一个立刻成功的 Promise
        return new myPromise((resolve) => resolve(value));
    }

    all(promises) {
        return new myPromise((resolve, reject) => {
            let count = 0;
            let results = [];
            for (let i = 0; i < promises.length; i++) {
                // 这里调用的是上面的静态方法
                myPromise.resolve(promises[i]).then((res) => {
                    results[i] = res;
                    count++;
                    if (count === promises.length) {
                        resolve(results);
                    }
                }, err => { reject(err) })
            }
        })
    }

    race(promises) {
        return new myPromise((resolve, reject) => {
            promises.forEach(ps => {
                // 这里调用的是上面的静态方法
                myPromise.resolve(ps).then((res) => {
                    resolve(res);
                }, err => { reject(err) });
            });
        })
    }
}
