var e=Object.defineProperty,t=Object.defineProperties,n=Object.getOwnPropertyDescriptors,r=Object.getOwnPropertySymbols,o=Object.prototype.hasOwnProperty,a=Object.prototype.propertyIsEnumerable,s=(t,n,r)=>n in t?e(t,n,{enumerable:!0,configurable:!0,writable:!0,value:r}):t[n]=r,l=(e,t)=>{for(var n in t||(t={}))o.call(t,n)&&s(e,n,t[n]);if(r)for(var n of r(t))a.call(t,n)&&s(e,n,t[n]);return e},c=(e,r)=>t(e,n(r));import{R as p,S as i,a as d,b as m,B as u,A as h,I as f,c as E,d as b}from"./vendor.a57ebf69.js";let _;const g={},y=function(e,t){if(!t||0===t.length)return e();if(void 0===_){const e=document.createElement("link").relList;_=e&&e.supports&&e.supports("modulepreload")?"modulepreload":"preload"}return Promise.all(t.map((e=>{if(e in g)return;g[e]=!0;const t=e.endsWith(".css"),n=t?'[rel="stylesheet"]':"";if(document.querySelector(`link[href="${e}"]${n}`))return;const r=document.createElement("link");return r.rel=t?"stylesheet":_,t||(r.as="script",r.crossOrigin=""),r.href=e,document.head.appendChild(r),t?new Promise(((e,t)=>{r.addEventListener("load",e),r.addEventListener("error",t)})):void 0}))).then((()=>e()))};function O(e){var t;return(t=class extends p.Component{constructor(){super(...arguments),this.state={Component:t.Component}}componentDidMount(){this.state.Component||e().then((({default:e})=>{t.Component=e,this.setState({Component:e})}))}render(){const{Component:e}=this.state;return e?p.createElement(e,l({},this.props)):null}}).Component=null,t}function j(e,t={},n={}){return e?p.createElement(i,l({},n),e.map(((e,n)=>p.createElement(d,{key:e.key||n,path:e.path,exact:e.exact,strict:e.strict,render:n=>e.render?e.render(c(l(l({},n),t),{route:e})):p.createElement(e.component,c(l(l({},n),t),{route:e}))})))):null}const P=[{component:({route:e})=>p.createElement(p.Fragment,null,j(e.routes)),routes:[{path:"/",label:"首页",exact:!0,component:()=>p.createElement(m,{to:"/dashboard/swagger"})},{path:"/project/select",label:"选择项目",exact:!0,component:O((()=>y((()=>import("./index.291207d6.js")),["/assets/index.291207d6.js","/assets/index.be24313b.css","/assets/vendor.a57ebf69.js","/assets/index.22ae736f.js","/assets/index.7ef4239e.css","/assets/index.14114358.js","/assets/FolderOutlined.6f6ebd58.js"])))},{path:"/dashboard",label:"看板",component:O((()=>y((()=>import("./index.88f2dd71.js")),["/assets/index.88f2dd71.js","/assets/index.70e16a77.css","/assets/vendor.a57ebf69.js","/assets/index.22ae736f.js","/assets/index.7ef4239e.css"]))),routes:[{name:"Config",path:"/dashboard/config",component:O((()=>y((()=>import("./index.42fa6a36.js")),["/assets/index.42fa6a36.js","/assets/index.44cec36f.css","/assets/vendor.a57ebf69.js","/assets/index.22ae736f.js","/assets/index.7ef4239e.css","/assets/CaretDownOutlined.0afa607e.js","/assets/index.14114358.js"])))},{name:"Swagger",path:"/dashboard/swagger",component:O((()=>y((()=>import("./index.0d4d71de.js")),["/assets/index.0d4d71de.js","/assets/index.deb70bf7.css","/assets/vendor.a57ebf69.js","/assets/index.22ae736f.js","/assets/index.7ef4239e.css","/assets/CaretDownOutlined.0afa607e.js","/assets/index.14114358.js","/assets/FolderOutlined.6f6ebd58.js"])))}]}]}];function v(){return p.createElement(u,null,j(P))}const w=new h({uri:"http://localhost:9000/graphql",cache:new f});E.render(p.createElement(b,{client:w},p.createElement(v,null)),document.getElementById("root"));export{j as r};
