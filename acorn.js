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

const ast = newParser.parse(`
    const a = 1;
`);
console.log(JSON.stringify(ast, null, 2));

