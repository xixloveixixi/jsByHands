# JS手写代码篇

在做手写题的时候，我们要思考两个问题

1. 这个代码的作用是什么
2. 能够实现的效果是什么样子

## 1. 手写 Object.create 

思路：创造一个对象，类似于Object.create()方法=>将obj作为原型

```
        // 手写 Object.create 
function create (obj) {
    // 构造函数
    function F(){};
    // 让F的原型为obj
    F.prototype = obj;
    // 返回F，记得要实例化
    return new F();
}
```

测试：

```
let person = { name : 'jyx' };
let child = Object.create(person);
console.log(child);
let child1 = create(person);
console.log(child1);
```

结果：

![](D:\重要\js手写代码\屏幕截图 2025-05-15 180149.png)

## 2、手写 instanceof 方法

instancecof用于检测一个对象是否是某个构造函数的实例。它通常用于检查对象的类型，尤其是在处理继承关系时。

eg:

```
     const arr = [1,2,3,4,5]
     console.log(arr instanceof Array); // true
     console.log(arr instanceof Object); // true
```

那这是怎么实现的呢？

- 每个对象都有一个原型，对象从其原型继承属性和方法。
- 数组的直接原型是 `Array.prototype`。
- `Array.prototype` 的原型是 `Object.prototype`。
- `Object.prototype` 的原型是 `null`，表示原型链的终点。

这种原型链机制是 JavaScript 继承和原型继承的基础。通过原型链，JavaScript 实现了对象的属性和方法的继承。

我们就知道：

```
     console.log(arr.__proto__ === Array.prototype); // true
     console.log(arr.__proto__=== Object.prototype); // true
     console.log(arr.__proto__.__proto__ === Object.prototype); // true
     console.log(arr.__proto__.__proto__.__proto__ === null); // true
```

这就让我想到本道题木的解题思路：

在函数当中我们输入目标和待测类型，进行循环，如果原型链上有待测类型的原型返回true，没有也就是当了原型链的终点null，返回false

**我的代码：**

```
    function getIncetanceof(target , type){
        // 1、target的原型链
        let targetProto = target.__proto__;
        // 2、循环判断
        while(true){
            if(targetProto === null){
                return false;
            }else if(targetProto === type.prototype){
                return true;
            }else{
                // 都没有的时候就要更新targetProto
                targetProto = targetProto.__proto__;
            }
        }
    }
```

## 3、手写 new 操作符

new就是新建一个对象，new的过程主要有四个

1. **创建一个新对象**：这个新对象的原型被设置为构造函数的 `prototype` 属性。

   ```
   Object.create()
   ```

2. **将新对象的 this 上下文绑定到构造函数**：这样构造函数内部的 `this` 就指向了这个新对象。

   ```
   apply()
   ```

3. **执行构造函数**：构造函数内部的代码被执行，通常会对新对象进行一些初始化操作。

4. **返回新对象**：如果构造函数没有返回一个对象或函数，则默认返回新创建的对象；如果构造函数返回了一个对象或函数，则返回该对象或函数。

我们只要按照着四步来，就可以实现手写new

```
function myNew(constructor , ...args){
    //1、创建一个新对象：这个新对象的原型被设置为构造函数的 prototype 属性
    const obj = Object.create(constructor.prototype);
    //2、将新对象的 this 上下文绑定到构造函数
    //apply返回的是一个对象或者函数,如果构造函数没有返回一个对象或函数，则默认返回新创建的对象；如果构造函数返回了一个对象或函数，则返回该对象或函数。
    const res = constructor.apply(constructor , args);
    if(res && typeof res === 'object' || typeof res === 'function'){
        return res;
    }else {
        return obj;
    }
}
```

1. **apply 方法**：`apply` 是 JavaScript 中 Function 对象的一个方法，它允许你在一个指定的 `this` 值上调用函数，并传入一个数组作为参数

   ```
   function.apply(function , args) //改变function当中的this指向
   ```

​       返回的是构造函数 `function` 的执行结果。具体来说，它返回的是构造函数内部通过 `return` 语句返回的值。如果构造函数内部没有显式返回一个对象或函数，那么 `function.apply(obj, args)` 将返回 `undefined`。

结果：

```
function Person(name , age){
  this.name = name;
  this.age = age;
}
console.log(new Person('lily' , 19))
console.log(myNew(Person , 'lily' , 19))
console.log(myNew(Array , 1,2,3))
```

![](D:\重要\js手写代码\屏幕截图 2025-05-17 162647.png)

**总结**：new的手写主要通过它实现的四个步骤进行一一实现，创建一个原型被设置为构造函数的 `prototype` 属性的对象，改变this的指向，判断新对象的类型最后进行对应的处理。

## 4、手写promise

`Promise` 是一个内置对象，用于处理异步操作。`Promise` 对象表示一个尚未完成但预期将来会完成的操作。

