(window["webpackJsonp"]=window["webpackJsonp"]||[]).push([["chunk-563a807e"],{"0653":function(t,e,i){"use strict";i("68ef")},2221:function(t,e,i){},"3b42":function(t,e,i){},4467:function(t,e,i){"use strict";i("68ef"),i("2221")},"5eea":function(t,e,i){},"72f6":function(t,e,i){"use strict";var n=i("5eea"),s=i.n(n);s.a},ac6a:function(t,e,i){for(var n=i("cadf"),s=i("0d58"),a=i("2aba"),o=i("7726"),r=i("32e9"),c=i("84f2"),l=i("2b4c"),u=l("iterator"),d=l("toStringTag"),h=c.Array,f={CSSRuleList:!0,CSSStyleDeclaration:!1,CSSValueList:!1,ClientRectList:!1,DOMRectList:!1,DOMStringList:!1,DOMTokenList:!0,DataTransferItemList:!1,FileList:!1,HTMLAllCollection:!1,HTMLCollection:!1,HTMLFormElement:!1,HTMLSelectElement:!1,MediaList:!0,MimeTypeArray:!1,NamedNodeMap:!1,NodeList:!0,PaintRequestList:!1,Plugin:!1,PluginArray:!1,SVGLengthList:!1,SVGNumberList:!1,SVGPathSegList:!1,SVGPointList:!1,SVGStringList:!1,SVGTransformList:!1,SourceBufferList:!1,StyleSheetList:!0,TextTrackCueList:!1,TextTrackList:!1,TouchList:!1},p=s(f),b=0;b<p.length;b++){var g,m=p[b],v=f[m],S=o[m],k=S&&S.prototype;if(k&&(k[u]||r(k,u,h),k[d]||r(k,d,m),c[m]=h,v))for(g in n)k[g]||a(k,g,n[g],!0)}},b650:function(t,e,i){"use strict";var n=i("a142"),s=i("543e"),a=Object(n["h"])("button"),o=a[0],r=a[1];e["a"]=o({props:{text:String,block:Boolean,plain:Boolean,round:Boolean,square:Boolean,loading:Boolean,disabled:Boolean,nativeType:String,bottomAction:Boolean,tag:{type:String,default:"button"},type:{type:String,default:"default"},size:{type:String,default:"normal"}},methods:{onClick:function(t){this.loading||this.disabled||this.$emit("click",t)}},render:function(t){return t(this.tag,{attrs:{type:this.nativeType,disabled:this.disabled},class:r([this.type,this.size,{block:this.block,plain:this.plain,round:this.round,square:this.square,loading:this.loading,disabled:this.disabled,"bottom-action":this.bottomAction}]),on:{click:this.onClick}},[this.loading?t(s["a"],{attrs:{size:"20px",color:"default"===this.type?void 0:""}}):t("span",{class:r("text")},[this.$slots.default||this.text])])}})},c194:function(t,e,i){"use strict";i("68ef")},c36e:function(t,e,i){"use strict";var n=i("fe7e"),s=i("db78"),a="@@clickoutsideContext",o={bind:function(t,e){var i=function(e){t.contains(e.target)||t[a].callback()};t[a]={handler:i,callback:e.value,arg:e.arg||"click"},Object(s["b"])(document,t[a].arg,i)},update:function(t,e){t[a].callback=e.value},unbind:function(t){Object(s["a"])(document,t[a].arg,t[a].handler)},install:function(t){t.directive("clickoutside",{bind:this.bind,unbind:this.unbind})}},r=i("3875"),c=.15;e["a"]=Object(n["a"])({render:function(){var t=this,e=t.$createElement,i=t._self._c||e;return i("div",{directives:[{name:"clickoutside",rawName:"v-clickoutside:touchstart",value:t.onClick,expression:"onClick",arg:"touchstart"}],class:t.b(),on:{click:function(e){t.onClick("cell")},touchstart:t.startDrag,touchmove:t.onDrag,touchend:t.endDrag,touchcancel:t.endDrag}},[i("div",{class:t.b("wrapper"),style:t.wrapperStyle,on:{transitionend:function(e){t.swipe=!1}}},[t.leftWidth?i("div",{class:t.b("left"),on:{click:function(e){e.stopPropagation(),t.onClick("left")}}},[t._t("left")],2):t._e(),t._t("default"),t.rightWidth?i("div",{class:t.b("right"),on:{click:function(e){e.stopPropagation(),t.onClick("right")}}},[t._t("right")],2):t._e()],2)])},name:"swipe-cell",mixins:[r["a"]],props:{onClose:Function,disabled:Boolean,leftWidth:Number,rightWidth:Number},directives:{Clickoutside:o},data:function(){return{offset:0,draging:!1}},computed:{wrapperStyle:function(){return{transform:"translate3d("+this.offset+"px, 0, 0)",transition:this.draging?"none":".6s cubic-bezier(0.18, 0.89, 0.32, 1)"}}},methods:{open:function(t){var e="left"===t?this.leftWidth:-this.rightWidth;this.swipeMove(e),this.resetSwipeStatus()},close:function(){this.offset=0},resetSwipeStatus:function(){this.swiping=!1,this.opened=!0},swipeMove:function(t){void 0===t&&(t=0),this.offset=t,t&&(this.swiping=!0),!t&&(this.opened=!1)},swipeLeaveTransition:function(t){var e=this.offset,i=this.leftWidth,n=this.rightWidth,s=this.opened?1-c:c;t>0&&-e>n*s&&n>0?this.open("right"):t<0&&e>i*s&&i>0?this.open("left"):this.swipeMove()},startDrag:function(t){this.disabled||(this.draging=!0,this.touchStart(t),this.opened&&(this.startX-=this.offset))},onDrag:function(t){if(!this.disabled){this.touchMove(t);var e=this.deltaX;e<0&&(-e>this.rightWidth||!this.rightWidth)||e>0&&(e>this.leftWidth||e>0)&&!this.leftWidth||"horizontal"===this.direction&&(t.preventDefault(),this.swipeMove(e))}},endDrag:function(){this.disabled||(this.draging=!1,this.swiping&&this.swipeLeaveTransition(this.offset>0?-1:1))},onClick:function(t){void 0===t&&(t="outside"),this.$emit("click",t),this.offset&&(this.onClose?this.onClose(t,this):this.swipeMove(0))}}})},e16e:function(t,e,i){"use strict";i.r(e);var n,s=function(){var t=this,e=t.$createElement,i=t._self._c||e;return i("transition",{attrs:{"enter-active-class":"slideInRight","leave-active-class":"slideOutRight"}},[i("div",{staticClass:"page",attrs:{id:"cart"}},[i("router-view"),i("header",{staticClass:"cart-header border-bottom"},[t._v("购物车")]),i("scroller",{staticClass:"cart-content"},t._l(t.cartList,function(e,n){return i("van-swipe-cell",{key:e.id,attrs:{"right-width":65}},[i("van-cell-group",{staticClass:"cart-item"},[i("input",{attrs:{type:"checkbox"},domProps:{checked:e.selected},on:{input:function(i){t.selectItem(i,e,n)}}}),i("img",{attrs:{src:e.img}}),i("div",{staticClass:"item-content"},[i("h3",[t._v(t._s(e.name))]),i("p",[t._v(t._s(e.price))])]),i("div",{staticClass:"item-handler"},[i("van-stepper",{attrs:{"disable-input":"",value:e.count},on:{input:function(i){t.handleInput(i,e)}}})],1)])],1)}),1),i("van-submit-bar",{staticClass:"border-top",attrs:{price:t.count,"button-text":"提交订单"},on:{submit:t.onSubmit}})],1)])},a=[],o=(i("ac6a"),i("cebc")),r=i("bd86"),c=(i("68ef"),i("3b42"),i("b650")),l=i("fe7e"),u=Object(l["a"])({render:function(){var t=this,e=t.$createElement,i=t._self._c||e;return i("div",{class:t.b()},[t._t("top"),t.tip||t.$slots.tip?i("div",{class:t.b("tip")},[t._v("\n    "+t._s(t.tip)),t._t("tip")],2):t._e(),i("div",{class:t.b("bar")},[t._t("default"),i("div",{class:t.b("text")},[t.hasPrice?[i("span",{domProps:{textContent:t._s(t.label||t.$t("label"))}}),i("span",{class:t.b("price")},[t._v(t._s(t.currency)+" "+t._s(t._f("format")(t.price)))])]:t._e()],2),i("van-button",{attrs:{square:"",size:"large",type:t.buttonType,disabled:t.disabled,loading:t.loading,text:t.loading?"":t.buttonText},on:{click:function(e){t.$emit("submit")}}})],2)],2)},name:"submit-bar",components:{VanButton:c["a"]},props:{tip:String,label:String,loading:Boolean,disabled:Boolean,buttonText:String,price:{type:Number,default:null},currency:{type:String,default:"¥"},buttonType:{type:String,default:"danger"}},computed:{hasPrice:function(){return"number"===typeof this.price}},filters:{format:function(t){return(t/100).toFixed(2)}}}),d=(i("fb6c"),Object(l["a"])({render:function(){var t=this,e=t.$createElement,i=t._self._c||e;return i("div",{class:t.b()},[i("button",{class:t.b("minus",{disabled:t.minusDisabled}),on:{click:function(e){t.onChange("minus")}}}),i("input",{class:t.b("input"),attrs:{type:"number",disabled:t.disabled||t.disableInput},domProps:{value:t.currentValue},on:{input:t.onInput,blur:t.onBlur}}),i("button",{class:t.b("plus",{disabled:t.plusDisabled}),on:{click:function(e){t.onChange("plus")}}})])},name:"stepper",props:{value:null,integer:Boolean,disabled:Boolean,asyncChange:Boolean,disableInput:Boolean,min:{type:[String,Number],default:1},max:{type:[String,Number],default:1/0},step:{type:[String,Number],default:1},defaultValue:{type:[String,Number],default:1}},data:function(){var t=this.range(this.isDef(this.value)?this.value:this.defaultValue);return t!==+this.value&&this.$emit("input",t),{currentValue:t}},computed:{minusDisabled:function(){return this.disabled||this.currentValue<=this.min},plusDisabled:function(){return this.disabled||this.currentValue>=this.max}},watch:{value:function(t){t!==this.currentValue&&(this.currentValue=this.format(t))},currentValue:function(t){this.$emit("input",t),this.$emit("change",t)}},methods:{format:function(t){return t=String(t).replace(/[^0-9.-]/g,""),""===t?0:this.integer?Math.floor(t):+t},range:function(t){return Math.max(Math.min(this.max,this.format(t)),this.min)},onInput:function(t){var e=t.target.value,i=this.format(e);this.asyncChange?(t.target.value=this.currentValue,this.$emit("input",i),this.$emit("change",i)):(+e!==i&&(t.target.value=i),this.currentValue=i)},onChange:function(t){if(this[t+"Disabled"])this.$emit("overlimit",t);else{var e="minus"===t?-this.step:+this.step,i=Math.round(100*(this.currentValue+e))/100;this.asyncChange?(this.$emit("input",i),this.$emit("change",i)):this.currentValue=this.range(i),this.$emit(t)}},onBlur:function(t){this.currentValue=this.range(this.currentValue),this.$emit("blur",t),0===this.currentValue&&(t.target.value=this.currentValue)}}})),h=(i("c194"),i("7744")),f=(i("0653"),i("34e9")),p=(i("7f7f"),i("4467"),i("c36e")),b=i("2f62"),g={data:function(){return{order:[],newArr:[],test:[{id:1},{id:2},{id:3},{id:4},{id:5},{id:6}]}},components:(n={},Object(r["a"])(n,p["a"].name,p["a"]),Object(r["a"])(n,f["a"].name,f["a"]),Object(r["a"])(n,h["a"].name,h["a"]),Object(r["a"])(n,d.name,d),Object(r["a"])(n,u.name,u),n),computed:Object(o["a"])({},Object(b["d"])({cartList:function(t){return t.cart.cartList}}),{count:function(){var t=0;return this.cartList.forEach(function(e){e.selected&&(t+=e.price*e.count)}),100*t}}),methods:{handleInput:function(t,e){0!=t&&this.$store.commit("cart/setCount",{item:e,count:t})},selectItem:function(t,e,i){console.log(i),console.log(t.target.checked),t.target.checked&&(this.cartList[i].selected=!0),t.target.checked||(this.cartList[i].selected=!1),console.log(e),this.$store.commit("cart/selectGoods",e)},handleRemove:function(t){this.$store.commit("cart/removeGoods",t)},onSubmit:function(){this.order=this.cartList.filter(function(t){return t.selected}),console.log(this.order),console.log(666),this.$router.push({path:"/cart/addresseidt"})}},created:function(){var t=this.test.filter(function(t){return 1!==t.id});console.log(t),localStorage.getItem("userToken")&&this.$store.dispatch("cart/getGoods")}},m=g,v=(i("72f6"),i("2877")),S=Object(v["a"])(m,s,a,!1,null,null,null);S.options.__file="index.vue";e["default"]=S.exports},fb6c:function(t,e,i){}}]);
//# sourceMappingURL=chunk-563a807e.cf43294e.js.map