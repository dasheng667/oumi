import{G as e,i as t,R as n}from"./vendor.88f6b8e8.js";import{N as o,e as a,f as r,g as s,F as d,G as i,B as l,z as c,O as p,E as u,K as f,Q as y,j as v,_ as h,b as g,c as x,R as K,s as m,x as k,U as E,d as N,h as C,V as b,I as w,L as S,v as P,W as D}from"./index.f4db9373.js";import{T as O,g as L,a as T,b as A,C as I,L as R,d as M,e as j,f as H,h as B,i as F,j as U,p as q,k as V,l as z,m as W,n as G,o as _,q as Q,r as X,s as Y,t as J}from"./conductUtil.be5740f0.js";import{a as Z,F as $,b as ee}from"./FolderOutlined.c8c19ab8.js";var te=e.exports.forwardRef((function(n,u){var y=o(!1,{value:n.visible,defaultValue:n.defaultVisible}),v=a(y,2),h=v[0],g=v[1],x=function(e,t){var o;g(e),null===(o=n.onVisibleChange)||void 0===o||o.call(n,e,t)},K=function(e){var t;x(!1,e),null===(t=n.onConfirm)||void 0===t||t.call(undefined,e)},m=function(e){var t;x(!1,e),null===(t=n.onCancel)||void 0===t||t.call(undefined,e)},k=e.exports.useContext(r).getPrefixCls,E=n.prefixCls,N=n.placement,C=n.children,b=n.overlayClassName,w=function(e,t){var n={};for(var o in e)Object.prototype.hasOwnProperty.call(e,o)&&t.indexOf(o)<0&&(n[o]=e[o]);if(null!=e&&"function"==typeof Object.getOwnPropertySymbols){var a=0;for(o=Object.getOwnPropertySymbols(e);a<o.length;a++)t.indexOf(o[a])<0&&Object.prototype.propertyIsEnumerable.call(e,o[a])&&(n[o[a]]=e[o[a]])}return n}(n,["prefixCls","placement","children","overlayClassName"]),S=k("popover",E),P=k("popconfirm",E),D=s(P,b),T=e.exports.createElement(d,{componentName:"Popconfirm",defaultLocale:i.Popconfirm},(function(o){return function(o,a){var r,s=n.okButtonProps,d=n.cancelButtonProps,i=n.title,p=n.cancelText,u=n.okText,f=n.okType,y=n.icon;return e.exports.createElement("div",{className:"".concat(o,"-inner-content")},e.exports.createElement("div",{className:"".concat(o,"-message")},y,e.exports.createElement("div",{className:"".concat(o,"-message-title")},(r=i)?"function"==typeof r?r():r:null)),e.exports.createElement("div",{className:"".concat(o,"-buttons")},e.exports.createElement(l,t({onClick:m,size:"small"},d),p||a.cancelText),e.exports.createElement(l,t({onClick:K},c(f),{size:"small"},s),u||a.okText)))}(S,o)})),A=k();return e.exports.createElement(O,t({},w,{prefixCls:S,placement:N,onVisibleChange:function(e){n.disabled||x(e)},visible:h,overlay:T,overlayClassName:D,ref:u,transitionName:L(A,"zoom-big",n.transitionName)}),p(C,{onKeyDown:function(t){var n,o;e.exports.isValidElement(C)&&(null===(o=null==C?void 0:(n=C.props).onKeyDown)||void 0===o||o.call(n,t)),function(e){e.keyCode===f.ESC&&h&&x(!1,e)}(t)}}))}));te.defaultProps={placement:"top",trigger:"click",okType:"primary",icon:e.exports.createElement(u,null),disabled:!1};var ne=["className","style","motion","motionNodes","motionType","onMotionStart","onMotionEnd","active","treeNodeRequiredProps"],oe=["key"],ae=function(n,o){var r=n.className,d=n.style,i=n.motion,l=n.motionNodes,c=n.motionType,p=n.onMotionStart,u=n.onMotionEnd,f=n.active,h=n.treeNodeRequiredProps,g=y(n,ne),x=e.exports.useState(!0),K=a(x,2),m=K[0],k=K[1],E=e.exports.useContext(T).prefixCls,N=e.exports.useRef(!1),C=function(){N.current||u(),N.current=!0};return e.exports.useEffect((function(){l&&"hide"===c&&m&&k(!1)}),[l]),e.exports.useEffect((function(){return l&&p(),function(){l&&C()}}),[]),l?e.exports.createElement(v,t({ref:o,visible:m},i,{motionAppear:"show"===c,onAppearEnd:C,onLeaveEnd:C}),(function(n,o){var a=n.className,r=n.style;return e.exports.createElement("div",{ref:o,className:s("".concat(E,"-treenode-motion"),a),style:r},l.map((function(n){var o=n.data,a=o.key,r=y(o,oe),s=n.isStart,d=n.isEnd;delete r.children;var i=A(a,h);return e.exports.createElement(I,t({},r,i,{active:f,data:n.data,key:a,isStart:s,isEnd:d}))})))})):e.exports.createElement(I,t({domRef:o,className:r,style:d},g,{active:f}))};ae.displayName="MotionTreeNode";var re=e.exports.forwardRef(ae);function se(e,t,n){var o=e.findIndex((function(e){return e.data.key===n})),a=e[o+1],r=t.findIndex((function(e){return e.data.key===n}));if(a){var s=t.findIndex((function(e){return e.data.key===a.data.key}));return t.slice(r+1,s)}return t.slice(r+1)}var de=["prefixCls","data","selectable","checkable","expandedKeys","selectedKeys","checkedKeys","loadedKeys","loadingKeys","halfCheckedKeys","keyEntities","disabled","dragging","dragOverNodeKey","dropPosition","motion","height","itemHeight","virtual","focusable","activeItem","focused","tabIndex","onKeyDown","onFocus","onBlur","onActiveChange","onListChangeStart","onListChangeEnd"],ie=["key"],le={width:0,height:0,display:"flex",overflow:"hidden",opacity:0,border:0,padding:0,margin:0},ce=function(){},pe="RC_TREE_MOTION_".concat(Math.random()),ue={key:pe},fe={key:pe,level:0,index:0,pos:"0",node:ue},ye={parent:null,children:[],pos:fe.pos,data:ue,isStart:[],isEnd:[]};function ve(e,t,n,o){return!1!==t&&n?e.slice(0,Math.ceil(n/o)+1):e}function he(e){var t=e.data.key,n=e.pos;return M(t,n)}var ge=function(n,o){var r=n.prefixCls,s=n.data;n.selectable,n.checkable;var d=n.expandedKeys,i=n.selectedKeys,l=n.checkedKeys,c=n.loadedKeys,p=n.loadingKeys,u=n.halfCheckedKeys,f=n.keyEntities,v=n.disabled,h=n.dragging,g=n.dragOverNodeKey,x=n.dropPosition,K=n.motion,m=n.height,k=n.itemHeight,E=n.virtual,N=n.focusable,C=n.activeItem,b=n.focused,w=n.tabIndex,S=n.onKeyDown,P=n.onFocus,D=n.onBlur,O=n.onActiveChange,L=n.onListChangeStart,T=n.onListChangeEnd,I=y(n,de),j=e.exports.useRef(null),H=e.exports.useRef(null);e.exports.useImperativeHandle(o,(function(){return{scrollTo:function(e){j.current.scrollTo(e)},getIndentWidth:function(){return H.current.offsetWidth}}}));var B=e.exports.useState(d),F=a(B,2),U=F[0],q=F[1],V=e.exports.useState(s),z=a(V,2),W=z[0],G=z[1],_=e.exports.useState(s),Q=a(_,2),X=Q[0],Y=Q[1],J=e.exports.useState([]),Z=a(J,2),$=Z[0],ee=Z[1],te=e.exports.useState(null),ne=a(te,2),oe=ne[0],ae=ne[1];function ue(){G(s),Y(s),ee([]),ae(null),T()}e.exports.useEffect((function(){q(d);var e=function(){var e=arguments.length>0&&void 0!==arguments[0]?arguments[0]:[],t=arguments.length>1&&void 0!==arguments[1]?arguments[1]:[],n=e.length,o=t.length;if(1!==Math.abs(n-o))return{add:!1,key:null};function a(e,t){var n=new Map;e.forEach((function(e){n.set(e,!0)}));var o=t.filter((function(e){return!n.has(e)}));return 1===o.length?o[0]:null}return n<o?{add:!0,key:a(e,t)}:{add:!1,key:a(t,e)}}(U,d);if(null!==e.key)if(e.add){var t=W.findIndex((function(t){return t.data.key===e.key})),n=ve(se(W,s,e.key),E,m,k),o=W.slice();o.splice(t+1,0,ye),Y(o),ee(n),ae("show")}else{var a=s.findIndex((function(t){return t.data.key===e.key})),r=ve(se(s,W,e.key),E,m,k),i=s.slice();i.splice(a+1,0,ye),Y(i),ee(r),ae("hide")}else W!==s&&(G(s),Y(s))}),[d,s]),e.exports.useEffect((function(){h||ue()}),[h]);var fe=K?X:s,ge={expandedKeys:d,selectedKeys:i,loadedKeys:c,loadingKeys:p,checkedKeys:l,halfCheckedKeys:u,dragOverNodeKey:g,dropPosition:x,keyEntities:f};return e.exports.createElement(e.exports.Fragment,null,b&&C&&e.exports.createElement("span",{style:le,"aria-live":"assertive"},function(e){for(var t=String(e.data.key),n=e;n.parent;)n=n.parent,t="".concat(n.data.key," > ").concat(t);return t}(C)),e.exports.createElement("div",{role:"tree"},e.exports.createElement("input",{style:le,disabled:!1===N||v,tabIndex:!1!==N?w:null,onKeyDown:S,onFocus:P,onBlur:D,value:"",onChange:ce})),e.exports.createElement("div",{className:"".concat(r,"-treenode"),"aria-hidden":!0,style:{position:"absolute",pointerEvents:"none",visibility:"hidden",height:0,overflow:"hidden"}},e.exports.createElement("div",{className:"".concat(r,"-indent")},e.exports.createElement("div",{ref:H,className:"".concat(r,"-indent-unit")}))),e.exports.createElement(R,t({},I,{data:fe,itemKey:he,height:m,fullHeight:!1,virtual:E,itemHeight:k,prefixCls:"".concat(r,"-list"),ref:j}),(function(n){var o=n.pos,a=n.data,r=a.key,s=y(a,ie),d=n.isStart,i=n.isEnd,l=M(r,o);delete s.children;var c=A(l,ge);return e.exports.createElement(re,t({},s,c,{active:!!C&&r===C.data.key,pos:o,data:n.data,isStart:d,isEnd:i,motion:K,motionNodes:r===pe?$:null,motionType:oe,onMotionStart:L,onMotionEnd:ue,treeNodeRequiredProps:ge,onMouseMove:function(){O(null)}}))})))},xe=e.exports.forwardRef(ge);xe.displayName="NodeList";var Ke,me,ke=function(n){h(a,n);var o=g(a);function a(){var t;x(this,a);for(var n=arguments.length,r=new Array(n),s=0;s<n;s++)r[s]=arguments[s];return(t=o.call.apply(o,[this].concat(r))).destroyed=!1,t.delayedDragEnterLogic=void 0,t.state={keyEntities:{},indent:null,selectedKeys:[],checkedKeys:[],halfCheckedKeys:[],loadedKeys:[],loadingKeys:[],expandedKeys:[],dragging:!1,dragChildrenKeys:[],dropTargetKey:null,dropPosition:null,dropContainerKey:null,dropLevelOffset:null,dropTargetPos:null,dropAllowed:!0,dragOverNodeKey:null,treeData:[],flattenNodes:[],focused:!1,activeKey:null,listChanging:!1,prevProps:null},t.dragStartMousePosition=null,t.dragNode=void 0,t.listRef=e.exports.createRef(),t.onNodeDragStart=function(e,n){var o=t.state,a=o.expandedKeys,r=o.keyEntities,s=t.props.onDragStart,d=n.props.eventKey;t.dragNode=n,t.dragStartMousePosition={x:e.clientX,y:e.clientY};var i=j(a,d);t.setState({dragging:!0,dragChildrenKeys:H(d,r),indent:t.listRef.current.getIndentWidth()}),t.setExpandedKeys(i),window.addEventListener("dragend",t.onWindowDragEnd),s&&s({event:e,node:B(n.props)})},t.onNodeDragEnter=function(e,n){var o=t.state,a=o.expandedKeys,r=o.keyEntities,s=o.dragChildrenKeys,d=o.flattenNodes,i=o.indent,l=t.props,c=l.onDragEnter,p=l.onExpand,u=l.allowDrop,f=l.direction,y=n.props.pos,v=K(t).dragNode,h=F(e,v,n,i,t.dragStartMousePosition,u,d,r,a,f),g=h.dropPosition,x=h.dropLevelOffset,k=h.dropTargetKey,E=h.dropContainerKey,N=h.dropTargetPos,C=h.dropAllowed,b=h.dragOverNodeKey;v&&-1===s.indexOf(k)&&C?(t.delayedDragEnterLogic||(t.delayedDragEnterLogic={}),Object.keys(t.delayedDragEnterLogic).forEach((function(e){clearTimeout(t.delayedDragEnterLogic[e])})),v.props.eventKey!==n.props.eventKey&&(e.persist(),t.delayedDragEnterLogic[y]=window.setTimeout((function(){if(t.state.dragging){var o=m(a),s=r[n.props.eventKey];s&&(s.children||[]).length&&(o=U(a,n.props.eventKey)),"expandedKeys"in t.props||t.setExpandedKeys(o),p&&p(o,{node:B(n.props),expanded:!0,nativeEvent:e.nativeEvent})}}),800)),v.props.eventKey!==k||0!==x?(t.setState({dragOverNodeKey:b,dropPosition:g,dropLevelOffset:x,dropTargetKey:k,dropContainerKey:E,dropTargetPos:N,dropAllowed:C}),c&&c({event:e,node:B(n.props),expandedKeys:a})):t.setState({dragOverNodeKey:null,dropPosition:null,dropLevelOffset:null,dropTargetKey:null,dropContainerKey:null,dropTargetPos:null,dropAllowed:!1})):t.setState({dragOverNodeKey:null,dropPosition:null,dropLevelOffset:null,dropTargetKey:null,dropContainerKey:null,dropTargetPos:null,dropAllowed:!1})},t.onNodeDragOver=function(e,n){var o=t.state,a=o.dragChildrenKeys,r=o.flattenNodes,s=o.keyEntities,d=o.expandedKeys,i=o.indent,l=t.props,c=l.onDragOver,p=l.allowDrop,u=l.direction,f=K(t).dragNode,y=F(e,f,n,i,t.dragStartMousePosition,p,r,s,d,u),v=y.dropPosition,h=y.dropLevelOffset,g=y.dropTargetKey,x=y.dropContainerKey,m=y.dropAllowed,k=y.dropTargetPos,E=y.dragOverNodeKey;f&&-1===a.indexOf(g)&&m&&(f.props.eventKey===g&&0===h?null===t.state.dropPosition&&null===t.state.dropLevelOffset&&null===t.state.dropTargetKey&&null===t.state.dropContainerKey&&null===t.state.dropTargetPos&&!1===t.state.dropAllowed&&null===t.state.dragOverNodeKey||t.setState({dropPosition:null,dropLevelOffset:null,dropTargetKey:null,dropContainerKey:null,dropTargetPos:null,dropAllowed:!1,dragOverNodeKey:null}):v===t.state.dropPosition&&h===t.state.dropLevelOffset&&g===t.state.dropTargetKey&&x===t.state.dropContainerKey&&k===t.state.dropTargetPos&&m===t.state.dropAllowed&&E===t.state.dragOverNodeKey||t.setState({dropPosition:v,dropLevelOffset:h,dropTargetKey:g,dropContainerKey:x,dropTargetPos:k,dropAllowed:m,dragOverNodeKey:E}),c&&c({event:e,node:B(n.props)}))},t.onNodeDragLeave=function(e,n){var o=t.props.onDragLeave;o&&o({event:e,node:B(n.props)})},t.onWindowDragEnd=function(e){t.onNodeDragEnd(e,null,!0),window.removeEventListener("dragend",t.onWindowDragEnd)},t.onNodeDragEnd=function(e,n){var o=arguments.length>2&&void 0!==arguments[2]&&arguments[2],a=t.props.onDragEnd;t.setState({dragOverNodeKey:null}),t.cleanDragState(),a&&!o&&a({event:e,node:B(n.props)}),t.dragNode=null},t.onNodeDrop=function(e,n){var o,a=arguments.length>2&&void 0!==arguments[2]&&arguments[2],r=t.state,s=r.dragChildrenKeys,d=r.dropPosition,i=r.dropTargetKey,l=r.dropTargetPos,c=r.dropAllowed;if(c){var p=t.props.onDrop;if(t.setState({dragOverNodeKey:null}),t.cleanDragState(),null!==i){var u=k(k({},A(i,t.getTreeNodeRequiredProps())),{},{active:(null===(o=t.getActiveItem())||void 0===o?void 0:o.data.key)===i,data:t.state.keyEntities[i].node}),f=-1!==s.indexOf(i);E(!f,"Can not drop to dragNode's children node. This is a bug of rc-tree. Please report an issue.");var y=q(l),v={event:e,node:B(u),dragNode:t.dragNode?B(t.dragNode.props):null,dragNodesKeys:[t.dragNode.props.eventKey].concat(s),dropToGap:0!==d,dropPosition:d+Number(y[y.length-1])};p&&!a&&p(v),t.dragNode=null}}},t.cleanDragState=function(){t.state.dragging&&t.setState({dragging:!1,dropPosition:null,dropContainerKey:null,dropTargetKey:null,dropLevelOffset:null,dropAllowed:!0,dragOverNodeKey:null}),t.dragStartMousePosition=null},t.onNodeClick=function(e,n){var o=t.props.onClick;o&&o(e,n)},t.onNodeDoubleClick=function(e,n){var o=t.props.onDoubleClick;o&&o(e,n)},t.onNodeSelect=function(e,n){var o=t.state.selectedKeys,a=t.state.keyEntities,r=t.props,s=r.onSelect,d=r.multiple,i=n.selected,l=n.key,c=!i,p=(o=c?d?U(o,l):[l]:j(o,l)).map((function(e){var t=a[e];return t?t.node:null})).filter((function(e){return e}));t.setUncontrolledState({selectedKeys:o}),s&&s(o,{event:"select",selected:c,node:n,selectedNodes:p,nativeEvent:e.nativeEvent})},t.onNodeCheck=function(e,n,o){var a,r=t.state,s=r.keyEntities,d=r.checkedKeys,i=r.halfCheckedKeys,l=t.props,c=l.checkStrictly,p=l.onCheck,u=n.key,f={event:"check",node:n,checked:o,nativeEvent:e.nativeEvent};if(c){var y=o?U(d,u):j(d,u);a={checked:y,halfChecked:j(i,u)},f.checkedNodes=y.map((function(e){return s[e]})).filter((function(e){return e})).map((function(e){return e.node})),t.setUncontrolledState({checkedKeys:y})}else{var v=V([].concat(m(d),[u]),!0,s),h=v.checkedKeys,g=v.halfCheckedKeys;if(!o){var x=new Set(h);x.delete(u);var K=V(Array.from(x),{checked:!1,halfCheckedKeys:g},s);h=K.checkedKeys,g=K.halfCheckedKeys}a=h,f.checkedNodes=[],f.checkedNodesPositions=[],f.halfCheckedKeys=g,h.forEach((function(e){var t=s[e];if(t){var n=t.node,o=t.pos;f.checkedNodes.push(n),f.checkedNodesPositions.push({node:n,pos:o})}})),t.setUncontrolledState({checkedKeys:h},!1,{halfCheckedKeys:g})}p&&p(a,f)},t.onNodeLoad=function(e){return new Promise((function(n,o){t.setState((function(a){var r=a.loadedKeys,s=void 0===r?[]:r,d=a.loadingKeys,i=void 0===d?[]:d,l=t.props,c=l.loadData,p=l.onLoad,u=e.key;return c&&-1===s.indexOf(u)&&-1===i.indexOf(u)?(c(e).then((function(){var o=t.state,a=o.loadedKeys,r=o.loadingKeys,s=U(a,u),d=j(r,u);p&&p(s,{event:"load",node:e}),t.setUncontrolledState({loadedKeys:s}),t.setState({loadingKeys:d}),n()})).catch((function(e){var n=t.state.loadingKeys,a=j(n,u);t.setState({loadingKeys:a}),o(e)})),{loadingKeys:U(i,u)}):null}))}))},t.onNodeMouseEnter=function(e,n){var o=t.props.onMouseEnter;o&&o({event:e,node:n})},t.onNodeMouseLeave=function(e,n){var o=t.props.onMouseLeave;o&&o({event:e,node:n})},t.onNodeContextMenu=function(e,n){var o=t.props.onRightClick;o&&(e.preventDefault(),o({event:e,node:n}))},t.onFocus=function(){var e=t.props.onFocus;t.setState({focused:!0}),e&&e.apply(void 0,arguments)},t.onBlur=function(){var e=t.props.onBlur;t.setState({focused:!1}),t.onActiveChange(null),e&&e.apply(void 0,arguments)},t.getTreeNodeRequiredProps=function(){var e=t.state;return{expandedKeys:e.expandedKeys||[],selectedKeys:e.selectedKeys||[],loadedKeys:e.loadedKeys||[],loadingKeys:e.loadingKeys||[],checkedKeys:e.checkedKeys||[],halfCheckedKeys:e.halfCheckedKeys||[],dragOverNodeKey:e.dragOverNodeKey,dropPosition:e.dropPosition,keyEntities:e.keyEntities}},t.setExpandedKeys=function(e){var n=t.state.treeData,o=z(n,e);t.setUncontrolledState({expandedKeys:e,flattenNodes:o},!0)},t.onNodeExpand=function(e,n){var o=t.state.expandedKeys,a=t.state.listChanging,r=t.props,s=r.onExpand,d=r.loadData,i=n.key,l=n.expanded;if(!a){var c=o.indexOf(i),p=!l;if(E(l&&-1!==c||!l&&-1===c,"Expand state not sync with index check"),o=p?U(o,i):j(o,i),t.setExpandedKeys(o),s&&s(o,{node:n,expanded:p,nativeEvent:e.nativeEvent}),p&&d){var u=t.onNodeLoad(n);u&&u.then((function(){var e=z(t.state.treeData,o);t.setUncontrolledState({flattenNodes:e})})).catch((function(){var e=t.state.expandedKeys,n=j(e,i);t.setExpandedKeys(n)}))}}},t.onListChangeStart=function(){t.setUncontrolledState({listChanging:!0})},t.onListChangeEnd=function(){setTimeout((function(){t.setUncontrolledState({listChanging:!1})}))},t.onActiveChange=function(e){var n=t.state.activeKey,o=t.props.onActiveChange;n!==e&&(t.setState({activeKey:e}),null!==e&&t.scrollTo({key:e}),o&&o(e))},t.getActiveItem=function(){var e=t.state,n=e.activeKey,o=e.flattenNodes;return null===n?null:o.find((function(e){return e.data.key===n}))||null},t.offsetActiveKey=function(e){var n=t.state,o=n.flattenNodes,a=n.activeKey,r=o.findIndex((function(e){return e.data.key===a}));-1===r&&e<0&&(r=o.length);var s=o[r=(r+e+o.length)%o.length];if(s){var d=s.data.key;t.onActiveChange(d)}else t.onActiveChange(null)},t.onKeyDown=function(e){var n=t.state,o=n.activeKey,a=n.expandedKeys,r=n.checkedKeys,s=t.props,d=s.onKeyDown,i=s.checkable,l=s.selectable;switch(e.which){case f.UP:t.offsetActiveKey(-1),e.preventDefault();break;case f.DOWN:t.offsetActiveKey(1),e.preventDefault()}var c=t.getActiveItem();if(c&&c.data){var p=t.getTreeNodeRequiredProps(),u=!1===c.data.isLeaf||!!(c.data.children||[]).length,y=B(k(k({},A(o,p)),{},{data:c.data,active:!0}));switch(e.which){case f.LEFT:u&&a.includes(o)?t.onNodeExpand({},y):c.parent&&t.onActiveChange(c.parent.data.key),e.preventDefault();break;case f.RIGHT:u&&!a.includes(o)?t.onNodeExpand({},y):c.children&&c.children.length&&t.onActiveChange(c.children[0].data.key),e.preventDefault();break;case f.ENTER:case f.SPACE:!i||y.disabled||!1===y.checkable||y.disableCheckbox?i||!l||y.disabled||!1===y.selectable||t.onNodeSelect({},y):t.onNodeCheck({},y,!r.includes(o))}}d&&d(e)},t.setUncontrolledState=function(e){var n=arguments.length>1&&void 0!==arguments[1]&&arguments[1],o=arguments.length>2&&void 0!==arguments[2]?arguments[2]:null;if(!t.destroyed){var a=!1,r=!0,s={};Object.keys(e).forEach((function(n){n in t.props?r=!1:(a=!0,s[n]=e[n])})),!a||n&&!r||t.setState(k(k({},s),o))}},t.scrollTo=function(e){t.listRef.current.scrollTo(e)},t}return N(a,[{key:"componentWillUnmount",value:function(){window.removeEventListener("dragend",this.onWindowDragEnd),this.destroyed=!0}},{key:"render",value:function(){var n,o=this.state,a=o.focused,r=o.flattenNodes,d=o.keyEntities,i=o.dragging,l=o.activeKey,c=o.dropLevelOffset,p=o.dropContainerKey,u=o.dropTargetKey,f=o.dropPosition,y=o.dragOverNodeKey,v=o.indent,h=this.props,g=h.prefixCls,x=h.className,K=h.style,m=h.showLine,k=h.focusable,E=h.tabIndex,N=void 0===E?0:E,b=h.selectable,w=h.showIcon,S=h.icon,P=h.switcherIcon,D=h.draggable,O=h.checkable,L=h.checkStrictly,A=h.disabled,I=h.motion,R=h.loadData,M=h.filterTreeNode,j=h.height,H=h.itemHeight,B=h.virtual,F=h.titleRender,U=h.dropIndicatorRender,q=h.onContextMenu,V=h.direction,z=Y(this.props);return e.exports.createElement(T.Provider,{value:{prefixCls:g,selectable:b,showIcon:w,icon:S,switcherIcon:P,draggable:D,checkable:O,checkStrictly:L,disabled:A,keyEntities:d,dropLevelOffset:c,dropContainerKey:p,dropTargetKey:u,dropPosition:f,dragOverNodeKey:y,indent:v,direction:V,dropIndicatorRender:U,loadData:R,filterTreeNode:M,titleRender:F,onNodeClick:this.onNodeClick,onNodeDoubleClick:this.onNodeDoubleClick,onNodeExpand:this.onNodeExpand,onNodeSelect:this.onNodeSelect,onNodeCheck:this.onNodeCheck,onNodeLoad:this.onNodeLoad,onNodeMouseEnter:this.onNodeMouseEnter,onNodeMouseLeave:this.onNodeMouseLeave,onNodeContextMenu:this.onNodeContextMenu,onNodeDragStart:this.onNodeDragStart,onNodeDragEnter:this.onNodeDragEnter,onNodeDragOver:this.onNodeDragOver,onNodeDragLeave:this.onNodeDragLeave,onNodeDragEnd:this.onNodeDragEnd,onNodeDrop:this.onNodeDrop}},e.exports.createElement("div",{className:s(g,x,(n={},C(n,"".concat(g,"-show-line"),m),C(n,"".concat(g,"-focused"),a),C(n,"".concat(g,"-active-focused"),null!==l),n))},e.exports.createElement(xe,t({ref:this.listRef,prefixCls:g,style:K,data:r,disabled:A,selectable:b,checkable:!!O,motion:I,dragging:i,height:j,itemHeight:H,virtual:B,focusable:k,focused:a,tabIndex:N,activeItem:this.getActiveItem(),onFocus:this.onFocus,onBlur:this.onBlur,onKeyDown:this.onKeyDown,onActiveChange:this.onActiveChange,onListChangeStart:this.onListChangeStart,onListChangeEnd:this.onListChangeEnd,onContextMenu:q},this.getTreeNodeRequiredProps(),z))))}}],[{key:"getDerivedStateFromProps",value:function(e,t){var n,o=t.prevProps,a={prevProps:e};function r(t){return!o&&t in e||o&&o[t]!==e[t]}if(r("treeData")?n=e.treeData:r("children")&&(E(!1,"`children` of Tree is deprecated. Please use `treeData` instead."),n=W(e.children)),n){a.treeData=n;var s=G(n);a.keyEntities=k(C({},pe,fe),s.keyEntities)}var d,i=a.keyEntities||t.keyEntities;if(r("expandedKeys")||o&&r("autoExpandParent"))a.expandedKeys=e.autoExpandParent||!o&&e.defaultExpandParent?_(e.expandedKeys,i):e.expandedKeys;else if(!o&&e.defaultExpandAll){var l=k({},i);delete l[pe],a.expandedKeys=Object.keys(l).map((function(e){return l[e].key}))}else!o&&e.defaultExpandedKeys&&(a.expandedKeys=e.autoExpandParent||e.defaultExpandParent?_(e.defaultExpandedKeys,i):e.defaultExpandedKeys);if(a.expandedKeys||delete a.expandedKeys,n||a.expandedKeys){var c=z(n||t.treeData,a.expandedKeys||t.expandedKeys);a.flattenNodes=c}if((e.selectable&&(r("selectedKeys")?a.selectedKeys=Q(e.selectedKeys,e):!o&&e.defaultSelectedKeys&&(a.selectedKeys=Q(e.defaultSelectedKeys,e))),e.checkable)&&(r("checkedKeys")?d=X(e.checkedKeys)||{}:!o&&e.defaultCheckedKeys?d=X(e.defaultCheckedKeys)||{}:n&&(d=X(e.checkedKeys)||{checkedKeys:t.checkedKeys,halfCheckedKeys:t.halfCheckedKeys}),d)){var p=d,u=p.checkedKeys,f=void 0===u?[]:u,y=p.halfCheckedKeys,v=void 0===y?[]:y;if(!e.checkStrictly){var h=V(f,!0,i);f=h.checkedKeys,v=h.halfCheckedKeys}a.checkedKeys=f,a.halfCheckedKeys=v}return r("loadedKeys")&&(a.loadedKeys=e.loadedKeys),a}}]),a}(e.exports.Component);function Ee(e,t){e.forEach((function(e){var n=e.key,o=e.children;!1!==t(n,e)&&Ee(o||[],t)}))}function Ne(e){var t=e.treeData,n=e.expandedKeys,o=e.startKey,a=e.endKey,r=[],s=Ke.None;if(o&&o===a)return[o];if(!o||!a)return[];return Ee(t,(function(e){if(s===Ke.End)return!1;if(function(e){return e===o||e===a}(e)){if(r.push(e),s===Ke.None)s=Ke.Start;else if(s===Ke.Start)return s=Ke.End,!1}else s===Ke.Start&&r.push(e);return-1!==n.indexOf(e)})),r}function Ce(e,t){var n=m(t),o=[];return Ee(e,(function(e,t){var a=n.indexOf(e);return-1!==a&&(o.push(t),n.splice(a,1)),!!n.length})),o}ke.defaultProps={prefixCls:"rc-tree",showLine:!1,showIcon:!0,selectable:!0,multiple:!1,checkable:!1,disabled:!1,checkStrictly:!1,draggable:!1,defaultExpandParent:!0,autoExpandParent:!1,defaultExpandAll:!1,defaultExpandedKeys:[],defaultCheckedKeys:[],defaultSelectedKeys:[],dropIndicatorRender:function(t){var n=t.dropPosition,o=t.dropLevelOffset,a=t.indent,r={pointerEvents:"none",position:"absolute",right:0,backgroundColor:"red",height:2};switch(n){case-1:r.top=0,r.left=-o*a;break;case 1:r.bottom=0,r.left=-o*a;break;case 0:r.bottom=0,r.left=a}return e.exports.createElement("div",{style:r})},allowDrop:function(){return!0}},ke.TreeNode=I,(me=Ke||(Ke={}))[me.None=0]="None",me[me.Start=1]="Start",me[me.End=2]="End";var be=function(e,t){var n={};for(var o in e)Object.prototype.hasOwnProperty.call(e,o)&&t.indexOf(o)<0&&(n[o]=e[o]);if(null!=e&&"function"==typeof Object.getOwnPropertySymbols){var a=0;for(o=Object.getOwnPropertySymbols(e);a<o.length;a++)t.indexOf(o[a])<0&&Object.prototype.propertyIsEnumerable.call(e,o[a])&&(n[o[a]]=e[o[a]])}return n};function we(t){var n=t.isLeaf,o=t.expanded;return n?e.exports.createElement(Z,null):o?e.exports.createElement($,null):e.exports.createElement(ee,null)}function Se(e){var t=e.treeData,n=e.children;return t||W(n)}var Pe=function(n,o){var d=n.defaultExpandAll,i=n.defaultExpandParent,l=n.defaultExpandedKeys,c=be(n,["defaultExpandAll","defaultExpandParent","defaultExpandedKeys"]),p=e.exports.useRef(),u=e.exports.useRef(),f=e.exports.createRef();e.exports.useImperativeHandle(o,(function(){return f.current}));var y,v=e.exports.useState(c.selectedKeys||c.defaultSelectedKeys||[]),h=a(v,2),g=h[0],x=h[1],K=e.exports.useState((y=G(Se(c)).keyEntities,d?Object.keys(y):i?_(c.expandedKeys||l,y):c.expandedKeys||l)),k=a(K,2),E=k[0],N=k[1];e.exports.useEffect((function(){"selectedKeys"in c&&x(c.selectedKeys)}),[c.selectedKeys]),e.exports.useEffect((function(){"expandedKeys"in c&&N(c.expandedKeys)}),[c.expandedKeys]);var w=b((function(e,t){t.isLeaf||e.shiftKey||e.metaKey||e.ctrlKey||f.current.onNodeExpand(e,t)}),200,{leading:!0}),S=e.exports.useContext(r),P=S.getPrefixCls,D=S.direction,O=c.prefixCls,L=c.className,T=be(c,["prefixCls","className"]),A=P("tree",O),I=s("".concat(A,"-directory"),C({},"".concat(A,"-directory-rtl"),"rtl"===D),L);return e.exports.createElement(Fe,t({icon:we,ref:f,blockNode:!0},T,{prefixCls:A,className:I,expandedKeys:E,selectedKeys:g,onSelect:function(e,n){var o,a,r=c.multiple,s=n.node,d=n.nativeEvent,i=s.key,l=void 0===i?"":i,f=Se(c),y=t(t({},n),{selected:!0}),v=d.ctrlKey||d.metaKey,h=d.shiftKey;r&&v?(a=e,p.current=l,u.current=a,y.selectedNodes=Ce(f,a)):r&&h?(a=Array.from(new Set([].concat(m(u.current||[]),m(Ne({treeData:f,expandedKeys:E,startKey:l,endKey:p.current}))))),y.selectedNodes=Ce(f,a)):(a=[l],p.current=l,u.current=a,y.selectedNodes=Ce(f,a)),null===(o=c.onSelect)||void 0===o||o.call(c,a,y),"selectedKeys"in c||x(a)},onClick:function(e,t){var n;"click"===c.expandAction&&w(e,t),null===(n=c.onClick)||void 0===n||n.call(c,e,t)},onDoubleClick:function(e,t){var n;"doubleClick"===c.expandAction&&w(e,t),null===(n=c.onDoubleClick)||void 0===n||n.call(c,e,t)},onExpand:function(e,t){var n;return"expandedKeys"in c||N(e),null===(n=c.onExpand)||void 0===n?void 0:n.call(c,e,t)}}))},De=e.exports.forwardRef(Pe);De.displayName="DirectoryTree",De.defaultProps={showIcon:!0,expandAction:"click"};var Oe={icon:{tag:"svg",attrs:{viewBox:"64 64 896 896",focusable:"false"},children:[{tag:"path",attrs:{d:"M328 544h368c4.4 0 8-3.6 8-8v-48c0-4.4-3.6-8-8-8H328c-4.4 0-8 3.6-8 8v48c0 4.4 3.6 8 8 8z"}},{tag:"path",attrs:{d:"M880 112H144c-17.7 0-32 14.3-32 32v736c0 17.7 14.3 32 32 32h736c17.7 0 32-14.3 32-32V144c0-17.7-14.3-32-32-32zm-40 728H184V184h656v656z"}}]},name:"minus-square",theme:"outlined"},Le=function(t,n){return e.exports.createElement(w,Object.assign({},t,{ref:n,icon:Oe}))};Le.displayName="MinusSquareOutlined";var Te=e.exports.forwardRef(Le),Ae={icon:{tag:"svg",attrs:{viewBox:"64 64 896 896",focusable:"false"},children:[{tag:"path",attrs:{d:"M328 544h152v152c0 4.4 3.6 8 8 8h48c4.4 0 8-3.6 8-8V544h152c4.4 0 8-3.6 8-8v-48c0-4.4-3.6-8-8-8H544V328c0-4.4-3.6-8-8-8h-48c-4.4 0-8 3.6-8 8v152H328c-4.4 0-8 3.6-8 8v48c0 4.4 3.6 8 8 8z"}},{tag:"path",attrs:{d:"M880 112H144c-17.7 0-32 14.3-32 32v736c0 17.7 14.3 32 32 32h736c17.7 0 32-14.3 32-32V144c0-17.7-14.3-32-32-32zm-40 728H184V184h656v656z"}}]},name:"plus-square",theme:"outlined"},Ie=function(t,n){return e.exports.createElement(w,Object.assign({},t,{ref:n,icon:Ae}))};Ie.displayName="PlusSquareOutlined";var Re=e.exports.forwardRef(Ie),Me={icon:{tag:"svg",attrs:{viewBox:"0 0 1024 1024",focusable:"false"},children:[{tag:"path",attrs:{d:"M840.4 300H183.6c-19.7 0-30.7 20.8-18.5 35l328.4 380.8c9.4 10.9 27.5 10.9 37 0L858.9 335c12.2-14.2 1.2-35-18.5-35z"}}]},name:"caret-down",theme:"filled"},je=function(t,n){return e.exports.createElement(w,Object.assign({},t,{ref:n,icon:Me}))};je.displayName="CaretDownFilled";var He=e.exports.forwardRef(je);function Be(e){var t,o=e.dropPosition,a=e.dropLevelOffset,r=e.prefixCls,s=e.indent,d=e.direction,i=void 0===d?"ltr":d,l="ltr"===i?"left":"right",c="ltr"===i?"right":"left",p=(C(t={},l,-a*s+4),C(t,c,0),t);switch(o){case-1:p.top=-3;break;case 1:p.bottom=-3;break;default:p.bottom=-3,p[l]=s+4}return n.createElement("div",{style:p,className:"".concat(r,"-drop-indicator")})}var Fe=e.exports.forwardRef((function(n,o){var a,d=e.exports.useContext(r),i=d.getPrefixCls,l=d.direction,c=d.virtual,u=n.prefixCls,f=n.className,y=n.showIcon,v=n.showLine,h=n.switcherIcon,g=n.blockNode,x=n.children,K=n.checkable,m=n.selectable,k=i("tree",u),E=t(t({},n),{showLine:Boolean(v),dropIndicatorRender:Be});return e.exports.createElement(ke,t({itemHeight:20,ref:o,virtual:c},E,{prefixCls:k,className:s((a={},C(a,"".concat(k,"-icon-hide"),!y),C(a,"".concat(k,"-block-node"),g),C(a,"".concat(k,"-unselectable"),!m),C(a,"".concat(k,"-rtl"),"rtl"===l),a),f),direction:l,checkable:K?e.exports.createElement("span",{className:"".concat(k,"-checkbox-inner")}):K,selectable:m,switcherIcon:function(t){return function(t,n,o,a){var r,d=a.isLeaf,i=a.expanded;if(a.loading)return e.exports.createElement(S,{className:"".concat(t,"-switcher-loading-icon")});if(o&&"object"===P(o)&&(r=o.showLeafIcon),d)return o?"object"!==P(o)||r?e.exports.createElement(Z,{className:"".concat(t,"-switcher-line-icon")}):e.exports.createElement("span",{className:"".concat(t,"-switcher-leaf-line")}):null;var l="".concat(t,"-switcher-icon");return D(n)?p(n,{className:s(n.props.className||"",l)}):n||(o?i?e.exports.createElement(Te,{className:"".concat(t,"-switcher-line-icon")}):e.exports.createElement(Re,{className:"".concat(t,"-switcher-line-icon")}):e.exports.createElement(He,{className:l}))}(k,h,v,t)}}),x)}));Fe.TreeNode=I,Fe.DirectoryTree=De,Fe.defaultProps={checkable:!1,selectable:!0,showIcon:!1,motion:t(t({},J),{motionAppear:!1}),blockNode:!1};export{te as P,Fe as T};