**Promise 的基本结构**

一个 `Promise` 对象通常有以下状态：

- **pending**（进行中）：初始状态，既不是成功也不是失败。
- **fulfilled**（已成功）：操作成功完成。
- **rejected**（已失败）：操作失败。

promise原生代码：

```
      let promise = new Promise((resolve, reject) => {
        setTimeout(() => {
       resolve("下次一定");
        })
      });

      // then的用法
      promise.then(
        (result) => {
          console.log(result);
        },
        (error) => {
          console.log(error);
        }
      ).then(
        (result) => {
          console.log(result);
        },
        (error) => {
          console.log(error);
        }
      );
```

### (1).初始结构

使用promise的基本结构：

```
    let promise = new Promise((resolve, reject) => {
       resolve("下次一定");
      });
```

先创建一个Promise实例，传入一个函数，函数有两个参数，而且promise是有三种状态的，执行reject还是resolve都要根据promise的状态来定

```
    //    因为promise的创建是：promise = new Promise(() => {})
    // 所以原生promose我们使用类
    class Commitment{
        // prmise有三种状态,全局定义
        static PENDING = "待定";
        static FULFILLED = "成功";
        static REJECTED = "拒绝";
        // promise一般会传入一个函数且参数为resolve和reject
        constructor(func){
              // 状态
            this.status = Commitment.PENDING;
            // 结果
            this.result = null;
            this.error = null;
            // this调用自身的方法
            func(this.resolve , this.reject)

        }
        // resolve
        resolve(result){
            // 判断状态
            if(this.status === Commitment.PENDING){
                Commitment.status = Commitment.FULFILLED;
              this.result = result;

            }
        }
        // reject
        reject(error){
            if(this.status === Commitment.PENDING){
                Commitment.status = Commitment.REJECTED;
              this.error = error;

            }
        }
    }

```

### (2).this指向

但是我们测试发现了问题：

```
promise自己写.html:38 Uncaught TypeError: Cannot read properties of undefined (reading 'status')
    at reject (promise自己写.html:38:21)
    at promise自己写.html:49:9
    at new Commitment (promise自己写.html:24:13)
    at promise自己写.html:47:21
```

Cannot read properties of undefined (reading 'status')：this已经跟丢了

解决class的this指向问题：箭头函数、bind或者proxy

```
      constructor(func){
              // 状态
            this.status = Commitment.PENDING;
            // 结果
            this.result = null;
            this.error = null;
            // this调用自身的方法,确保这些方法在被调用时，this 的值指向当前的 Commitment 实例
            func(this.resolve.bind(this) , this.reject.bind(this));

        }
```

- `bind(this)` 会创建一个新的函数，这个新函数的 `this` 值被永久绑定到当前 `Commitment` 实例（即 `this` 指向当前的 `Commitment` 对象）。
- 这样，无论 `resolve` 或 `reject` 方法在哪里被调用，`this` 始终指向 `Commitment` 实例，确保你可以正确访问实例的属性和方法（如 `this.status`、`this.result` 等）。

### (3).then

传入两个参数，一个是成功的回调，一个是失败的回调，但是还要判断条件

```
  promise.then(
        (result) => {
          console.log(result);
        },
        (error) => {
          console.log(error);
        }
      )
```

```
        then(onFULFILLED , onREJECTED){
            // 判断状态
            if(this.status === Commitment.FULFILLED){
                // 执行成功的回调
                onFULFILLED(this.result);
            }
            if(this.status === Commitment.REJECTED){
                // 执行失败的回调
                onREJECTED(this.error);
            }

        }
```

### (4).执行异常

1、执行报错

```
   // 测试
    const promise = new Commitment((resolve, reject) => {
       throw new Error("我报错啦");
    });
```

抛出错误，要识别

```
        // promise一般会传入一个函数且参数为resolve和reject
        constructor(func){
              // 状态
            this.status = Commitment.PENDING;
            // 结果
            this.result = null;
            this.error = null;
            // 在执行之前try...catch捕获错误
            try{
                // this调用自身的方法,确保这些方法在被调用时，this 的值指向当前的 Commitment 实例
               func(this.resolve.bind(this) , this.reject.bind(this));
            }catch(error){
                // 捕获错误
                this.reject(error);
            }

        }
```

2、当传入的then参数不为函数的时候

```

    // 测试
    const promise = new Commitment((resolve, reject) => {
      resolve("成功了");
    });
    promise.then (
      undefined,//成功
       error => { console.log("失败:", error.message); } // 失败回调（可选）
    )
```

我们会发现它报错了，解决方法就是判断类型

```
promise自己写.html:57 Uncaught TypeError: onFULFILLED is not a function
    at Commitment.then (promise自己写.html:57:17)
    at promise自己写.html:72:13
```

