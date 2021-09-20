'use strict';

function _interopNamespace(e) {
  if (e && e.__esModule) return e;
  var n = Object.create(null);
  if (e) {
    Object.keys(e).forEach(function (k) {
      if (k !== 'default') {
        var d = Object.getOwnPropertyDescriptor(e, k);
        Object.defineProperty(n, k, d.get ? d : {
          enumerable: true,
          get: function () {
            return e[k];
          }
        });
      }
    });
  }
  n['default'] = e;
  return Object.freeze(n);
}

const NAMESPACE = 'core';

let scopeId;
let hostTagName;
let queuePending = false;
const win = typeof window !== 'undefined' ? window : {};
const doc = win.document || { head: {} };
const plt = {
    $flags$: 0,
    $resourcesUrl$: '',
    jmp: (h) => h(),
    raf: (h) => requestAnimationFrame(h),
    ael: (el, eventName, listener, opts) => el.addEventListener(eventName, listener, opts),
    rel: (el, eventName, listener, opts) => el.removeEventListener(eventName, listener, opts),
    ce: (eventName, opts) => new CustomEvent(eventName, opts),
};
const supportsShadow = true;
const promiseResolve = (v) => Promise.resolve(v);
const supportsConstructibleStylesheets = /*@__PURE__*/ (() => {
        try {
            new CSSStyleSheet();
            return typeof new CSSStyleSheet().replace === 'function';
        }
        catch (e) { }
        return false;
    })()
    ;
