webpackJsonp([1],{"8dLF":function(t,e){},AqYa:function(t,e){t.exports="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAyNpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuNi1jMTQwIDc5LjE2MDQ1MSwgMjAxNy8wNS8wNi0wMTowODoyMSAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RSZWY9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZVJlZiMiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENDIChNYWNpbnRvc2gpIiB4bXBNTTpJbnN0YW5jZUlEPSJ4bXAuaWlkOkRGRjMxMkU1RTQyRDExRTc5REMzRjFEMUM4QUM1QzhFIiB4bXBNTTpEb2N1bWVudElEPSJ4bXAuZGlkOkRGRjMxMkU2RTQyRDExRTc5REMzRjFEMUM4QUM1QzhFIj4gPHhtcE1NOkRlcml2ZWRGcm9tIHN0UmVmOmluc3RhbmNlSUQ9InhtcC5paWQ6REZGMzEyRTNFNDJEMTFFNzlEQzNGMUQxQzhBQzVDOEUiIHN0UmVmOmRvY3VtZW50SUQ9InhtcC5kaWQ6REZGMzEyRTRFNDJEMTFFNzlEQzNGMUQxQzhBQzVDOEUiLz4gPC9yZGY6RGVzY3JpcHRpb24+IDwvcmRmOlJERj4gPC94OnhtcG1ldGE+IDw/eHBhY2tldCBlbmQ9InIiPz6GXrU1AAAAEElEQVR42mL4//8/A0CAAQAI/AL+26JNFgAAAABJRU5ErkJggg=="},C4mC:function(t,e){},GAoC:function(t,e){},NHnr:function(t,e,n){"use strict";Object.defineProperty(e,"__esModule",{value:!0});var s=n("7+uW"),i=n("Dd8w"),o=n.n(i),r={name:"Song",props:["song","order"],methods:{updateItemPositions:function(){for(var t=document.getElementsByClassName("song-item-container"),e={},n=0;n<t.length;n++){var s=t[n],i=s.id,o=s.dataset.order;if(i){var r=s.getBoundingClientRect();e[s.id]={order:o,top:r.top,bottom:r.bottom,height:r.height}}}this.$store.commit("itemPositions",e)},positionPlaceholder:function(t){var e=document.getElementById("draggedItemPlaceholder");if(e){var n=t.y-.5*e.getBoundingClientRect().height+window.pageYOffset;e.style.transform="translateY("+n+"px)"}},deleteSong:function(t){this.$store.commit("deleteSong",t.target.dataset.id)},selectItem:function(t){this.$store.commit("draggedItem",this.song),this.positionPlaceholder(t),this.updateItemPositions()},moveItem:function(t){for(var e in this.positionPlaceholder(t),this.itemPositions){var n=this.itemPositions[e];if(t.y>n.top&&t.y<n.bottom){var s=t.y<n.top+.5*n.height;this.$store.commit("draggingOverItemId",{id:e,targetSlot:s?parseInt(n.order,10)-1:parseInt(n.order,10),slotPre:s,slotPost:!s});break}}},dropItem:function(t){var e=this;this.$store.commit("draggedItemEnd"),setTimeout(function(){var t=document.getElementsByClassName("wasMoved")[0];t&&t.classList.remove("wasMoved"),e.$store.commit("itemWasMoved")},400)},handleTouchStart:function(t){var e=this;if(1==t.touches.length){this.distance=0,this.startTime=(new Date).getTime(),this.startX=t.touches[0].clientX,this.startY=t.touches[0].clientY;var n=this.pointFromEvent(t);this.longPressTimer=setTimeout(function(){e.selectItem(n)},500)}},handleTouchMove:function(t){if(this.isDragging)t.preventDefault(),this.moveItem(this.pointFromEvent(t));else{var e=this.startX-t.touches[0].clientX,n=this.startY-t.touches[0].clientY;Math.abs(n)>Math.abs(e)&&console.log("scroll"),Math.abs(n)<Math.abs(e)&&e>0&&t.currentTarget.parentNode.classList.add("delete"),Math.abs(n)>50&&this.cancelLongPress()}},handleTouchEnd:function(t){this.cancelLongPress(),this.isDragging&&(t.preventDefault(),this.dropItem(t))},cancelLongPress:function(){this.longPressTimer&&clearTimeout(this.longPressTimer),console.log("clearing longPressTimer")},handleDragStart:function(t){var e=document.getElementById("dragImg");e.style.display="block",e.style.top=window.pageYOffset+"px",t.dataTransfer.setDragImage(e,0,0),t.dataTransfer.dropEffect="move",this.selectItem(this.pointFromEvent(t))},handleDrag:function(t){this.moveItem(this.pointFromEvent(t))},handleDragEnd:function(t){this.dropItem(t)},pointFromEvent:function(t){var e=t.touches?t.touches[0]:t;return{x:e.clientX,y:e.clientY}}},computed:{slotClasses:function(){return{blankSpot:null!=this.draggedItem&&this.song.id===this.draggedItem.id,draggingOver:this.draggingOverThis,targetSlotPre:this.targetSlot===this.order-1,targetSlotPost:this.targetSlot===this.order,draggable:void 0!==this.order,wasMoved:this.wasMoved===this.song.id}},duration:function(){var t=Math.floor(this.song.duration/60),e=this.song.duration%60;return e<10&&(e="0"+e),t+":"+e},draggedItem:function(){return this.$store.state.draggedItem},draggingOverThis:function(){return this.draggingOverItemId===this.song.id},draggingOverItemId:function(){return this.$store.state.draggingOverItemId},targetSlot:function(){return this.$store.state.targetSlot},wasMoved:function(){return this.$store.state.wasMoved},itemPositions:function(){return this.$store.state.itemPositions},isDragging:function(){return this.$store.state.isDragging},isScrolling:function(){return this.$store.state.isScrolling}}},a={render:function(){var t=this,e=t.$createElement,n=t._self._c||e;return n("li",[n("div",{staticClass:"song-item-container",class:t.slotClasses,attrs:{id:t.song.id,"data-order":t.order,draggable:void 0!==t.order},on:{dragstart:t.handleDragStart,drag:t.handleDrag,dragend:t.handleDragEnd,contextmenu:function(t){return t.preventDefault()},touchstart:t.handleTouchStart,touchmove:t.handleTouchMove,touchend:t.handleTouchEnd,touchcancel:t.handleTouchEnd}},[n("div",{directives:[{name:"show",rawName:"v-show",value:1==t.order,expression:"order == 1"}],staticClass:"slot preSlot"}),t._v(" "),n("span",{staticClass:"songInfo order"},[t._v("\n        "+t._s(t.order)+"\n      ")]),t._v(" "),n("span",{staticClass:"songInfo artist left"},[t._v("\n        "+t._s(t.song.artist)+"\n      ")]),t._v(" "),n("span",{staticClass:"songInfo title"},[t._v("\n        "+t._s(t.song.title)+"\n      ")]),t._v(" "),n("span",{staticClass:"songInfo duration"},[t._v("\n        "+t._s(t.duration)+"\n      ")]),t._v(" "),n("div",{directives:[{name:"show",rawName:"v-show",value:void 0!==t.order,expression:"order !== undefined"}],staticClass:"slot postSlot"})]),t._v(" "),n("div",{staticClass:"delete-button",attrs:{"data-id":t.song.id},on:{click:t.deleteSong}},[t._v("\n    DELETE\n  ")])])},staticRenderFns:[]};var l=n("VU/8")(r,a,!1,function(t){n("C4mC")},"data-v-5e5fcf0a",null).exports,d=n("Zrlr"),c=n.n(d),g=n("i81k"),u=n.n(g),m=function t(e,n,s,i){c()(this,t),this.id=u()(),this.title=e,this.artist=n,this.duration=s,this.isEncore=i||!1};m.songFromDocData=function(t){return new m(t.title,t.artist,t.duration,!1)};var h=m,v={name:"SongsTotal",props:["songs"],components:{Song:l},computed:{total:function(){var t=0,e=0;return this.songs.forEach(function(n){t++,e+=n.duration}),{title:t+" songs in total",duration:e}}}},p={render:function(){var t=this.$createElement;return(this._self._c||t)("Song",{attrs:{song:this.total}})},staticRenderFns:[]},f={name:"Songs",components:{Song:l,SongsTotal:n("VU/8")(v,p,!1,null,null,null).exports},props:["songs"],computed:{draggedItemPlaceholder:function(){var t=new h(this.$store.state.draggedItem.title,this.$store.state.draggedItem.artist,this.$store.state.draggedItem.duration);return t},isDragging:function(){return this.$store.state.isDragging}}},S={render:function(){var t=this,e=t.$createElement,n=t._self._c||e;return n("div",{staticClass:"songs"},[n("transition-group",{staticClass:"song-items-container",attrs:{tag:"ul",name:"rearrange"}},[t._l(t.songs,function(t,e){return n("Song",{key:t.id,attrs:{order:e+1,song:t}})}),t._v(" "),n("hr",{key:"divider"}),t._v(" "),t.songs.length>0?n("SongsTotal",{key:"total",attrs:{songs:t.songs}}):t._e()],2),t._v(" "),t.isDragging?n("div",{attrs:{id:"draggedItemPlaceholder"}},[n("Song",{attrs:{song:t.draggedItemPlaceholder}})],1):t._e()],1)},staticRenderFns:[]};var I=n("VU/8")(f,S,!1,function(t){n("q5PM")},"data-v-c48b242c",null).exports,w=n("NYxO"),L=function t(e,n,s){c()(this,t),this.name=e||"Untitled SetList",this.subtitle=n||"",this.songs=s||[]};L.setListFromDocData=function(t){return new L(t.title,t.subtitle,t.songs)};var T=L,b={name:"SetList",components:{Songs:I},computed:o()({},Object(w.b)(["setList"])),data:function(){return{idleTimer:null,newSetListTitle:"",newSongTitle:"",newSongArtist:"",newSongDuration:""}},methods:{addSetList:function(){var t=new T(this.newSetListTitle);this.$store.commit("addSetList",t),this.resetForm()},handleInput:function(t){this.startIdleTimer(t.target);var e=t.target.value;switch(t.target.dataset.model){case"songTitle":e.length>2&&(console.log("Searching for",e),this.stopIdleTimer())}},handleBlur:function(t){this.stopIdleTimer()},startIdleTimer:function(t){var e=this;this.stopIdleTimer(),this.idleTimer=setTimeout(function(){e.idleTimer&&(e.stopIdleTimer(),console.log("User idle, performing search for:",t.value))},2e3)},stopIdleTimer:function(){clearTimeout(this.idleTimer)},addSong:function(){var t=new h(this.newSongTitle,this.newSongArtist,this.toSeconds(this.newSongDuration));this.$store.commit("addSong",t),this.resetForm()},resetForm:function(){this.newSetListTitle="",this.newSongTitle="",this.newSongArtist="",this.newSongDuration="",document.activeElement.blur()},onEnter:function(t){document.querySelector(".new-song-form").style.height=t.getBoundingClientRect().height+"px"},afterEnter:function(t){t.querySelector("input[autofocus]").focus()},toSeconds:function(t){if(""===t)return 0;var e=t.split(/[:,.]/gi);return e.length<=1?parseInt(t,10):60*parseInt(e[0].trim(),10)+parseInt(e[1].trim(),10)},notEmpty:function(t){return{empty:""===t}}}},A={render:function(){var t=this,e=t.$createElement,n=t._self._c||e;return n("div",[n("h2",[t._v(t._s(t.setList?t.setList.name:this.newSetListTitle||"Welcome"))]),t._v(" "),n("div",{staticClass:"new-song-form"},[n("transition",{attrs:{name:"fade-right-to-left"},on:{enter:t.onEnter,"after-enter":t.afterEnter}},[null===t.setList?n("form",{key:"addSetList",staticClass:"add-setlist-form",on:{submit:function(e){e.preventDefault(),t.addSetList(e)}}},[n("h3",{staticStyle:{"grid-area":"header"}},[t._v("New SetList")]),t._v(" "),n("input",{directives:[{name:"model",rawName:"v-model",value:t.newSetListTitle,expression:"newSetListTitle"}],staticClass:"center",staticStyle:{"grid-area":"title"},attrs:{type:"text",autofocus:"",placeholder:"Name"},domProps:{value:t.newSetListTitle},on:{input:function(e){e.target.composing||(t.newSetListTitle=e.target.value)}}}),t._v(" "),n("button",{staticStyle:{"grid-area":"submit"}},[t._v("Create SetList")])]):n("form",{key:"addNewSong",staticClass:"add-song-form",on:{submit:function(e){e.preventDefault(),t.addSong(e)}}},[n("h3",{staticStyle:{"grid-area":"header"}},[t._v("Add new song")]),t._v(" "),n("input",{directives:[{name:"model",rawName:"v-model",value:t.newSongTitle,expression:"newSongTitle"}],staticClass:"center",staticStyle:{"grid-area":"title"},attrs:{type:"text","data-model":"songTitle",autofocus:"",placeholder:"Song Title"},domProps:{value:t.newSongTitle},on:{input:[function(e){e.target.composing||(t.newSongTitle=e.target.value)},t.handleInput]}}),t._v(" "),n("input",{directives:[{name:"model",rawName:"v-model",value:t.newSongDuration,expression:"newSongDuration"}],staticClass:"center duration",staticStyle:{"grid-area":"duration"},attrs:{type:"text","data-model":"songDuration",placeholder:"0:00"},domProps:{value:t.newSongDuration},on:{input:[function(e){e.target.composing||(t.newSongDuration=e.target.value)},t.handleInput]}}),t._v(" "),n("input",{directives:[{name:"model",rawName:"v-model",value:t.newSongArtist,expression:"newSongArtist"}],staticClass:"center",staticStyle:{"grid-area":"artist"},attrs:{type:"text","data-model":"songArtist",placeholder:"Artist (optional)"},domProps:{value:t.newSongArtist},on:{input:[function(e){e.target.composing||(t.newSongArtist=e.target.value)},t.handleInput]}}),t._v(" "),n("button",{staticStyle:{"grid-area":"submit"}},[t._v("Add song to list")])])])],1),t._v(" "),t.setList?n("Songs",{attrs:{songs:t.setList.songs}}):t._e()],1)},staticRenderFns:[]};var E=n("VU/8")(b,A,!1,function(t){n("cabv")},null,null).exports,_={name:"Scroller",data:function(){return{scrollTimer:null}},methods:{handleScroll:function(t){var e=this;null===this.scrollTimer&&(this.$store.commit("scroll",!0),this.scrollTimer=setTimeout(function(){clearTimeout(e.scrollTimer),e.scrollTimer=null,e.$store.commit("scroll",!1)},700))}},created:function(){window.addEventListener("scroll",this.handleScroll)},destroyed:function(){window.removeEventListener("scroll",this.handleScroll)}},y={render:function(){var t=this.$createElement;return(this._self._c||t)("div")},staticRenderFns:[]},D=n("VU/8")(_,y,!1,null,null,null).exports;const M={apiKey:"AIzaSyAU9rtPJJWLXR3nB0Az-xCjToOOq8mPfLg",authDomain:"jaybo-setlister.firebaseapp.com",databaseURL:"https://jaybo-setlister.firebaseio.com",projectId:"jaybo-setlister",storageBucket:"jaybo-setlister.appspot.com",messagingSenderId:"459478069088"};var R=n("Sazm"),P=n.n(R),x=n("2ahc"),F=n.n(x),N={name:"app",components:{SetList:E,Songs:I,Scroller:D}},C={render:function(){var t=this.$createElement,e=this._self._c||t;return e("div",{attrs:{id:"app"}},[e("router-view")],1)},staticRenderFns:[]};var U=n("VU/8")(N,C,!1,function(t){n("8dLF")},null,null).exports,O=n("/ocq"),G=n("Xxa5"),k=n.n(G),Y=n("//Fk"),z=n.n(Y),V=n("exGp"),j=n.n(V);s.a.use(w.a);var B=new w.a.Store({state:{user:void 0,setLists:[],setListIndex:0,draggedItem:null,draggingOverItemId:"",itemPositions:{},targetSlot:-1,wasMoved:"",isDragging:!1,isScrolling:!1},getters:{setList:function(t){return t.setLists[t.setListIndex]||null}},mutations:{loggedIn:function(t,e){var n,s=this;t.user=e,console.log("Looking for setlists for",e.uid),P.a.firestore().collection("setlists").where("users."+e.uid,"==",!0).get().then((n=j()(k.a.mark(function t(e){var n,i;return k.a.wrap(function(t){for(;;)switch(t.prev=t.next){case 0:return n=[],i=[],e.forEach(function(t){var e=t.data(),s=t.ref.collection("songs").get().then(function(t){var n=T.setListFromDocData(e);t.forEach(function(t){var e=t.data(),s=h.songFromDocData(e);n.songs.push(s)}),i.push(n)});n.push(s)}),t.next=5,z.a.all(n);case 5:s.commit("loadSetLists",i);case 6:case"end":return t.stop()}},t,s)})),function(t){return n.apply(this,arguments)}))},loggedOut:function(t){t.user=void 0},loadSetLists:function(t,e){console.log("commit loadSetLists()"),t.setLists=e},scroll:function(t,e){t.isScrolling=e},addSetList:function(t,e){t.setListIndex=t.setLists.length,t.setLists.push(e)},addSong:function(t,e){this.getters.setList.songs.push(e)},deleteSong:function(t,e){this.getters.setList.songs=this.getters.setList.songs.filter(function(t){return t.id!==e})},draggedItem:function(t,e){t.draggedItem=e,t.isDragging=!0,t.wasMoved=""},draggedItemEnd:function(t){if(t.draggedItem&&t.draggedItem.id!==t.draggingOverItemId){var e=$(this.getters.setList,t.draggedItem.id);this.getters.setList.songs.splice(e,1);var n=e>t.targetSlot?0:-1;this.getters.setList.songs.splice(t.targetSlot+n,0,t.draggedItem),t.wasMoved=t.draggedItem.id}t.draggedItem=null,t.isDragging=!1,t.draggingOverItemId="",t.targetSlot=-1},itemWasMoved:function(t){t.wasMoved=""},draggingOverItemId:function(t,e){t.draggingOverItemId=e.id,t.targetSlot=e.targetSlot},itemPositions:function(t,e){t.itemPositions=e}}}),$=function(t,e){return t.songs.findIndex(function(t){return t.id===e})},Z=B,W=n("AqYa"),J=n.n(W),Q=(n("mtWM"),{name:"start",data:function(){return{pixel:J.a,spotifyLoginUrl:"https://accounts.spotify.com/authorize/?client_id=3bebc130ca7a4a8bbae269967a5e328e&response_type=code&redirect_uri=https%3A%2F%2Fjaybo-setlister.herokuapp.com%2Fsearch%2Fcallback%2F&scope=playlist-modify-public%20user-read-email&state=spotifylogin"}},methods:{logout:function(){P.a.auth().signOut()}},computed:o()({},Object(w.c)(["user"])),components:{SetList:E,Songs:I,Scroller:D}}),X={render:function(){var t=this,e=t.$createElement,n=t._self._c||e;return n("div",[n("h1",[t._v("SetLister 0.0.3")]),t._v(" "),t.user?n("h2",[t._v("Welcome "+t._s(t.user.name))]):t._e(),t._v(" "),t.user?n("p",[t._v("This is you: "),n("img",{staticStyle:{width:"30px"},attrs:{src:t.user.avatar}})]):t._e(),t._v(" "),t.user?n("button",{on:{click:function(e){e.preventDefault(),t.logout(e)}}},[t._v("Log out")]):t._e(),t._v(" "),n("a",{attrs:{href:t.spotifyLoginUrl}},[t._v("Login to Spotify")]),t._v(" "),n("Scroller"),t._v(" "),n("SetList"),t._v(" "),n("img",{attrs:{id:"dragImg",src:t.pixel}})],1)},staticRenderFns:[]};var H=n("VU/8")(Q,X,!1,function(t){n("GAoC")},"data-v-47c1369c",null).exports,q={name:"login",components:{SetList:E,Songs:I,Scroller:D},data:function(){return{status:"Logging in..."}},mounted:function(){new F.a.auth.AuthUI(P.a.auth()).start("#firebaseui-auth-container",{signInSuccessUrl:"/",signInOptions:[P.a.auth.GoogleAuthProvider.PROVIDER_ID],tosUrl:"/tos"})}},K={render:function(){var t=this.$createElement,e=this._self._c||t;return e("section",[e("h1",[this._v("Login")]),this._v(" "),e("div",{attrs:{id:"firebaseui-auth-container"}},[this._v(this._s(this.status))])])},staticRenderFns:[]},tt=n("VU/8")(q,K,!1,null,null,null).exports,et=new O.a({mode:"history",routes:[{path:"/",component:H},{path:"/login",component:tt}]});n("3VHS");s.a.use(O.a),s.a.config.productionTip=!1,new s.a({router:et,store:Z,created:function(){var t=this;P.a.initializeApp(M),P.a.auth().onAuthStateChanged(function(e){e?(Z.commit("loggedIn",{uid:e.uid,name:e.displayName,avatar:e.photoURL}),console.log("Logged in"),t.$router.push("/")):(Z.commit("loggedOut"),console.log("Logged out"),t.$router.push("/login"))})},el:"#app",template:"<App/>",components:{App:U}})},cabv:function(t,e){},lVK7:function(t,e,n){n("NHnr")},q5PM:function(t,e){}},["lVK7"]);
//# sourceMappingURL=app.d87c896225e1ebacb8dd.js.map