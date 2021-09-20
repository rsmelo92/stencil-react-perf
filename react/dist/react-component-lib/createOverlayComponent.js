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
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createOverlayComponent = void 0;
const react_1 = __importDefault(require("react"));
const react_dom_1 = __importDefault(require("react-dom"));
const utils_1 = require("./utils");
const createOverlayComponent = (tagName, controller, customElement) => {
    (0, utils_1.defineCustomElement)(tagName, customElement);
    const displayName = (0, utils_1.dashToPascalCase)(tagName);
    const didDismissEventName = `on${displayName}DidDismiss`;
    const didPresentEventName = `on${displayName}DidPresent`;
    const willDismissEventName = `on${displayName}WillDismiss`;
    const willPresentEventName = `on${displayName}WillPresent`;
    let isDismissing = false;
    class Overlay extends react_1.default.Component {
        constructor(props) {
            super(props);
            if (typeof document !== 'undefined') {
                this.el = document.createElement('div');
            }
            this.handleDismiss = this.handleDismiss.bind(this);
        }
        static get displayName() {
            return displayName;
        }
        componentDidMount() {
            if (this.props.isOpen) {
                this.present();
            }
        }
        componentWillUnmount() {
            if (this.overlay) {
                this.overlay.dismiss();
            }
        }
        handleDismiss(event) {
            if (this.props.onDidDismiss) {
                this.props.onDidDismiss(event);
            }
            (0, utils_1.setRef)(this.props.forwardedRef, null);
        }
        shouldComponentUpdate(nextProps) {
            // Check if the overlay component is about to dismiss
            if (this.overlay && nextProps.isOpen !== this.props.isOpen && nextProps.isOpen === false) {
                isDismissing = true;
            }
            return true;
        }
        componentDidUpdate(prevProps) {
            return __awaiter(this, void 0, void 0, function* () {
                if (this.overlay) {
                    (0, utils_1.attachProps)(this.overlay, this.props, prevProps);
                }
                if (prevProps.isOpen !== this.props.isOpen && this.props.isOpen === true) {
                    this.present(prevProps);
                }
                if (this.overlay && prevProps.isOpen !== this.props.isOpen && this.props.isOpen === false) {
                    yield this.overlay.dismiss();
                    isDismissing = false;
                    /**
                     * Now that the overlay is dismissed
                     * we need to render again so that any
                     * inner components will be unmounted
                     */
                    this.forceUpdate();
                }
            });
        }
        present(prevProps) {
            return __awaiter(this, void 0, void 0, function* () {
                const _a = this.props, { children, isOpen, onDidDismiss, onDidPresent, onWillDismiss, onWillPresent } = _a, cProps = __rest(_a, ["children", "isOpen", "onDidDismiss", "onDidPresent", "onWillDismiss", "onWillPresent"]);
                const elementProps = Object.assign(Object.assign({}, cProps), { ref: this.props.forwardedRef, [didDismissEventName]: this.handleDismiss, [didPresentEventName]: (e) => this.props.onDidPresent && this.props.onDidPresent(e), [willDismissEventName]: (e) => this.props.onWillDismiss && this.props.onWillDismiss(e), [willPresentEventName]: (e) => this.props.onWillPresent && this.props.onWillPresent(e) });
                this.overlay = yield controller.create(Object.assign(Object.assign({}, elementProps), { component: this.el, componentProps: {} }));
                (0, utils_1.setRef)(this.props.forwardedRef, this.overlay);
                (0, utils_1.attachProps)(this.overlay, elementProps, prevProps);
                yield this.overlay.present();
            });
        }
        render() {
            /**
             * Continue to render the component even when
             * overlay is dismissing otherwise component
             * will be hidden before animation is done.
             */
            return react_dom_1.default.createPortal(this.props.isOpen || isDismissing ? this.props.children : null, this.el);
        }
    }
    return react_1.default.forwardRef((props, ref) => {
        return react_1.default.createElement(Overlay, Object.assign({}, props, { forwardedRef: ref }));
    });
};
exports.createOverlayComponent = createOverlayComponent;
//# sourceMappingURL=createOverlayComponent.js.map