const CONTENT_REF_ID = 'r';
const ORG_LOCATION_ID = 'o';
const SLOT_NODE_ID = 's';
const TEXT_NODE_ID = 't';
const HYDRATE_ID = 's-id';
const HYDRATED_STYLE_ID = 'sty-id';
const HYDRATE_CHILD_ID = 'c-id';
const HYDRATED_CSS = '{visibility:hidden}.hydrated{visibility:inherit}';
const createTime = (fnName, tagName = '') => {
    {
        return () => {
            return;
        };
    }
};
const uniqueTime = (key, measureText) => {
    {
        return () => {
            return;
        };
    }
};
const rootAppliedStyles = new WeakMap();
const registerStyle = (scopeId, cssText, allowCS) => {
    let style = styles.get(scopeId);
    if (supportsConstructibleStylesheets && allowCS) {
        style = (style || new CSSStyleSheet());
        style.replace(cssText);
    }
    else {
        style = cssText;
    }
    styles.set(scopeId, style);
};
const addStyle = (styleContainerNode, cmpMeta, mode, hostElm) => {
    let scopeId = getScopeId(cmpMeta);
    let style = styles.get(scopeId);
    // if an element is NOT connected then getRootNode() will return the wrong root node
    // so the fallback is to always use the document for the root node in those cases
    styleContainerNode = styleContainerNode.nodeType === 11 /* DocumentFragment */ ? styleContainerNode : doc;
    if (style) {
        if (typeof style === 'string') {
            styleContainerNode = styleContainerNode.head || styleContainerNode;
            let appliedStyles = rootAppliedStyles.get(styleContainerNode);
            let styleElm;
            if (!appliedStyles) {
                rootAppliedStyles.set(styleContainerNode, (appliedStyles = new Set()));
            }
            if (!appliedStyles.has(scopeId)) {
                if (styleContainerNode.host &&
                    (styleElm = styleContainerNode.querySelector(`[${HYDRATED_STYLE_ID}="${scopeId}"]`))) {
                    // This is only happening on native shadow-dom, do not needs CSS var shim
                    styleElm.innerHTML = style;
                }
                else {
                    {
                        styleElm = doc.createElement('style');
                        styleElm.innerHTML = style;
                    }
                    styleContainerNode.insertBefore(styleElm, styleContainerNode.querySelector('link'));
                }
                if (appliedStyles) {
                    appliedStyles.add(scopeId);
                }
            }
        }
        else if (!styleContainerNode.adoptedStyleSheets.includes(style)) {
            styleContainerNode.adoptedStyleSheets = [...styleContainerNode.adoptedStyleSheets, style];
        }
    }
    return scopeId;
};
const attachStyles = (hostRef) => {
    const cmpMeta = hostRef.$cmpMeta$;
    const elm = hostRef.$hostElement$;
    const flags = cmpMeta.$flags$;
    const endAttachStyles = createTime('attachStyles', cmpMeta.$tagName$);
    const scopeId = addStyle(elm.shadowRoot ? elm.shadowRoot : elm.getRootNode(), cmpMeta);
    if (flags & 10 /* needsScopedEncapsulation */) {
        // only required when we're NOT using native shadow dom (slot)
        // or this browser doesn't support native shadow dom
        // and this host element was NOT created with SSR
        // let's pick out the inner content for slot projection
        // create a node to represent where the original
        // content was first placed, which is useful later on
        // DOM WRITE!!
        elm['s-sc'] = scopeId;
        elm.classList.add(scopeId + '-h');
    }
    endAttachStyles();
};
const getScopeId = (cmp, mode) => 'sc-' + (cmp.$tagName$);
const convertScopedToShadow = (css) => css.replace(/\/\*!@([^\/]+)\*\/[^\{]+\{/g, '$1{');
const isDef = (v) => v != null;
const isComplexType = (o) => {
    // https://jsperf.com/typeof-fn-object/5
    o = typeof o;
    return o === 'object' || o === 'function';
};
/**
 * Production h() function based on Preact by
 * Jason Miller (@developit)
 * Licensed under the MIT License
 * https://github.com/developit/preact/blob/master/LICENSE
 *
 * Modified for Stencil's compiler and vdom
 */
// const stack: any[] = [];
// export function h(nodeName: string | d.FunctionalComponent, vnodeData: d.PropsType, child?: d.ChildType): d.VNode;
// export function h(nodeName: string | d.FunctionalComponent, vnodeData: d.PropsType, ...children: d.ChildType[]): d.VNode;
const h = (nodeName, vnodeData, ...children) => {
    let child = null;
    let simple = false;
    let lastSimple = false;
    let vNodeChildren = [];
    const walk = (c) => {
        for (let i = 0; i < c.length; i++) {
            child = c[i];
            if (Array.isArray(child)) {
                walk(child);
            }
            else if (child != null && typeof child !== 'boolean') {
                if ((simple = typeof nodeName !== 'function' && !isComplexType(child))) {
                    child = String(child);
                }
                if (simple && lastSimple) {
                    // If the previous child was simple (string), we merge both
                    vNodeChildren[vNodeChildren.length - 1].$text$ += child;
                }
                else {
                    // Append a new vNode, if it's text, we create a text vNode
                    vNodeChildren.push(simple ? newVNode(null, child) : child);
                }
                lastSimple = simple;
            }
        }
    };
    walk(children);
    const vnode = newVNode(nodeName, null);
    vnode.$attrs$ = vnodeData;
    if (vNodeChildren.length > 0) {
        vnode.$children$ = vNodeChildren;
    }
    return vnode;
};
const newVNode = (tag, text) => {
    const vnode = {
        $flags$: 0,
        $tag$: tag,
        $text$: text,
        $elm$: null,
        $children$: null,
    };
    return vnode;
};
const Host = {};
const isHost = (node) => node && node.$tag$ === Host;
const createElm = (oldParentVNode, newParentVNode, childIndex, parentElm) => {
    // tslint:disable-next-line: prefer-const
    let newVNode = newParentVNode.$children$[childIndex];
    let i = 0;
    let elm;
    let childNode;
    if (newVNode.$text$ !== null) {
        // create text node
        elm = newVNode.$elm$ = doc.createTextNode(newVNode.$text$);
    }
    else {
        // create element
        elm = newVNode.$elm$ = (doc.createElement(newVNode.$tag$));
        if (isDef(scopeId) && elm['s-si'] !== scopeId) {
            // if there is a scopeId and this is the initial render
            // then let's add the scopeId as a css class
            elm.classList.add((elm['s-si'] = scopeId));
        }
        if (newVNode.$children$) {
            for (i = 0; i < newVNode.$children$.length; ++i) {
                // create the node
                childNode = createElm(oldParentVNode, newVNode, i);
                // return node could have been null
                if (childNode) {
                    // append our new node
                    elm.appendChild(childNode);
                }
            }
        }
    }
    return elm;
};
const addVnodes = (parentElm, before, parentVNode, vnodes, startIdx, endIdx) => {
    let containerElm = (parentElm);
    let childNode;
    if (containerElm.shadowRoot && containerElm.tagName === hostTagName) {
        containerElm = containerElm.shadowRoot;
    }
    for (; startIdx <= endIdx; ++startIdx) {
        if (vnodes[startIdx]) {
            childNode = createElm(null, parentVNode, startIdx);
            if (childNode) {
                vnodes[startIdx].$elm$ = childNode;
                containerElm.insertBefore(childNode, before);
            }
        }
    }
};
const removeVnodes = (vnodes, startIdx, endIdx, vnode, elm) => {
    for (; startIdx <= endIdx; ++startIdx) {
        if ((vnode = vnodes[startIdx])) {
            elm = vnode.$elm$;
            // remove the vnode's element from the dom
            elm.remove();
        }
    }
};
const updateChildren = (parentElm, oldCh, newVNode, newCh) => {
    let oldStartIdx = 0;
    let newStartIdx = 0;
    let oldEndIdx = oldCh.length - 1;
    let oldStartVnode = oldCh[0];
    let oldEndVnode = oldCh[oldEndIdx];
    let newEndIdx = newCh.length - 1;
    let newStartVnode = newCh[0];
    let newEndVnode = newCh[newEndIdx];
    let node;
    while (oldStartIdx <= oldEndIdx && newStartIdx <= newEndIdx) {
        if (oldStartVnode == null) {
            // Vnode might have been moved left
            oldStartVnode = oldCh[++oldStartIdx];
        }
        else if (oldEndVnode == null) {
            oldEndVnode = oldCh[--oldEndIdx];
        }
        else if (newStartVnode == null) {
            newStartVnode = newCh[++newStartIdx];
        }
        else if (newEndVnode == null) {
            newEndVnode = newCh[--newEndIdx];
        }
        else if (isSameVnode(oldStartVnode, newStartVnode)) {
            patch(oldStartVnode, newStartVnode);
            oldStartVnode = oldCh[++oldStartIdx];
            newStartVnode = newCh[++newStartIdx];
        }
        else if (isSameVnode(oldEndVnode, newEndVnode)) {
            patch(oldEndVnode, newEndVnode);
            oldEndVnode = oldCh[--oldEndIdx];
            newEndVnode = newCh[--newEndIdx];
        }
        else if (isSameVnode(oldStartVnode, newEndVnode)) {
            patch(oldStartVnode, newEndVnode);
            parentElm.insertBefore(oldStartVnode.$elm$, oldEndVnode.$elm$.nextSibling);
            oldStartVnode = oldCh[++oldStartIdx];
            newEndVnode = newCh[--newEndIdx];
        }
        else if (isSameVnode(oldEndVnode, newStartVnode)) {
            patch(oldEndVnode, newStartVnode);
            parentElm.insertBefore(oldEndVnode.$elm$, oldStartVnode.$elm$);
            oldEndVnode = oldCh[--oldEndIdx];
            newStartVnode = newCh[++newStartIdx];
        }
        else {
            {
                // new element
                node = createElm(oldCh && oldCh[newStartIdx], newVNode, newStartIdx);
                newStartVnode = newCh[++newStartIdx];
            }
            if (node) {
                {
                    oldStartVnode.$elm$.parentNode.insertBefore(node, oldStartVnode.$elm$);
                }
            }
        }
    }
    if (oldStartIdx > oldEndIdx) {
        addVnodes(parentElm, newCh[newEndIdx + 1] == null ? null : newCh[newEndIdx + 1].$elm$, newVNode, newCh, newStartIdx, newEndIdx);
    }
    else if (newStartIdx > newEndIdx) {
        removeVnodes(oldCh, oldStartIdx, oldEndIdx);
    }
};
const isSameVnode = (vnode1, vnode2) => {
    // compare if two vnode to see if they're "technically" the same
    // need to have the same element tag, and same key to be the same
    if (vnode1.$tag$ === vnode2.$tag$) {
        return true;
    }
    return false;
};
const patch = (oldVNode, newVNode) => {
    const elm = (newVNode.$elm$ = oldVNode.$elm$);
    const oldChildren = oldVNode.$children$;
    const newChildren = newVNode.$children$;
    const text = newVNode.$text$;
    if (text === null) {
        if (oldChildren !== null && newChildren !== null) {
            // looks like there's child vnodes for both the old and new vnodes
            updateChildren(elm, oldChildren, newVNode, newChildren);
        }
        else if (newChildren !== null) {
            // no old child vnodes, but there are new child vnodes to add
            if (oldVNode.$text$ !== null) {
                // the old vnode was text, so be sure to clear it out
                elm.textContent = '';
            }
            // add the new vnode children
            addVnodes(elm, null, newVNode, newChildren, 0, newChildren.length - 1);
        }
        else if (oldChildren !== null) {
            // no new child vnodes, but there are old child vnodes to remove
            removeVnodes(oldChildren, 0, oldChildren.length - 1);
        }
    }
    else if (oldVNode.$text$ !== text) {
        // update the text content for the text only vnode
        // and also only if the text is different than before
        elm.data = text;
    }
};
const renderVdom = (hostRef, renderFnResults) => {
    const hostElm = hostRef.$hostElement$;
    const oldVNode = hostRef.$vnode$ || newVNode(null, null);
    const rootVnode = isHost(renderFnResults) ? renderFnResults : h(null, null, renderFnResults);
    hostTagName = hostElm.tagName;
    rootVnode.$tag$ = null;
    rootVnode.$flags$ |= 4 /* isHost */;
    hostRef.$vnode$ = rootVnode;
    rootVnode.$elm$ = oldVNode.$elm$ = (hostElm.shadowRoot || hostElm );
    {
        scopeId = hostElm['s-sc'];
    }
    // synchronous patch
    patch(oldVNode, rootVnode);
};
/**
 * Helper function to create & dispatch a custom Event on a provided target
 * @param elm the target of the Event
 * @param name the name to give the custom Event
 * @param opts options for configuring a custom Event
 * @returns the custom Event
 */
const emitEvent = (elm, name, opts) => {
    const ev = plt.ce(name, opts);
    elm.dispatchEvent(ev);
    return ev;
};
const attachToAncestor = (hostRef, ancestorComponent) => {
    if (ancestorComponent && !hostRef.$onRenderResolve$ && ancestorComponent['s-p']) {
        ancestorComponent['s-p'].push(new Promise((r) => (hostRef.$onRenderResolve$ = r)));
    }
};
const scheduleUpdate = (hostRef, isInitialLoad) => {
    {
        hostRef.$flags$ |= 16 /* isQueuedForUpdate */;
    }
    if (hostRef.$flags$ & 4 /* isWaitingForChildren */) {
        hostRef.$flags$ |= 512 /* needsRerender */;
        return;
    }
    attachToAncestor(hostRef, hostRef.$ancestorComponent$);
    // there is no ancestor component or the ancestor component
    // has already fired off its lifecycle update then
    // fire off the initial update
    const dispatch = () => dispatchHooks(hostRef, isInitialLoad);
    return writeTask(dispatch) ;
};
const dispatchHooks = (hostRef, isInitialLoad) => {
    const endSchedule = createTime('scheduleUpdate', hostRef.$cmpMeta$.$tagName$);
    const instance = hostRef.$lazyInstance$ ;
    let promise;
    endSchedule();
    return then(promise, () => updateComponent(hostRef, instance, isInitialLoad));
};
const updateComponent = async (hostRef, instance, isInitialLoad) => {
    // updateComponent
    const elm = hostRef.$hostElement$;
    const endUpdate = createTime('update', hostRef.$cmpMeta$.$tagName$);
    const rc = elm['s-rc'];
    if (isInitialLoad) {
        // DOM WRITE!
        attachStyles(hostRef);
    }
    const endRender = createTime('render', hostRef.$cmpMeta$.$tagName$);
    {
        callRender(hostRef, instance);
    }
    if (rc) {
        // ok, so turns out there are some child host elements
        // waiting on this parent element to load
        // let's fire off all update callbacks waiting
        rc.map((cb) => cb());
        elm['s-rc'] = undefined;
    }
    endRender();
    endUpdate();
    {
        const childrenPromises = elm['s-p'];
        const postUpdate = () => postUpdateComponent(hostRef);
        if (childrenPromises.length === 0) {
            postUpdate();
        }
        else {
            Promise.all(childrenPromises).then(postUpdate);
            hostRef.$flags$ |= 4 /* isWaitingForChildren */;
            childrenPromises.length = 0;
        }
    }
};
const callRender = (hostRef, instance, elm) => {
    try {
        instance = instance.render() ;
        {
            hostRef.$flags$ &= ~16 /* isQueuedForUpdate */;
        }
        {
            hostRef.$flags$ |= 2 /* hasRendered */;
        }
        {
            {
                // looks like we've got child nodes to render into this host element
                // or we need to update the css class/attrs on the host element
                // DOM WRITE!
                {
                    renderVdom(hostRef, instance);
                }
            }
        }
    }
    catch (e) {
        consoleError(e, hostRef.$hostElement$);
    }
    return null;
};
const postUpdateComponent = (hostRef) => {
    const tagName = hostRef.$cmpMeta$.$tagName$;
    const elm = hostRef.$hostElement$;
    const endPostUpdate = createTime('postUpdate', tagName);
    const ancestorComponent = hostRef.$ancestorComponent$;
    if (!(hostRef.$flags$ & 64 /* hasLoadedComponent */)) {
        hostRef.$flags$ |= 64 /* hasLoadedComponent */;
        {
            // DOM WRITE!
            addHydratedFlag(elm);
        }
        endPostUpdate();
        {
            hostRef.$onReadyResolve$(elm);
            if (!ancestorComponent) {
                appDidLoad();
            }
        }
    }
    else {
        endPostUpdate();
    }
    // load events fire from bottom to top
    // the deepest elements load first then bubbles up
    {
        if (hostRef.$onRenderResolve$) {
            hostRef.$onRenderResolve$();
            hostRef.$onRenderResolve$ = undefined;
        }
        if (hostRef.$flags$ & 512 /* needsRerender */) {
            nextTick(() => scheduleUpdate(hostRef, false));
        }
        hostRef.$flags$ &= ~(4 /* isWaitingForChildren */ | 512 /* needsRerender */);
    }
    // ( •_•)
    // ( •_•)>⌐■-■
    // (⌐■_■)
};
const appDidLoad = (who) => {
    // on appload
    // we have finish the first big initial render
    {
        addHydratedFlag(doc.documentElement);
    }
    nextTick(() => emitEvent(win, 'appload', { detail: { namespace: NAMESPACE } }));
};
const then = (promise, thenFn) => {
    return promise && promise.then ? promise.then(thenFn) : thenFn();
};
const addHydratedFlag = (elm) => elm.classList.add('hydrated')
    ;
const initializeClientHydrate = (hostElm, tagName, hostId, hostRef) => {
    const endHydrate = createTime('hydrateClient', tagName);
    const shadowRoot = hostElm.shadowRoot;
    const childRenderNodes = [];
    const slotNodes = [];
    const shadowRootNodes = shadowRoot ? [] : null;
    const vnode = (hostRef.$vnode$ = newVNode(tagName, null));
    if (!plt.$orgLocNodes$) {
        initializeDocumentHydrate(doc.body, (plt.$orgLocNodes$ = new Map()));
    }
    hostElm[HYDRATE_ID] = hostId;
    hostElm.removeAttribute(HYDRATE_ID);
    clientHydrate(vnode, childRenderNodes, slotNodes, shadowRootNodes, hostElm, hostElm, hostId);
    childRenderNodes.map((c) => {
        const orgLocationId = c.$hostId$ + '.' + c.$nodeId$;
        const orgLocationNode = plt.$orgLocNodes$.get(orgLocationId);
        const node = c.$elm$;
        if (orgLocationNode && supportsShadow && orgLocationNode['s-en'] === '') {
            orgLocationNode.parentNode.insertBefore(node, orgLocationNode.nextSibling);
        }
        if (!shadowRoot) {
            node['s-hn'] = tagName;
            if (orgLocationNode) {
                node['s-ol'] = orgLocationNode;
                node['s-ol']['s-nr'] = node;
            }
        }
        plt.$orgLocNodes$.delete(orgLocationId);
    });
    if (shadowRoot) {
        shadowRootNodes.map((shadowRootNode) => {
            if (shadowRootNode) {
                shadowRoot.appendChild(shadowRootNode);
            }
        });
    }
    endHydrate();
};
const clientHydrate = (parentVNode, childRenderNodes, slotNodes, shadowRootNodes, hostElm, node, hostId) => {
    let childNodeType;
    let childIdSplt;
    let childVNode;
    let i;
    if (node.nodeType === 1 /* ElementNode */) {
        childNodeType = node.getAttribute(HYDRATE_CHILD_ID);
        if (childNodeType) {
            // got the node data from the element's attribute
            // `${hostId}.${nodeId}.${depth}.${index}`
            childIdSplt = childNodeType.split('.');
            if (childIdSplt[0] === hostId || childIdSplt[0] === '0') {
                childVNode = {
                    $flags$: 0,
                    $hostId$: childIdSplt[0],
                    $nodeId$: childIdSplt[1],
                    $depth$: childIdSplt[2],
                    $index$: childIdSplt[3],
                    $tag$: node.tagName.toLowerCase(),
                    $elm$: node,
                    $attrs$: null,
                    $children$: null,
                    $key$: null,
                    $name$: null,
                    $text$: null,
                };
                childRenderNodes.push(childVNode);
                node.removeAttribute(HYDRATE_CHILD_ID);
                // this is a new child vnode
                // so ensure its parent vnode has the vchildren array
                if (!parentVNode.$children$) {
                    parentVNode.$children$ = [];
                }
                // add our child vnode to a specific index of the vnode's children
                parentVNode.$children$[childVNode.$index$] = childVNode;
                // this is now the new parent vnode for all the next child checks
                parentVNode = childVNode;
                if (shadowRootNodes && childVNode.$depth$ === '0') {
                    shadowRootNodes[childVNode.$index$] = childVNode.$elm$;
                }
            }
        }
        // recursively drill down, end to start so we can remove nodes
        for (i = node.childNodes.length - 1; i >= 0; i--) {
            clientHydrate(parentVNode, childRenderNodes, slotNodes, shadowRootNodes, hostElm, node.childNodes[i], hostId);
        }
        if (node.shadowRoot) {
            // keep drilling down through the shadow root nodes
            for (i = node.shadowRoot.childNodes.length - 1; i >= 0; i--) {
                clientHydrate(parentVNode, childRenderNodes, slotNodes, shadowRootNodes, hostElm, node.shadowRoot.childNodes[i], hostId);
            }
        }
    }
    else if (node.nodeType === 8 /* CommentNode */) {
        // `${COMMENT_TYPE}.${hostId}.${nodeId}.${depth}.${index}`
        childIdSplt = node.nodeValue.split('.');
        if (childIdSplt[1] === hostId || childIdSplt[1] === '0') {
            // comment node for either the host id or a 0 host id
            childNodeType = childIdSplt[0];
            childVNode = {
                $flags$: 0,
                $hostId$: childIdSplt[1],
                $nodeId$: childIdSplt[2],
                $depth$: childIdSplt[3],
                $index$: childIdSplt[4],
                $elm$: node,
                $attrs$: null,
                $children$: null,
                $key$: null,
                $name$: null,
                $tag$: null,
                $text$: null,
            };
            if (childNodeType === TEXT_NODE_ID) {
                childVNode.$elm$ = node.nextSibling;
                if (childVNode.$elm$ && childVNode.$elm$.nodeType === 3 /* TextNode */) {
                    childVNode.$text$ = childVNode.$elm$.textContent;
                    childRenderNodes.push(childVNode);
                    // remove the text comment since it's no longer needed
                    node.remove();
                    if (!parentVNode.$children$) {
                        parentVNode.$children$ = [];
                    }
                    parentVNode.$children$[childVNode.$index$] = childVNode;
                    if (shadowRootNodes && childVNode.$depth$ === '0') {
                        shadowRootNodes[childVNode.$index$] = childVNode.$elm$;
                    }
                }
            }
            else if (childVNode.$hostId$ === hostId) {
                // this comment node is specifcally for this host id
                if (childNodeType === SLOT_NODE_ID) {
                    // `${SLOT_NODE_ID}.${hostId}.${nodeId}.${depth}.${index}.${slotName}`;
                    childVNode.$tag$ = 'slot';
                    if (childIdSplt[5]) {
                        node['s-sn'] = childVNode.$name$ = childIdSplt[5];
                    }
                    else {
                        node['s-sn'] = '';
                    }
                    node['s-sr'] = true;
                    if (shadowRootNodes) {
                        // browser support shadowRoot and this is a shadow dom component
                        // create an actual slot element
                        childVNode.$elm$ = doc.createElement(childVNode.$tag$);
                        if (childVNode.$name$) {
                            // add the slot name attribute
                            childVNode.$elm$.setAttribute('name', childVNode.$name$);
                        }
                        // insert the new slot element before the slot comment
                        node.parentNode.insertBefore(childVNode.$elm$, node);
                        // remove the slot comment since it's not needed for shadow
                        node.remove();
                        if (childVNode.$depth$ === '0') {
                            shadowRootNodes[childVNode.$index$] = childVNode.$elm$;
                        }
                    }
                    slotNodes.push(childVNode);
                    if (!parentVNode.$children$) {
                        parentVNode.$children$ = [];
                    }
                    parentVNode.$children$[childVNode.$index$] = childVNode;
                }
                else if (childNodeType === CONTENT_REF_ID) {
                    // `${CONTENT_REF_ID}.${hostId}`;
                    if (shadowRootNodes) {
                        // remove the content ref comment since it's not needed for shadow
                        node.remove();
                    }
                }
            }
        }
    }
    else if (parentVNode && parentVNode.$tag$ === 'style') {
        const vnode = newVNode(null, node.textContent);
        vnode.$elm$ = node;
        vnode.$index$ = '0';
        parentVNode.$children$ = [vnode];
    }
};
const initializeDocumentHydrate = (node, orgLocNodes) => {
    if (node.nodeType === 1 /* ElementNode */) {
        let i = 0;
        for (; i < node.childNodes.length; i++) {
            initializeDocumentHydrate(node.childNodes[i], orgLocNodes);
        }
        if (node.shadowRoot) {
            for (i = 0; i < node.shadowRoot.childNodes.length; i++) {
                initializeDocumentHydrate(node.shadowRoot.childNodes[i], orgLocNodes);
            }
        }
    }
    else if (node.nodeType === 8 /* CommentNode */) {
        const childIdSplt = node.nodeValue.split('.');
        if (childIdSplt[0] === ORG_LOCATION_ID) {
            orgLocNodes.set(childIdSplt[1] + '.' + childIdSplt[2], node);
            node.nodeValue = '';
            // useful to know if the original location is
            // the root light-dom of a shadow dom component
            node['s-en'] = childIdSplt[3];
        }
    }
};
const parsePropertyValue = (propValue, propType) => {
    // ensure this value is of the correct prop type
    if (propValue != null && !isComplexType(propValue)) {
        if (propType & 1 /* String */) {
            // could have been passed as a number or boolean
            // but we still want it as a string
            return String(propValue);
        }
        // redundant return here for better minification
        return propValue;
    }
    // not sure exactly what type we want
    // so no need to change to a different type
    return propValue;
};
const getValue = (ref, propName) => getHostRef(ref).$instanceValues$.get(propName);
const setValue = (ref, propName, newVal, cmpMeta) => {
    // check our new property value against our internal value
    const hostRef = getHostRef(ref);
    const oldVal = hostRef.$instanceValues$.get(propName);
    const flags = hostRef.$flags$;
    const instance = hostRef.$lazyInstance$ ;
    newVal = parsePropertyValue(newVal, cmpMeta.$members$[propName][0]);
    if ((!(flags & 8 /* isConstructingInstance */) || oldVal === undefined) && newVal !== oldVal) {
        // gadzooks! the property's value has changed!!
        // set our new value!
        hostRef.$instanceValues$.set(propName, newVal);
        if (instance) {
            if ((flags & (2 /* hasRendered */ | 16 /* isQueuedForUpdate */)) === 2 /* hasRendered */) {
                // looks like this value actually changed, so we've got work to do!
                // but only if we've already rendered, otherwise just chill out
                // queue that we need to do an update, but don't worry about queuing
                // up millions cuz this function ensures it only runs once
                scheduleUpdate(hostRef, false);
            }
        }
    }
};
const proxyComponent = (Cstr, cmpMeta, flags) => {
    if (cmpMeta.$members$) {
        // It's better to have a const than two Object.entries()
        const members = Object.entries(cmpMeta.$members$);
        const prototype = Cstr.prototype;
        members.map(([memberName, [memberFlags]]) => {
            if ((memberFlags & 31 /* Prop */ ||
                    ((flags & 2 /* proxyState */) && memberFlags & 32 /* State */))) {
                // proxyComponent - prop
                Object.defineProperty(prototype, memberName, {
                    get() {
                        // proxyComponent, get value
                        return getValue(this, memberName);
                    },
                    set(newValue) {
                        // proxyComponent, set value
                        setValue(this, memberName, newValue, cmpMeta);
                    },
                    configurable: true,
                    enumerable: true,
                });
            }
        });
        if ((flags & 1 /* isElementConstructor */)) {
            const attrNameToPropName = new Map();
            prototype.attributeChangedCallback = function (attrName, _oldValue, newValue) {
                plt.jmp(() => {
                    const propName = attrNameToPropName.get(attrName);
                    //  In a webcomponent lifecyle the attributeChangedCallback runs prior to connectedCallback
                    //  in the case where an attribute was set inline.
                    //  ```html
                    //    <my-component some-attribute="some-value"></my-component>
                    //  ```
                    //
                    //  There is an edge case where a developer sets the attribute inline on a custom element and then programatically
                    //  changes it before it has been upgraded as shown below:
                    //
                    //  ```html
                    //    <!-- this component has _not_ been upgraded yet -->
                    //    <my-component id="test" some-attribute="some-value"></my-component>
                    //    <script>
                    //      // grab non-upgraded component
                    //      el = document.querySelector("#test");
                    //      el.someAttribute = "another-value";
                    //      // upgrade component
                    //      cutsomElements.define('my-component', MyComponent);
                    //    </script>
                    //  ```
                    //  In this case if we do not unshadow here and use the value of the shadowing property, attributeChangedCallback
                    //  will be called with `newValue = "some-value"` and will set the shadowed property (this.someAttribute = "another-value")
                    //  to the value that was set inline i.e. "some-value" from above example. When
                    //  the connectedCallback attempts to unshadow it will use "some-value" as the intial value rather than "another-value"
                    //
                    //  The case where the attribute was NOT set inline but was not set programmatically shall be handled/unshadowed
                    //  by connectedCallback as this attributeChangedCallback will not fire.
                    //
                    //  https://developers.google.com/web/fundamentals/web-components/best-practices#lazy-properties
                    //
                    //  TODO(STENCIL-16) we should think about whether or not we actually want to be reflecting the attributes to
                    //  properties here given that this goes against best practices outlined here
                    //  https://developers.google.com/web/fundamentals/web-components/best-practices#avoid-reentrancy
                    if (this.hasOwnProperty(propName)) {
                        newValue = this[propName];
                        delete this[propName];
                    }
                    this[propName] = newValue === null && typeof this[propName] === 'boolean' ? false : newValue;
                });
            };
            // create an array of attributes to observe
            // and also create a map of html attribute name to js property name
            Cstr.observedAttributes = members
                .filter(([_, m]) => m[0] & 15 /* HasAttribute */) // filter to only keep props that should match attributes
                .map(([propName, m]) => {
                const attrName = m[1] || propName;
                attrNameToPropName.set(attrName, propName);
                return attrName;
            });
        }
    }
    return Cstr;
};
const initializeComponent = async (elm, hostRef, cmpMeta, hmrVersionId, Cstr) => {
    // initializeComponent
    if ((hostRef.$flags$ & 32 /* hasInitializedComponent */) === 0) {
        {
            // we haven't initialized this element yet
            hostRef.$flags$ |= 32 /* hasInitializedComponent */;
            // lazy loaded components
            // request the component's implementation to be
            // wired up with the host element
            Cstr = loadModule(cmpMeta);
            if (Cstr.then) {
                // Await creates a micro-task avoid if possible
                const endLoad = uniqueTime();
                Cstr = await Cstr;
                endLoad();
            }
            if (!Cstr.isProxied) {
                proxyComponent(Cstr, cmpMeta, 2 /* proxyState */);
                Cstr.isProxied = true;
            }
            const endNewInstance = createTime('createInstance', cmpMeta.$tagName$);
            // ok, time to construct the instance
            // but let's keep track of when we start and stop
            // so that the getters/setters don't incorrectly step on data
            {
                hostRef.$flags$ |= 8 /* isConstructingInstance */;
            }
            // construct the lazy-loaded component implementation
            // passing the hostRef is very important during
            // construction in order to directly wire together the
            // host element and the lazy-loaded instance
            try {
                new Cstr(hostRef);
            }
            catch (e) {
                consoleError(e);
            }
            {
                hostRef.$flags$ &= ~8 /* isConstructingInstance */;
            }
            endNewInstance();
        }
        if (Cstr.style) {
            // this component has styles but we haven't registered them yet
            let style = Cstr.style;
            const scopeId = getScopeId(cmpMeta);
            if (!styles.has(scopeId)) {
                const endRegisterStyles = createTime('registerStyles', cmpMeta.$tagName$);
                registerStyle(scopeId, style, !!(cmpMeta.$flags$ & 1 /* shadowDomEncapsulation */));
                endRegisterStyles();
            }
        }
    }
    // we've successfully created a lazy instance
    const ancestorComponent = hostRef.$ancestorComponent$;
    const schedule = () => scheduleUpdate(hostRef, true);
    if (ancestorComponent && ancestorComponent['s-rc']) {
        // this is the intial load and this component it has an ancestor component
        // but the ancestor component has NOT fired its will update lifecycle yet
        // so let's just cool our jets and wait for the ancestor to continue first
        // this will get fired off when the ancestor component
        // finally gets around to rendering its lazy self
        // fire off the initial update
        ancestorComponent['s-rc'].push(schedule);
    }
    else {
        schedule();
    }
};
const connectedCallback = (elm) => {
    if ((plt.$flags$ & 1 /* isTmpDisconnected */) === 0) {
        const hostRef = getHostRef(elm);
        const cmpMeta = hostRef.$cmpMeta$;
        const endConnected = createTime('connectedCallback', cmpMeta.$tagName$);
        if (!(hostRef.$flags$ & 1 /* hasConnected */)) {
            // first time this component has connected
            hostRef.$flags$ |= 1 /* hasConnected */;
            let hostId;
            {
                hostId = elm.getAttribute(HYDRATE_ID);
                if (hostId) {
                    if (cmpMeta.$flags$ & 1 /* shadowDomEncapsulation */) {
                        const scopeId = addStyle(elm.shadowRoot, cmpMeta);
                        elm.classList.remove(scopeId + '-h', scopeId + '-s');
                    }
                    initializeClientHydrate(elm, cmpMeta.$tagName$, hostId, hostRef);
                }
            }
            {
                // find the first ancestor component (if there is one) and register
                // this component as one of the actively loading child components for its ancestor
                let ancestorComponent = elm;
                while ((ancestorComponent = ancestorComponent.parentNode || ancestorComponent.host)) {
                    // climb up the ancestors looking for the first
                    // component that hasn't finished its lifecycle update yet
                    if ((ancestorComponent.nodeType === 1 /* ElementNode */ &&
                        ancestorComponent.hasAttribute('s-id') &&
                        ancestorComponent['s-p']) ||
                        ancestorComponent['s-p']) {
                        // we found this components first ancestor component
                        // keep a reference to this component's ancestor component
                        attachToAncestor(hostRef, (hostRef.$ancestorComponent$ = ancestorComponent));
                        break;
                    }
                }
            }
            // Lazy properties
            // https://developers.google.com/web/fundamentals/web-components/best-practices#lazy-properties
            if (cmpMeta.$members$) {
                Object.entries(cmpMeta.$members$).map(([memberName, [memberFlags]]) => {
                    if (memberFlags & 31 /* Prop */ && elm.hasOwnProperty(memberName)) {
                        const value = elm[memberName];
                        delete elm[memberName];
                        elm[memberName] = value;
                    }
                });
            }
            {
                initializeComponent(elm, hostRef, cmpMeta);
            }
        }
        endConnected();
    }
};
const disconnectedCallback = (elm) => {
    if ((plt.$flags$ & 1 /* isTmpDisconnected */) === 0) {
        getHostRef(elm);
    }
};
const bootstrapLazy = (lazyBundles, options = {}) => {
    const endBootstrap = createTime();
    const cmpTags = [];
    const exclude = options.exclude || [];
    const customElements = win.customElements;
    const head = doc.head;
    const metaCharset = /*@__PURE__*/ head.querySelector('meta[charset]');
    const visibilityStyle = /*@__PURE__*/ doc.createElement('style');
    const deferredConnectedCallbacks = [];
    const styles = /*@__PURE__*/ doc.querySelectorAll(`[${HYDRATED_STYLE_ID}]`);
    let appLoadFallback;
    let isBootstrapping = true;
    let i = 0;
    Object.assign(plt, options);
    plt.$resourcesUrl$ = new URL(options.resourcesUrl || './', doc.baseURI).href;
    {
        // If the app is already hydrated there is not point to disable the
        // async queue. This will improve the first input delay
        plt.$flags$ |= 2 /* appLoaded */;
    }
    {
        for (; i < styles.length; i++) {
            registerStyle(styles[i].getAttribute(HYDRATED_STYLE_ID), convertScopedToShadow(styles[i].innerHTML), true);
        }
    }
    lazyBundles.map((lazyBundle) => lazyBundle[1].map((compactMeta) => {
        const cmpMeta = {
            $flags$: compactMeta[0],
            $tagName$: compactMeta[1],
            $members$: compactMeta[2],
            $listeners$: compactMeta[3],
        };
        {
            cmpMeta.$members$ = compactMeta[2];
        }
        const tagName = cmpMeta.$tagName$;
        const HostElement = class extends HTMLElement {
            // StencilLazyHost
            constructor(self) {
                // @ts-ignore
                super(self);
                self = this;
                registerHost(self, cmpMeta);
                if (cmpMeta.$flags$ & 1 /* shadowDomEncapsulation */) {
                    // this component is using shadow dom
                    // and this browser supports shadow dom
                    // add the read-only property "shadowRoot" to the host element
                    // adding the shadow root build conditionals to minimize runtime
                    {
                        {
                            self.attachShadow({ mode: 'open' });
                        }
                    }
                }
            }
            connectedCallback() {
                if (appLoadFallback) {
                    clearTimeout(appLoadFallback);
                    appLoadFallback = null;
                }
                if (isBootstrapping) {
                    // connectedCallback will be processed once all components have been registered
                    deferredConnectedCallbacks.push(this);
                }
                else {
                    plt.jmp(() => connectedCallback(this));
                }
            }
            disconnectedCallback() {
                plt.jmp(() => disconnectedCallback(this));
            }
            componentOnReady() {
                return getHostRef(this).$onReadyPromise$;
            }
        };
        cmpMeta.$lazyBundleId$ = lazyBundle[0];
        if (!exclude.includes(tagName) && !customElements.get(tagName)) {
            cmpTags.push(tagName);
            customElements.define(tagName, proxyComponent(HostElement, cmpMeta, 1 /* isElementConstructor */));
        }
    }));
    {
        visibilityStyle.innerHTML = cmpTags + HYDRATED_CSS;
        visibilityStyle.setAttribute('data-styles', '');
        head.insertBefore(visibilityStyle, metaCharset ? metaCharset.nextSibling : head.firstChild);
    }
    // Process deferred connectedCallbacks now all components have been registered
    isBootstrapping = false;
    if (deferredConnectedCallbacks.length) {
        deferredConnectedCallbacks.map((host) => host.connectedCallback());
    }
    else {
        {
            plt.jmp(() => (appLoadFallback = setTimeout(appDidLoad, 30)));
        }
    }
    // Fallback appLoad event
    endBootstrap();
};
const hostRefs = new WeakMap();
const getHostRef = (ref) => hostRefs.get(ref);
const registerInstance = (lazyInstance, hostRef) => hostRefs.set((hostRef.$lazyInstance$ = lazyInstance), hostRef);
const registerHost = (elm, cmpMeta) => {
    const hostRef = {
        $flags$: 0,
        $hostElement$: elm,
        $cmpMeta$: cmpMeta,
        $instanceValues$: new Map(),
    };
    {
        hostRef.$onReadyPromise$ = new Promise((r) => (hostRef.$onReadyResolve$ = r));
        elm['s-p'] = [];
        elm['s-rc'] = [];
    }
    return hostRefs.set(elm, hostRef);
};
const consoleError = (e, el) => (0, console.error)(e, el);
const cmpModules = /*@__PURE__*/ new Map();
const loadModule = (cmpMeta, hostRef, hmrVersionId) => {
    // loadModuleImport
    const exportName = cmpMeta.$tagName$.replace(/-/g, '_');
    const bundleId = cmpMeta.$lazyBundleId$;
    const module = cmpModules.get(bundleId) ;
    if (module) {
        return module[exportName];
    }
    return Promise.resolve().then(function () { return /*#__PURE__*/_interopNamespace(require(
    /* webpackInclude: /\.entry\.js$/ */
    /* webpackExclude: /\.system\.entry\.js$/ */
    /* webpackMode: "lazy" */
    `./${bundleId}.entry.js${''}`)); }).then((importedModule) => {
        {
            cmpModules.set(bundleId, importedModule);
        }
        return importedModule[exportName];
    }, consoleError);
};
const styles = new Map();
const queueDomReads = [];
const queueDomWrites = [];
const queueTask = (queue, write) => (cb) => {
    queue.push(cb);
    if (!queuePending) {
        queuePending = true;
        if (write && plt.$flags$ & 4 /* queueSync */) {
            nextTick(flush);
        }
        else {
            plt.raf(flush);
        }
    }
};
const consume = (queue) => {
    for (let i = 0; i < queue.length; i++) {
        try {
            queue[i](performance.now());
        }
        catch (e) {
            consoleError(e);
        }
    }
    queue.length = 0;
};
const flush = () => {
    // always force a bunch of medium callbacks to run, but still have
    // a throttle on how many can run in a certain time
    // DOM READS!!!
    consume(queueDomReads);
    // DOM WRITES!!!
    {
        consume(queueDomWrites);
        if ((queuePending = queueDomReads.length > 0)) {
            // still more to do yet, but we've run out of time
            // let's let this thing cool off and try again in the next tick
            plt.raf(flush);
        }
    }
};
const nextTick = /*@__PURE__*/ (cb) => promiseResolve().then(cb);
const writeTask = /*@__PURE__*/ queueTask(queueDomWrites, true);

exports.bootstrapLazy = bootstrapLazy;
exports.h = h;
exports.promiseResolve = promiseResolve;
exports.registerInstance = registerInstance;
