"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProgressUpdateTransformer = exports.formatProgress = exports.buildUserAgentString = exports.definedOrError = void 0;
const definedOrError_1 = __importDefault(require("./definedOrError"));
exports.definedOrError = definedOrError_1.default;
const buildUserAgentString_1 = __importDefault(require("./buildUserAgentString"));
exports.buildUserAgentString = buildUserAgentString_1.default;
const formatProgress_1 = __importStar(require("./formatProgress"));
exports.formatProgress = formatProgress_1.default;
Object.defineProperty(exports, "ProgressUpdateTransformer", { enumerable: true, get: function () { return formatProgress_1.ProgressUpdateTransformer; } });
//# sourceMappingURL=index.js.map