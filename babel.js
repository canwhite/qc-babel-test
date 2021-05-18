
//babel parser 对 acorn 的扩展。
const acorn = require("acorn");
const Parser = acorn.Parser;

var literalExtend = function(Parser) {

    return class extends Parser {
        //继承 + 重写
        parseLiteral (...args) {
            const node = super.parseLiteral(...args);
            switch(typeof node.value) {
                case 'number':
                    node.type = 'NumericLiteral';
                    break;
                case 'string':
                    node.type = 'StringLiteral';
                    break;
            }
            return  node;
        }
    }
}


const newParser = Parser.extend(literalExtend);


/* const ast = newParser.parse(`
const a = 1,b=2,c=3;
const d=4,e=5;
`); */
// console.log(JSON.stringify(ast, null, 2));

/*type部分
主要是AST
怎么遍历-visitor
怎么创建-builder
怎么判断-fields.validate
以及别名-alias

*/
const AST_DEFINATIONS_MAP = new Map();

AST_DEFINATIONS_MAP.set('Program', {
    visitor: ['body']
});
AST_DEFINATIONS_MAP.set('VariableDeclaration', {
    visitor: ['declarations']
});
AST_DEFINATIONS_MAP.set('VariableDeclarator', {
    visitor: ['id', 'init']
});
AST_DEFINATIONS_MAP.set('Identifier', {});
AST_DEFINATIONS_MAP.set('NumericLiteral', {});

const astDefinationsMap = AST_DEFINATIONS_MAP;


/*
{
  "type": "Program",
  "start": 0,
  "end": 18,
  "body": [
    {
      "type": "VariableDeclaration",
      "start": 5,
      "end": 17,
      "declarations": [
        {
          "type": "VariableDeclarator",
          "start": 11,
          "end": 16,
          "id": {
            "type": "Identifier",
            "start": 11,
            "end": 12,
            "name": "b"
          },
          "init": {
            "type": "NumericLiteral",
            "start": 15,
            "end": 16,
            "value": 1,
            "raw": "1"
          }
        }
      ],
      "kind": "const"
    }
  ],
  "sourceType": "script"
}

*/


//为了植入path这里封装一个类
class NodePath{
    constructor(node, parent, parentPath,key,listKey) {
        this.node = node;
        this.parent = parent;
        this.parentPath = parentPath;
        //parent可以保存，同理sibling也可以
        //也就是说我们可以通过path拿到所有的AST
        //首先我们把遍历到的AST属性对应的key和如果是数组的时候对应的listKey都保存下来
        this.key = key;
        this.listKey = listKey;
    }
    //但是直接操作AST比较麻烦，所以我们提供一些api来简化操作
    //基于key和listKey来实现replaceWith和remove得api
    replaceWith(node) {
        if (this.listKey) {
            this.parent[this.key].splice(this.listKey, 1, node);
        }
        this.parent[this.key] = node
    }
    remove () {
        if (this.listKey) {
            this.parent[this.key].splice(this.listKey, 1);
        }
        this.parent[this.key] = null;
    }

}

//加了parent，parentPath
function traverse(node, visitors, parent, parentPath,key,listKey) {
    /*console.log(node.type);
    Program
    VariableDeclaration
    VariableDeclarator
    Identifier
    NumericLiteral */


    const defination = astDefinationsMap.get(node.type);
    /* console.log(node.type + ":",defination);
    Program: { visitor: [ 'body' ] }
    VariableDeclaration: { visitor: [ 'declarations' ] }
    VariableDeclarator: { visitor: [ 'id', 'init' ] }
    Identifier: {}
    NumericLiteral: {} */


    /* 
    
    const visitorFunc = visitors[node.type] || {};
    if(visitorFunc && typeof visitorFunc === 'function') {
        visitorFunc(node);
    } */

    /* babel 的 visitor 也支持指定 enter、exit 来选择在遍历子节点之前和之后调用，
    如果传入的是函数，那么就被当做 enter,所以在原来的基础上作些修改 */

    //因为要更改，所以也不能用const
    let visitorFuncs = visitors[node.type] || {};

    if(typeof visitorFuncs === 'function') {
        visitorFuncs = {
            enter: visitorFuncs
        }
    }

    //引入path，看下边的遍历就会知道
    //traverse(childNode, visitors, node, path);以下几个参数的赋值来自于这里
    const path = new NodePath(node, parent, parentPath,key,listKey);

    //遍历节点之前调用,将node换成path
    visitorFuncs.enter && visitorFuncs.enter(path);

    //遍历
    if (defination.visitor) {
        defination.visitor.forEach(key => {
            const prop = node[key];
            if (Array.isArray(prop)) { // 如果该属性是数组
                prop.forEach((childNode,index) => {
                    //值的起点：traverse(node, visitors, parent, parentPath,key,listKey) 
                    traverse(childNode, visitors, node, path, key , index);
                })
            } else {
                traverse(prop, visitors, node, path,key);
            }
        })
    }
    //等上边得遍历完了，生成树了之后，我们这里再去遍历获取
    //这部分得实现是在visitor内部
    visitorFuncs.exit && visitorFuncs.exit(path);
}