```
        // then方法:传入两个参数，一个是成功的回调，一个是失败的回调
        // 但是还要判断条件
        then(onFULFILLED , onREJECTED){
            // 判断状态以及是否为函数
            if(this.status === Commitment.FULFILLED && typeof onFULFILLED === 'function'){
                // 执行成功的回调
                onFULFILLED(this.result);
            }
            if(this.status === Commitment.REJECTED && typeof onREJECTED === 'function'){
                // 执行失败的回调
                onREJECTED(this.error);
            }

        }
```

### (5)异步

then实现异步--setTimeOut

```
     // then方法:传入两个参数，一个是成功的回调，一个是失败的回调
        // 但是还要判断条件
        then(onFULFILLED , onREJECTED){
            // 判断状态以及是否为函数
            if(this.status === Commitment.FULFILLED && typeof onFULFILLED === 'function'){
                // 执行成功的回调
                onFULFILLED(this.result);
            }
            if(this.status === Commitment.REJECTED && typeof onREJECTED === 'function'){
                // 执行失败的回调
                onREJECTED(this.error);
            }

        }
```

resolve是异步的，then也是调用的

原生的promise：

```
 console.log("第一步");
      let promise = new Promise((resolve, reject) => {
      console.log("第二步");

        setTimeout(() => {
       resolve("下次一定");
      console.log("第四步");


        })
      });

      // then的用法
      promise.then(
        (result) => {
          console.log(result);
        },
        (error) => {
          console.log(error);
        }
      )
      console.log("第三步");
```

```
第一步
第二步
第三步
第四步
下次一定
```

但是手写promise

```
   console.log("第一步");
    const promise = new Commitment((resolve, reject) => {
    console.log("第二步");

        setTimeout(() => {  //执行then
             resolve("成功了");
            console.log("第四步");
        }, 0);
   
    });
    promise.then (
      result => {console.log("成功"  , result.message); },//成功
       error => { console.log("失败:", error.message); } // 失败回调（可选）
    )
    console.log("第三步");
```

```
第一步
第二步
第三步
第四步
```

原因：then中状态判断的问题，settimeout之后它就执行then方法了，但是此时的状态还是待定，但是then里面并没有处理待定状态

### (6)回调保存

解决：判定待定状态，保留then里面的函数，所以我们要用数组保存函数

但是我们发现还是有问题resolve和reject是在事件循环末尾执行的，他们也要添加resolve和reject

```
<script>
      //    因为promise的创建是：promise = new Promise(() => {})
      // 所以原生promose我们使用类
      class Commitment {
        // prmise有三种状态,全局定义
        static PENDING = "待定";
        static FULFILLED = "成功";
        static REJECTED = "拒绝";
        // promise一般会传入一个函数且参数为resolve和reject
        constructor(func) {
          // 状态
          this.status = Commitment.PENDING;
          // 结果
          this.result = null;
          this.error = null;
          //   数组：用于保存成功和失败的回调
          this.onFulfilledCallbacks = [];//新增
          this.onRejectedCallbacks = [];//新增
          // 在执行之前try...catch捕获错误
          try {
            // this调用自身的方法,确保这些方法在被调用时，this 的值指向当前的 Commitment 实例
            func(this.resolve.bind(this), this.reject.bind(this));
          } catch (error) {
            // 捕获错误
            this.reject(error);
          }
        }
        // resolve
        resolve(result) {
          setTimeout(() => {
            // 判断状态
            if (this.status === Commitment.PENDING) {
              this.status = Commitment.FULFILLED;
              this.result = result;
              // 执行成功的回调--新增
              this.onFulfilledCallbacks.forEach((callback) => {
                callback(result);
              });
            }
          });
        }
        // reject
        reject(error) {
          setTimeout(() => {
            if (this.status === Commitment.PENDING) {
              this.status = Commitment.REJECTED;
              this.error = error;
              // 执行失败的回调--新增
              this.onRejectedCallbacks.forEach((callback) => {
                callback(error);
              });
            }
          });
        }
        // then方法:传入两个参数，一个是成功的回调，一个是失败的回调
        // 但是还要判断条件
        then(onFULFILLED, onREJECTED) {
          // 判断状态以及是否为函数
          //   如果是待定，就要保存函数到数组里面--新增
          if (this.status === Commitment.PENDING) {
            this.onFulfilledCallbacks.push(onFULFILLED);
            this.onRejectedCallbacks.push(onREJECTED);
          }
          if (
            this.status === Commitment.FULFILLED &&
            typeof onFULFILLED === "function"
          ) {
            // then是异步的
            setTimeout(() => {
              // 执行成功的回调
              onFULFILLED(this.result);
            });
          }
          if (
            this.status === Commitment.REJECTED &&
            typeof onREJECTED === "function"
          ) {
            // then是异步的
            setTimeout(() => {
              // 执行失败的回调
              onREJECTED(this.error);
            });
          }
        }
      }

      // 测试
      console.log("第一步");
      const promise = new Commitment((resolve, reject) => {
        console.log("第二步");
        setTimeout(() => {
          resolve("成功了");
          console.log("第四步");
        }, 0);
      });
      promise.then(
        (result) => {
          console.log(result);
        }, //成功
        (error) => {
          console.log(error);
        } // 失败回调（可选）
      );
      console.log("第三步");
    </script>
```

