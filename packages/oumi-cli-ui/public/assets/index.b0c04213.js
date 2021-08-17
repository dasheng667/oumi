var e=Object.defineProperty,t=Object.defineProperties,a=Object.getOwnPropertyDescriptors,r=Object.getOwnPropertySymbols,n=Object.prototype.hasOwnProperty,l=Object.prototype.propertyIsEnumerable,s=(t,a,r)=>a in t?e(t,a,{enumerable:!0,configurable:!0,writable:!0,value:r}):t[a]=r,c=(e,t)=>{for(var a in t||(t={}))n.call(t,a)&&s(e,a,t[a]);if(r)for(var a of r(t))l.call(t,a)&&s(e,a,t[a]);return e},o=(e,r)=>t(e,a(r));import{c as i,R as m,l as d,T as u,t as p,O as f,w as E,I as b,Q as y,f as h,X as g,Y as v,b as k,Z as O,i as N}from"./vendor.a178a0ed.js";import{u as P,i as S}from"./index.60f9b818.js";import{C as j}from"./index.34c381ac.js";const{TabPane:x}=u;function w(){const e=sessionStorage.getItem("OUMI_BLOCKS");return e?JSON.parse(e):null}var C=e=>{const{item:t,addToProject:a}=e,[r,n]=i.exports.useState({}),{data:l,loading:s,error:o,request:p,source:f,setData:E}=P("/api/block/getListFormGit",{lazy:!0}),b=()=>{if(t&&t.href){const e=w();if(e){const a=e[t.href];if(a)return void E(a)}p({url:t.href,useBuiltJSON:!0})}};return i.exports.useEffect((()=>(b(),()=>{f.cancel()})),[]),i.exports.useEffect((()=>{if(!l||!Array.isArray(l))return;const e={};l.forEach((t=>{const{tags:a}=t;a.forEach((a=>{e[a]?e[a].push(t):e[a]=[t]}))})),t.href&&function(e){const t=c({},e),a=w();a&&Object.assign(t,a),sessionStorage.setItem("OUMI_BLOCKS",JSON.stringify(t))}({[t.href]:l}),n(e)}),[l]),s?m.createElement("div",{className:"loading-blocks"},m.createElement(d,null)):o?m.createElement("div",{className:"error-blocks"},"请求失败，",m.createElement("a",null,"https://raw.githubusercontent.com"),"域名有波动，",m.createElement("a",{onClick:b},"稍后重试"),"。"):m.createElement("div",{className:"blocks-container"},m.createElement(u,{type:"card"},r&&Object.keys(r).map((e=>{const t=r[e];return m.createElement(x,{forceRender:!1,tab:e,key:e},m.createElement("div",{className:"blocks-list"},t&&t.map((e=>m.createElement("div",{className:"blocks-list__item",key:e.path},m.createElement("div",{className:"handler"},m.createElement("span",{onClick:()=>a(e)},"添加到项目")),m.createElement("div",{className:"img"},m.createElement("img",{src:e.img,alt:""})),m.createElement("p",null,e.name))))))}))))},I=e=>{const{selectNode:t,onSuccess:a}=e,{dirPath:r}=t||{},[n]=p.useForm(),[l,s]=m.useState(!1),{data:o,request:i,loading:d}=P("/api/project/createDir",{lazy:!0}),u=e=>{s(e)};return m.createElement(f,{title:()=>m.createElement("div",null,m.createElement(p,{form:n,className:"my-popconfirm-form"},m.createElement(p.Item,{name:"dirName",label:"目录名称",rules:[{required:!0,message:"请输入目录名称"},{pattern:/^[a-zA-Z0-9_-]+$/,message:"请输入正确的目录名称"}]},m.createElement(b,null)))),visible:l,onConfirm:()=>{n.validateFields().then((e=>{i(c({currentPath:r},e)).then((e=>{s(!1),"function"==typeof a&&a()}))}))},placement:"left",okButtonProps:{loading:d},onCancel:()=>u(!1),icon:!1},m.createElement(E,{size:"small",type:"primary",disabled:!t,onClick:()=>u(!0)},"新建文件夹"))};function D(e,t,a){return e.map((e=>e.key===t?o(c({},e),{children:a}):e.children?o(c({},e),{children:D(e.children,t,a)}):e))}var L=e=>{const{onSelect:t}=e,[a,r]=i.exports.useState([]),[n,l]=i.exports.useState(null),s=e=>S.post("/api/project/dirs",e),c=()=>{s().then((e=>{r(e)}))};function o({key:e,children:t,dirPath:a}){return new Promise((n=>{t?n():s({currentPath:a}).then((t=>{Array.isArray(t)&&r((a=>D(a,e,t))),n()}))}))}i.exports.useEffect((()=>{c()}),[]);return m.createElement("div",{className:"dirs",style:{maxHeight:450,overflow:"hidden",overflowY:"auto"}},m.createElement("div",{className:"dirs-box"},m.createElement(I,{selectNode:n,onSuccess:()=>{n&&n.key?o({key:n.key,dirPath:n.key}):c()}}),m.createElement(y,{showLine:!0,showIcon:!0,loadData:o,treeData:a,onSelect:(e,a)=>{const{selected:r,node:n}=a,{isLeaf:s}=n;l(r&&!s?n:null),t&&"function"==typeof t&&t(a)}})))};const T=e=>{const t=h(),{modalData:a,setModalVisible:r}=e,n=a&&a.name?`添加 - ${null==a?void 0:a.name} `:"添加到项目",[l,s]=i.exports.useState(null),{data:c,loading:o,request:d}=P("/api/block/downloadFile",{lazy:!0});return m.createElement(m.Fragment,null,m.createElement(g,{title:n,visible:!!a,style:{top:20},onOk:()=>{l&&a&&d({destPath:null==l?void 0:l.dirPath,url:a.url}).then((e=>{e?k.success("下载文件完成"):k.error("下载文件异常"),r(null)})).catch((e=>{k.destroy(),999===e.code?g.confirm({title:"限速提示!",icon:m.createElement(O,null),content:e.msg,onOk:()=>{t.push("/config?key=3")}}):k.error(e.msg||"请求超时，请重试~")}))},onCancel:()=>{r(null)},okButtonProps:{disabled:!l,loading:o},okText:"确认添加",cancelText:"取消"},m.createElement(v,{message:"温馨提示：该功能会下载远程文件，请耐心等待！😀😀😀",type:"warning"}),m.createElement("br",null),m.createElement(L,{onSelect:e=>{const{selected:t,node:a}=e,{isLeaf:r}=a;s(t&&!r?a:null)}})))};const{TabPane:A}=u;export default e=>{const[t,a]=i.exports.useState(null);h();const{data:r=[],request:n}=P("/api/block/getList"),l=e=>{a(e)};return m.createElement(j,{title:"资产",className:"dashboard-main"},m.createElement("div",{className:"dashboard-body"},m.createElement("div",{className:"ui-dashboard-content"},m.createElement("div",{className:"ui-content-container ui-main-container"},m.createElement(u,{type:"line",defaultActiveKey:"1",tabPosition:"left"},r&&r.map((e=>m.createElement(A,{forceRender:!1,tab:m.createElement("span",null," ",m.createElement(N,null)," ",e.name," "),key:e.id,closable:!1},m.createElement(C,{item:e,addToProject:l}))))))),m.createElement(T,{modalData:t,setModalVisible:a})))};
