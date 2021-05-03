//既然是转义工具，必然有自己转义的一套东西
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