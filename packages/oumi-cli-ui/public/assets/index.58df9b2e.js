var e=Object.defineProperty,t=Object.defineProperties,a=Object.getOwnPropertyDescriptors,r=Object.getOwnPropertySymbols,l=Object.prototype.hasOwnProperty,n=Object.prototype.propertyIsEnumerable,c=(t,a,r)=>a in t?e(t,a,{enumerable:!0,configurable:!0,writable:!0,value:r}):t[a]=r,s=(e,t)=>{for(var a in t||(t={}))l.call(t,a)&&c(e,a,t[a]);if(r)for(var a of r(t))n.call(t,a)&&c(e,a,t[a]);return e};import{c as o,f as i,R as m,T as p,U as u,E as d,l as E,P as v,C as f,m as N,n as h,o as b,I as g,p as j,q as y,F as P,r as x,s as k}from"./vendor.a178a0ed.js";import{u as q,i as C}from"./index.60f9b818.js";const{TabPane:O}=p,S=({projectList:e=[],removeProject:t,goDashboard:a})=>{const[r,l]=o.exports.useState(null),[n,{data:c,error:s,loading:i}]={};return m.createElement("section",{className:"project-select-list container-center tabs-content-auto"},e&&e.map((e=>m.createElement("div",{className:"project-select-list-item",key:e.id},m.createElement("div",{className:"content"},m.createElement("div",{className:"content-icon"},m.createElement(v,{style:{fontSize:22}})),m.createElement("div",{className:"content-left",onClick:()=>a({id:e.id})},m.createElement("div",{className:"name"},e.name),m.createElement("div",{className:"path"},e.path)),m.createElement("div",{className:"content-right"},m.createElement("span",{className:"open",onClick:()=>(e=>{i||(l(e),n({variables:{input:{file:e.path}}}))})(e)},m.createElement(f,null)," 在编辑器中打开 ",i&&e===r&&m.createElement(N,null)),m.createElement("span",{className:"delete",onClick:()=>t(e)},m.createElement(h,null))))))),e&&0===e.length&&m.createElement("div",{className:"empty flex-center"},"没有项目哦，去导入吧~"))},D=({projectData:e,requestImportToProject:t,requestFiles:a})=>{o.exports.useRef(null);const[r,l]=o.exports.useState(!1),{currentPath:n=[],isPackage:c=!1,files:s=[]}=e||{},{request:i,loading:p}=q("/api/project/verifyDirs",{lazy:!0}),u=e=>{const t=e.target.value.split("/");i({targetPath:t}).then((()=>{l(!1),a({rootPathArr:t})})).catch((()=>{l(!1)}))};return m.createElement("div",{className:"project-import container-center tabs-content-auto"},m.createElement("div",{className:"toolbar"},m.createElement("div",{className:"back flex-center",onClick:()=>{const e=[...n];e.pop(),e.length>1&&a({rootPathArr:e})}},m.createElement(b,null)),m.createElement("div",{className:"current-path"},n.map(((e,t)=>m.createElement("div",{key:e,className:"path-part flex-center",onClick:()=>((e,t)=>{if(t===n.length-1||!e)return;const r=[...n].splice(0,t+1);a({rootPathArr:r})})(e,t)},e))),r&&m.createElement("div",{className:"edit-path"},m.createElement(g,{id:"search-input",defaultValue:n.join("/"),onPressEnter:u}))),m.createElement("div",{className:"edit flex-center",onClick:()=>{const e=document.getElementById("search-input");if(e&&e.value){const{value:t}=e;u({target:{value:t}})}l(!r)}},!r&&m.createElement(j,null),r&&m.createElement(y,null))),m.createElement("div",{className:"folders"},m.createElement(I,{files:s,goNextFile:e=>{const t=[...n,e];a({rootPathArr:t})}})),m.createElement("div",{className:"import-btn"},m.createElement("button",{className:""+(c?"":"disabled"),onClick:()=>{c&&t({importPath:n})}},m.createElement(P,null)," 导入这个文件夹")))},I=({files:e,goNextFile:r})=>m.createElement("div",null,e&&e.map((e=>m.createElement("div",{className:"folder-explorer-item",key:e,onClick:()=>r(e)},m.createElement("div",{className:"icon flex-center"},(()=>{const r={fontSize:18},l=(n=s({},r),t(n,a({color:"#168bff"})));var n;return e.includes(".json")?m.createElement(x,{style:s({},r)}):m.createElement(k,{style:l})})()),m.createElement("div",{className:"folder-name"},e)))),e&&0===e.length&&m.createElement("div",{className:"empty flex-center"},"该目录没有文件~"));export default()=>{const[e,t]=o.exports.useState("1"),a=i(),{request:r,data:l,loading:n}=q("/api/user/folder",{errorMsg:!1}),{request:c,data:v=[],loading:f}=q("/api/project/list"),{request:N,loading:h}=q("/api/project/dashboard",{lazy:!0,onSuccess:()=>{a.push("/")}}),{request:b,loading:g}=q("/api/project/remove",{lazy:!0,onSuccess:()=>{j()}}),j=e=>{c(e)};return m.createElement("section",{className:"ui-container"},m.createElement("div",{className:"title"},"Oumi UI 项目管理器"),m.createElement("div",{className:"ui-tabs"},m.createElement(p,{defaultActiveKey:"1",activeKey:e,onChange:e=>t(e)},m.createElement(O,{key:"1",tab:m.createElement("span",null,m.createElement(u,null),"项目")},m.createElement(S,{projectList:v,removeProject:b,goDashboard:N})),m.createElement(O,{key:"2",tab:m.createElement("span",null,m.createElement(d,null),"导入")},m.createElement(D,{requestImportToProject:e=>{C.post("/api/project/import",s({},e)).then((e=>{j(),t("1")}))},projectData:l,requestFiles:e=>{r(e)}}))),(n||f)&&m.createElement("div",{className:"loading flex-center"},m.createElement(E,null))))};
