# qc-babel-test
Babel让ES5+可以应用到node或者低版本的浏览器上

# run
1. yarn install  
2. yarn babel  
3. yarn test
4. yarn parse

# des
```
Pre:
babel的配置项可以写入.babelrc文件中
也可以在package.json中加："babel":{}
只需要一种就可以，建议第一种

------------------------------------------------------

Babel 把 Javascript 语法 分为 Syntax 和 API
1、Syntax：像 let/ const / class / Arrow Function / Decorators 等等这些，我们在 Javascript 在运行时无法重写的

2、API：指那些我们可以通过 函数重新覆盖的语法 ，类似 includes / map / includes/ Promise 凡是我们能想到重写的都可以归属到 API

其中preset-env可以解决大多数的Syntax转译

--------------------------------------------
API的转译使用polyfill
当然preset-env里边也有相应的内置，可以使用useBuiltIns
实现API的转译：
[
    "@babel/preset-env",
    {
        "useBuiltIns": "usage"
    }
]
--------------------------------------------
一些静态相关的问题，使用插件
@babel/plugin-proposal-class-properties

--------------------------------------------
转译过程中公用的方法给提出来，防止在单个文件中重复定义
需要使用插件：
@babel/runtime

当然我们有更好的选择，使用：
@babel/plugin-transform-runtime

我们还可以加个corejs选项以便能够构建沙盒，
使工具包里边的编译不影响外部环境
["@babel/plugin-transform-runtime", {
    "corejs": 3
}]

---------------------------------------------
最后为了让babel指令能够执行，我们还需要安装一个工具包：
@babel/cli
这样package.json中的
"scripts": {
    "babel": "babel src --out-dir lib --watch",
},
就可以执行了
yarn babel

----------------------------------------------
babel主要可以作转译操作，写了个简单的将js代码转
AST的操作，放在了根目录下的
babel-parse.js里可以看下

```

# example

[rxsub-build](https://github.com/canwhite/rxsub-build)