var e=Object.defineProperty,t=Object.defineProperties,n=Object.getOwnPropertyDescriptors,r=Object.getOwnPropertySymbols,o=Object.prototype.hasOwnProperty,a=Object.prototype.propertyIsEnumerable,s=(t,n,r)=>n in t?e(t,n,{enumerable:!0,configurable:!0,writable:!0,value:r}):t[n]=r,c=(e,t)=>{for(var n in t||(t={}))o.call(t,n)&&s(e,n,t[n]);if(r)for(var n of r(t))a.call(t,n)&&s(e,n,t[n]);return e},l=(e,r)=>t(e,n(r));import{R as i,S as p,a as m,b as d,B as u,A as h,I as f,c as E,d as b}from"./vendor.88f6b8e8.js";let _;const g={},y=function(e,t){if(!t||0===t.length)return e();if(void 0===_){const e=document.createElement("link").relList;_=e&&e.supports&&e.supports("modulepreload")?"modulepreload":"preload"}return Promise.all(t.map((e=>{if(e in g)return;g[e]=!0;const t=e.endsWith(".css"),n=t?'[rel="stylesheet"]':"";if(document.querySelector(`link[href="${e}"]${n}`))return;const r=document.createElement("link");return r.rel=t?"stylesheet":_,t||(r.as="script",r.crossOrigin=""),r.href=e,document.head.appendChild(r),t?new Promise(((e,t)=>{r.addEventListener("load",e),r.addEventListener("error",t)})):void 0}))).then((()=>e()))};function O(e){var t;return(t=class extends i.Component{constructor(){super(...arguments),this.state={Component:t.Component}}componentDidMount(){this.state.Component||e().then((({default:e})=>{t.Component=e,this.setState({Component:e})}))}render(){const{Component:e}=this.state;return e?i.createElement(e,c({},this.props)):null}}).Component=null,t}function j(e,t={},n={}){return e?i.createElement(p,c({},n),e.map(((e,n)=>i.createElement(m,{key:e.key||n,path:e.path,exact:e.exact,strict:e.strict,render:n=>e.render?e.render(l(c(c({},n),t),{route:e})):i.createElement(e.component,l(c(c({},n),t),{route:e}))})))):null}const x=[{component:({route:e})=>i.createElement(i.Fragment,null,j(e.routes)),routes:[{path:"/",label:"首页",exact:!0,component:()=>i.createElement(d,{to:"/dashboard"})},{path:"/project/select",label:"选择项目",exact:!0,component:O((()=>y((()=>import("./index.6a3f9869.js")),["/assets/index.6a3f9869.js","/assets/index.be24313b.css","/assets/vendor.88f6b8e8.js","/assets/index.a5148aad.js","/assets/index.7ef4239e.css","/assets/FolderOutlined.242f1f56.js"])))},{path:"/dashboard",label:"看板",component:O((()=>y((()=>import("./index.015cdcd6.js")),["/assets/index.015cdcd6.js","/assets/index.d9a055c4.css","/assets/vendor.88f6b8e8.js","/assets/index.a5148aad.js","/assets/index.7ef4239e.css","/assets/conductUtil.a65dd83b.js","/assets/Tree.4d682869.js","/assets/FolderOutlined.242f1f56.js","/assets/getScrollBarSize.1ed6416c.js"]))),routes:[{name:"Swagger",path:"/dashboard/swagger",exact:!0,component:O((()=>y((()=>import("./index.28098e34.js")),["/assets/index.28098e34.js","/assets/index.deb70bf7.css","/assets/vendor.88f6b8e8.js","/assets/index.a5148aad.js","/assets/index.7ef4239e.css","/assets/conductUtil.a65dd83b.js","/assets/CaretDownOutlined.c199c197.js","/assets/Tree.4d682869.js","/assets/FolderOutlined.242f1f56.js"])))},{name:"Config",path:"/dashboard/config",exact:!0,component:O((()=>y((()=>import("./index.ef9b0c2b.js")),["/assets/index.ef9b0c2b.js","/assets/index.44cec36f.css","/assets/vendor.88f6b8e8.js","/assets/index.a5148aad.js","/assets/index.7ef4239e.css","/assets/conductUtil.a65dd83b.js","/assets/CaretDownOutlined.c199c197.js","/assets/getScrollBarSize.1ed6416c.js"])))}]}]}];function w(){return i.createElement(u,null,j(x))}const P=new h({uri:`${window.location.origin}/graphql`,cache:new f});E.render(i.createElement(b,{client:P},i.createElement(w,null)),document.getElementById("root"));export{j as r};