### (7)链式

promise的链式是新建一个promise对象，我们直接返回this就好了

```
 then(onFULFILLED, onREJECTED) {
          // 判断状态以及是否为函数
          //   如果是待定，就要保存函数到数组里面
          if (this.status === Commitment.PENDING) {
            this.onFulfilledCallbacks.push(onFULFILLED);
            this.onRejectedCallbacks.push(onREJECTED);
          }
          if (
            this.status === Commitment.FULFILLED &&
            typeof onFULFILLED === "function"
          ) {
            // then是异步的
            setTimeout(() => {
              // 执行成功的回调
              onFULFILLED(this.result);
            });
          }
          if (
            this.status === Commitment.REJECTED &&
            typeof onREJECTED === "function"
          ) {
            // then是异步的
            setTimeout(() => {
              // 执行失败的回调
              onREJECTED(this.error);
            });
          }
          return this; // 返回当前的promise对象
        }
      }
```

为什么直接返回this可以实现回调呢？？？

方法调用和返回值

在 JavaScript 中，方法的调用（例如 `obj.method()`）会返回方法的返回值。

如果方法返回 `this`（即对象本身），那么调用该方法后，你仍然持有对该对象的引用。

链式调用的实现

当你调用

```
obj.method1().method2()
```

时：

obj.method1()` 被调用，并返回 `obj`（因为 `method1` 返回 `this`）。`

 `然后 `method2()` 被调用，其调用者仍然是 `obj`。

这样，你可以连续调用多个方法，形成链式调用。

**总结：**手写 Promise 的核心在于实现状态管理、异步回调和链式调用。首先，Promise 有三种状态（pending/fulfilled/rejected），通过构造函数接收执行器函数，并用 `resolve` 和 `reject` 更新状态。

关键点包括：**状态管理：**初始为 `pending`，调用 `resolve` 或 `reject` 后不可逆地变为 `fulfilled` 或 `rejected`。**异步回调：**`then` 方法需异步执行回调（用 `setTimeout`），若状态为 `pending`，需将回调存入数组，待状态变更后遍历执行。**错误捕获：**构造函数中用 `try/catch` 捕获执行器函数的同步错误，并调用 `reject`。**链式调用：**`then` 返回 `this`，使后续 `then` 能继续绑定回调，形成链式调用。

最终实现需确保：

- 状态变更后异步触发回调。
- 回调参数类型检查（非函数则忽略）。
- 链式调用通过返回 `this` 实现。

## 5、promise.all

**首先promise.all的作用：**

all主要用来解决多个异步操作的调用问题，类似于Promise.all的功能。

```
        function p1 (){
            return new Promise((resolve , reject) => {
                setTimeout(() => {
                    resolve('p1 resolved');
                }, 1000);
            })
        }
        function p2 (){
            return new Promise((resolve , reject) => {
                resolve('p2 resolved');
            })
        }
        Promise.all([p1(), p2()]).then((results) => {
            console.log(results); // ['p1 resolved', 'p2 resolved']
        }).catch((error) => {
            console.error(error);
        });
```

因为p1是有setTimeout的，所以p1会在1秒后执行，而p2是立即执行的，所以p1和p2的结果会在1秒后一起输出。但是我们使用了 Promise.all，所以它会等待所有的 Promise 都完成后再执行 then 方法。这就是为什么结果是 ['p1 resolved', 'p2 resolved']，而不是 ['p2 resolved', 'p1 resolved']。

**开始手写：**

- all方法是静态方法，所以不需要实例化
- all方法的返回值是一个新的promise对象，这个新的promise对象的结果是一个数组，数组的长度和传入的数组长度一致
- 如果有一个失败，就直接reject
-  如果所有的都成功，就resolve一个数组，数组的长度和传入的数组长度一致
- for循环一下子就执行完了，但是有异步执行的操作，我们要设一个计数器，当数组的长度和传入的数组长度一致的时候，就要reject

```
        static all(array){
          let res = []; //存放结果的数组
          let count = 0; // 计数器
          return new Commitment((resolve , reject) => {
          // 添加数据的函数
          function addData (key , value){
            res[key] = value;
            count++; // 每添加一个数据就加1
            // 如果计数器等于数组长度，就说明所有数据都添加完了
            if(count === array.length){
              // 说明所有数据都添加完了，就resolve
              resolve(res);//保证所有数据都添加完了才resolve,因为for循环一下子就执行完了，但是有异步执行的操作
            }
          }
            // 循环
            for(let i = 0 ; i < array.length ; i++){
              let cur = array[i];
              // 判断是否是普通值
              if(cur instanceof Commitment){
                // 如果不是，执行promise，注意如果有一个失败，就直接reject
                cur.then((value) => addData(i , value) , (error) => reject(error));
              }else {
                // 如果是，直接添加到结果数组中
                addData(i , cur);
              }
            }

          })


        }
