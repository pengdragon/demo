(window["webpackJsonp"]=window["webpackJsonp"]||[]).push([["chunk-5d7f3f4a"],{"08b6":function(t,e,i){},"0f17":function(t,e,i){"use strict";var n=i("1ff6"),s=i.n(n);s.a},"11e9":function(t,e,i){var n=i("52a7"),s=i("4630"),a=i("6821"),o=i("6a99"),r=i("69a8"),c=i("c69a"),h=Object.getOwnPropertyDescriptor;e.f=i("9e1e")?h:function(t,e){if(t=a(t),e=o(e,!0),c)try{return h(t,e)}catch(i){}if(r(t,e))return s(!n.f.call(t,e),t[e])}},"1ff6":function(t,e,i){},"27fe":function(t,e,i){},3112:function(t,e,i){},"52a7":function(t,e){e.f={}.propertyIsEnumerable},"5dbc":function(t,e,i){var n=i("d3f4"),s=i("8b97").set;t.exports=function(t,e,i){var a,o=e.constructor;return o!==i&&"function"==typeof o&&(a=o.prototype)!==i.prototype&&n(a)&&s&&s(t,a),t}},"61d1":function(t,e,i){"use strict";var n=i("08b6"),s=i.n(n);s.a},"656d":function(t,e,i){"use strict";var n=i("f1f2"),s=i.n(n);s.a},8228:function(t,e,i){"use strict";var n=i("ccf3"),s=i.n(n);s.a},"84e0":function(t,e,i){"use strict";var n=i("27fe"),s=i.n(n);s.a},8912:function(t,e,i){t.exports=i.p+"img/timg.dceef676.jpg"},"8b97":function(t,e,i){var n=i("d3f4"),s=i("cb7c"),a=function(t,e){if(s(t),!n(e)&&null!==e)throw TypeError(e+": can't set as prototype!")};t.exports={set:Object.setPrototypeOf||("__proto__"in{}?function(t,e,n){try{n=i("9b43")(Function.call,i("11e9").f(Object.prototype,"__proto__").set,2),n(t,[]),e=!(t instanceof Array)}catch(s){e=!0}return function(t,i){return a(t,i),e?t.__proto__=i:n(t,i),t}}({},!1):void 0),check:a}},9093:function(t,e,i){var n=i("ce10"),s=i("e11e").concat("length","prototype");e.f=Object.getOwnPropertyNames||function(t){return n(t,s)}},aa77:function(t,e,i){var n=i("5ca1"),s=i("be13"),a=i("79e5"),o=i("fdef"),r="["+o+"]",c="​",h=RegExp("^"+r+r+"*"),l=RegExp(r+r+"*$"),u=function(t,e,i){var s={},r=a(function(){return!!o[t]()||c[t]()!=c}),h=s[t]=r?e(d):o[t];i&&(s[i]=h),n(n.P+n.F*r,"String",s)},d=u.trim=function(t,e){return t=String(s(t)),1&e&&(t=t.replace(h,"")),2&e&&(t=t.replace(l,"")),t};t.exports=u},bb1d:function(t,e,i){"use strict";var n=function(){var t=this,e=t.$createElement,i=t._self._c||e;return i("div",{staticClass:"ly-tab"},[i("ly-tabbar",t._b({model:{value:t.selectedId,callback:function(e){t.selectedId=e},expression:"selectedId"}},"ly-tabbar",t.options,!1),t._l(t.items,function(e,n){return i("ly-tab-item",{key:n},[t.options.fixBottom&&e.icon?i("span",{attrs:{slot:"icon"},slot:"icon"},[i("i",{class:e.icon})]):t._e(),i("span",[t._v(t._s(e[t.labelKey]))])])}),1)],1)},s=[],a=(i("c5f6"),i("cadf"),i("551c"),i("097d"),function(){var t=this,e=t.$createElement,i=t._self._c||e;return i("div",{ref:"viewArea",staticClass:"ly-tabbar",class:{"ly-tabbar-fix-bottom":t.fixBottom}},[i("div",{ref:"list",staticClass:"ly-tab-list",style:t.style},[t._t("default"),t.fixBottom?t._e():i("div",{ref:"activeBar",staticClass:"ly-tab-active-bar",style:t.activeBarStyle})],2)])}),o=[];function r(){for(var t=0,e=["webkit","moz"],i=0;i<e.length&&!window.requestAnimationFrame;++i)window.requestAnimationFrame=window[e[i]+"RequestAnimationFrame"],window.cancelAnimationFrame=window[e[i]+"CancelAnimationFrame"]||window[e[i]+"CancelRequestAnimationFrame"];window.requestAnimationFrame||(window.requestAnimationFrame=function(e,i){var n=(new Date).getTime(),s=Math.max(0,16.7-(n-t)),a=n-t,o=window.setTimeout(function(){e(a)},s);return t=n+s,o}),window.cancelAnimationFrame||(window.cancelAnimationFrame=function(t){clearTimeout(t)})}var c={name:"LyTabbar",props:{lineWidth:{type:Number,default:3},activeColor:{type:String,default:"red"},fixBottom:{type:Boolean,default:!1},value:{type:Number,default:0},additionalX:{type:Number,default:50},reBoundExponent:{type:Number,default:10,validator:function(t){return t>0}},sensitivity:{type:Number,default:1e3,validator:function(t){return t>0}},reBoundingDuration:{type:Number,default:360}},data:function(){return{activeBarX:0,activeBarWidth:0,speed:0,touching:!1,reBounding:!1,translateX:0,startX:0,lastX:0,currentX:0,startMoveTime:0,endMoveTime:0,frameTime:16.7,frameStartTime:0,frameEndTime:0,inertiaFrame:0,zeroSpeed:.001,acceleration:0}},computed:{style:function(){return this.fixBottom?{}:{transitionTimingFunction:this.transitionTimingFunction,transitionDuration:"".concat(this.transitionDuration,"ms"),transform:"translate3d(".concat(this.translateX,"px, 0px, 0px)")}},activeBarStyle:function(){return{transition:"all 300ms",width:"".concat(this.activeBarWidth,"px"),height:"".concat(this.lineWidth,"px"),transform:"translate3d(".concat(this.activeBarX,"px, 0, 0)"),backgroundColor:this.activeColor}},transitionDuration:function(){return this.touching||!this.reBounding&&!this.touching?0:this.reBounding&&!this.touching?this.reBoundingDuration:void 0},transitionTimingFunction:function(){return this.reBounding?"cubic-bezier(0.25, 0.46, 0.45, 0.94)":"cubic-bezier(0.1, 0.57, 0.1, 1)"},viewAreaWidth:function(){return this.$refs.viewArea.offsetWidth},listWidth:function(){return this.$refs.list.offsetWidth-this.viewAreaWidth},isMoveLeft:function(){return this.currentX<=this.startX},isMoveRight:function(){return this.currentX>=this.startX}},watch:{value:function(){this.checkPosition(),this.calcBarPosX()}},mounted:function(){this.bindEvent(),this.checkPosition(),this.calcBarPosX(),r()},destoryed:function(){this.removeEvent()},methods:{handleTouchStart:function(t){t.stopPropagation(),cancelAnimationFrame(this.inertiaFrame),this.lastX=t.touches[0].clientX},handleTouchMove:function(t){this.listWidth<=0||(t.preventDefault(),t.stopPropagation(),this.touching=!0,this.startMoveTime=this.endMoveTime,this.startX=this.lastX,this.currentX=t.touches[0].clientX,this.moveFollowTouch(),this.endMoveTime=t.timeStamp)},handleTouchEnd:function(t){if(this.touching=!1,this.checkReboundX())cancelAnimationFrame(this.inertiaFrame);else{var e=t.timeStamp-this.endMoveTime,i=this.endMoveTime-this.startMoveTime;if(i=i>0?i:8,e>100)return;this.speed=(this.lastX-this.startX)/i,this.acceleration=this.speed/this.sensitivity,this.frameStartTime=(new Date).getTime(),this.inertiaFrame=requestAnimationFrame(this.moveByInertia)}},checkReboundX:function(){return this.reBounding=!1,this.translateX>0?(this.reBounding=!0,this.translateX=0):this.translateX<-this.listWidth&&(this.reBounding=!0,this.translateX=-this.listWidth),0===this.translateX||this.translateX===-this.listWidth},bindEvent:function(){this.$el.addEventListener("touchstart",this.handleTouchStart,!1),this.$el.addEventListener("touchmove",this.handleTouchMove,!1),this.$el.addEventListener("touchend",this.handleTouchEnd,!1)},removeEvent:function(){this.$el.removeEventListener("touchstart",this.handleTouchStart),this.$el.removeEventListener("touchmove",this.handleTouchMove),this.$el.removeEventListener("touchend",this.handleTouchEnd)},moveFollowTouch:function(){this.isMoveLeft?this.translateX<=0&&this.translateX+this.listWidth>0||this.translateX>0?this.translateX+=this.currentX-this.lastX:this.translateX+this.listWidth<=0&&(this.translateX+=this.additionalX*(this.currentX-this.lastX)/(this.viewAreaWidth+Math.abs(this.translateX+this.listWidth))):this.translateX>=0?this.translateX+=this.additionalX*(this.currentX-this.lastX)/(this.viewAreaWidth+this.translateX):(this.translateX<=0&&this.translateX+this.listWidth>=0||this.translateX+this.listWidth<=0)&&(this.translateX+=this.currentX-this.lastX),this.lastX=this.currentX},moveByInertia:function(){this.frameEndTime=(new Date).getTime(),this.frameTime=this.frameEndTime-this.frameStartTime,this.isMoveLeft?this.translateX<=-this.listWidth?(this.acceleration*=(this.reBoundExponent+Math.abs(this.translateX+this.listWidth))/this.reBoundExponent,this.speed=Math.min(this.speed-this.acceleration,0)):this.speed=Math.min(this.speed-this.acceleration*this.frameTime,0):this.isMoveRight&&(this.translateX>=0?(this.acceleration*=(this.reBoundExponent+this.translateX)/this.reBoundExponent,this.speed=Math.max(this.speed-this.acceleration,0)):this.speed=Math.max(this.speed-this.acceleration*this.frameTime,0)),this.translateX+=this.speed*this.frameTime/2,Math.abs(this.speed)<=this.zeroSpeed?this.checkReboundX():(this.frameStartTime=this.frameEndTime,this.inertiaFrame=requestAnimationFrame(this.moveByInertia))},calcBarPosX:function(){if(!this.fixBottom&&this.$children.length&&!(this.$children.length<=this.value)){var t=this.$children[this.value].$el,e=t.offsetWidth,i=t.offsetLeft;this.activeBarWidth=Math.max(.6*e,14),this.activeBarX=i+(e-this.activeBarWidth)/2}},checkPosition:function(){if(!this.fixBottom&&this.$children.length&&!(this.$children.length<=this.value)){var t=this.$children[this.value].$el,e=t.offsetLeft,i=(this.viewAreaWidth-t.offsetWidth)/2,n=0,s=Math.abs(this.translateX);if(e<=s+i){var a=e+this.translateX;n=i-a}else n=-(e-s-i);var o=n+this.translateX;o>0&&(o=0),o<-this.listWidth&&(o=-this.listWidth),this.reBounding=!0,this.translateX=o}}}},h=c,l=(i("0f17"),i("2877")),u=Object(l["a"])(h,a,o,!1,null,null,null);u.options.__file="tabbar.vue";var d=u.exports,f=function(){var t=this,e=t.$createElement,i=t._self._c||e;return i("a",{staticClass:"ly-tab-item",style:t.$parent.value===t.id?t.activeStyle:{},on:{click:t.onItemClicked}},[t.$parent.fixBottom?i("div",{staticClass:"ly-tab-item-icon"},[t._t("icon")],2):t._e(),i("div",{staticClass:"ly-tab-item-label"},[t._t("default")],2)])},m=[],v={name:"LyTabItem",computed:{activeStyle:function(){return{color:this.$parent.activeColor}}},data:function(){return{id:(this.$parent.$children.length||1)-1}},methods:{onItemClicked:function(){this.$parent.$emit("input",this.id)}}},p=v,b=(i("656d"),Object(l["a"])(p,f,m,!1,null,null,null));b.options.__file="tab-item.vue";var w=b.exports,g={name:"LyTab",components:{LyTabbar:d,LyTabItem:w},props:{value:{type:Number,default:0},items:{type:Array,default:function(){return[]}},options:{type:Object,default:function(){return{}}}},data:function(){return{selectedId:this.value}},computed:{labelKey:function(){return this.options.labelKey||"label"}},watch:{value:function(t){this.selectedId=t},selectedId:function(t){this.$emit("input",t),this.$emit("change",this.items[t],t)}}},y=g,X=Object(l["a"])(y,n,s,!1,null,null,null);X.options.__file="index.vue";var _=X.exports;const x=function(t,e={}){x.installed||t.component(_.name,_)};"undefined"!==typeof window&&window.Vue&&x(window.Vue);e["a"]={install:x,LyTab:_}},c5f6:function(t,e,i){"use strict";var n=i("7726"),s=i("69a8"),a=i("2d95"),o=i("5dbc"),r=i("6a99"),c=i("79e5"),h=i("9093").f,l=i("11e9").f,u=i("86cc").f,d=i("aa77").trim,f="Number",m=n[f],v=m,p=m.prototype,b=a(i("2aeb")(p))==f,w="trim"in String.prototype,g=function(t){var e=r(t,!1);if("string"==typeof e&&e.length>2){e=w?e.trim():d(e,3);var i,n,s,a=e.charCodeAt(0);if(43===a||45===a){if(i=e.charCodeAt(2),88===i||120===i)return NaN}else if(48===a){switch(e.charCodeAt(1)){case 66:case 98:n=2,s=49;break;case 79:case 111:n=8,s=55;break;default:return+e}for(var o,c=e.slice(2),h=0,l=c.length;h<l;h++)if(o=c.charCodeAt(h),o<48||o>s)return NaN;return parseInt(c,n)}}return+e};if(!m(" 0o1")||!m("0b1")||m("+0x1")){m=function(t){var e=arguments.length<1?0:t,i=this;return i instanceof m&&(b?c(function(){p.valueOf.call(i)}):a(i)!=f)?o(new v(g(e)),i,m):g(e)};for(var y,X=i("9e1e")?h(v):"MAX_VALUE,MIN_VALUE,NaN,NEGATIVE_INFINITY,POSITIVE_INFINITY,EPSILON,isFinite,isInteger,isNaN,isSafeInteger,MAX_SAFE_INTEGER,MIN_SAFE_INTEGER,parseFloat,parseInt,isInteger".split(","),_=0;X.length>_;_++)s(v,y=X[_])&&!s(m,y)&&u(m,y,l(v,y));m.prototype=p,p.constructor=m,i("2aba")(n,f,m)}},ccf3:function(t,e,i){},d5b9:function(t,e,i){"use strict";var n=i("3112"),s=i.n(n);s.a},e41f:function(t,e,i){"use strict";var n=i("fe7e"),s=i("6605");e["a"]=Object(n["a"])({render:function(){var t,e=this,i=e.$createElement,n=e._self._c||i;return n("transition",{attrs:{name:e.currentTransition}},[e.shouldRender?n("div",{directives:[{name:"show",rawName:"v-show",value:e.value,expression:"value"}],class:e.b((t={},t[e.position]=e.position,t))},[e._t("default")],2):e._e()])},name:"popup",mixins:[s["a"]],props:{position:String,transition:String,overlay:{type:Boolean,default:!0},closeOnClickOverlay:{type:Boolean,default:!0}},computed:{currentTransition:function(){return this.transition||(this.position?"popup-slide-"+this.position:"van-fade")}}})},f1f2:function(t,e,i){},f5b8:function(t,e,i){"use strict";i.r(e);var n=function(){var t=this,e=t.$createElement,i=t._self._c||e;return i("transition",{attrs:{"enter-active-class":"slideInRight","leave-active-class":"slideOutRight"}},[i("div",[i("div",{staticClass:"page",attrs:{id:"home"}},[i("home-header",{attrs:{login:t.login}}),i("home-menu"),i("keep-alive",[i("router-view",{staticClass:"home-content"})],1)],1),i("transition",{attrs:{"enter-active-class":"slideInRight","leave-active-class":"slideOutRight"}},[i("router-view",{attrs:{name:"subpage"}})],1)],1)])},s=[],a=function(){var t=this,e=t.$createElement,i=t._self._c||e;return i("header",{staticClass:"home-header"},[t._m(0),i("div",{staticClass:"search-bar"},[i("van-icon",{attrs:{name:"search"}}),t._v("\n    搜索商品, 共"+t._s(t.$store.state.home.total)+"款好物\n  ")],1),i("div",{staticClass:"login-btn",on:{click:t.loginAction}},[t._v("登录")])])},o=[function(){var t=this,e=t.$createElement,n=t._self._c||e;return n("div",{staticClass:"logo"},[n("img",{attrs:{src:i("8912")}})])}],r=(i("cadf"),i("551c"),i("097d"),{props:["login"],created:function(){this.$store.dispatch("home/getGoodsTotal")},methods:{loginAction:function(){this.login()}}}),c=r,h=(i("8228"),i("2877")),l=Object(h["a"])(c,a,o,!1,null,"cca0ac48",null);l.options.__file="home-header.vue";var u=l.exports,d=function(){var t=this,e=t.$createElement,i=t._self._c||e;return i("div",{staticClass:"home-menu-wrap"},[t.menuList.length>1?i("ly-tab",{attrs:{items:t.menuList,options:{activeColor:"#b4282d"}},model:{value:t.selectIndex,callback:function(e){t.selectIndex=e},expression:"selectIndex"}}):t._e(),i("div",{staticClass:"control"},[i("span",{staticClass:"box"}),i("van-icon",{class:{active:t.isShow},attrs:{name:"arrow-down"},on:{click:t.showAction}})],1),i("van-popup",{model:{value:t.isShow,callback:function(e){t.isShow=e},expression:"isShow"}}),i("div",{directives:[{name:"show",rawName:"v-show",value:t.isShow,expression:"isShow"}],staticClass:"wrap border-top"},[i("div",{staticClass:"title"},[t._v("全部频道")]),i("ul",{staticClass:"menu-list"},t._l(t.menuList,function(e,n){return i("li",{key:e.id,staticClass:"menu-item",class:{active:t.selectIndex==n},on:{click:function(e){t.selectAction(n)}}},[i("span",[t._v(t._s(e.label))])])}),0)])],1)},f=[],m=(i("20d6"),i("cebc")),v=i("bd86"),p=(i("7f7f"),i("68ef"),i("4d75"),i("e41f")),b=i("2f62"),w=i("bb1d"),g={components:Object(v["a"])({"ly-tab":w["a"].LyTab},p["a"].name,p["a"]),data:function(){return{isShow:!1,selectIndex:0}},computed:Object(m["a"])({},Object(b["d"])({menuList:function(t){return t.home.menuList}})),watch:{selectIndex:function(t){if(0==t)this.$router.push("/home/main");else{var e=this.menuList[t],i=e.id,n=e.label;this.$router.push("/home/menu/".concat(i,"/").concat(n))}},menuList:function(){if(this.$route.params.name){var t=this.$route.params.name;this.selectIndex=this.menuList.findIndex(function(e){return e.label==t})}},"$route.path":function(t){"/home"!=t&&"/home/main"!=t||(this.selectIndex=0)}},methods:{showAction:function(){this.isShow=!this.isShow},selectAction:function(t){this.selectIndex=t,this.showAction()}},created:function(){this.$store.dispatch("home/getMenuData")}},y=g,X=(i("84e0"),i("61d1"),Object(h["a"])(y,d,f,!1,null,"550e0f95",null));X.options.__file="home-menu.vue";var _=X.exports,x={props:["showLogin"],components:{homeHeader:u,homeMenu:_},mounted:function(){console.log(this.showLogin)},methods:{login:function(){this.$emit("login")}}},T=x,E=(i("d5b9"),Object(h["a"])(T,n,s,!1,null,"38ef803e",null));E.options.__file="index.vue";e["default"]=E.exports},fdef:function(t,e){t.exports="\t\n\v\f\r   ᠎             　\u2028\u2029\ufeff"}}]);
//# sourceMappingURL=chunk-5d7f3f4a.28f3db43.js.map