import{c as E,r as s,j as k}from"./index-EILkn9hz.js";import{M as N,i as A,u as v,P as W,a as B,b as D,L as H}from"./proxy-SbBN1-cw.js";/**
 * @license lucide-react v0.562.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const K=[["path",{d:"M5 12h14",key:"1ays0h"}],["path",{d:"m12 5 7 7-7 7",key:"xquz4c"}]],ee=E("arrow-right",K);/**
 * @license lucide-react v0.562.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const U=[["path",{d:"M21.801 10A10 10 0 1 1 17 3.335",key:"yps3ct"}],["path",{d:"m9 11 3 3L22 4",key:"1pflzl"}]],te=E("circle-check-big",U);/**
 * @license lucide-react v0.562.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const X=[["path",{d:"m21 21-4.34-4.34",key:"14j7rj"}],["circle",{cx:"11",cy:"11",r:"8",key:"4ej97u"}]],ne=E("search",X);/**
 * @license lucide-react v0.562.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const q=[["path",{d:"M11.525 2.295a.53.53 0 0 1 .95 0l2.31 4.679a2.123 2.123 0 0 0 1.595 1.16l5.166.756a.53.53 0 0 1 .294.904l-3.736 3.638a2.123 2.123 0 0 0-.611 1.878l.882 5.14a.53.53 0 0 1-.771.56l-4.618-2.428a2.122 2.122 0 0 0-1.973 0L6.396 21.01a.53.53 0 0 1-.77-.56l.881-5.139a2.122 2.122 0 0 0-.611-1.879L2.16 9.795a.53.53 0 0 1 .294-.906l5.165-.755a2.122 2.122 0 0 0 1.597-1.16z",key:"r04s7s"}]],se=E("star",q);/**
 * @license lucide-react v0.562.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const F=[["path",{d:"M18 6 6 18",key:"1bl5f8"}],["path",{d:"m6 6 12 12",key:"d8bk6v"}]],oe=E("x",F);function z(e,o){if(typeof e=="function")return e(o);e!=null&&(e.current=o)}function G(...e){return o=>{let t=!1;const r=e.map(i=>{const n=z(i,o);return!t&&typeof n=="function"&&(t=!0),n});if(t)return()=>{for(let i=0;i<r.length;i++){const n=r[i];typeof n=="function"?n():z(e[i],null)}}}}function T(...e){return s.useCallback(G(...e),e)}class V extends s.Component{getSnapshotBeforeUpdate(o){const t=this.props.childRef.current;if(t&&o.isPresent&&!this.props.isPresent){const r=t.offsetParent,i=A(r)&&r.offsetWidth||0,n=this.props.sizeRef.current;n.height=t.offsetHeight||0,n.width=t.offsetWidth||0,n.top=t.offsetTop,n.left=t.offsetLeft,n.right=i-n.width-n.left}return null}componentDidUpdate(){}render(){return this.props.children}}function J({children:e,isPresent:o,anchorX:t,root:r}){const i=s.useId(),n=s.useRef(null),p=s.useRef({width:0,height:0,top:0,left:0,right:0}),{nonce:x}=s.useContext(N),R=T(n,e==null?void 0:e.ref);return s.useInsertionEffect(()=>{const{width:c,height:m,top:l,left:f,right:d}=p.current;if(o||!n.current||!c||!m)return;const C=t==="left"?`left: ${f}`:`right: ${d}`;n.current.dataset.motionPopId=i;const u=document.createElement("style");x&&(u.nonce=x);const M=r??document.head;return M.appendChild(u),u.sheet&&u.sheet.insertRule(`
          [data-motion-pop-id="${i}"] {
            position: absolute !important;
            width: ${c}px !important;
            height: ${m}px !important;
            ${C}px !important;
            top: ${l}px !important;
          }
        `),()=>{M.contains(u)&&M.removeChild(u)}},[o]),k.jsx(V,{isPresent:o,childRef:n,sizeRef:p,children:s.cloneElement(e,{ref:R})})}const O=({children:e,initial:o,isPresent:t,onExitComplete:r,custom:i,presenceAffectsLayout:n,mode:p,anchorX:x,root:R})=>{const c=v(Q),m=s.useId();let l=!0,f=s.useMemo(()=>(l=!1,{id:m,initial:o,isPresent:t,custom:i,onExitComplete:d=>{c.set(d,!0);for(const C of c.values())if(!C)return;r&&r()},register:d=>(c.set(d,!1),()=>c.delete(d))}),[t,c,r]);return n&&l&&(f={...f}),s.useMemo(()=>{c.forEach((d,C)=>c.set(C,!1))},[t]),s.useEffect(()=>{!t&&!c.size&&r&&r()},[t]),p==="popLayout"&&(e=k.jsx(J,{isPresent:t,anchorX:x,root:R,children:e})),k.jsx(W.Provider,{value:f,children:e})};function Q(){return new Map}const j=e=>e.key||"";function b(e){const o=[];return s.Children.forEach(e,t=>{s.isValidElement(t)&&o.push(t)}),o}const re=({children:e,custom:o,initial:t=!0,onExitComplete:r,presenceAffectsLayout:i=!0,mode:n="sync",propagate:p=!1,anchorX:x="left",root:R})=>{const[c,m]=B(p),l=s.useMemo(()=>b(e),[e]),f=p&&!c?[]:l.map(j),d=s.useRef(!0),C=s.useRef(l),u=v(()=>new Map),[M,I]=s.useState(l),[y,$]=s.useState(l);D(()=>{d.current=!1,C.current=l;for(let h=0;h<y.length;h++){const a=j(y[h]);f.includes(a)?u.delete(a):u.get(a)!==!0&&u.set(a,!1)}},[y,f.length,f.join("-")]);const w=[];if(l!==M){let h=[...l];for(let a=0;a<y.length;a++){const g=y[a],_=j(g);f.includes(_)||(h.splice(a,0,g),w.push(g))}return n==="wait"&&w.length&&(h=w),$(b(h)),I(l),null}const{forceRender:P}=s.useContext(H);return k.jsx(k.Fragment,{children:y.map(h=>{const a=j(h),g=p&&!c?!1:l===y||f.includes(a),_=()=>{if(u.has(a))u.set(a,!0);else return;let L=!0;u.forEach(S=>{S||(L=!1)}),L&&(P==null||P(),$(C.current),p&&(m==null||m()),r&&r())};return k.jsx(O,{isPresent:g,initial:!d.current||t?void 0:!1,custom:o,presenceAffectsLayout:i,mode:n,root:R,onExitComplete:g?void 0:_,anchorX:x,children:h},a)})})};export{re as A,te as C,ne as S,oe as X,se as a,ee as b};
