(window.webpackJsonp=window.webpackJsonp||[]).push([[0],{49:function(e,t,n){e.exports=n(65)},65:function(e,t,n){"use strict";n.r(t);var r=n(1),a=n.n(r),i=n(31),o=n.n(i),s=n(19),c=n(46),u=n(43),l=n(17),h=(n(58),n(20)),d=Object(h.c)({activeCell:null,rows:5,columns:5},{SET_ACTIVE_CELL:function(e,t){var n=t.payload;e.activeCell=n}}),p=Object(h.c)({},{SET_CELL_VALUE:function(e,t){var n=t.payload,r=n.location,a=n.value,i=n.formula;e[r]={value:a,formula:i}},DELETE_CELL_VALUE:function(e,t){delete e[t.payload]}}),f=function(){return Object(h.a)({reducer:{global:d,table:p}})},v={xs:0,sm:420,md:900,lg:1200},m={xs:"sm",sm:"md",md:"lg"},y={xs:"@media (max-width: ".concat(v.sm-1,"px)"),sm:"@media (min-width: ".concat(v.sm,"px) and (max-width: ").concat(v.md-1,"px)"),md:"@media (min-width: ".concat(v.md,"px) and (max-width: ").concat(v.lg-1,"px)"),lg:"@media (min-width: ".concat(v.lg,"px)"),from:function(e){return"@media (min-width: ".concat(v[e],"px)")},upTo:function(e){return"@media (max-width: ".concat(v[m[e]]-1,"px)")}},b={colors:{text:"#3D3D3D",cell:{border:"lightgray"},primary:{strong:"#E10D75"},field:{background:"#F0F0F0"}},breaks:v,queries:y},O=Object(l.c)("body{color:",b.colors.text,";line-height:1.3em;}table,th,td{border:0;border-spacing:0;border-collapse:collapse;}td{padding:0;line-height:1.2em;}p,h1,h2,h3,h4,h5,h6{margin:0;}"),w=n(10),E=Object(h.b)("SET_ACTIVE_CELL"),k=Object(w.a)("header",{target:"e1mq5pli0"})({name:"1rn5ure",styles:"width:100%;display:flex;flex-direction:column;align-items:center;padding:30px 0 30px;"});var g=function(){return a.a.createElement(k,null,a.a.createElement("h3",null,"Spreadsheet App"))},x=n(6),j=n(7),N=n(13),C=n(12),T=n(9),U=n(14),D=n(18),L=Object(D.a)({id:"cell",initial:"static",states:{static:{initial:"notFocused",states:{focused:{},notFocused:{}},on:{EDITABLE_MODIFY:{target:"editable.modify"},EDITABLE_REPLACE:{target:"editable.replace"}}},editable:{states:{modify:{},replace:{}},on:{STATIC_FOCUSED:{target:"static.focused"},STATIC:{target:"static"}}}}}),S=Object(h.b)("SET_CELL_VALUE");function M(e){return function(t,n){if(void 0===n().table[e])return Promise.resolve();var r={type:"DELETE_CELL_VALUE",payload:e};return Promise.resolve(t(r))}}var A=function(){function e(t,n){var r=arguments.length>2&&void 0!==arguments[2]?arguments[2]:"";Object(x.a)(this,e),this.type=t,this.text=n,this.value=null,this.html=null,this.whitespace=r}return Object(j.a)(e,[{key:"_repr",value:function(){return Object.entries(this).reduce(function(e,t){return null!==t[1]&&(e[t[0]]=t[1]),e},{})}}]),e}(),I={EOF:"EOF",UNKNOWN:"UNKNOWN",EQUALS:"EQUALS",COMMA:"COMMA",COLON:"COLON",LPAREN:"LPAREN",RPAREN:"RPAREN",PLUS:"PLUS",MINUS:"MINUS",MULT:"MULT",DIV:"DIV",NUMBER:"NUMBER",CELL:"CELL",FUNCTION:"FUNCTION"},F=I,P=function(){function e(t,n,r){Object(x.a)(this,e),this.regex=t,this.groupIndex=n,this.token=r}return Object(j.a)(e,[{key:"setIndex",value:function(e){this.regex.lastIndex=e}},{key:"test",value:function(e){return this.regex.exec(e)}}]),e}(),R=[new P(/=/g,0,F.EQUALS),new P(/,/g,0,F.COMMA),new P(/:/g,0,F.COLON),new P(/\(/g,0,F.LPAREN),new P(/\)/g,0,F.RPAREN),new P(/\+/g,0,F.PLUS),new P(/\-/g,0,F.MINUS),new P(/\*/g,0,F.MULT),new P(/\//g,0,F.DIV),new P(/[\d\.]+/g,0,F.NUMBER),new P(/[a-z]+[\d]+/gi,0,F.CELL),new P(/([a-z]+)\(/gi,1,F.FUNCTION)],V=function(){function e(t,n){Object(x.a)(this,e),this.input=t,this.grammar=n,this.index=0,this.char=t[this.index],this.markers=[],this.tokens=[]}return Object(j.a)(e,[{key:"getTokens",value:function(){for(;this.char!==F.EOF;){var e=this.nextToken();this.tokens.push(e)}return this.tokens}},{key:"nextToken",value:function(){if(this.char===F.EOF)return new A(F.EOF,F.EOF);var e,t=this.getWhitespace(),n=!0,r=!1,a=void 0;try{for(var i,o=this.grammar[Symbol.iterator]();!(n=(i=o.next()).done);n=!0){var s=i.value;s.setIndex(this.index);var c=s.test(this.input);if(c&&c.index===this.index){var u=c[s.groupIndex];e=new A(s.token,u,t),this.index+=u.length-1,this.consume();break}}}catch(l){r=!0,a=l}finally{try{n||null==o.return||o.return()}finally{if(r)throw a}}return e||(e=this.tokenUNKNOWN(t)),e}},{key:"tokenUNKNOWN",value:function(e){for(var t=[];!(this.isEOF()||this.isSeparator()||this.isWhitespace());)t.push(this.char),this.consume();var n=t.join("");return new A(F.UNKNOWN,n,e)}},{key:"consume",value:function(){this.index++,this.index<this.input.length?this.char=this.input[this.index]:this.char=F.EOF}},{key:"isEOF",value:function(){return this.char===F.EOF}},{key:"isWhitespace",value:function(){return!this.isEOF()&&Boolean(this.char.match(/\s/))}},{key:"isSeparator",value:function(){return!this.isEOF()&&Boolean(this.char.match(/[()+-\/*]{1}/))}},{key:"getWhitespace",value:function(){for(var e=0;this.isWhitespace();)e++,this.consume();return Array(e).fill(" ").join("")}}]),e}(),K=n(36),_={AVERAGE:function(){if(0===arguments.length)throw new Error("Empty elements");return this.SUM.apply(this,arguments)/this.COUNT.apply(this,arguments)},CONCAT:function(){for(var e=arguments.length,t=new Array(e),n=0;n<e;n++)t[n]=arguments[n];if(0===t.length)throw new Error("Empty elements");return t.reduce(function(e,t){return e+t},"")},COUNT:function(){return arguments.length},MAX:function(){for(var e=arguments.length,t=new Array(e),n=0;n<e;n++)t[n]=arguments[n];if(0===t.length)throw new Error("Empty elements");return t.forEach(function(e){if("number"!==typeof e)throw new TypeError("".concat(e," is not a number"))}),Math.max.apply(Math,t)},MIN:function(){for(var e=arguments.length,t=new Array(e),n=0;n<e;n++)t[n]=arguments[n];if(0===t.length)throw new Error("Empty elements");return t.forEach(function(e){if("number"!==typeof e)throw new TypeError("".concat(e," is not a number"))}),Math.min.apply(Math,t)},POWER:function(){for(var e=arguments.length,t=new Array(e),n=0;n<e;n++)t[n]=arguments[n];if(2!==t.length)throw new Error("Formula takes only two elements");var r=t[0],a=t[1];return Math.pow(r,a)},SQRT:function(){if(1!==arguments.length)throw new Error("Formula takes only one element");return Math.sqrt(arguments.length<=0?void 0:arguments[0])},SUM:function(){for(var e=arguments.length,t=new Array(e),n=0;n<e;n++)t[n]=arguments[n];if(0===t.length)throw new Error("Empty elements");return t.reduce(function(e,t){return e+t})}};_.POW=_.POWER;var B=_,W=function(){function e(){Object(x.a)(this,e)}return Object(j.a)(e,[{key:"eval",value:function(){throw new Error("Implement method.")}}]),e}(),z=function(e){function t(e){var n;return Object(x.a)(this,t),(n=Object(N.a)(this,Object(C.a)(t).call(this)))._name="NumberNode",n.numberNode=e,n}return Object(U.a)(t,e),Object(j.a)(t,[{key:"eval",value:function(){return this.testPeriodCount(),this.setTokenValue(),this.value}},{key:"testPeriodCount",value:function(){var e=this.numberNode.text,t=(e.match(/\./g)||[]).length;if(t>=2||1===t&&1===e.length)throw new Error('Invalid number "'.concat(this.numberNode.text,'"'))}},{key:"setTokenValue",value:function(){var e=parseFloat(this.numberNode.text);if(isNaN(e))throw new Error('Invalid number "'.concat(this.numberNode.text,'"'));this.numberNode.value=e}},{key:"value",get:function(){return this.numberNode.value}}]),t}(W),q=function(e){function t(e,n){var r;return Object(x.a)(this,t),(r=Object(N.a)(this,Object(C.a)(t).call(this)))._name="UnaryOp",r.opNode=e,r.expr=n,r}return Object(U.a)(t,e),Object(j.a)(t,[{key:"eval",value:function(e){if(this.opNode.type===I.PLUS)return e;if(this.opNode.type===I.MINUS)return-e;throw new Error('Unary operator is not "+" or "-"')}}]),t}(W),Q=function(e){function t(e,n){var r;return Object(x.a)(this,t),(r=Object(N.a)(this,Object(C.a)(t).call(this)))._name="FuncOp",r.funcNode=e,r.argNodes=n,r}return Object(U.a)(t,e),Object(j.a)(t,[{key:"eval",value:function(e){return this.getFunction().apply(void 0,Object(K.a)(e))}},{key:"getFunction",value:function(){var e=B[this.funcNode.text.toUpperCase()];if(e)return e;throw new Error("Formula ".concat(this.funcNode.text," not found"))}}]),t}(W),J=function(e){function t(e,n,r){var a;return Object(x.a)(this,t),(a=Object(N.a)(this,Object(C.a)(t).call(this)))._name="BinaryOp",a.leftNode=e,a.opNode=n,a.rightNode=r,a}return Object(U.a)(t,e),Object(j.a)(t,[{key:"eval",value:function(e,t){switch(this.opNode.type){case I.PLUS:return e+t;case I.MINUS:return e-t;case I.DIV:if(0===t)throw new Error("Division by zero: ".concat(e,"/").concat(t));return e/t;case I.MULT:return e*t;default:throw new Error('Unsupported operator "'.concat(this.token.text,'"'))}}}]),t}(W),Y=function(){function e(t){Object(x.a)(this,e),this.index=0,this.tokens=t,this.curr=t[this.index],this.depth=0}return Object(j.a)(e,[{key:"parse",value:function(){this.equals();var e=this.expr();if(null!==this.curr)throw new Error("Unexpected term at index ".concat(this.index,': "').concat(this.curr.text,'"'));if(0!==this.depth)throw new Error("Unbalanced expression");return e}},{key:"expr",value:function(){var e,t,n;for(e=this.term();[I.PLUS,I.MINUS].includes(this.peekType());)t=this.operator(),n=this.term(),e=new J(e,t,n);return e}},{key:"term",value:function(){var e,t,n;for(e=this.factor();[I.MULT,I.DIV].includes(this.peekType());)t=this.operator(),n=this.factor(),e=new J(e,t,n);return e}},{key:"factor",value:function(){switch(this.peekType()){case I.PLUS:case I.MINUS:return this.unaryOp();case I.NUMBER:return this.number();case I.LPAREN:return this.enclosedExpr();case I.FUNCTION:return this.func();case I.RPAREN:throw new Error("Unexpected term at index ".concat(this.index,': "').concat(this.curr.text,'"'));default:throw new Error("Missing factor")}}},{key:"number",value:function(){if(this.peekType()===I.NUMBER){var e=new z(this.curr);return this.consume(),e}throw new Error("Missing number")}},{key:"operator",value:function(){if([I.PLUS,I.MINUS,I.MULT,I.DIV].includes(this.peekType())){var e=this.curr;return this.consume(),e}throw new Error("Missing operator")}},{key:"enclosedExpr",value:function(){this.lparen();var e=this.expr();return this.rparen(),e}},{key:"func",value:function(){var e,t;if(this.peekType()===I.FUNCTION)return e=this.curr,this.consume(),this.lparen(),t=this.args(),this.rparen(),new Q(e,t);throw new Error("Missing function")}},{key:"args",value:function(){var e=[],t=this.term();for(e.push(t);this.peekType()===I.COMMA;)this.consume(),t=this.term(),e.push(t);return e}},{key:"equals",value:function(){if(this.peekType()!==I.EQUALS)throw new Error("Missing equals sign");this.consume()}},{key:"lparen",value:function(){if(this.peekType()!==I.LPAREN)throw new Error("Missing left parenthesis");this.depth+=1,this.consume()}},{key:"rparen",value:function(){if(this.peekType()!==I.RPAREN)throw new Error("Missing right parenthesis");this.depth-=1,this.consume()}},{key:"unaryOp",value:function(){if([I.PLUS,I.MINUS].includes(this.peekType())){var e=this.curr;return this.consume(),new q(e,this.factor())}throw new Error("Missing unary operator")}},{key:"consume",value:function(){this.index<this.tokens.length-1?(this.index++,this.curr=this.tokens[this.index]):this.curr=null}},{key:"isUnbalanced",value:function(){return!(this.index===this.tokens.length&&0===this.depth)}},{key:"peekType",value:function(){return this.curr&&this.curr.type}}]),e}(),G=function(){function e(t){Object(x.a)(this,e),this.input=t,this.tokens=null,this.ast=null,this.result=null,this.error=null}return Object(j.a)(e,[{key:"interpret",value:function(){try{var e=new V(this.input,R);this.tokens=e.getTokens();var t=new Y(this.tokens);return this.ast=t.parse(),this.result=this.visit(this.ast),this.result}catch(n){return this.result=null,this.error=n,null}}},{key:"visit",value:function(e){switch(e._name){case"NumberNode":return this.NumberNode(e);case"FuncOp":return this.FuncOp(e);case"BinaryOp":return this.BinaryOp(e);case"UnaryOp":return this.UnaryOp(e);default:var t=e._name||(e.constructor||{}).name;throw new Error("Unrecognized AST node ".concat(t))}}},{key:"NumberNode",value:function(e){return e.eval()}},{key:"UnaryOp",value:function(e){var t=this.visit(e.expr);return e.eval(t)}},{key:"FuncOp",value:function(e){var t=[],n=!0,r=!1,a=void 0;try{for(var i,o=e.argNodes[Symbol.iterator]();!(n=(i=o.next()).done);n=!0){var s=i.value,c=this.visit(s);t.push(c)}}catch(u){r=!0,a=u}finally{try{n||null==o.return||o.return()}finally{if(r)throw a}}return e.eval(t)}},{key:"BinaryOp",value:function(e){var t=this.visit(e.leftNode),n=this.visit(e.rightNode);return e.eval(t,n)}}]),e}(),X=Object(w.a)("input",{target:"egik0ru0"})({name:"atryua",styles:"display:flex;align-items:center;outline:none;border:2px solid transparent;width:100%;height:100%;padding:0 2px;line-height:1em;:focus{border:2px solid salmon;}"}),H=function(e){function t(){var e;return Object(x.a)(this,t),(e=Object(N.a)(this,Object(C.a)(t).call(this))).refInput=a.a.createRef(),e.handleOnKeyDown=e.handleOnKeyDown.bind(Object(T.a)(e)),e.handleOnBlur=e.handleOnBlur.bind(Object(T.a)(e)),e}return Object(U.a)(t,e),Object(j.a)(t,[{key:"componentDidMount",value:function(){this.focusInputTag()}},{key:"focusInputTag",value:function(){var e=this.refInput.current;e.focus(),e.scrollLeft=e.scrollWidth}},{key:"setNewValue",value:function(e){var t=e.trim(),n=this.props.location;if(0!==t.length){var r={location:n,formula:t},a="="===t[0];r.value=a?this.evaluateFormula(t):t,this.props.setCellValue(r)}else this.props.clearCellValue(n)}},{key:"evaluateFormula",value:function(e){var t=new G(e),n=t.interpret(),r=t.error;return r?r.message.match(/division by zero/i)?"#DIV/0!":"#ERROR!":n}},{key:"handleOnKeyDown",value:function(e){var t=e.key;"Escape"===t?this.props.onEscape():"Enter"===t?(this.setNewValue(e.target.value),this.props.onCommit()):e.stopPropagation()}},{key:"handleOnBlur",value:function(e){this.setNewValue(e.target.value),this.props.onCommit()}},{key:"render",value:function(){var e=this.props.replaceValue?null:this.props.formula;return a.a.createElement(X,{ref:this.refInput,id:"f-".concat(this.props.location),defaultValue:e,onKeyDown:this.handleOnKeyDown,onBlur:this.handleOnBlur})}}]),t}(a.a.PureComponent);var Z={setCellValue:S,clearCellValue:M},$=Object(s.b)(function(e,t){var n=e.table[t.location];return{formula:n?n.formula:""}},Z)(H),ee=Object(w.a)("div",{target:"e1dfe2wz0"})({name:"10hpjg9",styles:"display:flex;align-items:center;outline:none;border:2px solid transparent;width:100%;height:100%;padding:0 2px;:focus{border:2px solid salmon;}"}),te=function(e){function t(){var e;return Object(x.a)(this,t),(e=Object(N.a)(this,Object(C.a)(t).call(this))).refDataTag=a.a.createRef(),e.handleOnKeyDown=e.handleOnKeyDown.bind(Object(T.a)(e)),e}return Object(U.a)(t,e),Object(j.a)(t,[{key:"componentDidMount",value:function(){this.focusDataTag()}},{key:"focusDataTag",value:function(){this.props.isFocused&&this.refDataTag.current.focus()}},{key:"handleOnKeyDown",value:function(e){var t=e.key;(this.props.setActiveCell(this.props.location),["Delete","Backspace"].includes(t))?(""+this.props.value).length>0&&this.props.clearCellValue(this.props.location):1===t.length&&this.props.onKeyDownEditable()}},{key:"render",value:function(){return a.a.createElement(ee,{ref:this.refDataTag,id:"t-".concat(this.props.location),tabIndex:"0",onKeyDown:this.handleOnKeyDown,onDoubleClick:this.props.onDoubleClick},this.props.value)}}]),t}(a.a.PureComponent);var ne={clearCellValue:M,setActiveCell:E},re=Object(s.b)(function(e,t){var n=e.table[t.location];return{value:n?n.value:""}},ne)(te),ae=Object(w.a)("div",{target:"eoyj2860"})({name:"1wzsgjr",styles:"cursor:cell;width:100%;height:100%;font-size:13px;border-right:1px solid #dfdfdf;border-bottom:1px solid #dfdfdf;"}),ie=function(e){function t(){var e;return Object(x.a)(this,t),(e=Object(N.a)(this,Object(C.a)(t).call(this))).state={displayState:L.initialState},e.displayService=Object(D.c)(L).onTransition(function(t){return e.setState({displayState:t})}),e.evaluatedOnDoubleClick=e.evaluatedOnDoubleClick.bind(Object(T.a)(e)),e.evaluatedOnKeyDownEditable=e.evaluatedOnKeyDownEditable.bind(Object(T.a)(e)),e.inputOnEscape=e.inputOnEscape.bind(Object(T.a)(e)),e.inputOnCommit=e.inputOnCommit.bind(Object(T.a)(e)),e}return Object(U.a)(t,e),Object(j.a)(t,[{key:"componentDidMount",value:function(){this.displayService.start()}},{key:"componentWillUnmount",value:function(){this.displayService.stop()}},{key:"evaluatedOnDoubleClick",value:function(){this.displayService.send("EDITABLE_MODIFY")}},{key:"evaluatedOnKeyDownEditable",value:function(){this.displayService.send("EDITABLE_REPLACE")}},{key:"inputOnEscape",value:function(){this.displayService.send("STATIC_FOCUSED")}},{key:"inputOnCommit",value:function(){this.displayService.send("STATIC")}},{key:"renderData",value:function(){var e=this.state.displayState;return e.matches("editable")?a.a.createElement($,{replaceValue:e.matches("editable.replace"),location:this.props.location,onEscape:this.inputOnEscape,onCommit:this.inputOnCommit}):a.a.createElement(re,{location:this.props.location,onDoubleClick:this.evaluatedOnDoubleClick,onKeyDownEditable:this.evaluatedOnKeyDownEditable,isFocused:e.matches("static.focused")})}},{key:"render",value:function(){return a.a.createElement(ae,null,this.renderData())}}]),t}(a.a.PureComponent),oe=n(27),se="A".codePointAt(0);function ce(e){for(var t=[],n=[""],r=e;r>0;){var a=[];e:for(var i=0,o=n;i<o.length;i++){var s=o[i],c=!0,u=!1,l=void 0;try{for(var h,d="ABCDEFGHIJKLMNOPQRSTUVWXYZ"[Symbol.iterator]();!(c=(h=d.next()).done);c=!0){var p=h.value;if(0===r)break e;a.push("".concat(s).concat(p)),r-=1}}catch(f){u=!0,l=f}finally{try{c||null==d.return||d.return()}finally{if(u)throw l}}}n=a,t=[].concat(Object(K.a)(t),a)}return t}function ue(e){var t=e.split("-"),n=Object(oe.a)(t,3),r=(n[0],n[1]),a=n[2];return[function(e){var t=e.split("-"),n=Object(oe.a)(t,2),r=n[0];return n[1],r.split("").reduce(function(e,t){return 26*e+t.charCodeAt(0)-se+1},0)-1}(r),+a-1]}var le=n(47);function he(e){var t=e.rows,n=e.columns,r=e.rowIndex,a=e.colIndex;switch(e.key){case"ArrowUp":r=Math.max(0,r-1);break;case"ArrowRight":a=Math.min(n-1,a+1);break;case"ArrowDown":case"Enter":r=Math.min(t-1,r+1);break;case"ArrowLeft":a=Math.max(0,a-1);break;default:return null}var i=function(e){var t=[],n=se,r=e+1;do{var a=n+(r-=1)%26,i=String.fromCodePoint(a);t.push(i),r=Math.floor(r/26)}while(r>0);return t.reverse().join("")}(a),o=""+(r+1);return"t-".concat(i,"-").concat(o)}var de={id:"keyboardNav",initial:"idle",context:{columns:null,rows:null,key:null,colIndex:null,rowIndex:null,endLocation:null,wasFocused:!1},states:{idle:{on:{MOVE_FOCUS:{actions:["setNewContext","calcTargetLocation"],target:"focusTarget"}}},focusTarget:{invoke:{src:function(e){return e.endLocation?new Promise(function(t){setTimeout(function(){var n="#".concat(e.endLocation),r=document.querySelector(n);r&&r.focus(),t(!0)},0)}):Promise.resolve(!1)},onDone:{actions:Object(D.b)({wasFocused:function(e,t){return t.data}}),target:"idle"}}}}},pe={actions:{setNewContext:Object(D.b)(function(e,t){var n=t.key,r=ue(t.location),a=Object(oe.a)(r,2);return{colIndex:a[0],rowIndex:a[1],key:n}}),calcTargetLocation:Object(D.b)({endLocation:function(e){return he(e)}})}};var fe=function(e,t){var n=Object(le.a)({},de.context,{columns:t,rows:e});return Object(D.a)(de,pe,n)},ve=Object(w.a)("table",{target:"e1tmjcr20"})("border-top:2px solid ",function(e){return e.theme.colors.cell.border},";border-left:2px solid ",function(e){return e.theme.colors.cell.border},";border-right:1px solid ",function(e){return e.theme.colors.cell.border},";border-bottom:1px solid ",function(e){return e.theme.colors.cell.border},";"),me=Object(w.a)("td",{target:"e1tmjcr21"})({name:"1jom3qt",styles:"width:130px;height:26px;"}),ye=function(e){function t(e){var n;return Object(x.a)(this,t),(n=Object(N.a)(this,Object(C.a)(t).call(this,e))).keyboardNavMachine=fe(n.props.rows,n.props.columns),n.focusService=Object(D.c)(n.keyboardNavMachine),n.handleTableOnClick=n.handleTableOnClick.bind(Object(T.a)(n)),n.handleTableOnKeyDown=n.handleTableOnKeyDown.bind(Object(T.a)(n)),n.columnNames=ce(e.columns),n}return Object(U.a)(t,e),Object(j.a)(t,[{key:"componentDidMount",value:function(){this.focusService.start()}},{key:"componentWillUnmount",value:function(){this.focusService.stop()}},{key:"handleTableOnClick",value:function(e){e.stopPropagation()}},{key:"handleTableOnKeyDown",value:function(e){e.stopPropagation(),this.moveFocus(e.key,e.target.id)}},{key:"moveFocus",value:function(e,t){this.focusService.send({type:"MOVE_FOCUS",key:e,location:t})}},{key:"renderDataCells",value:function(e){var t=this;return new Array(this.props.columns).fill(0).map(function(n,r){var i="".concat(t.columnNames[r],"-").concat(e);return a.a.createElement(me,{key:i},a.a.createElement(ie,{isActive:t.props.activeCell===i,location:i}))})}},{key:"renderRows",value:function(){var e=this;return new Array(this.props.rows).fill(0).map(function(t,n){return a.a.createElement("tr",{key:n},e.renderDataCells(n+1))})}},{key:"render",value:function(){return a.a.createElement(ve,{onClick:this.handleTableOnClick,onKeyDown:this.handleTableOnKeyDown},a.a.createElement("tbody",null,this.renderRows()))}}]),t}(a.a.PureComponent),be=Object(s.b)(function(e){var t=e.global;return{activeCell:t.activeCell,rows:t.rows,columns:t.columns}})(ye),Oe=Object(w.a)("div",{target:"e4x97se0"})({name:"pl3zfx",styles:'display:grid;grid:"left-blank main right-blank" 100vh / auto minmax(auto,1000px) auto;'}),we=Object(w.a)("main",{target:"e4x97se1"})({name:"n7iznt",styles:"grid-area:main;"});var Ee={setActiveCell:E},ke=Object(s.b)(null,Ee)(function(e){var t=e.setActiveCell;return a.a.createElement(Oe,{onClick:function(){t(null)}},a.a.createElement(we,null,a.a.createElement(g,null),a.a.createElement(be,null)))}),ge=f();var xe=function(){return a.a.createElement(s.a,{store:ge},a.a.createElement(c.a,null,a.a.createElement(u.a,{theme:b},a.a.createElement(l.a,{styles:O}),a.a.createElement(ke,null))))};Boolean("localhost"===window.location.hostname||"[::1]"===window.location.hostname||window.location.hostname.match(/^127(?:\.(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)){3}$/));o.a.render(a.a.createElement(xe,null),document.getElementById("root")),"serviceWorker"in navigator&&navigator.serviceWorker.ready.then(function(e){e.unregister()})}},[[49,1,2]]]);
//# sourceMappingURL=main.d372828a.chunk.js.map