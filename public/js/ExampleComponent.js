var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
define(["require", "exports", "react"], function (require, exports, React) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var ExampleComponent = (function (_super) {
        __extends(ExampleComponent, _super);
        function ExampleComponent() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        ExampleComponent.prototype.render = function () {
            return React.createElement("div", null, "Hello World!");
        };
        return ExampleComponent;
    }(React.Component));
    exports.ExampleComponent = ExampleComponent;
});
//# sourceMappingURL=ExampleComponent.js.map