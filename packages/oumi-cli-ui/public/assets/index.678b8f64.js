var e=Object.defineProperty,t=Object.defineProperties,n=Object.getOwnPropertyDescriptors,r=Object.getOwnPropertySymbols,o=Object.prototype.hasOwnProperty,a=Object.prototype.propertyIsEnumerable,s=(t,n,r)=>n in t?e(t,n,{enumerable:!0,configurable:!0,writable:!0,value:r}):t[n]=r,c=(e,t)=>{for(var n in t||(t={}))o.call(t,n)&&s(e,n,t[n]);if(r)for(var n of r(t))a.call(t,n)&&s(e,n,t[n]);return e},l=(e,r)=>t(e,n(r));import{R as p,S as i,a as m,b as d,B as u,A as h,I as E,c as b,d as f}from"./vendor.e987c7b3.js";let _;const g={},y=function(e,t){if(!t||0===t.length)return e();if(void 0===_){const e=document.createElement("link").relList;_=e&&e.supports&&e.supports("modulepreload")?"modulepreload":"preload"}return Promise.all(t.map((e=>{if(e in g)return;g[e]=!0;const t=e.endsWith(".css"),n=t?'[rel="stylesheet"]':"";if(document.querySelector(`link[href="${e}"]${n}`))return;const r=document.createElement("link");return r.rel=t?"stylesheet":_,t||(r.as="script",r.crossOrigin=""),r.href=e,document.head.appendChild(r),t?new Promise(((e,t)=>{r.addEventListener("load",e),r.addEventListener("error",t)})):void 0}))).then((()=>e()))};function O(e){var t;return(t=class extends p.Component{constructor(){super(...arguments),this.state={Component:t.Component}}componentDidMount(){this.state.Component||e().then((({default:e})=>{t.Component=e,this.setState({Component:e})}))}render(){const{Component:e}=this.state;return e?p.createElement(e,c({},this.props)):null}}).Component=null,t}function j(e,t={},n={}){return e?p.createElement(i,c({},n),e.map(((e,n)=>p.createElement(m,{key:e.key||n,path:e.path,exact:e.exact,strict:e.strict,render:n=>e.render?e.render(l(c(c({},n),t),{route:e})):p.createElement(e.component,l(c(c({},n),t),{route:e}))})))):null}const P=[{component:({route:e})=>p.createElement(p.Fragment,null,j(e.routes)),routes:[{path:"/",label:"首页",exact:!0,component:()=>p.createElement(d,{to:"/dashboard/swagger"})},{path:"/project/select",label:"选择项目",exact:!0,component:O((()=>y((()=>import("./index.64b92254.js")),["/assets/index.64b92254.js","/assets/index.be24313b.css","/assets/vendor.e987c7b3.js","/assets/index.390a7d21.js","/assets/index.7ef4239e.css","/assets/index.b7277a71.js","/assets/FolderOutlined.dfd92120.js"])))},{path:"/dashboard",label:"看板",component:O((()=>y((()=>import("./index.c4993cd0.js")),["/assets/index.c4993cd0.js","/assets/index.70e16a77.css","/assets/vendor.e987c7b3.js","/assets/index.390a7d21.js","/assets/index.7ef4239e.css"]))),routes:[{name:"Config",path:"/dashboard/config",component:O((()=>y((()=>import("./index.c4caaec4.js")),["/assets/index.c4caaec4.js","/assets/index.44cec36f.css","/assets/vendor.e987c7b3.js","/assets/index.390a7d21.js","/assets/index.7ef4239e.css","/assets/CaretDownOutlined.420b3a9c.js","/assets/index.b7277a71.js"])))},{name:"Swagger",path:"/dashboard/swagger",component:O((()=>y((()=>import("./index.0278d1a1.js")),["/assets/index.0278d1a1.js","/assets/index.deb70bf7.css","/assets/vendor.e987c7b3.js","/assets/index.390a7d21.js","/assets/index.7ef4239e.css","/assets/CaretDownOutlined.420b3a9c.js","/assets/index.b7277a71.js","/assets/FolderOutlined.dfd92120.js"])))}]}]}];function v(){return p.createElement(u,null,j(P))}const w=new h({uri:"http://localhost:9000/graphql",cache:new E});b.render(p.createElement(f,{client:w},p.createElement(v,null)),document.getElementById("root"));export{j as r};