```

**总结一下：**promise.all方法主要是处理多个异步的调用问题，传入一个数组，返回的是新的promise对象，它是静态方式。所以传入数组后我们循环遍历了这个数组，如果它是普通值，如果是就要直接添加到结果数组里卖弄，如果不是，then等待结果，只要有一个错误，那么就直接reject，最后当结果数组的长度和传入数组的长度相同的时候就要resolve啦~~

## 6、promise.race

**Promise.race()** 静态方法接受一个 promise 可迭代对象作为输入，并返回一个 [`Promise`](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Promise)。这个返回的 promise 会随着第一个 promise 的敲定而敲定。

比如说：

```
    //   原生promiserace;
      const p1 = new Promise((resolve, reject) => {
        setTimeout(() => {
          resolve("p1");
        }, 500);
      });
      const p2 = new Promise((resolve, reject) => {
        setTimeout(() => {
          resolve("p2");
        }, 100);
      });
      Promise.race([p1, p2]).then((value) => {
        console.log(value); //p1
      });
```

**手写promise.race：**

- 输入可迭代的数组
- 输出返回应该promise
- 第一个完成的话就要全部结束，所以我们要设定标志词
- 如果传入的不是promise怎么办，使用promise.relove将每个元素转换为Promise，以处理非Promise的情况。

**代码如下：**

```
      //  promise.race
        static race(array){
        // 判断是否为空
        if(array.length === 0){
          return ;
        }
        // 返回应该鑫的promise
        return new Commitment((resolve , reject) => {
                   // 标志
          let close = false;
          // 开始遍历
          array.forEach((item) =>{
            Promise.resolve(item).then((res) => {
              if(!close){
                close = true;
                resolve(res);
              }

            }).catch((error) => {
              if(!close){
                close = true;
                reject(error);
              }
            })

          })

        })
        }
