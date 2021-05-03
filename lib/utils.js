"use strict";

var _Object$defineProperty = require("@babel/runtime-corejs3/core-js-stable/object/define-property");

var _interopRequireDefault = require("@babel/runtime-corejs3/helpers/interopRequireDefault");

_Object$defineProperty(exports, "__esModule", {
  value: true
});

exports.Animal = void 0;

var _classCallCheck2 = _interopRequireDefault(require("@babel/runtime-corejs3/helpers/classCallCheck"));

var _createClass2 = _interopRequireDefault(require("@babel/runtime-corejs3/helpers/createClass"));

var Animal = /*#__PURE__*/function () {
  function Animal() {
    (0, _classCallCheck2["default"])(this, Animal);
  }

  (0, _createClass2["default"])(Animal, [{
    key: "makeSound",
    value: function makeSound() {
      console.log('ga~ga~ga~');
    }
  }]);
  return Animal;
}();

exports.Animal = Animal;