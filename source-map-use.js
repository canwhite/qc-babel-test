//yarn add source-map README.md中有完整的实现过程
const {SourceMapGenerator} = require("source-map")
console.log(SourceMapGenerator);

/* 
var map = new SourceMapGenerator({file: "source-mapped.js"});
  
map.addMapping({
    generated: {
        line: 10,
        column: 35
    },
    source: "foo.js",//源头文件
    
    original: {
        line: 33,
        column: 2
    },
    name: "christopher"
});

console.log(map.toString()); */


/* 
PS:输出

// '{"version":3,"file":"source-mapped.js",
//   "sources":["foo.js"],"names":["christopher"],"mappings":";;;;;;;;;mCAgCEA"}'


PS：解析一

// •version：顾名思义，指代了版本号，目前 source map 标准的版本为 3，也就是说这份 source map 使用的是第三版标准产出的
// •file：编译后的文件名
// •names：一个优化用的字段，后续会在 mappings 中用到
// •sources：多个源文件名
// •mappings：这是最重要的内容，表示了源代码及编译后代码的关系，但是先略过这块，下文中会详细解释



PS：解析二

generated和original的区别在于产生的结果有差别
original产出：
{ 
    source: 'http://example.com/www/js/two.js',
    line: 33,
    column: 2,
    name: 'christopher'
} 
generated产出：
{
    line:10,
    column:35
}

    */
  

