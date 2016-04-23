import { get } from 'lodash'
import fs from 'fs'
import Promise from 'bluebird'
import * as babylon from "babylon"
import traverse from "babel-traverse";
import * as t from "babel-types";

Promise.promisifyAll(fs)

class BabylonModuleDefinitions {
  constructor() {
    return this
  }
  babylonParseAll(code) {
    return babylon.parse(code, {
      sourceType: "module",
      plugins: [
        "jsx",
        "flow",
        "asyncFunctions",
        "classConstructorCall",
        "doExpressions",
        "trailingFunctionCommas",
        "objectRestSpread",
        "decorators",
        "classProperties",
        "exportExtensions",
        "exponentiationOperator",
        "asyncGenerators",
        "functionBind",
        "functionSent"
      ]
    })
  }
  getDepsFromAst(ast) {
    let deps = []
    traverse(ast, {
      enter(path) {
        if (t.isImportDeclaration(path.node)) {
          if (get(path, 'node.source.value')) {
            deps.push(path.node.source.value)
          } else if (get(path, 'node.specifiers.0')) {
            deps.push(path.node.specifiers[0])
          }
        } else if (t.isIdentifier(path.node, { name: "require" })) {
          if (get(path, 'parent.arguments.0.value')) {
            deps.push(path.parent.arguments[0].value)
          }
        }
      }
    })
    return deps
  }
  getDepsFromCode(code) {
    let ast = this.babylonParseAll(code)
    let deps = this.getDepsFromAst(ast)
    return deps
  }
  async getDepsFromFile(file) {
    let code = await fs.readFileAsync(file, 'utf8')
    return this.getDepsFromCode(code)
  }
}

export default function ({file, code}) {
  let actions = new BabylonModuleDefinitions('./req.js')
  if (file) return actions.getDepsFromFile(file)
  if (code) return actions.getDepsFromCode(code)
}
