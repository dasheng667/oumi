var e=Object.defineProperty,t=Object.defineProperties,a=Object.getOwnPropertyDescriptors,l=Object.getOwnPropertySymbols,r=Object.prototype.hasOwnProperty,n=Object.prototype.propertyIsEnumerable,c=(t,a,l)=>a in t?e(t,a,{enumerable:!0,configurable:!0,writable:!0,value:l}):t[a]=l,s=(e,t)=>{for(var a in t||(t={}))r.call(t,a)&&c(e,a,t[a]);if(l)for(var a of l(t))n.call(t,a)&&c(e,a,t[a]);return e};import{r as o,d as i,R as m,T as p,U as u,E as d,e as E,s as v,I as f,t as y,v as N,F as j,w as g,x as h,g as b,y as P,f as x,z as k,G as q}from"./vendor.b6308d1a.js";import{u as C,i as O}from"./index.933877c2.js";const{TabPane:z}=p,A=({projectList:e=[],getProjectList:t,removeProject:a,goDashboard:l})=>{const[r,n]=o.exports.useState(null),{request:c,loading:s}=C("/api/openInEditor",{lazy:!0}),{request:i}=C("/api/project/collect",{lazy:!0});if(!Array.isArray(e))return null;const p=e.filter((e=>e.collection)),u=e.filter((e=>!e.collection));function d(e,o){return Array.isArray(e)?e.map((e=>m.createElement("div",{className:"project-select-list-item",key:e.id},m.createElement("div",{className:"content"},m.createElement("div",{className:"content-icon cur",onClick:a=>(async(e,a,l)=>{e.stopPropagation(),e.preventDefault(),await i({id:a.id,collect:!l}),t()})(a,e,o)},!o&&m.createElement(b,{style:{fontSize:22}}),o&&m.createElement(P,{style:{fontSize:22,color:"#1890ff"}})),m.createElement("div",{className:"content-left",onClick:()=>l({id:e.id})},m.createElement("div",{className:"name"},e.name),m.createElement("div",{className:"path"},e.path)),m.createElement("div",{className:"content-right"},m.createElement("span",{className:"open",onClick:()=>(e=>{s||(n(e),c({input:{file:e.path}}))})(e)},m.createElement(x,null)," 在编辑器中打开 ",s&&e===r&&m.createElement(k,null)),m.createElement("span",{className:"delete",onClick:()=>a(e)},m.createElement(q,null))))))):null}return m.createElement("section",{className:"project-select-list container-center tabs-content-auto"},p.length>0&&m.createElement("div",{className:"project-select-list__title"},"收藏项目"),d(p,!0),m.createElement("div",{className:"project-select-list__title"},"更多项目"),d(u),e&&0===e.length&&m.createElement("div",{className:"empty flex-center"},"没有项目哦，去导入吧~"))},S=({projectData:e,requestImportToProject:t,requestFiles:a})=>{o.exports.useRef(null);const[l,r]=o.exports.useState(!1),{currentPath:n=[],isPackage:c=!1,files:s=[]}=e||{},{request:i}=C("/api/project/verifyDirs",{lazy:!0}),p=e=>{const t=e.target.value.split("/");i({targetPath:t}).then((()=>{r(!1),a({rootPathArr:t})})).catch((()=>{r(!1)}))};return m.createElement("div",{className:"project-import container-center tabs-content-auto"},m.createElement("div",{className:"toolbar"},m.createElement("div",{className:"back flex-center",onClick:()=>{const e=[...n];e.pop(),e.length>1&&a({rootPathArr:e})}},m.createElement(v,null)),m.createElement("div",{className:"current-path"},n.map(((e,t)=>m.createElement("div",{key:e,className:"path-part flex-center",onClick:()=>((e,t)=>{if(t===n.length-1||!e)return;const l=[...n].splice(0,t+1);a({rootPathArr:l})})(e,t)},e))),l&&m.createElement("div",{className:"edit-path"},m.createElement(f,{id:"search-input",defaultValue:n.join("/"),onPressEnter:p}))),m.createElement("div",{className:"edit flex-center",onClick:()=>{const e=document.getElementById("search-input");if(e&&e.value){const{value:t}=e;p({target:{value:t}})}r(!l)}},!l&&m.createElement(y,null),l&&m.createElement(N,null))),m.createElement("div",{className:"folders"},m.createElement(D,{files:s,goNextFile:e=>{const t=[...n,e];a({rootPathArr:t})}})),m.createElement("div",{className:"import-btn"},m.createElement("button",{className:""+(c?"":"disabled"),onClick:()=>{c&&t({importPath:n})}},m.createElement(j,null)," 导入这个文件夹")))},D=({files:e,goNextFile:l})=>m.createElement("div",null,e&&e.map((e=>m.createElement("div",{className:"folder-explorer-item",key:e,onClick:()=>l(e)},m.createElement("div",{className:"icon flex-center"},(()=>{const l={fontSize:18},r=(n=s({},l),t(n,a({color:"#168bff"})));var n;return e.includes(".json")?m.createElement(g,{style:s({},l)}):m.createElement(h,{style:r})})()),m.createElement("div",{className:"folder-name"},e)))),e&&0===e.length&&m.createElement("div",{className:"empty flex-center"},"该目录没有文件~"));var I=()=>{const[e,t]=o.exports.useState("1"),a=i(),{request:l,data:r,loading:n}=C("/api/user/folder",{errorMsg:!1}),{request:c,data:v=[],loading:f}=C("/api/project/list"),{request:y,loading:N}=C("/api/project/dashboard",{lazy:!0,onSuccess:()=>{a.push("/")}}),{request:j,loading:g}=C("/api/project/remove",{lazy:!0,onSuccess:()=>{h()}}),h=e=>{c(e)};return m.createElement("section",{className:"ui-container"},m.createElement("div",{className:"title"},"Oumi UI 项目管理器"),m.createElement("div",{className:"ui-tabs"},m.createElement(p,{defaultActiveKey:"1",activeKey:e,onChange:e=>t(e)},m.createElement(z,{key:"1",tab:m.createElement("span",null,m.createElement(u,null),"项目")},m.createElement(A,{projectList:v,getProjectList:c,removeProject:j,goDashboard:y})),m.createElement(z,{key:"2",tab:m.createElement("span",null,m.createElement(d,null),"导入")},m.createElement(S,{requestImportToProject:e=>{O.post("/api/project/import",s({},e)).then((e=>{h(),t("1")}))},projectData:r,requestFiles:e=>{l(e)}}))),(n||f)&&m.createElement("div",{className:"loading flex-center"},m.createElement(E,null))))};export{I as default};