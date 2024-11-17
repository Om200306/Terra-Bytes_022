"use strict";
var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);
var component_api_exports = {};
__export(component_api_exports, {
  componentApiDTS: () => componentApiDTS,
  componentApiJs: () => componentApiJs,
  componentApiStubDTS: () => componentApiStubDTS,
  resolveFunctionReference: () => resolveFunctionReference,
  rootComponentApiCJS: () => rootComponentApiCJS
});
module.exports = __toCommonJS(component_api_exports);
var import_path = __toESM(require("path"), 1);
var import_zod = require("zod");
var import_bundler = require("../../bundler/index.js");
var import_directoryStructure = require("../lib/components/definition/directoryStructure.js");
var import_api = require("./api.js");
var import_common = require("./common.js");
var import_validator = require("../lib/deployApi/validator.js");
var import_value = require("../../values/value.js");
function componentApiJs() {
  const lines = [];
  lines.push((0, import_common.header)("Generated `api` utility."));
  lines.push(`
    import { anyApi, componentsGeneric } from "convex/server";

    /**
     * A utility for referencing Convex functions in your app's API.
     *
     * Usage:
     * \`\`\`js
     * const myFunctionReference = api.myModule.myFunction;
     * \`\`\`
     */
    export const api = anyApi;
    export const internal = anyApi;
    export const components = componentsGeneric();
  `);
  return lines.join("\n");
}
function rootComponentApiCJS() {
  const lines = [];
  lines.push((0, import_common.header)("Generated `api` utility."));
  lines.push(`const { anyApi } = require("convex/server");`);
  lines.push(`module.exports = {
    api: anyApi,
    internal: anyApi,
  };`);
  return lines.join("\n");
}
function componentApiStubDTS() {
  const lines = [];
  lines.push((0, import_common.header)("Generated `api` utility."));
  lines.push(`import type { AnyApi, AnyComponents } from "convex/server";`);
  lines.push(`
    export declare const api: AnyApi;
    export declare const internal: AnyApi;
    export declare const components: AnyComponents;
  `);
  return lines.join("\n");
}
async function componentApiDTS(ctx, startPush, rootComponent, componentDirectory) {
  const definitionPath = (0, import_directoryStructure.toComponentDefinitionPath)(
    rootComponent,
    componentDirectory
  );
  const absModulePaths = await (0, import_bundler.entryPoints)(ctx, componentDirectory.path);
  const modulePaths = absModulePaths.map(
    (p) => import_path.default.relative(componentDirectory.path, p)
  );
  const lines = [];
  lines.push((0, import_common.header)("Generated `api` utility."));
  for (const modulePath of modulePaths) {
    const ident = (0, import_api.moduleIdentifier)(modulePath);
    const path2 = (0, import_api.importPath)(modulePath);
    lines.push(`import type * as ${ident} from "../${path2}.js";`);
  }
  lines.push(`
    import type {
      ApiFromModules,
      FilterApi,
      FunctionReference,
    } from "convex/server";
    /**
     * A utility for referencing Convex functions in your app's API.
     *
     * Usage:
     * \`\`\`js
     * const myFunctionReference = api.myModule.myFunction;
     * \`\`\`
     */
    declare const fullApi: ApiFromModules<{
  `);
  for (const modulePath of modulePaths) {
    const ident = (0, import_api.moduleIdentifier)(modulePath);
    const path2 = (0, import_api.importPath)(modulePath);
    lines.push(`  "${path2}": typeof ${ident},`);
  }
  lines.push(`}>;`);
  for await (const line of codegenApiWithMounts(
    ctx,
    startPush,
    definitionPath
  )) {
    lines.push(line);
  }
  lines.push(`
    export declare const api: FilterApi<typeof fullApiWithMounts, FunctionReference<any, "public">>;
    export declare const internal: FilterApi<typeof fullApiWithMounts, FunctionReference<any, "internal">>;
  `);
  lines.push(`
  export declare const components: {`);
  const analysis = startPush.analysis[definitionPath];
  if (!analysis) {
    return await ctx.crash({
      exitCode: 1,
      errorType: "fatal",
      printedMessage: `No analysis found for component ${definitionPath} orig: ${definitionPath}
in
${Object.keys(startPush.analysis).toString()}`
    });
  }
  for (const childComponent of analysis.definition.childComponents) {
    const childComponentAnalysis = startPush.analysis[childComponent.path];
    if (!childComponentAnalysis) {
      return await ctx.crash({
        exitCode: 1,
        errorType: "fatal",
        printedMessage: `No analysis found for child component ${childComponent.path}`
      });
    }
    for await (const line of codegenExports(
      ctx,
      childComponent.name,
      childComponentAnalysis
    )) {
      lines.push(line);
    }
  }
  lines.push("};");
  return lines.join("\n");
}
async function* codegenApiWithMounts(ctx, startPush, definitionPath) {
  const mountTree = await buildMountTree(ctx, startPush, definitionPath, []);
  if (mountTree) {
    yield "export type Mounts = ";
    yield* codegenMountTree(mountTree);
    yield `;`;
    yield `// For now fullApiWithMounts is only fullApi which provides`;
    yield `// jump-to-definition in component client code.`;
    yield `// Use Mounts for the same type without the inference.`;
    yield "declare const fullApiWithMounts: typeof fullApi;";
  } else {
    yield "declare const fullApiWithMounts: typeof fullApi;";
  }
}
function* codegenMountTree(tree) {
  yield `{`;
  for (const [identifier, subtree] of Object.entries(tree)) {
    if (typeof subtree === "string") {
      yield `"${identifier}": ${subtree},`;
    } else {
      yield `"${identifier}":`;
      yield* codegenMountTree(subtree);
      yield `,`;
    }
  }
  yield `}`;
}
async function buildMountTree(ctx, startPush, definitionPath, attributes) {
  const analysis = startPush.analysis[definitionPath];
  if (!analysis) {
    return await ctx.crash({
      exitCode: 1,
      errorType: "fatal",
      printedMessage: `No analysis found for component ${definitionPath} orig: ${definitionPath}
in
${Object.keys(startPush.analysis).toString()}`
    });
  }
  let current = analysis.definition.exports.branch;
  for (const attribute of attributes) {
    const componentExport = current.find(
      ([identifier]) => identifier === attribute
    );
    if (!componentExport) {
      return await ctx.crash({
        exitCode: 1,
        errorType: "fatal",
        printedMessage: `No export found for ${attribute}`
      });
    }
    const [_, node] = componentExport;
    if (node.type !== "branch") {
      return await ctx.crash({
        exitCode: 1,
        errorType: "fatal",
        printedMessage: `Expected branch at ${attribute}`
      });
    }
    current = node.branch;
  }
  return buildComponentMountTree(ctx, startPush, analysis, current);
}
async function buildComponentMountTree(ctx, startPush, analysis, exports) {
  const result = {};
  let nonEmpty = false;
  for (const [identifier, componentExport] of exports) {
    if (componentExport.type === "leaf") {
      if (componentExport.leaf.startsWith("_reference/childComponent/")) {
        const suffix = componentExport.leaf.slice(
          "_reference/childComponent/".length
        );
        const [componentName, ...attributes] = suffix.split("/");
        const childComponent = analysis.definition.childComponents.find(
          (c) => c.name === componentName
        );
        if (!childComponent) {
          return await ctx.crash({
            exitCode: 1,
            errorType: "fatal",
            printedMessage: `No child component found for ${componentName}`
          });
        }
        const childTree = await buildMountTree(
          ctx,
          startPush,
          childComponent.path,
          attributes
        );
        if (childTree) {
          result[identifier] = childTree;
          nonEmpty = true;
        }
      }
      const isRoot = analysis.definition.definitionType.type === "app";
      if (!isRoot && componentExport.leaf.startsWith("_reference/function/")) {
        const leaf = await resolveFunctionReference(
          ctx,
          analysis,
          componentExport.leaf,
          "public"
        );
        result[identifier] = leaf;
        nonEmpty = true;
      }
    } else {
      const subTree = await buildComponentMountTree(
        ctx,
        startPush,
        analysis,
        componentExport.branch
      );
      if (subTree) {
        result[identifier] = subTree;
        nonEmpty = true;
      }
    }
  }
  return nonEmpty ? result : null;
}
async function* codegenExports(ctx, name, analysis) {
  yield `${name}: {`;
  for (const [name2, componentExport] of analysis.definition.exports.branch) {
    yield `${name2}:`;
    yield* codegenExport(ctx, analysis, componentExport);
    yield ",";
  }
  yield "},";
}
async function* codegenExport(ctx, analysis, componentExport) {
  if (componentExport.type === "leaf") {
    yield await resolveFunctionReference(
      ctx,
      analysis,
      componentExport.leaf,
      "internal"
    );
  } else if (componentExport.type === "branch") {
    yield "{";
    for (const [name, childExport] of componentExport.branch) {
      yield `${name}:`;
      yield* codegenExport(ctx, analysis, childExport);
      yield ",";
    }
    yield "}";
  }
}
async function resolveFunctionReference(ctx, analysis, reference, visibility) {
  if (!reference.startsWith("_reference/function/")) {
    return await ctx.crash({
      exitCode: 1,
      errorType: "fatal",
      printedMessage: `Invalid function reference: ${reference}`
    });
  }
  const udfPath = reference.slice("_reference/function/".length);
  const [modulePath, functionName] = udfPath.split(":");
  const canonicalizedModulePath = canonicalizeModulePath(modulePath);
  const analyzedModule = analysis.functions[canonicalizedModulePath];
  if (!analyzedModule) {
    return await ctx.crash({
      exitCode: 1,
      errorType: "fatal",
      printedMessage: `Module not found: ${modulePath}`
    });
  }
  const analyzedFunction = analyzedModule.functions.find(
    (f) => f.name === functionName
  );
  if (!analyzedFunction) {
    return await ctx.crash({
      exitCode: 1,
      errorType: "fatal",
      printedMessage: `Function not found: ${functionName}`
    });
  }
  const udfType = analyzedFunction.udfType.toLowerCase();
  let argsType = "any";
  try {
    const argsValidator = parseValidator(analyzedFunction.args);
    if (argsValidator) {
      if (argsValidator.type === "object" || argsValidator.type === "any") {
        argsType = validatorToType(argsValidator);
      } else {
        throw new Error(
          `Unexpected argument validator type: ${argsValidator.type}`
        );
      }
    }
  } catch (e) {
    return await ctx.crash({
      exitCode: 1,
      errorType: "fatal",
      printedMessage: `Invalid function args: ${analyzedFunction.args}`,
      errForSentry: e
    });
  }
  let returnsType = "any";
  try {
    const returnsValidator = parseValidator(analyzedFunction.returns);
    if (returnsValidator) {
      returnsType = validatorToType(returnsValidator);
    }
  } catch (e) {
    return await ctx.crash({
      exitCode: 1,
      errorType: "fatal",
      printedMessage: `Invalid function returns: ${analyzedFunction.returns}`,
      errForSentry: e
    });
  }
  return `FunctionReference<"${udfType}", "${visibility}", ${argsType}, ${returnsType}>`;
}
function parseValidator(validator) {
  if (!validator) {
    return null;
  }
  return import_zod.z.nullable(import_validator.convexValidator).parse(JSON.parse(validator));
}
function canonicalizeModulePath(modulePath) {
  if (!modulePath.endsWith(".js")) {
    return modulePath + ".js";
  }
  return modulePath;
}
function validatorToType(validator) {
  if (validator.type === "null") {
    return "null";
  } else if (validator.type === "number") {
    return "number";
  } else if (validator.type === "bigint") {
    return "bigint";
  } else if (validator.type === "boolean") {
    return "boolean";
  } else if (validator.type === "string") {
    return "string";
  } else if (validator.type === "bytes") {
    return "ArrayBuffer";
  } else if (validator.type === "any") {
    return "any";
  } else if (validator.type === "literal") {
    const convexValue = (0, import_value.jsonToConvex)(validator.value);
    return convexValueToLiteral(convexValue);
  } else if (validator.type === "id") {
    return "string";
  } else if (validator.type === "array") {
    return `Array<${validatorToType(validator.value)}>`;
  } else if (validator.type === "record") {
    return `Record<${validatorToType(validator.keys)}, ${validatorToType(validator.values.fieldType)}>`;
  } else if (validator.type === "union") {
    return validator.value.map(validatorToType).join(" | ");
  } else if (validator.type === "object") {
    return objectValidatorToType(validator.value);
  } else {
    throw new Error(`Unsupported validator type`);
  }
}
function objectValidatorToType(fields) {
  const fieldStrings = [];
  for (const [fieldName, field] of Object.entries(fields)) {
    const fieldType = validatorToType(field.fieldType);
    fieldStrings.push(`${fieldName}${field.optional ? "?" : ""}: ${fieldType}`);
  }
  return `{ ${fieldStrings.join(", ")} }`;
}
function convexValueToLiteral(value) {
  if (value === null) {
    return "null";
  }
  if (typeof value === "bigint") {
    return `${value}n`;
  }
  if (typeof value === "number") {
    return `${value}`;
  }
  if (typeof value === "boolean") {
    return `${value}`;
  }
  if (typeof value === "string") {
    return `"${value}"`;
  }
  throw new Error(`Unsupported literal type`);
}
//# sourceMappingURL=component_api.js.map
