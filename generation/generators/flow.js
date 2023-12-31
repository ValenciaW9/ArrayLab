"use strict";

var _interopRequireWildcard = function (obj) { return obj && obj.__esModule ? obj : { "default": obj }; };

exports.AnyTypeAnnotation = AnyTypeAnnotation;
exports.ArrayTypeAnnotation = ArrayTypeAnnotation;
exports.BooleanTypeAnnotation = BooleanTypeAnnotation;
exports.ClassProperty = ClassProperty;
exports.DeclareClass = DeclareClass;
exports.DeclareFunction = DeclareFunction;
exports.DeclareModule = DeclareModule;
exports.DeclareVariable = DeclareVariable;
exports.FunctionTypeAnnotation = FunctionTypeAnnotation;
exports.FunctionTypeParam = FunctionTypeParam;
exports.InterfaceExtends = InterfaceExtends;
exports._interfaceish = _interfaceish;
exports.InterfaceDeclaration = InterfaceDeclaration;
exports.IntersectionTypeAnnotation = IntersectionTypeAnnotation;
exports.NullableTypeAnnotation = NullableTypeAnnotation;
exports.NumberTypeAnnotation = NumberTypeAnnotation;
exports.StringLiteralTypeAnnotation = StringLiteralTypeAnnotation;
exports.StringTypeAnnotation = StringTypeAnnotation;
exports.TupleTypeAnnotation = TupleTypeAnnotation;
exports.TypeofTypeAnnotation = TypeofTypeAnnotation;
exports.TypeAlias = TypeAlias;
exports.TypeAnnotation = TypeAnnotation;
exports.TypeParameterInstantiation = TypeParameterInstantiation;
exports.ObjectTypeAnnotation = ObjectTypeAnnotation;
exports.ObjectTypeCallProperty = ObjectTypeCallProperty;
exports.ObjectTypeIndexer = ObjectTypeIndexer;
exports.ObjectTypeProperty = ObjectTypeProperty;
exports.QualifiedTypeIdentifier = QualifiedTypeIdentifier;
exports.UnionTypeAnnotation = UnionTypeAnnotation;
exports.TypeCastExpression = TypeCastExpression;
exports.VoidTypeAnnotation = VoidTypeAnnotation;
exports.__esModule = true;

var t = _interopRequireWildcard(require("../../types"));

function AnyTypeAnnotation() {
  this.push("any");
}

function ArrayTypeAnnotation(node, print) {
  print(node.elementType);
  this.push("[");
  this.push("]");
}

function BooleanTypeAnnotation(node) {
  this.push("bool");
}

function ClassProperty(node, print) {
  if (node["static"]) this.push("static ");
  print(node.key);
  print(node.typeAnnotation);
  this.semicolon();
}

function DeclareClass(node, print) {
  this.push("declare class ");
  this._interfaceish(node, print);
}

function DeclareFunction(node, print) {
  this.push("declare function ");
  print(node.id);
  print(node.id.typeAnnotation.typeAnnotation);
  this.semicolon();
}

function DeclareModule(node, print) {
  this.push("declare module ");
  print(node.id);
  this.space();
  print(node.body);
}

function DeclareVariable(node, print) {
  this.push("declare var ");
  print(node.id);
  print(node.id.typeAnnotation);
  this.semicolon();
}

function FunctionTypeAnnotation(node, print, parent) {
  print(node.typeParameters);
  this.push("(");
  print.list(node.params);

  if (node.rest) {
    if (node.params.length) {
      this.push(",");
      this.space();
    }
    this.push("...");
    print(node.rest);
  }

  this.push(")");

  // this node type is overloaded, not sure why but it makes it EXTREMELY annoying
  if (parent.type === "ObjectTypeProperty" || parent.type === "ObjectTypeCallProperty" || parent.type === "DeclareFunction") {
    this.push(":");
  } else {
    this.space();
    this.push("=>");
  }

  this.space();
  print(node.returnType);
}

function FunctionTypeParam(node, print) {
  print(node.name);
  if (node.optional) this.push("?");
  this.push(":");
  this.space();
  print(node.typeAnnotation);
}

function InterfaceExtends(node, print) {
  print(node.id);
  print(node.typeParameters);
}

exports.ClassImplements = InterfaceExtends;
exports.GenericTypeAnnotation = InterfaceExtends;

function _interfaceish(node, print) {
  print(node.id);
  print(node.typeParameters);
  if (node["extends"].length) {
    this.push(" extends ");
    print.join(node["extends"], { separator: ", " });
  }
  this.space();
  print(node.body);
}

function InterfaceDeclaration(node, print) {
  this.push("interface ");
  this._interfaceish(node, print);
}

function IntersectionTypeAnnotation(node, print) {
  print.join(node.types, { separator: " & " });
}

function NullableTypeAnnotation(node, print) {
  this.push("?");
  print(node.typeAnnotation);
}

function NumberTypeAnnotation() {
  this.push("number");
}

function StringLiteralTypeAnnotation(node) {
  this._stringLiteral(node.value);
}

function StringTypeAnnotation() {
  this.push("string");
}

function TupleTypeAnnotation(node, print) {
  this.push("[");
  print.join(node.types, { separator: ", " });
  this.push("]");
}

function TypeofTypeAnnotation(node, print) {
  this.push("typeof ");
  print(node.argument);
}

function TypeAlias(node, print) {
  this.push("type ");
  print(node.id);
  print(node.typeParameters);
  this.space();
  this.push("=");
  this.space();
  print(node.right);
  this.semicolon();
}

function TypeAnnotation(node, print) {
  this.push(":");
  this.space();
  if (node.optional) this.push("?");
  print(node.typeAnnotation);
}

function TypeParameterInstantiation(node, print) {
  this.push("<");
  print.join(node.params, { separator: ", " });
  this.push(">");
}

exports.TypeParameterDeclaration = TypeParameterInstantiation;

function ObjectTypeAnnotation(node, print) {
  this.push("{");
  var props = node.properties.concat(node.callProperties, node.indexers);
  if (props.length) {
    this.space();
    print.list(props, { indent: true, separator: "; " });
    this.space();
  }
  this.push("}");
}

function ObjectTypeCallProperty(node, print) {
  if (node["static"]) this.push("static ");
  print(node.value);
}

function ObjectTypeIndexer(node, print) {
  if (node["static"]) this.push("static ");
  this.push("[");
  print(node.id);
  this.push(":");
  this.space();
  print(node.key);
  this.push("]");
  this.push(":");
  this.space();
  print(node.value);
}

function ObjectTypeProperty(node, print) {
  if (node["static"]) this.push("static ");
  print(node.key);
  if (node.optional) this.push("?");
  if (!t.isFunctionTypeAnnotation(node.value)) {
    this.push(":");
    this.space();
  }
  print(node.value);
}

function QualifiedTypeIdentifier(node, print) {
  print(node.qualification);
  this.push(".");
  print(node.id);
}

function UnionTypeAnnotation(node, print) {
  print.join(node.types, { separator: " | " });
}

function TypeCastExpression(node, print) {
  this.push("(");
  print(node.expression);
  print(node.typeAnnotation);
  this.push(")");
}

function VoidTypeAnnotation(node) {
  this.push("void");
}