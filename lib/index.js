'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _regenerator = require('babel-runtime/regenerator');

var _regenerator2 = _interopRequireDefault(_regenerator);

var _classCallCheck2 = require('babel-runtime/helpers/classCallCheck');

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _createClass2 = require('babel-runtime/helpers/createClass');

var _createClass3 = _interopRequireDefault(_createClass2);

exports.default = function (_ref) {
  var file = _ref.file;
  var code = _ref.code;

  var actions = new BabylonModuleDefinitions('./req.js');
  if (file) return actions.getDepsFromFile(file);
  if (code) return actions.getDepsFromCode(code);
};

var _lodash = require('lodash');

var _fs = require('fs');

var _fs2 = _interopRequireDefault(_fs);

var _bluebird = require('bluebird');

var _bluebird2 = _interopRequireDefault(_bluebird);

var _babylon = require('babylon');

var babylon = _interopRequireWildcard(_babylon);

var _babelTraverse = require('babel-traverse');

var _babelTraverse2 = _interopRequireDefault(_babelTraverse);

var _babelTypes = require('babel-types');

var t = _interopRequireWildcard(_babelTypes);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

_bluebird2.default.promisifyAll(_fs2.default);

var BabylonModuleDefinitions = function () {
  function BabylonModuleDefinitions() {
    (0, _classCallCheck3.default)(this, BabylonModuleDefinitions);

    return this;
  }

  (0, _createClass3.default)(BabylonModuleDefinitions, [{
    key: 'babylonParseAll',
    value: function babylonParseAll(code) {
      return babylon.parse(code, {
        sourceType: "module",
        plugins: ["jsx", "flow", "asyncFunctions", "classConstructorCall", "doExpressions", "trailingFunctionCommas", "objectRestSpread", "decorators", "classProperties", "exportExtensions", "exponentiationOperator", "asyncGenerators", "functionBind", "functionSent"]
      });
    }
  }, {
    key: 'getDepsFromAst',
    value: function getDepsFromAst(ast) {
      var deps = [];
      (0, _babelTraverse2.default)(ast, {
        enter: function enter(path) {
          if (t.isImportDeclaration(path.node)) {
            if ((0, _lodash.get)(path, 'node.source.value')) {
              deps.push(path.node.source.value);
            } else if ((0, _lodash.get)(path, 'node.specifiers.0')) {
              deps.push(path.node.specifiers[0]);
            }
          } else if (t.isIdentifier(path.node, { name: "require" })) {
            if ((0, _lodash.get)(path, 'parent.arguments.0.value')) {
              deps.push(path.parent.arguments[0].value);
            }
          }
        }
      });
      return deps;
    }
  }, {
    key: 'getDepsFromCode',
    value: function getDepsFromCode(code) {
      var ast = this.babylonParseAll(code);
      var deps = this.getDepsFromAst(ast);
      return deps;
    }
  }, {
    key: 'getDepsFromFile',
    value: function getDepsFromFile(file) {
      var code;
      return _regenerator2.default.async(function getDepsFromFile$(_context) {
        while (1) {
          switch (_context.prev = _context.next) {
            case 0:
              _context.next = 2;
              return _regenerator2.default.awrap(_fs2.default.readFileAsync(file, 'utf8'));

            case 2:
              code = _context.sent;
              return _context.abrupt('return', this.getDepsFromCode(code));

            case 4:
            case 'end':
              return _context.stop();
          }
        }
      }, null, this);
    }
  }]);
  return BabylonModuleDefinitions;
}();