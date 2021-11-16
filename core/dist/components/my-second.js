import { HTMLElement, h, Host, proxyCustomElement } from '@stencil/core/internal/client';

const mySecondCss = ":host{display:block;background-color:red}";

let MySecond$1 = class extends HTMLElement {
  constructor() {
    super();
    this.__registerHost();
    this.__attachShadow();
  }
  render() {
    return (h(Host, null, h("slot", null)));
  }
  static get style() { return mySecondCss; }
};
MySecond$1 = /*@__PURE__*/ proxyCustomElement(MySecond$1, [1, "my-second"]);
function defineCustomElement$1() {
  if (typeof customElements === "undefined") {
    return;
  }
  const components = ["my-second"];
  components.forEach(tagName => { switch (tagName) {
    case "my-second":
      if (!customElements.get(tagName)) {
        customElements.define(tagName, MySecond$1);
      }
      break;
  } });
}
defineCustomElement$1();

const MySecond = MySecond$1;
const defineCustomElement = defineCustomElement$1;

export { MySecond, defineCustomElement };
