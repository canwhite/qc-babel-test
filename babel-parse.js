//既然是转义工具，必然有自己转译的一套东西
const parser = require('@babel/parser');
const traverse = require('@babel/traverse').default;
const code = `
  function func() {
    const guang = 'guang';
    function func2() {
      const ssh = 'ssh';
      {
        function func3 () {
          const suzhe = 'suzhe';
        }
      }
    }
  }
`;

const ast = parser.parse(code);

traverse(ast, {
  FunctionDeclaration (path) {
    if (path.get('id.name').node === 'func3') {
      console.log(path.scope.dump());
    }
  }
})

/*
//输出
# FunctionDeclaration
 - suzhe { constant: true, references: 0, violations: 0, kind: 'const' 
}
# BlockStatement
 - func3 { constant: true, references: 0, violations: 0, kind: 'hoisted' }
# FunctionDeclaration
 - ssh { constant: true, references: 0, violations: 0, kind: 'const' } 
# FunctionDeclaration
 - guang { constant: true, references: 0, violations: 0, kind: 'const' 
}
 - func2 { constant: true, references: 0, violations: 0, kind: 'hoisted' }
# Program
 - func { constant: true, references: 0, violations: 0, kind: 'hoisted' } */
