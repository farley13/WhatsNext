"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
exports.__esModule = true;
var jsx_runtime_1 = require("react/jsx-runtime");
var react_1 = __importDefault(require("react"));
var react_dom_1 = __importDefault(require("react-dom"));
require("./app.css");
var logo_png_1 = __importDefault(require("../public/logo.png"));
var App = /** @class */ (function (_super) {
    __extends(App, _super);
    function App() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    App.prototype.render = function () {
        var user = {
            firstName: "Angela",
            lastName: "Davis",
            role: "Professor"
        };
        console.log(user.name);
        var b = "thing";
        return ((0, jsx_runtime_1.jsx)("div", __assign({ className: "App" }, { children: (0, jsx_runtime_1.jsxs)("header", __assign({ className: "App-header" }, { children: [(0, jsx_runtime_1.jsx)("img", { src: logo_png_1["default"], className: "App-logo", alt: "logo" }, void 0), (0, jsx_runtime_1.jsxs)("p", { children: ["No! need to Edit ", (0, jsx_runtime_1.jsx)("code", { children: "src/app.jsx" }, void 0), " and tap.... on the play button."] }, void 0), (0, jsx_runtime_1.jsx)("a", __assign({ className: "App-link", href: "https://reactjs.org", target: "_blank", rel: "noopener noreferrer" }, { children: "Learn React" }), void 0)] }), void 0) }), void 0));
    };
    return App;
}(react_1["default"].Component));
react_dom_1["default"].render((0, jsx_runtime_1.jsx)(App, {}, void 0), document.getElementById('root'));