/* 
-------------------------------------------------------
types 包用于创建 AST，会维护创建和判断各种 AST 的 api，
并且提供每种 AST 需要遍历的属性是哪些，用于 traverse 的过程
-------------------------------------------------------
template 包是批量创建 AST 的，这里我们实现一个简单的版本，
传入字符串，parse 成 AST 返回。
-------------------------------------------------------
 */
function template(code) {
    return newParser.parse(code);
}
template.expression = function(code) {
    console.log(template(code));
    console.log("==================");
    return template(code).body[0].expression;
}


/*
param1:ast
param2:visistor
*/

//引入path之后，我们可以在visitor中拿到父节点，父节点的父节点
//babel本身就提供了path的功能
traverse(
    ast, 
    //visitor
    {
        Identifier:{
            //exit在这里加了，enter在traverse里边加吧
            exit(path){
                path.node.name = 'b';
                //将path对象给到curPath
                let curPath = path;
                while(curPath){
                    //输出type
                    console.log(curPath.node.type);
                    //指向
                    curPath = curPath.parentPath;
                }
            }
        },
        //会被遍历的
        /* NumericLiteral(path) {
            //NumericLiteral被替换成了Identifier，通过传入字面量来更改，
            //babel是通过types包来提供创建AST的能力
            path.replaceWith(template.expression('bbb'));
        } */
        NumericLiteral(path) {
            if (path.node.value === 2) {
                path.replaceWith(template.expression('aaaaa'));
            }
        }
    }
);
//后边的2是子一级空格
// console.log(JSON.stringify(ast, null, 2));


class Printer {
    constructor () {
        this.buf = '';
    }

    space() {
        this.buf += ' ';
    }

    nextLine() {
        this.buf += '\n';
    }

    Program (node) {
        node.body.forEach(item => {
            this[item.type](item) + ';';
            this.nextLine();
        });

    }
    VariableDeclaration(node) {
        this.buf += node.kind;
        this.space();
        node.declarations.forEach((declaration, index) => {
            if (index != 0) {
                this.buf += ',';
            }
            this[declaration.type](declaration);
        });
        this.buf += ';';
    }
    VariableDeclarator(node) {
        this[node.id.type](node.id);
        this.buf += '=';
        this[node.init.type](node.init);
    }
    Identifier(node) {
        this.buf += node.name;
    }
    NumericLiteral(node) {
        this.buf += node.value;
    }

}
class Generator extends Printer{

    generate(node) {
        this[node.type](node);
        return this.buf;
    }
}
//上边是对AST的增删改,generate就是一个拼接字符串的过程，打印目标代码
function generate (node) {
    return new Generator().generate(node);
}

//更改之后的目标
// console.log(generate(ast));

//可以用core整合为一个整体
function transformSync(code, options) {
    const ast = newParser.parse(code);

    const pluginApi = {
        template
    }
    const visitors = {};
    options.plugins.forEach(([plugin, options]) => {
        const res = plugin(pluginApi, options);
        Object.assign(visitors, res.visitor);
    })

    traverse(ast, visitors);
    return generate(ast);
}

const sourceCode = `
const a = 1;
`;

const code = transformSync(sourceCode, {
    plugins: [
        [
            function plugin1(api, options) {
                return {
                    visitor: {
                        Identifier(path) {
                                // path.node.value = 2222;
                                path.replaceWith(api.template.expression(options.replaceName));
                        }
                    }
                }
            },
            {
                replaceName: 'ddddd'
            }
        ]
    ]
});
console.log(code);

/*
我们梳理了 babel 的编译流程和内置的包的各自的功能，然后明确了我们要实现的包：
parser、traverse、generate、types、template、core。接下来依次做了实现或梳理了实现思路。

parser 包基于 acorn，babel 是 fork 自 acorn，我们是直接基于 acorn 插件来修改 AST。
我们实现了 Literal 的 AST 的扩展。

traverse 包负责遍历 AST，我们通过记录 visitor key 实现了 AST 的深度优先遍历，
并且在遍历的过程中调用 visitor，而且还支持 enter 和 exit 两个阶段的调用。
visitor 传入的参数支持了 path，可以拿到 parent，
可以调用 replaceWith 和 remove 等 api。我们还梳理了实现 scope 的思路。

遍历之修改之后重新生成
types 和 template 都是用于创建 AST 的，
我们梳理了 types 的实现思路，就是递归创建 AST 然后组装，
实现了简单的 template，使用直接从字符串 parse 的方式。

generate 包负责把修改以后的 AST 打印成目标代码以及生成 sourcemap，
我们实现了代码的打印。梳理了 sourcemap 的思路。

core 包是整个编译流程的集成，而且支持 plugins 和 preset，
我们实现了 transformSync 的 api，也支持了 plugin 的调用。

上面就是 babel 的实现思路，细化一下是能够实现一个完整功能的 babel 的。

*/