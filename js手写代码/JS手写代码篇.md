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

