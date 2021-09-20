"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.renderReact = void 0;
const server_1 = __importDefault(require("react-dom/server"));
const hydrate_1 = require("../../core/hydrate");
const renderReact = (jsx) => __awaiter(void 0, void 0, void 0, function* () {
    const startTime = Date.now();
    const rawHtml = server_1.default.renderToString(jsx);
    const renderReactTime = Date.now();
    const { html } = yield (0, hydrate_1.renderToString)(rawHtml);
    const renderWCTime = Date.now();
    console.info(`[DEBUG]
    firstRender: ${renderReactTime - startTime}ms,
    secondRender: ${renderWCTime - renderReactTime}ms,
    total: ${renderWCTime - startTime}ms
  `.replace(/\s{2}|\n/gi, '').trim(), { startTime, renderReactTime, renderWCTime });
    return html;
});
exports.renderReact = renderReact;
//# sourceMappingURL=ssrRender.js.map