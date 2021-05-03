"use strict";

var _Reflect$construct = require("@babel/runtime-corejs3/core-js-stable/reflect/construct");

var _Object$defineProperty = require("@babel/runtime-corejs3/core-js-stable/object/define-property");

var _interopRequireDefault = require("@babel/runtime-corejs3/helpers/interopRequireDefault");

_Object$defineProperty(exports, "__esModule", {
  value: true
});

exports["default"] = void 0;

var _inherits2 = _interopRequireDefault(require("@babel/runtime-corejs3/helpers/inherits"));

var _possibleConstructorReturn2 = _interopRequireDefault(require("@babel/runtime-corejs3/helpers/possibleConstructorReturn"));

var _getPrototypeOf2 = _interopRequireDefault(require("@babel/runtime-corejs3/helpers/getPrototypeOf"));

var _classCallCheck2 = _interopRequireDefault(require("@babel/runtime-corejs3/helpers/classCallCheck"));

var _createClass2 = _interopRequireDefault(require("@babel/runtime-corejs3/helpers/createClass"));

var _includes = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/instance/includes"));

var _assign = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/object/assign"));

var _promise = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/promise"));

var _setTimeout2 = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/set-timeout"));

var _set = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/set"));

var _map = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/map"));

var _utils = require("./utils");

var _context;

function _createSuper(Derived) { var hasNativeReflectConstruct = _isNativeReflectConstruct(); return function _createSuperInternal() { var Super = (0, _getPrototypeOf2["default"])(Derived), result; if (hasNativeReflectConstruct) { var NewTarget = (0, _getPrototypeOf2["default"])(this).constructor; result = _Reflect$construct(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return (0, _possibleConstructorReturn2["default"])(this, result); }; }

function _isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !_Reflect$construct) return false; if (_Reflect$construct.sham) return false; if (typeof Proxy === "function") return true; try { Boolean.prototype.valueOf.call(_Reflect$construct(Boolean, [], function () {})); return true; } catch (e) { return false; } }

// let声明 & 箭头函数
var fn = function fn() {
  console.log(1);
}; // 实例方法


(0, _includes["default"])(_context = [2, 3, 4]).call(_context, 1); // 静态方法

(0, _assign["default"])({
  a: 1,
  b: 2
}, {
  c: 3
}); // 新的API

var promise = new _promise["default"](function (res, rej) {
  (0, _setTimeout2["default"])(res, 1000);
});
var set = new _set["default"]();
var map = new _map["default"](); // 新的语法

var Person = /*#__PURE__*/function () {
  function Person() {
    (0, _classCallCheck2["default"])(this, Person);
  }

  (0, _createClass2["default"])(Person, [{
    key: "say",
    value: function say() {
      console.log('hello world!');
    }
  }], [{
    key: "name",
    get: function get() {
      return 'Person';
    }
  }]);
  return Person;
}();

var Duck = /*#__PURE__*/function (_Animal) {
  (0, _inherits2["default"])(Duck, _Animal);

  var _super = _createSuper(Duck);

  function Duck() {
    (0, _classCallCheck2["default"])(this, Duck);
    return _super.apply(this, arguments);
  }

  return Duck;
}(_utils.Animal);

var duck = new Duck();
duck.makeSound();
var _default = Person;
exports["default"] = _default;