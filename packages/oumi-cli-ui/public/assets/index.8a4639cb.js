var e=Object.defineProperty,t=Object.defineProperties,n=Object.getOwnPropertyDescriptors,a=Object.getOwnPropertySymbols,o=Object.prototype.hasOwnProperty,r=Object.prototype.propertyIsEnumerable,s=(t,n,a)=>n in t?e(t,n,{enumerable:!0,configurable:!0,writable:!0,value:a}):t[n]=a,d=(e,t)=>{for(var n in t||(t={}))o.call(t,n)&&s(e,n,t[n]);if(a)for(var n of a(t))r.call(t,n)&&s(e,n,t[n]);return e},l=(e,a)=>t(e,n(a));import{G as i,i as c,R as p,L as u}from"./vendor.a57ebf69.js";import{g as f,v as y,j as v,F as h,M as g,B as m,a0 as x,h as E,C as K,_ as k,a as N,b,o as C,q as w,c as S,w as P,d as O,p as D,a4 as L,I as T,L as I,m as A,D as M,u as j,i as R,N as F,S as H}from"./index.4c92c9ef.js";import{B as z,l as q,T as B,g as U,m as V,n as W,o as _,L as G,p as $,e as X,q as Y,s as Z,t as J,f as Q,v as ee,b as te,w as ne,x as ae,a as oe,y as re,z as se,A as de,D as le,c as ie,F as ce,I as pe,k as ue,h as fe,d as ye}from"./CaretDownOutlined.4c51e108.js";import{b as ve,K as he,T as ge}from"./index.1e29c4af.js";import{a as me,F as xe,b as Ee}from"./FolderOutlined.a13ee49e.js";var Ke=i.exports.forwardRef((function(e,t){var n=ve(!1,{value:e.visible,defaultValue:e.defaultVisible}),a=f(n,2),o=a[0],r=a[1],s=function(t,n){var a;r(t),null===(a=e.onVisibleChange)||void 0===a||a.call(e,t,n)},d=function(t){var n;s(!1,t),null===(n=e.onConfirm)||void 0===n||n.call(undefined,t)},l=function(t){var n;s(!1,t),null===(n=e.onCancel)||void 0===n||n.call(undefined,t)},p=i.exports.useContext(y).getPrefixCls,u=e.prefixCls,x=e.placement,E=e.children,K=e.overlayClassName,k=function(e,t){var n={};for(var a in e)Object.prototype.hasOwnProperty.call(e,a)&&t.indexOf(a)<0&&(n[a]=e[a]);if(null!=e&&"function"==typeof Object.getOwnPropertySymbols){var o=0;for(a=Object.getOwnPropertySymbols(e);o<a.length;o++)t.indexOf(a[o])<0&&Object.prototype.propertyIsEnumerable.call(e,a[o])&&(n[a[o]]=e[a[o]])}return n}(e,["prefixCls","placement","children","overlayClassName"]),N=p("popover",u),b=p("popconfirm",u),C=v(b,K),w=i.exports.createElement(h,{componentName:"Popconfirm",defaultLocale:g.Popconfirm},(function(t){return function(t,n){var a,o=e.okButtonProps,r=e.cancelButtonProps,s=e.title,p=e.cancelText,u=e.okText,f=e.okType,y=e.icon;return i.exports.createElement("div",{className:"".concat(t,"-inner-content")},i.exports.createElement("div",{className:"".concat(t,"-message")},y,i.exports.createElement("div",{className:"".concat(t,"-message-title")},(a=s)?"function"==typeof a?a():a:null)),i.exports.createElement("div",{className:"".concat(t,"-buttons")},i.exports.createElement(z,c({onClick:l,size:"small"},r),p||n.cancelText),i.exports.createElement(z,c({onClick:d},q(f),{size:"small"},o),u||n.okText)))}(N,t)})),S=p();return i.exports.createElement(B,c({},k,{prefixCls:N,placement:x,onVisibleChange:function(t){e.disabled||s(t)},visible:o,overlay:w,overlayClassName:C,ref:t,transitionName:U(S,"zoom-big",e.transitionName)}),m(E,{onKeyDown:function(e){var t,n;i.exports.isValidElement(E)&&(null===(n=null==E?void 0:(t=E.props).onKeyDown)||void 0===n||n.call(t,e)),function(e){e.keyCode===he.ESC&&o&&s(!1,e)}(e)}}))}));Ke.defaultProps={placement:"top",trigger:"click",okType:"primary",icon:i.exports.createElement(x,null),disabled:!1};var ke=["className","style","motion","motionNodes","motionType","onMotionStart","onMotionEnd","active","treeNodeRequiredProps"],Ne=["key"],be=function(e,t){var n=e.className,a=e.style,o=e.motion,r=e.motionNodes,s=e.motionType,d=e.onMotionStart,l=e.onMotionEnd,p=e.active,u=e.treeNodeRequiredProps,y=E(e,ke),h=i.exports.useState(!0),g=f(h,2),m=g[0],x=g[1],k=i.exports.useContext(V).prefixCls,N=i.exports.useRef(!1),b=function(){N.current||l(),N.current=!0};return i.exports.useEffect((function(){r&&"hide"===s&&m&&x(!1)}),[r]),i.exports.useEffect((function(){return r&&d(),function(){r&&b()}}),[]),r?i.exports.createElement(K,c({ref:t,visible:m},o,{motionAppear:"show"===s,onAppearEnd:b,onLeaveEnd:b}),(function(e,t){var n=e.className,a=e.style;return i.exports.createElement("div",{ref:t,className:v("".concat(k,"-treenode-motion"),n),style:a},r.map((function(e){var t=e.data,n=t.key,a=E(t,Ne),o=e.isStart,r=e.isEnd;delete a.children;var s=W(n,u);return i.exports.createElement(_,c({},a,s,{active:p,data:e.data,key:n,isStart:o,isEnd:r}))})))})):i.exports.createElement(_,c({domRef:t,className:n,style:a},y,{active:p}))};be.displayName="MotionTreeNode";var Ce=i.exports.forwardRef(be);function we(e,t,n){var a=e.findIndex((function(e){return e.data.key===n})),o=e[a+1],r=t.findIndex((function(e){return e.data.key===n}));if(o){var s=t.findIndex((function(e){return e.data.key===o.data.key}));return t.slice(r+1,s)}return t.slice(r+1)}var Se=["prefixCls","data","selectable","checkable","expandedKeys","selectedKeys","checkedKeys","loadedKeys","loadingKeys","halfCheckedKeys","keyEntities","disabled","dragging","dragOverNodeKey","dropPosition","motion","height","itemHeight","virtual","focusable","activeItem","focused","tabIndex","onKeyDown","onFocus","onBlur","onActiveChange","onListChangeStart","onListChangeEnd"],Pe=["key"],Oe={width:0,height:0,display:"flex",overflow:"hidden",opacity:0,border:0,padding:0,margin:0},De=function(){},Le="RC_TREE_MOTION_".concat(Math.random()),Te={key:Le},Ie={key:Le,level:0,index:0,pos:"0",node:Te},Ae={parent:null,children:[],pos:Ie.pos,data:Te,isStart:[],isEnd:[]};function Me(e,t,n,a){return!1!==t&&n?e.slice(0,Math.ceil(n/a)+1):e}function je(e){var t=e.data.key,n=e.pos;return $(t,n)}var Re=function(e,t){var n=e.prefixCls,a=e.data;e.selectable,e.checkable;var o=e.expandedKeys,r=e.selectedKeys,s=e.checkedKeys,d=e.loadedKeys,l=e.loadingKeys,p=e.halfCheckedKeys,u=e.keyEntities,y=e.disabled,v=e.dragging,h=e.dragOverNodeKey,g=e.dropPosition,m=e.motion,x=e.height,K=e.itemHeight,k=e.virtual,N=e.focusable,b=e.activeItem,C=e.focused,w=e.tabIndex,S=e.onKeyDown,P=e.onFocus,O=e.onBlur,D=e.onActiveChange,L=e.onListChangeStart,T=e.onListChangeEnd,I=E(e,Se),A=i.exports.useRef(null),M=i.exports.useRef(null);i.exports.useImperativeHandle(t,(function(){return{scrollTo:function(e){A.current.scrollTo(e)},getIndentWidth:function(){return M.current.offsetWidth}}}));var j=i.exports.useState(o),R=f(j,2),F=R[0],H=R[1],z=i.exports.useState(a),q=f(z,2),B=q[0],U=q[1],V=i.exports.useState(a),_=f(V,2),X=_[0],Y=_[1],Z=i.exports.useState([]),J=f(Z,2),Q=J[0],ee=J[1],te=i.exports.useState(null),ne=f(te,2),ae=ne[0],oe=ne[1];function re(){U(a),Y(a),ee([]),oe(null),T()}i.exports.useEffect((function(){H(o);var e=function(){var e=arguments.length>0&&void 0!==arguments[0]?arguments[0]:[],t=arguments.length>1&&void 0!==arguments[1]?arguments[1]:[],n=e.length,a=t.length;if(1!==Math.abs(n-a))return{add:!1,key:null};function o(e,t){var n=new Map;e.forEach((function(e){n.set(e,!0)}));var a=t.filter((function(e){return!n.has(e)}));return 1===a.length?a[0]:null}return n<a?{add:!0,key:o(e,t)}:{add:!1,key:o(t,e)}}(F,o);if(null!==e.key)if(e.add){var t=B.findIndex((function(t){return t.data.key===e.key})),n=Me(we(B,a,e.key),k,x,K),r=B.slice();r.splice(t+1,0,Ae),Y(r),ee(n),oe("show")}else{var s=a.findIndex((function(t){return t.data.key===e.key})),d=Me(we(a,B,e.key),k,x,K),l=a.slice();l.splice(s+1,0,Ae),Y(l),ee(d),oe("hide")}else B!==a&&(U(a),Y(a))}),[o,a]),i.exports.useEffect((function(){v||re()}),[v]);var se=m?X:a,de={expandedKeys:o,selectedKeys:r,loadedKeys:d,loadingKeys:l,checkedKeys:s,halfCheckedKeys:p,dragOverNodeKey:h,dropPosition:g,keyEntities:u};return i.exports.createElement(i.exports.Fragment,null,C&&b&&i.exports.createElement("span",{style:Oe,"aria-live":"assertive"},function(e){for(var t=String(e.data.key),n=e;n.parent;)n=n.parent,t="".concat(n.data.key," > ").concat(t);return t}(b)),i.exports.createElement("div",{role:"tree"},i.exports.createElement("input",{style:Oe,disabled:!1===N||y,tabIndex:!1!==N?w:null,onKeyDown:S,onFocus:P,onBlur:O,value:"",onChange:De})),i.exports.createElement("div",{className:"".concat(n,"-treenode"),"aria-hidden":!0,style:{position:"absolute",pointerEvents:"none",visibility:"hidden",height:0,overflow:"hidden"}},i.exports.createElement("div",{className:"".concat(n,"-indent")},i.exports.createElement("div",{ref:M,className:"".concat(n,"-indent-unit")}))),i.exports.createElement(G,c({},I,{data:se,itemKey:je,height:x,fullHeight:!1,virtual:k,itemHeight:K,prefixCls:"".concat(n,"-list"),ref:A}),(function(e){var t=e.pos,n=e.data,a=n.key,o=E(n,Pe),r=e.isStart,s=e.isEnd,d=$(a,t);delete o.children;var l=W(d,de);return i.exports.createElement(Ce,c({},o,l,{active:!!b&&a===b.data.key,pos:t,data:e.data,isStart:r,isEnd:s,motion:m,motionNodes:a===Le?Q:null,motionType:ae,onMotionStart:L,onMotionEnd:re,treeNodeRequiredProps:de,onMouseMove:function(){D(null)}}))})))},Fe=i.exports.forwardRef(Re);Fe.displayName="NodeList";var He,ze,qe=function(e){k(n,e);var t=N(n);function n(){var e;b(this,n);for(var a=arguments.length,o=new Array(a),r=0;r<a;r++)o[r]=arguments[r];return(e=t.call.apply(t,[this].concat(o))).destroyed=!1,e.delayedDragEnterLogic=void 0,e.state={keyEntities:{},indent:null,selectedKeys:[],checkedKeys:[],halfCheckedKeys:[],loadedKeys:[],loadingKeys:[],expandedKeys:[],dragging:!1,dragChildrenKeys:[],dropTargetKey:null,dropPosition:null,dropContainerKey:null,dropLevelOffset:null,dropTargetPos:null,dropAllowed:!0,dragOverNodeKey:null,treeData:[],flattenNodes:[],focused:!1,activeKey:null,listChanging:!1,prevProps:null},e.dragStartMousePosition=null,e.dragNode=void 0,e.listRef=i.exports.createRef(),e.onNodeDragStart=function(t,n){var a=e.state,o=a.expandedKeys,r=a.keyEntities,s=e.props.onDragStart,d=n.props.eventKey;e.dragNode=n,e.dragStartMousePosition={x:t.clientX,y:t.clientY};var l=X(o,d);e.setState({dragging:!0,dragChildrenKeys:Y(d,r),indent:e.listRef.current.getIndentWidth()}),e.setExpandedKeys(l),window.addEventListener("dragend",e.onWindowDragEnd),s&&s({event:t,node:Z(n.props)})},e.onNodeDragEnter=function(t,n){var a=e.state,o=a.expandedKeys,r=a.keyEntities,s=a.dragChildrenKeys,d=a.flattenNodes,l=a.indent,i=e.props,c=i.onDragEnter,p=i.onExpand,u=i.allowDrop,f=i.direction,y=n.props.pos,v=C(e).dragNode,h=J(t,v,n,l,e.dragStartMousePosition,u,d,r,o,f),g=h.dropPosition,m=h.dropLevelOffset,x=h.dropTargetKey,E=h.dropContainerKey,K=h.dropTargetPos,k=h.dropAllowed,N=h.dragOverNodeKey;v&&-1===s.indexOf(x)&&k?(e.delayedDragEnterLogic||(e.delayedDragEnterLogic={}),Object.keys(e.delayedDragEnterLogic).forEach((function(t){clearTimeout(e.delayedDragEnterLogic[t])})),v.props.eventKey!==n.props.eventKey&&(t.persist(),e.delayedDragEnterLogic[y]=window.setTimeout((function(){if(e.state.dragging){var a=w(o),s=r[n.props.eventKey];s&&(s.children||[]).length&&(a=Q(o,n.props.eventKey)),"expandedKeys"in e.props||e.setExpandedKeys(a),p&&p(a,{node:Z(n.props),expanded:!0,nativeEvent:t.nativeEvent})}}),800)),v.props.eventKey!==x||0!==m?(e.setState({dragOverNodeKey:N,dropPosition:g,dropLevelOffset:m,dropTargetKey:x,dropContainerKey:E,dropTargetPos:K,dropAllowed:k}),c&&c({event:t,node:Z(n.props),expandedKeys:o})):e.setState({dragOverNodeKey:null,dropPosition:null,dropLevelOffset:null,dropTargetKey:null,dropContainerKey:null,dropTargetPos:null,dropAllowed:!1})):e.setState({dragOverNodeKey:null,dropPosition:null,dropLevelOffset:null,dropTargetKey:null,dropContainerKey:null,dropTargetPos:null,dropAllowed:!1})},e.onNodeDragOver=function(t,n){var a=e.state,o=a.dragChildrenKeys,r=a.flattenNodes,s=a.keyEntities,d=a.expandedKeys,l=a.indent,i=e.props,c=i.onDragOver,p=i.allowDrop,u=i.direction,f=C(e).dragNode,y=J(t,f,n,l,e.dragStartMousePosition,p,r,s,d,u),v=y.dropPosition,h=y.dropLevelOffset,g=y.dropTargetKey,m=y.dropContainerKey,x=y.dropAllowed,E=y.dropTargetPos,K=y.dragOverNodeKey;f&&-1===o.indexOf(g)&&x&&(f.props.eventKey===g&&0===h?null===e.state.dropPosition&&null===e.state.dropLevelOffset&&null===e.state.dropTargetKey&&null===e.state.dropContainerKey&&null===e.state.dropTargetPos&&!1===e.state.dropAllowed&&null===e.state.dragOverNodeKey||e.setState({dropPosition:null,dropLevelOffset:null,dropTargetKey:null,dropContainerKey:null,dropTargetPos:null,dropAllowed:!1,dragOverNodeKey:null}):v===e.state.dropPosition&&h===e.state.dropLevelOffset&&g===e.state.dropTargetKey&&m===e.state.dropContainerKey&&E===e.state.dropTargetPos&&x===e.state.dropAllowed&&K===e.state.dragOverNodeKey||e.setState({dropPosition:v,dropLevelOffset:h,dropTargetKey:g,dropContainerKey:m,dropTargetPos:E,dropAllowed:x,dragOverNodeKey:K}),c&&c({event:t,node:Z(n.props)}))},e.onNodeDragLeave=function(t,n){var a=e.props.onDragLeave;a&&a({event:t,node:Z(n.props)})},e.onWindowDragEnd=function(t){e.onNodeDragEnd(t,null,!0),window.removeEventListener("dragend",e.onWindowDragEnd)},e.onNodeDragEnd=function(t,n){var a=arguments.length>2&&void 0!==arguments[2]&&arguments[2],o=e.props.onDragEnd;e.setState({dragOverNodeKey:null}),e.cleanDragState(),o&&!a&&o({event:t,node:Z(n.props)}),e.dragNode=null},e.onNodeDrop=function(t,n){var a,o=arguments.length>2&&void 0!==arguments[2]&&arguments[2],r=e.state,s=r.dragChildrenKeys,d=r.dropPosition,l=r.dropTargetKey,i=r.dropTargetPos,c=r.dropAllowed;if(c){var p=e.props.onDrop;if(e.setState({dragOverNodeKey:null}),e.cleanDragState(),null!==l){var u=S(S({},W(l,e.getTreeNodeRequiredProps())),{},{active:(null===(a=e.getActiveItem())||void 0===a?void 0:a.data.key)===l,data:e.state.keyEntities[l].node}),f=-1!==s.indexOf(l);P(!f,"Can not drop to dragNode's children node. This is a bug of rc-tree. Please report an issue.");var y=ee(i),v={event:t,node:Z(u),dragNode:e.dragNode?Z(e.dragNode.props):null,dragNodesKeys:[e.dragNode.props.eventKey].concat(s),dropToGap:0!==d,dropPosition:d+Number(y[y.length-1])};p&&!o&&p(v),e.dragNode=null}}},e.cleanDragState=function(){e.state.dragging&&e.setState({dragging:!1,dropPosition:null,dropContainerKey:null,dropTargetKey:null,dropLevelOffset:null,dropAllowed:!0,dragOverNodeKey:null}),e.dragStartMousePosition=null},e.onNodeClick=function(t,n){var a=e.props.onClick;a&&a(t,n)},e.onNodeDoubleClick=function(t,n){var a=e.props.onDoubleClick;a&&a(t,n)},e.onNodeSelect=function(t,n){var a=e.state.selectedKeys,o=e.state.keyEntities,r=e.props,s=r.onSelect,d=r.multiple,l=n.selected,i=n.key,c=!l,p=(a=c?d?Q(a,i):[i]:X(a,i)).map((function(e){var t=o[e];return t?t.node:null})).filter((function(e){return e}));e.setUncontrolledState({selectedKeys:a}),s&&s(a,{event:"select",selected:c,node:n,selectedNodes:p,nativeEvent:t.nativeEvent})},e.onNodeCheck=function(t,n,a){var o,r=e.state,s=r.keyEntities,d=r.checkedKeys,l=r.halfCheckedKeys,i=e.props,c=i.checkStrictly,p=i.onCheck,u=n.key,f={event:"check",node:n,checked:a,nativeEvent:t.nativeEvent};if(c){var y=a?Q(d,u):X(d,u);o={checked:y,halfChecked:X(l,u)},f.checkedNodes=y.map((function(e){return s[e]})).filter((function(e){return e})).map((function(e){return e.node})),e.setUncontrolledState({checkedKeys:y})}else{var v=te([].concat(w(d),[u]),!0,s),h=v.checkedKeys,g=v.halfCheckedKeys;if(!a){var m=new Set(h);m.delete(u);var x=te(Array.from(m),{checked:!1,halfCheckedKeys:g},s);h=x.checkedKeys,g=x.halfCheckedKeys}o=h,f.checkedNodes=[],f.checkedNodesPositions=[],f.halfCheckedKeys=g,h.forEach((function(e){var t=s[e];if(t){var n=t.node,a=t.pos;f.checkedNodes.push(n),f.checkedNodesPositions.push({node:n,pos:a})}})),e.setUncontrolledState({checkedKeys:h},!1,{halfCheckedKeys:g})}p&&p(o,f)},e.onNodeLoad=function(t){return new Promise((function(n,a){e.setState((function(o){var r=o.loadedKeys,s=void 0===r?[]:r,d=o.loadingKeys,l=void 0===d?[]:d,i=e.props,c=i.loadData,p=i.onLoad,u=t.key;return c&&-1===s.indexOf(u)&&-1===l.indexOf(u)?(c(t).then((function(){var a=e.state,o=a.loadedKeys,r=a.loadingKeys,s=Q(o,u),d=X(r,u);p&&p(s,{event:"load",node:t}),e.setUncontrolledState({loadedKeys:s}),e.setState({loadingKeys:d}),n()})).catch((function(t){var n=e.state.loadingKeys,o=X(n,u);e.setState({loadingKeys:o}),a(t)})),{loadingKeys:Q(l,u)}):null}))}))},e.onNodeMouseEnter=function(t,n){var a=e.props.onMouseEnter;a&&a({event:t,node:n})},e.onNodeMouseLeave=function(t,n){var a=e.props.onMouseLeave;a&&a({event:t,node:n})},e.onNodeContextMenu=function(t,n){var a=e.props.onRightClick;a&&(t.preventDefault(),a({event:t,node:n}))},e.onFocus=function(){var t=e.props.onFocus;e.setState({focused:!0}),t&&t.apply(void 0,arguments)},e.onBlur=function(){var t=e.props.onBlur;e.setState({focused:!1}),e.onActiveChange(null),t&&t.apply(void 0,arguments)},e.getTreeNodeRequiredProps=function(){var t=e.state;return{expandedKeys:t.expandedKeys||[],selectedKeys:t.selectedKeys||[],loadedKeys:t.loadedKeys||[],loadingKeys:t.loadingKeys||[],checkedKeys:t.checkedKeys||[],halfCheckedKeys:t.halfCheckedKeys||[],dragOverNodeKey:t.dragOverNodeKey,dropPosition:t.dropPosition,keyEntities:t.keyEntities}},e.setExpandedKeys=function(t){var n=e.state.treeData,a=ne(n,t);e.setUncontrolledState({expandedKeys:t,flattenNodes:a},!0)},e.onNodeExpand=function(t,n){var a=e.state.expandedKeys,o=e.state.listChanging,r=e.props,s=r.onExpand,d=r.loadData,l=n.key,i=n.expanded;if(!o){var c=a.indexOf(l),p=!i;if(P(i&&-1!==c||!i&&-1===c,"Expand state not sync with index check"),a=p?Q(a,l):X(a,l),e.setExpandedKeys(a),s&&s(a,{node:n,expanded:p,nativeEvent:t.nativeEvent}),p&&d){var u=e.onNodeLoad(n);u&&u.then((function(){var t=ne(e.state.treeData,a);e.setUncontrolledState({flattenNodes:t})})).catch((function(){var t=e.state.expandedKeys,n=X(t,l);e.setExpandedKeys(n)}))}}},e.onListChangeStart=function(){e.setUncontrolledState({listChanging:!0})},e.onListChangeEnd=function(){setTimeout((function(){e.setUncontrolledState({listChanging:!1})}))},e.onActiveChange=function(t){var n=e.state.activeKey,a=e.props.onActiveChange;n!==t&&(e.setState({activeKey:t}),null!==t&&e.scrollTo({key:t}),a&&a(t))},e.getActiveItem=function(){var t=e.state,n=t.activeKey,a=t.flattenNodes;return null===n?null:a.find((function(e){return e.data.key===n}))||null},e.offsetActiveKey=function(t){var n=e.state,a=n.flattenNodes,o=n.activeKey,r=a.findIndex((function(e){return e.data.key===o}));-1===r&&t<0&&(r=a.length);var s=a[r=(r+t+a.length)%a.length];if(s){var d=s.data.key;e.onActiveChange(d)}else e.onActiveChange(null)},e.onKeyDown=function(t){var n=e.state,a=n.activeKey,o=n.expandedKeys,r=n.checkedKeys,s=e.props,d=s.onKeyDown,l=s.checkable,i=s.selectable;switch(t.which){case he.UP:e.offsetActiveKey(-1),t.preventDefault();break;case he.DOWN:e.offsetActiveKey(1),t.preventDefault()}var c=e.getActiveItem();if(c&&c.data){var p=e.getTreeNodeRequiredProps(),u=!1===c.data.isLeaf||!!(c.data.children||[]).length,f=Z(S(S({},W(a,p)),{},{data:c.data,active:!0}));switch(t.which){case he.LEFT:u&&o.includes(a)?e.onNodeExpand({},f):c.parent&&e.onActiveChange(c.parent.data.key),t.preventDefault();break;case he.RIGHT:u&&!o.includes(a)?e.onNodeExpand({},f):c.children&&c.children.length&&e.onActiveChange(c.children[0].data.key),t.preventDefault();break;case he.ENTER:case he.SPACE:!l||f.disabled||!1===f.checkable||f.disableCheckbox?l||!i||f.disabled||!1===f.selectable||e.onNodeSelect({},f):e.onNodeCheck({},f,!r.includes(a))}}d&&d(t)},e.setUncontrolledState=function(t){var n=arguments.length>1&&void 0!==arguments[1]&&arguments[1],a=arguments.length>2&&void 0!==arguments[2]?arguments[2]:null;if(!e.destroyed){var o=!1,r=!0,s={};Object.keys(t).forEach((function(n){n in e.props?r=!1:(o=!0,s[n]=t[n])})),!o||n&&!r||e.setState(S(S({},s),a))}},e.scrollTo=function(t){e.listRef.current.scrollTo(t)},e}return O(n,[{key:"componentWillUnmount",value:function(){window.removeEventListener("dragend",this.onWindowDragEnd),this.destroyed=!0}},{key:"render",value:function(){var e,t=this.state,n=t.focused,a=t.flattenNodes,o=t.keyEntities,r=t.dragging,s=t.activeKey,d=t.dropLevelOffset,l=t.dropContainerKey,p=t.dropTargetKey,u=t.dropPosition,f=t.dragOverNodeKey,y=t.indent,h=this.props,g=h.prefixCls,m=h.className,x=h.style,E=h.showLine,K=h.focusable,k=h.tabIndex,N=void 0===k?0:k,b=h.selectable,C=h.showIcon,w=h.icon,S=h.switcherIcon,P=h.draggable,O=h.checkable,L=h.checkStrictly,T=h.disabled,I=h.motion,A=h.loadData,M=h.filterTreeNode,j=h.height,R=h.itemHeight,F=h.virtual,H=h.titleRender,z=h.dropIndicatorRender,q=h.onContextMenu,B=h.direction,U=le(this.props);return i.exports.createElement(V.Provider,{value:{prefixCls:g,selectable:b,showIcon:C,icon:w,switcherIcon:S,draggable:P,checkable:O,checkStrictly:L,disabled:T,keyEntities:o,dropLevelOffset:d,dropContainerKey:l,dropTargetKey:p,dropPosition:u,dragOverNodeKey:f,indent:y,direction:B,dropIndicatorRender:z,loadData:A,filterTreeNode:M,titleRender:H,onNodeClick:this.onNodeClick,onNodeDoubleClick:this.onNodeDoubleClick,onNodeExpand:this.onNodeExpand,onNodeSelect:this.onNodeSelect,onNodeCheck:this.onNodeCheck,onNodeLoad:this.onNodeLoad,onNodeMouseEnter:this.onNodeMouseEnter,onNodeMouseLeave:this.onNodeMouseLeave,onNodeContextMenu:this.onNodeContextMenu,onNodeDragStart:this.onNodeDragStart,onNodeDragEnter:this.onNodeDragEnter,onNodeDragOver:this.onNodeDragOver,onNodeDragLeave:this.onNodeDragLeave,onNodeDragEnd:this.onNodeDragEnd,onNodeDrop:this.onNodeDrop}},i.exports.createElement("div",{className:v(g,m,(e={},D(e,"".concat(g,"-show-line"),E),D(e,"".concat(g,"-focused"),n),D(e,"".concat(g,"-active-focused"),null!==s),e))},i.exports.createElement(Fe,c({ref:this.listRef,prefixCls:g,style:x,data:a,disabled:T,selectable:b,checkable:!!O,motion:I,dragging:r,height:j,itemHeight:R,virtual:F,focusable:K,focused:n,tabIndex:N,activeItem:this.getActiveItem(),onFocus:this.onFocus,onBlur:this.onBlur,onKeyDown:this.onKeyDown,onActiveChange:this.onActiveChange,onListChangeStart:this.onListChangeStart,onListChangeEnd:this.onListChangeEnd,onContextMenu:q},this.getTreeNodeRequiredProps(),U))))}}],[{key:"getDerivedStateFromProps",value:function(e,t){var n,a=t.prevProps,o={prevProps:e};function r(t){return!a&&t in e||a&&a[t]!==e[t]}if(r("treeData")?n=e.treeData:r("children")&&(P(!1,"`children` of Tree is deprecated. Please use `treeData` instead."),n=ae(e.children)),n){o.treeData=n;var s=oe(n);o.keyEntities=S(D({},Le,Ie),s.keyEntities)}var d,l=o.keyEntities||t.keyEntities;if(r("expandedKeys")||a&&r("autoExpandParent"))o.expandedKeys=e.autoExpandParent||!a&&e.defaultExpandParent?re(e.expandedKeys,l):e.expandedKeys;else if(!a&&e.defaultExpandAll){var i=S({},l);delete i[Le],o.expandedKeys=Object.keys(i).map((function(e){return i[e].key}))}else!a&&e.defaultExpandedKeys&&(o.expandedKeys=e.autoExpandParent||e.defaultExpandParent?re(e.defaultExpandedKeys,l):e.defaultExpandedKeys);if(o.expandedKeys||delete o.expandedKeys,n||o.expandedKeys){var c=ne(n||t.treeData,o.expandedKeys||t.expandedKeys);o.flattenNodes=c}if((e.selectable&&(r("selectedKeys")?o.selectedKeys=se(e.selectedKeys,e):!a&&e.defaultSelectedKeys&&(o.selectedKeys=se(e.defaultSelectedKeys,e))),e.checkable)&&(r("checkedKeys")?d=de(e.checkedKeys)||{}:!a&&e.defaultCheckedKeys?d=de(e.defaultCheckedKeys)||{}:n&&(d=de(e.checkedKeys)||{checkedKeys:t.checkedKeys,halfCheckedKeys:t.halfCheckedKeys}),d)){var p=d,u=p.checkedKeys,f=void 0===u?[]:u,y=p.halfCheckedKeys,v=void 0===y?[]:y;if(!e.checkStrictly){var h=te(f,!0,l);f=h.checkedKeys,v=h.halfCheckedKeys}o.checkedKeys=f,o.halfCheckedKeys=v}return r("loadedKeys")&&(o.loadedKeys=e.loadedKeys),o}}]),n}(i.exports.Component);function Be(e,t){e.forEach((function(e){var n=e.key,a=e.children;!1!==t(n,e)&&Be(a||[],t)}))}function Ue(e){var t=e.treeData,n=e.expandedKeys,a=e.startKey,o=e.endKey,r=[],s=He.None;if(a&&a===o)return[a];if(!a||!o)return[];return Be(t,(function(e){if(s===He.End)return!1;if(function(e){return e===a||e===o}(e)){if(r.push(e),s===He.None)s=He.Start;else if(s===He.Start)return s=He.End,!1}else s===He.Start&&r.push(e);return-1!==n.indexOf(e)})),r}function Ve(e,t){var n=w(t),a=[];return Be(e,(function(e,t){var o=n.indexOf(e);return-1!==o&&(a.push(t),n.splice(o,1)),!!n.length})),a}qe.defaultProps={prefixCls:"rc-tree",showLine:!1,showIcon:!0,selectable:!0,multiple:!1,checkable:!1,disabled:!1,checkStrictly:!1,draggable:!1,defaultExpandParent:!0,autoExpandParent:!1,defaultExpandAll:!1,defaultExpandedKeys:[],defaultCheckedKeys:[],defaultSelectedKeys:[],dropIndicatorRender:function(e){var t=e.dropPosition,n=e.dropLevelOffset,a=e.indent,o={pointerEvents:"none",position:"absolute",right:0,backgroundColor:"red",height:2};switch(t){case-1:o.top=0,o.left=-n*a;break;case 1:o.bottom=0,o.left=-n*a;break;case 0:o.bottom=0,o.left=a}return i.exports.createElement("div",{style:o})},allowDrop:function(){return!0}},qe.TreeNode=_,(ze=He||(He={}))[ze.None=0]="None",ze[ze.Start=1]="Start",ze[ze.End=2]="End";var We=function(e,t){var n={};for(var a in e)Object.prototype.hasOwnProperty.call(e,a)&&t.indexOf(a)<0&&(n[a]=e[a]);if(null!=e&&"function"==typeof Object.getOwnPropertySymbols){var o=0;for(a=Object.getOwnPropertySymbols(e);o<a.length;o++)t.indexOf(a[o])<0&&Object.prototype.propertyIsEnumerable.call(e,a[o])&&(n[a[o]]=e[a[o]])}return n};function _e(e){var t=e.isLeaf,n=e.expanded;return t?i.exports.createElement(me,null):n?i.exports.createElement(xe,null):i.exports.createElement(Ee,null)}function Ge(e){var t=e.treeData,n=e.children;return t||ae(n)}var $e=function(e,t){var n=e.defaultExpandAll,a=e.defaultExpandParent,o=e.defaultExpandedKeys,r=We(e,["defaultExpandAll","defaultExpandParent","defaultExpandedKeys"]),s=i.exports.useRef(),d=i.exports.useRef(),l=i.exports.createRef();i.exports.useImperativeHandle(t,(function(){return l.current}));var p,u=i.exports.useState(r.selectedKeys||r.defaultSelectedKeys||[]),h=f(u,2),g=h[0],m=h[1],x=i.exports.useState((p=oe(Ge(r)).keyEntities,n?Object.keys(p):a?re(r.expandedKeys||o,p):r.expandedKeys||o)),E=f(x,2),K=E[0],k=E[1];i.exports.useEffect((function(){"selectedKeys"in r&&m(r.selectedKeys)}),[r.selectedKeys]),i.exports.useEffect((function(){"expandedKeys"in r&&k(r.expandedKeys)}),[r.expandedKeys]);var N=L((function(e,t){t.isLeaf||e.shiftKey||e.metaKey||e.ctrlKey||l.current.onNodeExpand(e,t)}),200,{leading:!0}),b=i.exports.useContext(y),C=b.getPrefixCls,S=b.direction,P=r.prefixCls,O=r.className,T=We(r,["prefixCls","className"]),I=C("tree",P),A=v("".concat(I,"-directory"),D({},"".concat(I,"-directory-rtl"),"rtl"===S),O);return i.exports.createElement(st,c({icon:_e,ref:l,blockNode:!0},T,{prefixCls:I,className:A,expandedKeys:K,selectedKeys:g,onSelect:function(e,t){var n,a,o=r.multiple,l=t.node,i=t.nativeEvent,p=l.key,u=void 0===p?"":p,f=Ge(r),y=c(c({},t),{selected:!0}),v=i.ctrlKey||i.metaKey,h=i.shiftKey;o&&v?(a=e,s.current=u,d.current=a,y.selectedNodes=Ve(f,a)):o&&h?(a=Array.from(new Set([].concat(w(d.current||[]),w(Ue({treeData:f,expandedKeys:K,startKey:u,endKey:s.current}))))),y.selectedNodes=Ve(f,a)):(a=[u],s.current=u,d.current=a,y.selectedNodes=Ve(f,a)),null===(n=r.onSelect)||void 0===n||n.call(r,a,y),"selectedKeys"in r||m(a)},onClick:function(e,t){var n;"click"===r.expandAction&&N(e,t),null===(n=r.onClick)||void 0===n||n.call(r,e,t)},onDoubleClick:function(e,t){var n;"doubleClick"===r.expandAction&&N(e,t),null===(n=r.onDoubleClick)||void 0===n||n.call(r,e,t)},onExpand:function(e,t){var n;return"expandedKeys"in r||k(e),null===(n=r.onExpand)||void 0===n?void 0:n.call(r,e,t)}}))},Xe=i.exports.forwardRef($e);Xe.displayName="DirectoryTree",Xe.defaultProps={showIcon:!0,expandAction:"click"};var Ye={icon:{tag:"svg",attrs:{viewBox:"64 64 896 896",focusable:"false"},children:[{tag:"path",attrs:{d:"M328 544h368c4.4 0 8-3.6 8-8v-48c0-4.4-3.6-8-8-8H328c-4.4 0-8 3.6-8 8v48c0 4.4 3.6 8 8 8z"}},{tag:"path",attrs:{d:"M880 112H144c-17.7 0-32 14.3-32 32v736c0 17.7 14.3 32 32 32h736c17.7 0 32-14.3 32-32V144c0-17.7-14.3-32-32-32zm-40 728H184V184h656v656z"}}]},name:"minus-square",theme:"outlined"},Ze=function(e,t){return i.exports.createElement(T,Object.assign({},e,{ref:t,icon:Ye}))};Ze.displayName="MinusSquareOutlined";var Je=i.exports.forwardRef(Ze),Qe={icon:{tag:"svg",attrs:{viewBox:"64 64 896 896",focusable:"false"},children:[{tag:"path",attrs:{d:"M328 544h152v152c0 4.4 3.6 8 8 8h48c4.4 0 8-3.6 8-8V544h152c4.4 0 8-3.6 8-8v-48c0-4.4-3.6-8-8-8H544V328c0-4.4-3.6-8-8-8h-48c-4.4 0-8 3.6-8 8v152H328c-4.4 0-8 3.6-8 8v48c0 4.4 3.6 8 8 8z"}},{tag:"path",attrs:{d:"M880 112H144c-17.7 0-32 14.3-32 32v736c0 17.7 14.3 32 32 32h736c17.7 0 32-14.3 32-32V144c0-17.7-14.3-32-32-32zm-40 728H184V184h656v656z"}}]},name:"plus-square",theme:"outlined"},et=function(e,t){return i.exports.createElement(T,Object.assign({},e,{ref:t,icon:Qe}))};et.displayName="PlusSquareOutlined";var tt=i.exports.forwardRef(et),nt={icon:{tag:"svg",attrs:{viewBox:"0 0 1024 1024",focusable:"false"},children:[{tag:"path",attrs:{d:"M840.4 300H183.6c-19.7 0-30.7 20.8-18.5 35l328.4 380.8c9.4 10.9 27.5 10.9 37 0L858.9 335c12.2-14.2 1.2-35-18.5-35z"}}]},name:"caret-down",theme:"filled"},at=function(e,t){return i.exports.createElement(T,Object.assign({},e,{ref:t,icon:nt}))};at.displayName="CaretDownFilled";var ot=i.exports.forwardRef(at);function rt(e){var t,n=e.dropPosition,a=e.dropLevelOffset,o=e.prefixCls,r=e.indent,s=e.direction,d=void 0===s?"ltr":s,l="ltr"===d?"left":"right",i="ltr"===d?"right":"left",c=(D(t={},l,-a*r+4),D(t,i,0),t);switch(n){case-1:c.top=-3;break;case 1:c.bottom=-3;break;default:c.bottom=-3,c[l]=r+4}return p.createElement("div",{style:c,className:"".concat(o,"-drop-indicator")})}var st=i.exports.forwardRef((function(e,t){var n,a=i.exports.useContext(y),o=a.getPrefixCls,r=a.direction,s=a.virtual,d=e.prefixCls,l=e.className,p=e.showIcon,u=e.showLine,f=e.switcherIcon,h=e.blockNode,g=e.children,x=e.checkable,E=e.selectable,K=o("tree",d),k=c(c({},e),{showLine:Boolean(u),dropIndicatorRender:rt});return i.exports.createElement(qe,c({itemHeight:20,ref:t,virtual:s},k,{prefixCls:K,className:v((n={},D(n,"".concat(K,"-icon-hide"),!p),D(n,"".concat(K,"-block-node"),h),D(n,"".concat(K,"-unselectable"),!E),D(n,"".concat(K,"-rtl"),"rtl"===r),n),l),direction:r,checkable:x?i.exports.createElement("span",{className:"".concat(K,"-checkbox-inner")}):x,selectable:E,switcherIcon:function(e){return function(e,t,n,a){var o,r=a.isLeaf,s=a.expanded;if(a.loading)return i.exports.createElement(I,{className:"".concat(e,"-switcher-loading-icon")});if(n&&"object"===A(n)&&(o=n.showLeafIcon),r)return n?"object"!==A(n)||o?i.exports.createElement(me,{className:"".concat(e,"-switcher-line-icon")}):i.exports.createElement("span",{className:"".concat(e,"-switcher-leaf-line")}):null;var d="".concat(e,"-switcher-icon");return M(t)?m(t,{className:v(t.props.className||"",d)}):t||(n?s?i.exports.createElement(Je,{className:"".concat(e,"-switcher-line-icon")}):i.exports.createElement(tt,{className:"".concat(e,"-switcher-line-icon")}):i.exports.createElement(ot,{className:d}))}(K,f,u,e)}}),g)}));st.TreeNode=_,st.DirectoryTree=Xe,st.defaultProps={checkable:!1,selectable:!0,showIcon:!1,motion:c(c({},ie),{motionAppear:!1}),blockNode:!1};var dt={icon:{tag:"svg",attrs:{viewBox:"0 0 1024 1024",focusable:"false"},children:[{tag:"path",attrs:{d:"M715.8 493.5L335 165.1c-14.2-12.2-35-1.2-35 18.5v656.8c0 19.7 20.8 30.7 35 18.5l380.8-328.4c10.9-9.4 10.9-27.6 0-37z"}}]},name:"caret-right",theme:"outlined"},lt=function(e,t){return i.exports.createElement(T,Object.assign({},e,{ref:t,icon:dt}))};lt.displayName="CaretRightOutlined";var it=i.exports.forwardRef(lt);const ct=(e=8,t)=>{const n=[],a=t||"0123456789abcdef";for(let o=0;o<e;o++)n[o]=a.substr(Math.floor(Math.random()*a.length),1);return n.join("")};var pt=e=>{const{onFinish:t}=e;return p.createElement(ce,{name:"customized_form_controls",layout:"inline",onFinish:t},p.createElement(ce.Item,{name:"name",label:"搜索",tooltip:{title:"首字母是“v”或包含中文表示搜索tag，否则就是搜索path",icon:p.createElement(pe,null)}},p.createElement(ue,{placeholder:"可搜索关键字、tag、路径",style:{width:230},allowClear:!0})),p.createElement(ce.Item,null,p.createElement(z,{type:"primary",htmlType:"submit"},"搜索")))};const ut=e=>{const{swaggerList:t,expandData:n={},expandCacheId:a,loadingId:o,onClickSwaggerHead:r,setSelectId:s,selectId:d}=e;return p.createElement("div",{className:"swagger-list"},t&&t.map((e=>p.createElement("div",{className:"swagger-list-item",key:e.id},p.createElement("div",{className:"heading",onClick:()=>r(e)},p.createElement("div",{className:"options"},o===e.id?p.createElement(I,null):a.includes(e.id)?p.createElement(fe,null):p.createElement(it,null),a.includes(e.id)&&p.createElement("span",{className:"all",onClick:t=>((e,t)=>{const a=Object.keys(n[t.id]||{});d.includes(a[0])?s(d.filter((e=>!a.includes(e)))):s([...d,...a]),e.stopPropagation(),e.preventDefault()})(t,e)},"全选")),p.createElement("h3",null,e.name)),a.includes(e.id)&&p.createElement("div",{className:"content"},p.createElement("ul",{className:"content-list"},n&&n[e.id]&&Object.keys(n[e.id]).map((t=>{const a=n[e.id][t];return p.createElement("li",{className:`${a.methods||"get"}`,key:t},p.createElement("span",{className:"checkbox"},p.createElement(ye,{value:t,onChange:()=>(e=>{d.includes(e)?s(d.filter((t=>t!==e))):s([...d,e])})(t),checked:d.includes(t)})),p.createElement("span",{className:"methods"},(a.methods||"get").toLocaleUpperCase()),p.createElement("span",{className:"path"},t),p.createElement("span",{className:"desc",title:a.description},a.description))}))))))))};var ft=e=>{const{selectNode:t,onSuccess:n}=e,{dirPath:a}=t||{},[o]=ce.useForm(),[r,s]=p.useState(!1),{data:l,request:i,loading:c}=j("/api/project/createDir",{lazy:!0}),u=e=>{s(e)};return p.createElement(Ke,{title:()=>p.createElement("div",null,p.createElement(ce,{form:o,className:"my-popconfirm-form"},p.createElement(ce.Item,{name:"dirName",label:"目录名称",rules:[{required:!0,message:"请输入目录名称"},{pattern:/^[a-zA-Z0-9_-]+$/,message:"请输入正确的目录名称"}]},p.createElement(ue,null)))),visible:r,onConfirm:()=>{o.validateFields().then((e=>{i(d({currentPath:a},e)).then((e=>{s(!1),"function"==typeof n&&n()}))}))},placement:"left",okButtonProps:{loading:c},onCancel:()=>u(!1),icon:!1},p.createElement(z,{size:"small",type:"primary",disabled:!t,onClick:()=>u(!0)},"新建目录"))};function yt(e,t,n){return e.map((e=>e.key===t?l(d({},e),{children:n}):e.children?l(d({},e),{children:yt(e.children,t,n)}):e))}var vt=e=>{const{selectId:t,configId:n}=e,[a,o]=i.exports.useState([]),[r,s]=i.exports.useState(null),{data:d,loading:l,request:c}=j("/api/swagger/build",{lazy:!0}),u=e=>R.post("/api/project/dirs",e),f=()=>{u().then((e=>{o(e)}))};function y({key:e,children:t,dirPath:n}){return new Promise((a=>{t?a():u({currentPath:n}).then((t=>{Array.isArray(t)&&o((n=>yt(n,e,t))),a()}))}))}i.exports.useEffect((()=>{f()}),[]);return p.createElement("div",{className:"dirs"},p.createElement("div",{className:"dirs-box"},p.createElement("div",{className:"dirs-head"},"当前项目目录："),p.createElement(ft,{selectNode:r,onSuccess:()=>{r&&r.key?y({key:r.key,dirPath:r.key}):f()}}),p.createElement(st,{showLine:!0,showIcon:!0,loadData:y,treeData:a,onSelect:(e,t)=>{const{selected:n,node:a}=t,{isLeaf:o}=a;s(n&&!o?a:null)}})),p.createElement("div",{className:"dirs-btn"},p.createElement(z,{type:"primary",disabled:!r,onClick:()=>{if(t.length<=0&&F.warn("请选择需要导出的api"),r&&t.length>0){const{dirPath:e}=r;c({outputPath:e,searchContent:t,configId:n}).then((e=>{F.success("生成文件成功~")}))}},loading:l},"生成接口到目录")))};const{TabPane:ht}=ge,gt=e=>p.createElement("div",{className:"ui-swagger-content"},p.createElement("div",{className:"top-header"},p.createElement("h2",null,"Swagger")),p.createElement("div",{className:"ui-content-container ui-swagger-container"},e.children)),mt=()=>p.createElement(gt,null,p.createElement("div",{className:"swagger-error"},"您当前还没有配置Swagger，去 ",p.createElement(u,{to:"/dashboard/config"},"配置")," 。"));export default()=>{const[e,t]=i.exports.useState(""),{data:n,error:a,loading:o}=j("/api/config/swagger/get"),{data:r,loading:s,request:c}=j("/api/swagger/info",{lazy:!0}),{data:u,loading:f,request:y}=j("/api/swagger/search",{lazy:!0}),[v,h]=i.exports.useState([]),[g,m]=i.exports.useState({}),[x,E]=i.exports.useState(""),[K,k]=i.exports.useState([]),[N,b]=i.exports.useState([]);i.exports.useEffect((()=>{n&&n.length>0&&t(n[0].id)}),[n]),i.exports.useEffect((()=>{r&&Array.isArray(r.tags)&&h(r.tags.map((e=>l(d({},e),{id:ct(8)}))))}),[r]),i.exports.useEffect((()=>{e&&c({id:e})}),[e]);return o?p.createElement(gt,null,p.createElement(H,null)):a||!Array.isArray(n)||0===n.length?p.createElement(mt,null):p.createElement(gt,null,p.createElement(ge,{type:"card",defaultActiveKey:e,onTabClick:e=>{t(e)}},n&&n.map((e=>p.createElement(ht,{tab:e.name,key:e.id})))),p.createElement("div",{className:"tabs-content"},s&&p.createElement("div",{className:"fetch-loading"},p.createElement(H,null)),p.createElement("div",{className:"flex align-items"},p.createElement(pt,{onFinish:t=>{const{name:n}=t;if(n){const t=ct(8);h([{name:n,description:"",id:t}]),k([t]),E(t),b([]);const a=/[\u4e00-\u9fa5]+/g,o=n.toLocaleUpperCase().startsWith("V")||a.test(n)?{searchTag:n}:{searchPath:n};y(d({configId:e},o)).then((e=>{if(E(""),"object"==typeof e&&Object.keys(e||{}).length>0){const n={};Object.keys(e).forEach((t=>{n[t]={description:e[t].description,methods:e[t].methods}})),m({[t]:n})}else F.warning("没有数据")}))}else c({id:e})}}),p.createElement("div",{className:"plp2"},"已选中",N.length,"个")),p.createElement("div",{className:"body-flex"},p.createElement(ut,{selectId:N,setSelectId:b,swaggerList:v,loadingId:x,expandCacheId:K,expandData:g,onClickSwaggerHead:t=>{K.includes(t.id)?k(K.filter((e=>e!==t.id))):g[t.id]?k([...K,t.id]):(E(t.id),y({configId:e,searchTag:t.name}).then((e=>{if(E(""),"object"==typeof e&&Object.keys(e||{}).length>0){const n={};Object.keys(e).forEach((t=>{n[t]={description:e[t].description,methods:e[t].methods}})),k([...K,t.id]),m(l(d({},g),{[t.id]:n}))}else F.warning("没有数据")})))}}),p.createElement(vt,{selectId:N,configId:e}))))};