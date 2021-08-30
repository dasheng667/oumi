var e=Object.defineProperty,t=Object.defineProperties,n=Object.getOwnPropertyDescriptors,r=Object.getOwnPropertySymbols,o=Object.prototype.hasOwnProperty,a=Object.prototype.propertyIsEnumerable,s=(t,n,r)=>n in t?e(t,n,{enumerable:!0,configurable:!0,writable:!0,value:r}):t[n]=r,c=(e,t)=>{for(var n in t||(t={}))o.call(t,n)&&s(e,n,t[n]);if(r)for(var n of r(t))a.call(t,n)&&s(e,n,t[n]);return e},l=(e,r)=>t(e,n(r));import{R as i,S as p,a as m,G as u,b as d,i as E,c as h,u as f,d as _,e as x,f as b,L as g,H as k,M as y,g as j,h as v,C as O,j as P,A as S,k as C,B as w,l as D}from"./vendor.e4b9c5d6.js";let L;const T={},I=function(e,t){if(!t||0===t.length)return e();if(void 0===L){const e=document.createElement("link").relList;L=e&&e.supports&&e.supports("modulepreload")?"modulepreload":"preload"}return Promise.all(t.map((e=>{if(e in T)return;T[e]=!0;const t=e.endsWith(".css"),n=t?'[rel="stylesheet"]':"";if(document.querySelector(`link[href="${e}"]${n}`))return;const r=document.createElement("link");return r.rel=t?"stylesheet":L,t||(r.as="script",r.crossOrigin=""),r.href=e,document.head.appendChild(r),t?new Promise(((e,t)=>{r.addEventListener("load",e),r.addEventListener("error",t)})):void 0}))).then((()=>e()))};function A(e){var t;return(t=class extends i.Component{constructor(){super(...arguments),this.state={Component:t.Component}}componentDidMount(){this.state.Component||e().then((({default:e})=>{t.Component=e,this.setState({Component:e})}))}render(){const{Component:e}=this.state;return e?i.createElement(e,c({},this.props)):i.createElement("div",{style:{padding:20}},"页面加载中...")}}).Component=null,t}function R(e,t={},n={}){return e?i.createElement(p,c({},n),e.map(((e,n)=>i.createElement(m,{key:e.key||n,path:e.path,exact:e.exact,strict:e.strict,render:n=>e.render?e.render(l(c(c({},n),t),{route:e})):i.createElement(e.component,l(c(c({},n),t),{route:e}))})))):null}const V=u.create({timeout:15e3});V.interceptors.response.use((e=>{if(e&&e.data&&!0===e.data.success)return e.data.data;const{config:t,data:n}=e,r=n&&n.msg?n.msg:"系统繁忙~";return!t||void 0!==t.errorMsg&&!0!==t.errorMsg||(d.destroy(),d.error(r)),Promise.reject(e.data)}),(e=>Promise.reject(e)));const M=E(window.location.origin);M.on("connect",(()=>{window.console.log("socket.connected")}));const N=h.exports.createContext({socket:M}),q=()=>h.exports.useContext(N),z=(e,t)=>{const{params:n,methods:r="post",lazy:o=!1,errorMsg:a=!0,onSuccess:s,onError:l}=t||{},[i,p]=h.exports.useState(o),[m]=h.exports.useState(u.CancelToken.source()),[d,E]=h.exports.useState(null),[f,_]=h.exports.useState(null),[x,b]=h.exports.useState(!1),g=h.exports.useCallback(((t,o)=>(b(!0),new Promise(((i,p)=>{V[r](e,c(c({},n),t),{errorMsg:a,cancelToken:m.token}).then((e=>{b(!1),_(e),"function"==typeof s&&s(e),o&&"function"==typeof o.onSuccess&&o.onSuccess(e),i(e)})).catch((e=>{b(!1),E(e),"function"==typeof l&&l(e),o&&"function"==typeof o.onError&&o.onError(e),p(e)}))})))),[n]);return h.exports.useEffect((()=>{!1===i&&g(),p(!0)}),[g,i,n]),{error:d,data:f,source:m,setData:_,loading:x,request:g}},B=()=>{const e=f(),t=_();return Object.assign(e,t),e.query=x.parse(e.search.substr(1)),e};var W=e=>{const t=b(),[n,r]=h.exports.useState(""),{data:o,error:a,request:s}=z("/api/dashboard/init",{errorMsg:!1,lazy:!0});h.exports.useEffect((()=>{s()}),[]),h.exports.useEffect((()=>{a&&t.replace("/project/select")}),[a]),h.exports.useEffect((()=>{const{location:e}=t;let n=e.pathname;n.startsWith("/tasks")&&(n="/tasks"),r(n)}),[t,t.location]);return a?i.createElement("div",{style:{padding:50}},i.createElement(g,{to:"/project/select"},"选择项目")):i.createElement("div",{className:"ui-slider"},i.createElement("header",{onClick:()=>{t.push("/project/select")}},i.createElement("div",{className:"icon",title:"Oumi 项目过滤器"},i.createElement(k,{style:{fontSize:18}})),i.createElement("div",{className:"project-name"},o&&o.name)),i.createElement("div",{className:"slider-list"},$.map((e=>i.createElement("div",{className:"slider-list-item "+(n===e.path?"active":""),key:e.path},i.createElement(g,{to:e.path},e.icon,e.name))))),i.createElement("div",{className:"contact-me"},i.createElement("a",{href:"mailto:345263463@qq.com"},i.createElement(y,null)," 向我反馈")))};const $=[{name:"任务",path:"/tasks",icon:i.createElement(v,null)},{name:"依赖",path:"/deps",icon:i.createElement(O,null)},{name:"资产",path:"/blocks",icon:i.createElement(P,null)},{name:"Swagger",path:"/swagger",icon:i.createElement(S,null)},{name:"配置",path:"/config",icon:i.createElement(C,null)}],F=[{component:({route:e})=>{const t=b(),[n,r]=h.exports.useState(!1);return h.exports.useEffect((()=>{const{location:e}=t;r("/project/select"!==e.pathname)}),[t,t.location]),i.createElement(i.Fragment,null,n&&i.createElement(W,null),i.createElement("div",{className:"root-container"},R(e.routes)))},routes:[{path:"/",label:"首页",exact:!0,component:()=>i.createElement(j,{to:"/tasks"})},{path:"/project/select",label:"选择项目",exact:!0,component:A((()=>I((()=>import("./index.3a18b993.js")),["/assets/index.3a18b993.js","/assets/index.11f3719d.css","/assets/vendor.e4b9c5d6.js"])))},{path:"/dashboard",label:"Dashboard",exact:!0,component:A((()=>I((()=>import("./index.647101d9.js")),["/assets/index.647101d9.js","/assets/vendor.e4b9c5d6.js","/assets/index.8f5e455a.js","/assets/index.d2bcae10.css"])))},{path:"/swagger",label:"Swagger",exact:!0,component:A((()=>I((()=>import("./index.b803e548.js")),["/assets/index.b803e548.js","/assets/index.cacf812f.css","/assets/vendor.e4b9c5d6.js","/assets/index.8f5e455a.js","/assets/index.d2bcae10.css"])))},{path:"/tasks",label:"Tasks",component:A((()=>I((()=>import("./index.4fc97b9c.js")),["/assets/index.4fc97b9c.js","/assets/index.91f2b036.css","/assets/vendor.e4b9c5d6.js","/assets/index.8f5e455a.js","/assets/index.d2bcae10.css","/assets/event.8de212c3.js"])))},{path:"/tasks/:id",label:"Tasks",component:A((()=>I((()=>import("./index.4fc97b9c.js")),["/assets/index.4fc97b9c.js","/assets/index.91f2b036.css","/assets/vendor.e4b9c5d6.js","/assets/index.8f5e455a.js","/assets/index.d2bcae10.css","/assets/event.8de212c3.js"])))},{path:"/blocks",label:"Blocks",exact:!0,component:A((()=>I((()=>import("./index.670dc7ce.js")),["/assets/index.670dc7ce.js","/assets/index.d177f23e.css","/assets/vendor.e4b9c5d6.js","/assets/index.8f5e455a.js","/assets/index.d2bcae10.css"])))},{path:"/config",label:"Config",exact:!0,component:A((()=>I((()=>import("./index.70987152.js")),["/assets/index.70987152.js","/assets/index.188218b6.css","/assets/vendor.e4b9c5d6.js","/assets/index.8f5e455a.js","/assets/index.d2bcae10.css"])))},{path:"/deps",label:"Deps",exact:!0,component:A((()=>I((()=>import("./index.cc4a6d77.js")),["/assets/index.cc4a6d77.js","/assets/index.3a4c602e.css","/assets/vendor.e4b9c5d6.js","/assets/index.8f5e455a.js","/assets/index.d2bcae10.css","/assets/event.8de212c3.js"])))}]}];function G(){return i.createElement(w,null,R(F))}D.render(i.createElement(N.Provider,{value:{socket:M}},i.createElement(G,null)),document.getElementById("root"));export{q as a,B as b,V as i,z as u};