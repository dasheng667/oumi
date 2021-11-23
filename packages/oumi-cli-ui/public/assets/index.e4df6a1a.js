var e=Object.defineProperty,t=Object.defineProperties,r=Object.getOwnPropertyDescriptors,n=Object.getOwnPropertySymbols,o=Object.prototype.hasOwnProperty,a=Object.prototype.propertyIsEnumerable,s=(t,r,n)=>r in t?e(t,r,{enumerable:!0,configurable:!0,writable:!0,value:n}):t[r]=n,c=(e,t)=>{for(var r in t||(t={}))o.call(t,r)&&s(e,r,t[r]);if(n)for(var r of n(t))a.call(t,r)&&s(e,r,t[r]);return e},l=(e,n)=>t(e,r(n)),i=(e,t,r)=>(s(e,"symbol"!=typeof t?t+"":t,r),r);import{R as p,S as m,a as d,b as u,m as E,i as f,r as h,u as g,c as _,l as b,d as y,L as x,D as k,e as j,C as v,M as O,H as P,f as w,g as C,h as D,j as I,k as S,n as L,A as T,B as A,o as R,p as V,q}from"./vendor.b9d39691.js";!function(){const e=document.createElement("link").relList;if(!(e&&e.supports&&e.supports("modulepreload"))){for(const e of document.querySelectorAll('link[rel="modulepreload"]'))t(e);new MutationObserver((e=>{for(const r of e)if("childList"===r.type)for(const e of r.addedNodes)"LINK"===e.tagName&&"modulepreload"===e.rel&&t(e)})).observe(document,{childList:!0,subtree:!0})}function t(e){if(e.ep)return;e.ep=!0;const t=function(e){const t={};return e.integrity&&(t.integrity=e.integrity),e.referrerpolicy&&(t.referrerPolicy=e.referrerpolicy),"use-credentials"===e.crossorigin?t.credentials="include":"anonymous"===e.crossorigin?t.credentials="omit":t.credentials="same-origin",t}(e);fetch(e.href,t)}}();const N={},M=function(e,t){return t&&0!==t.length?Promise.all(t.map((e=>{if((e=`/${e}`)in N)return;N[e]=!0;const t=e.endsWith(".css"),r=t?'[rel="stylesheet"]':"";if(document.querySelector(`link[href="${e}"]${r}`))return;const n=document.createElement("link");return n.rel=t?"stylesheet":"modulepreload",t||(n.as="script",n.crossOrigin=""),n.href=e,document.head.appendChild(n),t?new Promise(((e,t)=>{n.addEventListener("load",e),n.addEventListener("error",t)})):void 0}))).then((()=>e())):e()};function z(e){var t;return t=class extends p.Component{constructor(){super(...arguments),i(this,"state",{Component:t.Component})}componentDidMount(){this.state.Component||e().then((({default:e})=>{t.Component=e,this.setState({Component:e})}))}render(){const{Component:e}=this.state;return e?p.createElement(e,c({},this.props)):p.createElement("div",{style:{padding:20}},"页面加载中...")}},i(t,"Component",null),t}function B(e,t={},r={}){return e?p.createElement(m,c({},r),e.map(((e,r)=>p.createElement(d,{key:e.key||r,path:e.path,exact:e.exact,strict:e.strict,render:r=>e.render?e.render(l(c(c({},r),t),{route:e})):p.createElement(e.component,l(c(c({},r),t),{route:e}))})))):null}const $=u.create({timeout:15e3});$.interceptors.response.use((e=>{if(e&&e.data&&!0===e.data.success)return e.data.data;const{config:t,data:r}=e,n=r&&r.msg?r.msg:"系统繁忙~";return!t||void 0!==t.errorMsg&&!0!==t.errorMsg||(E.destroy(),E.error(n)),Promise.reject(e.data)}),(e=>Promise.reject(e)));const W=f(window.location.origin);W.on("connect",(()=>{window.console.log("socket.connected")})),W.on("error",(e=>{window.console.log("socket.error",e)}));const F=h.exports.createContext({socket:W}),G=()=>h.exports.useContext(F),H=(e,t)=>{const{params:r,methods:n="post",lazy:o=!1,errorMsg:a=!0,onSuccess:s,onError:l}=t||{},[i,p]=h.exports.useState(o),[m]=h.exports.useState(u.CancelToken.source()),[d,E]=h.exports.useState(null),[f,g]=h.exports.useState(null),[_,b]=h.exports.useState(!1),y=h.exports.useCallback(((t,o)=>(b(!0),new Promise(((i,p)=>{$[n](e,c(c({},r),t),{errorMsg:a,cancelToken:m.token}).then((e=>{b(!1),g(e),"function"==typeof s&&s(e),o&&"function"==typeof o.onSuccess&&o.onSuccess(e),i(e)})).catch((e=>{b(!1),E(e),"function"==typeof l&&l(e),o&&"function"==typeof o.onError&&o.onError(e),p(e)}))})))),[r]);return h.exports.useEffect((()=>{!1===i&&y(),p(!0)}),[y,i,r]),{error:d,data:f,source:m,setData:g,loading:_,request:y}},K=()=>{const e=g(),t=_();return Object.assign(e,t),e.query=b.parse(e.search.substr(1)),e};var J=e=>{const t=y(),[r,n]=h.exports.useState(""),[o,a]=h.exports.useState(!1),{request:s,data:c=[]}=H("/api/project/list"),{request:l}=H("/api/project/dashboard",{lazy:!0}),{request:i}=H("/api/openInEditor",{lazy:!0}),{data:m,error:d,request:u}=H("/api/dashboard/init",{errorMsg:!1,lazy:!0});h.exports.useEffect((()=>{a(!0),u().then((()=>{a(!1)})).catch((()=>{a(!1)}))}),[]),h.exports.useEffect((()=>{d&&t.replace("/project/select")}),[d]),h.exports.useEffect((()=>{const{location:e}=t;let r=e.pathname;r.startsWith("/tasks")&&(r="/tasks"),n(r)}),[t,t.location]);const E=()=>{t.push("/project/select")},f=async()=>{if(m){a(!0);try{await i({input:{file:m.path}}),a(!1)}catch(e){a(!1)}}};return m?d?p.createElement("div",{style:{padding:50}},p.createElement(x,{to:"/project/select"},"选择项目")):p.createElement("div",{className:"ui-slider"},p.createElement("header",null,p.createElement(k,{arrow:!0,placement:"bottomCenter",overlay:()=>p.createElement(O,null,p.createElement(O.Item,{key:"3",onClick:E},p.createElement(P,null)," Oumi 管理器"),p.createElement(O.Item,{key:"1",onClick:f},p.createElement(w,null)," 在编辑器中打开"),p.createElement(O.Divider,null),p.createElement(O.ItemGroup,{title:"收藏的项目"},c&&c.filter((e=>!!e.collection&&m&&e.id!==m.id)).map((e=>p.createElement(O.Item,{key:e.id,onClick:()=>(e=>{l({id:e.id}).then((()=>{window.location.reload()}))})(e)}," ",p.createElement(C,null)," ",e.name," "))))),trigger:["click"]},p.createElement("div",{className:"search"},m.name,o?p.createElement(j,{size:"small"}):p.createElement(v,null)))),p.createElement("div",{className:"slider-list"},Q.map((e=>p.createElement("div",{className:"slider-list-item "+(r===e.path?"active":""),key:e.path},p.createElement(x,{to:e.path},e.icon,e.name))))),p.createElement("div",{className:"contact-me"})):null};const Q=[{name:"任务",path:"/tasks",icon:p.createElement(I,null)},{name:"依赖",path:"/deps",icon:p.createElement(S,null)},{name:"资产",path:"/blocks",icon:p.createElement(L,null)},{name:"Swagger",path:"/swagger",icon:p.createElement(T,null)},{name:"接口调试",path:"/debugger",icon:p.createElement(A,null)},{name:"配置",path:"/config",icon:p.createElement(R,null)}],U=[{component:({route:e})=>{const t=y(),[r,n]=h.exports.useState(!1);return h.exports.useEffect((()=>{const{location:e}=t;n("/project/select"!==e.pathname)}),[t,t.location]),p.createElement(p.Fragment,null,r&&p.createElement(J,null),p.createElement("div",{className:"root-container"},B(e.routes)))},routes:[{path:"/",label:"首页",exact:!0,component:()=>p.createElement(D,{to:"/tasks"})},{path:"/project/select",label:"选择项目",exact:!0,component:z((()=>M((()=>import("./index.3e980ed4.js")),["assets/index.3e980ed4.js","assets/index.0ab7a36a.css","assets/vendor.b9d39691.js"])))},{path:"/dashboard",label:"Dashboard",exact:!0,component:z((()=>M((()=>import("./index.5bb4da91.js")),["assets/index.5bb4da91.js","assets/vendor.b9d39691.js","assets/index.cd6d2183.js","assets/index.31e78832.css"])))},{path:"/swagger",label:"Swagger",exact:!0,component:z((()=>M((()=>import("./index.2df9f8d7.js")),["assets/index.2df9f8d7.js","assets/index.3ac2faf0.css","assets/vendor.b9d39691.js","assets/index.03ffb951.js","assets/index.cd6d2183.js","assets/index.31e78832.css","assets/index.5f79f0e0.js"])))},{path:"/tasks",label:"Tasks",component:z((()=>M((()=>import("./index.fd78025d.js")),["assets/index.fd78025d.js","assets/index.b11d4c50.css","assets/vendor.b9d39691.js","assets/index.cd6d2183.js","assets/index.31e78832.css","assets/event.f54b444a.js","assets/index.03ffb951.js"])))},{path:"/tasks/:id",label:"Tasks",component:z((()=>M((()=>import("./index.fd78025d.js")),["assets/index.fd78025d.js","assets/index.b11d4c50.css","assets/vendor.b9d39691.js","assets/index.cd6d2183.js","assets/index.31e78832.css","assets/event.f54b444a.js","assets/index.03ffb951.js"])))},{path:"/blocks",label:"Blocks",exact:!0,component:z((()=>M((()=>import("./index.6c96556a.js")),["assets/index.6c96556a.js","assets/index.b50aae06.css","assets/vendor.b9d39691.js","assets/index.cd6d2183.js","assets/index.31e78832.css"])))},{path:"/config",label:"Config",exact:!0,component:z((()=>M((()=>import("./index.894e725b.js")),["assets/index.894e725b.js","assets/index.77952f6c.css","assets/vendor.b9d39691.js","assets/index.cd6d2183.js","assets/index.31e78832.css"])))},{path:"/deps",label:"Deps",exact:!0,component:z((()=>M((()=>import("./index.c1af938c.js")),["assets/index.c1af938c.js","assets/index.2114993f.css","assets/vendor.b9d39691.js","assets/index.cd6d2183.js","assets/index.31e78832.css","assets/event.f54b444a.js"])))},{path:"/debugger",label:"Debugger",exact:!0,component:z((()=>M((()=>import("./index.189db05e.js")),["assets/index.189db05e.js","assets/index.5b963c2b.css","assets/vendor.b9d39691.js","assets/index.03ffb951.js","assets/index.5f79f0e0.js"])))},{path:"/debugger/:id",label:"Debugger",exact:!0,component:z((()=>M((()=>import("./index.189db05e.js")),["assets/index.189db05e.js","assets/index.5b963c2b.css","assets/vendor.b9d39691.js","assets/index.03ffb951.js","assets/index.5f79f0e0.js"])))}]}];function X(){return p.createElement(V,null,B(U))}q.render(p.createElement(F.Provider,{value:{socket:W}},p.createElement(X,null)),document.getElementById("root"));export{G as a,K as b,$ as i,H as u};