```

## 7、手写防抖函数

**什么是防抖函数？举个例子！**

当你在上电梯的时候，你准备关门，关门的时间是2s，但是在此期间有人进来了，你又要关门，时间又是2s.

**什么场景下可以使用防抖函数？**

键盘输入实时搜索时input事件防抖，浏览器窗口改变resize事件防抖等等。

**三个条件：**

高频，耗时、以最后一次为准

```
        function  debounce(fn , wait){
            let timer = null;
            return function(){
<<<<<<< HEAD
            let context = this;
            let args = arguments ; 
                clearTimeout(timer);
                timer = setTimeout(() => {
                    fn.apply(context , args);//保证函数的上下文和参数与原始调用时一致
=======
                clearTimeout(timer);
                timer = setTimeout(() => {
                    fn();
>>>>>>> 42a7aba2d6cd41f3ff44d060a1dafecff7a79dc6
                } , wait)
            }
        }
```

<<<<<<< HEAD
## 8、节流函数

**什么是节流函数？**

指规定一个单位时间，在这个单位时间内，只能有一次触发事件的回调函数执行，如果在同一个单位时间内某事件被触发多次，只有一次能生效。

**与防抖函数有什么区别？**

防抖函数是延迟函数执行，直到事件停止触发一段时间后再执行，适用于需要等待事件停止触发后再执行的场景。而节流函数则是控制函数在指定时间内只执行一次，适用于需要控制执行频率的场景。

```
   function throttle(fn, wait) {
        let preTime = new Date();
        return function () {
            let context = this;
            let args = arguments;
            let curTime = new Date();
            let during = curTime - preTime;
            if (during > wait) {
                // 当时间大于等待时间的时候
                // 执行函数
                fn.apply(context, args);
                // 更新 preTime
                preTime = curTime;
            }
        };
    }
```












































































=======
>>>>>>> 
8、节流函数

什么是节流函数？

指规定一个单位时间，在这个单位时间内，只能有一次触发事件的回调函数执行，如果在同一个单位时间内某事件被触发多次，只有一次能生效。

与防抖函数有什么区别？

防抖函数是延迟函数执行，直到事件停止触发一段时间后再执行，适用于需要等待事件停止触发后再执行的场景。而节流函数则是控制函数在指定时间内只执行一次，适用于需要控制执行频率的场景。

       function throttle(fn, wait) {
            let preTime = new Date();
            return function () {
                let context = this;
                let args = arguments;
                let curTime = new Date();
                let during = curTime - preTime;
                if (during > wait) {
                    // 当时间大于等待时间的时候
                    // 执行函数
                    fn.apply(context, args);
                    // 更新 preTime
                    preTime = curTime;
                }
            };
        }

>>>>>>> 41d893d478ec2e39e1d18bf2009db746f08864c5

##   9、手写类型判断函数

 手写完成这个函数：输入一个对象(value)，返回它的类型

**js中的数据类型：**

- 值类型：String、Number、Boolean、Null、Undefied、Symbol
- 引用类型：Object、Array、Function、RegExp、Date

使用typeOf判断类型，但是null返回的是object， 只能判断值类型，其他返回的是object，Object.prototype.toString.call():判断数据类型

**大概思路：**

先使用typeof判断输入对象的类型，如果是值类型就直接返回typeof识别到的类型，如果不是就要使用Object.prototype.toString.call()返回表示对象类型的字符串。

**代码：**

```
    function getType(value){
            // 对于null要添加一个特殊的检查
            if(value === null){
                return value + "";
            }
            // 分两个方面：直接使用typeof和使用Object.prototype.toString.call
            // 如果是值类型：、
            if(typeof value !== 'object'){//小写
                return typeof value;
            }else {
                // 如果是对象，就要使用Object.prototype.toString.call
                const valueContext = Object.prototype.toString.call(value).slice(8 , -1).toLowerCase();
                return valueContext;
            }
        }
```

**为什么要使用call???**

- `Object.prototype.toString` 直接调用时，`this` 默认指向 `Object.prototype`，因此返回 `"[object Object]"`。
- `Object.prototype.toString.call(value)` 使用 `call` 方法调用时，可以显式地指定 `this` 的值为 `value`，因此返回 `value` 的字符串表示。


```
    function getType(value){
            // 对于null要添加一个特殊的检查
            if(value === null){
                return value + "";
            }
            // 分两个方面：直接使用typeof和使用Object.prototype.toString.call
            // 如果是值类型：、
            if(typeof value !== 'object'){//小写
                return typeof value;
            }else {
                // 如果是对象，就要使用Object.prototype.toString.call
                const valueContext = Object.prototype.toString.call(value).slice(8 , -1).toLowerCase();
                return valueContext;
            }
        }
```

**为什么要使用call???**

- `Object.prototype.toString` 直接调用时，`this` 默认指向 `Object.prototype`，因此返回 `"[object Object]"`。
- `Object.prototype.toString.call(value)` 使用 `call` 方法调用时，可以显式地指定 `this` 的值为 `value`，因此返回 `value` 的字符串表示。


## 10、手写call函数

1. **call 方法的作用**：改变函数的 `this` 指向并立即执行该函数
2. **手动实现 call 的原理**：通过将函数作为对象的方法调用来改变 `this` 指向

**代码如下：**

```
       Function.prototype.myCall = function (obj , ...args){
            // 判断this是否为函数，只有函数才可以进行后面的调用
            if(typeof this !== 'function'){
                throw new TypeError("this not a function")
            }
            // 当obj为null或者undefied的时候obj是globalThis,其他都是对象
            obj = (obj === null || obj === undefied ) ? globalThis : Object(obj);
            // 大致的结构就是改变this指向加执行函数
            // 我们最开始是直接添加一个fn的属性，但是我们是通用的，很有可能属性会相同
            // 我们使用 es6的symbol：Symbol 来避免属性名冲突
            const key = Symbol('temp');
            obj[key] = this;
            // 当存在值的时候，要接收
            const res = obj[key](...args);
            delete obj[key];
            return res;
        }
```

**重要知识点：**

1.Symbol 的作用

- 创建唯一的属性名，避免命名冲突
- 适合用于临时属性的键名

2.参数处理

- 使用剩余参数 `...args` 收集所有传入参数
- 展开运算符 `...` 用于传递参数列表

3.边界情况处理

- 检查调用者是否为函数
- 处理 `null`/`undefined` 上下文的情况
- 确保不污染传入的对象

## 11、手写apply方法

**apply方法的作用：**

`apply` 是一个函数的方法，它允许你调用一个函数，同时将函数的 `this` 值设置为指定的值，并将函数的参数作为数组（或类数组对象）传递给该函数。

**与call的区别：**

最大的区别就是参数部分：

apply：

```
function greet(greeting, name) {
  console.log(greeting + ', ' + name);
}

var args = ['Hello', 'Alice'];
greet.apply(null, args); // 输出: Hello, Alice

```

call：

```
function greet(greeting, name) {
  console.log(greeting + ', ' + name);
}

greet.call(null, 'Hello', 'Alice'); // 输出: Hello, Alice

```

所以在手写的时候我们格外要注意**apply当中参数**的解决：与call不同的就是，apply里面对于args的处理不再是...args，因为传递的是一个数组，通过扩展运算符处理数组就好。

```
             // 手写aooly
        Function.prototype.myApply = function (obj, args) {//args是数组
            // 先判断this是不是函数
            if (typeof this !== 'function') {
                throw new TypeError("this is not a function")
            }
            // 如果是null或者undefied
            obj = obj === null || obj === undefined ? globalThis : Object(obj);
            //    属性唯一
            const key = Symbol('temp');
            obj[key] = this;
            let res = null;
            // 要对args进行判断：null或者undefied
            // 这里要注意一下：对args进行判断
            // args == null 在 JavaScript 中等价于 args === null || args === undefined。
            if (args == null) {
                res = obj[key]();
            } else {
                res = obj[key](...args);
            }
            // 删除属性、
            delete obj[key];
            return res;
        }
```

是否对args进行判断：

- 在实现 `myCall` 方法时，通常不需要对 `args` 进行判断，因为 `myCall` 方法的设计就是接受多个参数，从第二个参数开始，每个参数都会作为函数的参数传递。因此，`args` 参数是一个可变参数列表，不需要进行额外的判断。
- 然而，在实现 `myApply` 方法时，需要对 `args` 进行判断，因为 `myApply` 方法接受一个数组或类数组对象作为参数，需要检查 `args` 是否为 `null` 或 `undefined`，如果是，则不传递任何参数；否则，使用扩展运算符 `...args` 来传递参数。


## 12、手写bind方法

`bind` 是 Function 对象的一个方法，它主要用于创建一个新的函数，并绑定该函数的 `this` 值以及预设的参数。`bind` 方法允许你在调用函数时，指定函数的 `this` 值，并可以预先填充部分参数。

与call、apply的共性：**改变this指向**

但是bind与她们不相同的就是**返回一个函数**，在函数当中执行this指向的函数，这里会面临一个问题：**this是否还会指向原来的函数？？？**

答案是不会，**所以我们要事先接收this指向的函数.**

**代码：**

```
    // 1、创建bind函数，传入obj和参数
        Function.prototype.myBind= function(obj , ...bindAgrs){
            // 2.判断this
            if(typeof this !== 'function'){
                throw TypeError("this is not a function")
            }
            // 3.保存函数引用:后面会使用到的
            const self = this;
            // 4.返回的是function,function也是会传入参数的
            return function(...callArgs){
                // 5.执行这个函数(self)，我们也是新建一个属性
                const key = Symbol('temp');
                // 注意！！！判断是否为空
                obj = obj ==null ? globalThis : Object(obj);
                // obj[key] = this;
                // 这里的 this 在返回的新函数中，指向调用新函数的对象（比如 window），而不是原始要绑定的函数。
                obj[key] = self;
                // 执行可能返回数据
                const res = obj[key](...bindAgrs  , ...callArgs);
                delete obj[key];
                return res;
            }

        }
```

**注意：**

在返回的函数里面也是要接收参数的

## 13、手写函数柯里化

它将一个接受多个参数的函数转换为一系列只接受一个参数的函数

举个例子：

```
 function add(a, b) {
            return a + b;
        }
        console.log(add(2, 3)); // 输出：5
        // 柯里化后：
        function curriedAdd(a) {
            return function (b) {
                return a + b;
            };
        }
        const add2 = curriedAdd(2); // 固定第一个参数为 2
        console.log(add2(3)); // 输出：

```

柯里化   

- 传入：一个函数，但是有多个参数
- 目的：就是把多个参数进行链式调用

```
        let currying = function (func) {
            // 参数
            // let args = [];//这样的话,每次调用currying,都会指向第一次的args
            // 返回函数进行链式调用,，也需要传递参数
            return function curried(...args) {
                // 每次链式调用都应该有自己的参数收集，可以这样递归实现：

                return function result(...res) {
                    // 当res的长度为0(不调用参数的时候，就代表要执行函数)
                    if (res.length === 0) {
                        return func(...args)
                    } else {
                        // 当在执行函数之前，就要保存参数,进行链式调用
                        args.push(...res);
                        return result;
                    }
                }

            }

        }
```

进行改进：

```
        // 柯里化函数：传入一个函数
        let currying = function (func) {
            // 开始递归返回函数
            // ...args可以收集函数
            return function curried(...args) {
                // 如果参数数量足够，执行原函数
                // 如果收集的函数参数大于等于了原函数的参数,就可以直接执行了
                if (args.length >= func.length) {
                    return func.apply(this, args);
                }
                // 否则返回一个新函数继续收集参数
                // 当参数不足时，返回一个新函数继续收集参数
                // 新函数将之前收集的参数(args)与新传入的参数(newArgs)合并
                return function (...newArgs) {
                    // 这里就是链式调用
                    return curried.apply(this, args.concat(newArgs));
                };
            };
        };
```

我写的一些问题：

1. **结构复杂**：嵌套了两个函数（`curried`和`result`），逻辑不够直观
2. **参数收集不完整**：只收集了第二次及以后的参数，第一次调用的参数没有被收集
3. **递归使用不当**：`result`函数的递归调用方式不够优雅
4. **链式调用逻辑有误**：当传入空参数时才执行函数，这与柯里化的常见实现方式不同

## 14、实现ajax请求

通过 JavaScript 的 异步通信，从服务器获取 XML 文档从中提取数据，再更新当前网页的对应部分，而不用刷新整个网页。

**步骤：**

- 创建一个 XMLHttpRequest 对象。
- 设置超时时间。
- 定义成功和失败的回调函数。
- 监听请求状态变化，并在请求完成时检查 HTTP 状态码，调用相应的回调函数。
- 处理网络错误和超时错误。
- 打开请求，设置请求头和响应类型，并发送请求。

**代码：**

```
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
```

## 15、使用Promise封装AJAX请求

promise就有reject和resolve了，就不必写成功和失败的回调函数了

```
   const BASEURL = './手写ajax/test.json'
        function promiseAjax() {
            return new Promise((resolve, reject) => {
                const xhr = new XMLHttpRequest();
                xhr.open("get", BASEURL, true);
                // 设置请求头
                xhr.setRequestHeader("accept", "application/json");
                // 设置超时时间\
                const timeout = 1000;
                xhr.timeout = timeout;
                // 监听状态:箭头函数没有this
                xhr.onreadystatechange =  () =>  {
                    // 监听ajax
                    if (xhr.readyState !== 4) {
                        return;
                    }
                    // 监听http
                    if ((xhr.status >= 200 && xhr.status < 300) || xhr.status === 304) {
                        resolve(xhr.response)
                    } else {
                        reject(new Error(xhr.statusText))
                    }
                }
                // 处理错误情况
                xhr.onerror = () =>  {
                    reject(new Error(xhr.statusText))
                }
                xhr.ontimeout =  () =>  {
                    reject(new Error(xhr.statusText))
                }
                // 设置格式\
                xhr.responseType = "json"
                // 发送请求
                xhr.send(null);
            })
        }
        // 测试调用
        promiseAjax().then(
            res => console.log("成功：", res),
            err => console.error("失败：", err)
        );
```

## 16、浅拷贝

如果拷贝的是基本数据类型，拷贝的就是基本数据类型的值(直接赋值)，如果是引用数据类型，拷贝的就是内存地址。如果其中一个对象的引用内存地址发生改变，另一个对象也会发生变化。(动态的)

**看看各种浅拷贝：**

- es6的浅拷贝 :assign

  ```
  const obj1 = { a: 1, b: 2 };
          const obj2 = { c: 3, d: 4 };
          const shallowCopy1 = Object.assign({}, obj1, obj2);
          console.log('es6浅拷贝:', shallowCopy1); // { a: 1, b: 2, c: 3, d: 4 }
  ```

- 扩展运算符

  ```
   const shallowCopy2 = { ...obj1, ...obj2 };
          console.log('扩展运算符浅拷贝:', shallowCopy2); // { a: 3, b: 4 }
  ```

- 数组中的方法：slice

  ```
          const arr = [1, 2, 3, 4];
          const shallowCopy3 = arr.slice();
          console.log('数组slice浅拷贝:', shallowCopy3); // [1, 2, 3, 4]
  ```

- concat:合并两个或多个数组。此方法不会更改现有数组，而是返回一个新数组。

  ```
    const arr2 = [5, 6, 7];
          const shallowCopy4 = arr.concat(arr2);
          console.log('数组concat浅拷贝:', shallowCopy4); // [1, 2, 3, 4, 5, 6, 7]
  ```

  ​

**浅拷贝的核心逻辑是：**

1. 判断输入是否为对象
   - 如果不是对象（如 `number`、`string`），直接返回原值（因为基本类型不需要拷贝）。
   - 如果是对象或数组，则创建一个新对象/数组。
2. 遍历属性并复制
   - 使用 `for...in` 遍历对象的所有可枚举属性。
   - 用 `hasOwnProperty` 过滤掉原型链上的属性，只拷贝自身属性。
   - 将属性值直接赋给新对象（如果是对象，则保持引用）。

**代码：**

```
    function shallowCopy(obj) {
            // 判断obj是否为对象，只拷贝对象
            if (!obj || typeof obj !== 'object') {
                return obj;
            }
            // 判断obj的类型
            const newObj = Array.isArray(obj) ? [] : {};
            // 进行遍历，是obj的属性我们才进行拷贝
            // 仅对对象和数组及逆行拷贝
            for (let key in obj) {
                if (obj.hasOwnProperty(key)) {
                    newObj[key] = obj[key];
                }
            }
            // 返回 newObj;
            return newObj;
        }
```

**浅拷贝的局限性：**

浅拷贝只能处理**一层**的拷贝：

- 如果对象的属性是**嵌套对象**，浅拷贝只会复制引用，而不是新对象。





