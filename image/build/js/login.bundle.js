/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// identity function for calling harmony imports with the correct context
/******/ 	__webpack_require__.i = function(value) { return value; };
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 14);
/******/ })
/************************************************************************/
/******/ ({

/***/ 0:
/***/ (function(module, exports) {

/*
	MIT License http://www.opensource.org/licenses/mit-license.php
	Author Tobias Koppers @sokra
*/
// css base code, injected by the css-loader
module.exports = function() {
	var list = [];

	// return the list of modules as css string
	list.toString = function toString() {
		var result = [];
		for(var i = 0; i < this.length; i++) {
			var item = this[i];
			if(item[2]) {
				result.push("@media " + item[2] + "{" + item[1] + "}");
			} else {
				result.push(item[1]);
			}
		}
		return result.join("");
	};

	// import a list of modules into the list
	list.i = function(modules, mediaQuery) {
		if(typeof modules === "string")
			modules = [[null, modules, ""]];
		var alreadyImportedModules = {};
		for(var i = 0; i < this.length; i++) {
			var id = this[i][0];
			if(typeof id === "number")
				alreadyImportedModules[id] = true;
		}
		for(i = 0; i < modules.length; i++) {
			var item = modules[i];
			// skip already imported module
			// this implementation is not 100% perfect for weird media query combinations
			//  when a module is imported multiple times with different media queries.
			//  I hope this will never occur (Hey this way we have smaller bundles)
			if(typeof item[0] !== "number" || !alreadyImportedModules[item[0]]) {
				if(mediaQuery && !item[2]) {
					item[2] = mediaQuery;
				} else if(mediaQuery) {
					item[2] = "(" + item[2] + ") and (" + mediaQuery + ")";
				}
				list.push(item);
			}
		}
	};
	return list;
};


/***/ }),

/***/ 1:
/***/ (function(module, exports) {

/*
	MIT License http://www.opensource.org/licenses/mit-license.php
	Author Tobias Koppers @sokra
*/
var stylesInDom = {},
	memoize = function(fn) {
		var memo;
		return function () {
			if (typeof memo === "undefined") memo = fn.apply(this, arguments);
			return memo;
		};
	},
	isOldIE = memoize(function() {
		return /msie [6-9]\b/.test(window.navigator.userAgent.toLowerCase());
	}),
	getHeadElement = memoize(function () {
		return document.head || document.getElementsByTagName("head")[0];
	}),
	singletonElement = null,
	singletonCounter = 0,
	styleElementsInsertedAtTop = [];

module.exports = function(list, options) {
	if(typeof DEBUG !== "undefined" && DEBUG) {
		if(typeof document !== "object") throw new Error("The style-loader cannot be used in a non-browser environment");
	}

	options = options || {};
	// Force single-tag solution on IE6-9, which has a hard limit on the # of <style>
	// tags it will allow on a page
	if (typeof options.singleton === "undefined") options.singleton = isOldIE();

	// By default, add <style> tags to the bottom of <head>.
	if (typeof options.insertAt === "undefined") options.insertAt = "bottom";

	var styles = listToStyles(list);
	addStylesToDom(styles, options);

	return function update(newList) {
		var mayRemove = [];
		for(var i = 0; i < styles.length; i++) {
			var item = styles[i];
			var domStyle = stylesInDom[item.id];
			domStyle.refs--;
			mayRemove.push(domStyle);
		}
		if(newList) {
			var newStyles = listToStyles(newList);
			addStylesToDom(newStyles, options);
		}
		for(var i = 0; i < mayRemove.length; i++) {
			var domStyle = mayRemove[i];
			if(domStyle.refs === 0) {
				for(var j = 0; j < domStyle.parts.length; j++)
					domStyle.parts[j]();
				delete stylesInDom[domStyle.id];
			}
		}
	};
}

function addStylesToDom(styles, options) {
	for(var i = 0; i < styles.length; i++) {
		var item = styles[i];
		var domStyle = stylesInDom[item.id];
		if(domStyle) {
			domStyle.refs++;
			for(var j = 0; j < domStyle.parts.length; j++) {
				domStyle.parts[j](item.parts[j]);
			}
			for(; j < item.parts.length; j++) {
				domStyle.parts.push(addStyle(item.parts[j], options));
			}
		} else {
			var parts = [];
			for(var j = 0; j < item.parts.length; j++) {
				parts.push(addStyle(item.parts[j], options));
			}
			stylesInDom[item.id] = {id: item.id, refs: 1, parts: parts};
		}
	}
}

function listToStyles(list) {
	var styles = [];
	var newStyles = {};
	for(var i = 0; i < list.length; i++) {
		var item = list[i];
		var id = item[0];
		var css = item[1];
		var media = item[2];
		var sourceMap = item[3];
		var part = {css: css, media: media, sourceMap: sourceMap};
		if(!newStyles[id])
			styles.push(newStyles[id] = {id: id, parts: [part]});
		else
			newStyles[id].parts.push(part);
	}
	return styles;
}

function insertStyleElement(options, styleElement) {
	var head = getHeadElement();
	var lastStyleElementInsertedAtTop = styleElementsInsertedAtTop[styleElementsInsertedAtTop.length - 1];
	if (options.insertAt === "top") {
		if(!lastStyleElementInsertedAtTop) {
			head.insertBefore(styleElement, head.firstChild);
		} else if(lastStyleElementInsertedAtTop.nextSibling) {
			head.insertBefore(styleElement, lastStyleElementInsertedAtTop.nextSibling);
		} else {
			head.appendChild(styleElement);
		}
		styleElementsInsertedAtTop.push(styleElement);
	} else if (options.insertAt === "bottom") {
		head.appendChild(styleElement);
	} else {
		throw new Error("Invalid value for parameter 'insertAt'. Must be 'top' or 'bottom'.");
	}
}

function removeStyleElement(styleElement) {
	styleElement.parentNode.removeChild(styleElement);
	var idx = styleElementsInsertedAtTop.indexOf(styleElement);
	if(idx >= 0) {
		styleElementsInsertedAtTop.splice(idx, 1);
	}
}

function createStyleElement(options) {
	var styleElement = document.createElement("style");
	styleElement.type = "text/css";
	insertStyleElement(options, styleElement);
	return styleElement;
}

function addStyle(obj, options) {
	var styleElement, update, remove;

	if (options.singleton) {
		var styleIndex = singletonCounter++;
		styleElement = singletonElement || (singletonElement = createStyleElement(options));
		update = applyToSingletonTag.bind(null, styleElement, styleIndex, false);
		remove = applyToSingletonTag.bind(null, styleElement, styleIndex, true);
	} else {
		styleElement = createStyleElement(options);
		update = applyToTag.bind(null, styleElement);
		remove = function() {
			removeStyleElement(styleElement);
		};
	}

	update(obj);

	return function updateStyle(newObj) {
		if(newObj) {
			if(newObj.css === obj.css && newObj.media === obj.media && newObj.sourceMap === obj.sourceMap)
				return;
			update(obj = newObj);
		} else {
			remove();
		}
	};
}

var replaceText = (function () {
	var textStore = [];

	return function (index, replacement) {
		textStore[index] = replacement;
		return textStore.filter(Boolean).join('\n');
	};
})();

function applyToSingletonTag(styleElement, index, remove, obj) {
	var css = remove ? "" : obj.css;

	if (styleElement.styleSheet) {
		styleElement.styleSheet.cssText = replaceText(index, css);
	} else {
		var cssNode = document.createTextNode(css);
		var childNodes = styleElement.childNodes;
		if (childNodes[index]) styleElement.removeChild(childNodes[index]);
		if (childNodes.length) {
			styleElement.insertBefore(cssNode, childNodes[index]);
		} else {
			styleElement.appendChild(cssNode);
		}
	}
}

function applyToTag(styleElement, obj) {
	var css = obj.css;
	var media = obj.media;
	var sourceMap = obj.sourceMap;

	if (media) {
		styleElement.setAttribute("media", media);
	}

	if (sourceMap) {
		// https://developer.chrome.com/devtools/docs/javascript-debugging
		// this makes source maps inside style tags work properly in Chrome
		css += '\n/*# sourceURL=' + sourceMap.sources[0] + ' */';
		// http://stackoverflow.com/a/26603875
		css += "\n/*# sourceMappingURL=data:application/json;base64," + btoa(unescape(encodeURIComponent(JSON.stringify(sourceMap)))) + " */";
	}

	if (styleElement.styleSheet) {
		styleElement.styleSheet.cssText = css;
	} else {
		while(styleElement.firstChild) {
			styleElement.removeChild(styleElement.firstChild);
		}
		styleElement.appendChild(document.createTextNode(css));
	}
}


/***/ }),

/***/ 11:
/***/ (function(module, exports, __webpack_require__) {

var __vue_script__, __vue_template__
var __vue_styles__ = {}
__vue_template__ = __webpack_require__(56)
module.exports = __vue_script__ || {}
if (module.exports.__esModule) module.exports = module.exports.default
var __vue_options__ = typeof module.exports === "function" ? (module.exports.options || (module.exports.options = {})) : module.exports
if (__vue_template__) {
__vue_options__.template = __vue_template__
}
if (!__vue_options__.computed) __vue_options__.computed = {}
Object.keys(__vue_styles__).forEach(function (key) {
var module = __vue_styles__[key]
__vue_options__.computed[key] = function () { return module }
})
if (false) {(function () {  module.hot.accept()
  var hotAPI = require("vue-hot-reload-api")
  hotAPI.install(require("vue"), false)
  if (!hotAPI.compatible) return
  var id = "_v-87c69c0a/app.vue"
  if (!module.hot.data) {
    hotAPI.createRecord(id, module.exports)
  } else {
    hotAPI.update(id, module.exports, __vue_template__)
  }
})()}

/***/ }),

/***/ 12:
/***/ (function(module, exports, __webpack_require__) {

var __vue_script__, __vue_template__
var __vue_styles__ = {}
__webpack_require__(65)
__vue_script__ = __webpack_require__(23)
if (Object.keys(__vue_script__).some(function (key) { return key !== "default" && key !== "__esModule" })) {
  console.warn("[vue-loader] src/pages/login/login.vue: named exports in *.vue files are ignored.")}
__vue_template__ = __webpack_require__(57)
module.exports = __vue_script__ || {}
if (module.exports.__esModule) module.exports = module.exports.default
var __vue_options__ = typeof module.exports === "function" ? (module.exports.options || (module.exports.options = {})) : module.exports
if (__vue_template__) {
__vue_options__.template = __vue_template__
}
if (!__vue_options__.computed) __vue_options__.computed = {}
Object.keys(__vue_styles__).forEach(function (key) {
var module = __vue_styles__[key]
__vue_options__.computed[key] = function () { return module }
})
if (false) {(function () {  module.hot.accept()
  var hotAPI = require("vue-hot-reload-api")
  hotAPI.install(require("vue"), false)
  if (!hotAPI.compatible) return
  var id = "_v-b2664a7a/login.vue"
  if (!module.hot.data) {
    hotAPI.createRecord(id, module.exports)
  } else {
    hotAPI.update(id, module.exports, __vue_template__)
  }
})()}

/***/ }),

/***/ 14:
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Vue.use(VueRouter);

var routes = [{
    path: '/login',
    component: __webpack_require__(12)
}, {
    path: '/',
    redirect: '/login'
}];

var router = new VueRouter({
    routes: routes
});

var app = new Vue({
    el: '#app',
    router: router,
    components: {
        App: __webpack_require__(11)
    },
    template: '<app></app>'
});

window.apiready = function () {
    api.addEventListener({
        name: 'keyback'
    }, function (ret, err) {
        var hashs = ['#/login'];
        if (hashs.indexOf(window.location.hash) > -1) {
            api.closeWidget();
        } else {
            history.back();
        }
    });
};

/***/ }),

/***/ 23:
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = {
  methods: {
    login: function login() {
      window.location.href = "index.html";
    }
  }
};

/***/ }),

/***/ 31:
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(0)();
// imports


// module
exports.push([module.i, "\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n.login-warp {\n  width: 100%;\n  height: 100%;\n  background: #f8f8f8;\n}\n\n.login-logo {\n  padding: 30px 20px;\n}\n\n.login-content-icon {\n  height: 80px;\n  width: 100%;\n}\n\n.login-title {\n  margin: 0px auto;\n  display: block;\n  width: 118px;\n  height: 72px;\n}\n\n.login-content-user {\n  margin-top: 20px;\n  padding: 0px 20px;\n  height: 60%;\n  width: 89%;\n}\n\n.login-content-user-name {\n  width: 100%;\n  background: #ffffff;\n  height: 48px;\n  border-bottom: 1px solid #cccccc;\n}\n\n.login-content-user-passwd {\n  width: 100%;\n  background: #ffffff;\n  height: 48px;\n}\n\n.login-content-user input {\n  height: 40px;\n  outline: none;\n  float: right;\n  width: 86%;\n  font-size: 16px;\n  color: #333;\n  border: 0px;\n}\n\ninput::-webkit-input-placeholder {\n  color: #a9a9a9;\n  font-size: 14px;\n}\n\n.login-input-icon {\n  font-size: 20px;\n  padding: 0px 10px;\n  line-height: 50px;\n  color: #bebebe;\n}\n\n.login-user-btn {\n  padding: 10px 40px;\n  font-size: 16px;\n  background: #259b24;\n  color: #ffffff;\n  margin-top: 20px;\n  text-align: center;\n  letter-spacing: 4px;\n}\n\n.login-footer {\n  width: 100%;\n  height: 10%;\n}\n", "", {"version":3,"sources":["/./src/pages/login/login.vue?302c851f"],"names":[],"mappings":";;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;AAkCA;EACA,YAAA;EACA,aAAA;EACA,oBAAA;CACA;;AAEA;EACA,mBAAA;CACA;;AAEA;EACA,aAAA;EACA,YAAA;CACA;;AAEA;EACA,iBAAA;EACA,eAAA;EACA,aAAA;EACA,aAAA;CACA;;AAEA;EACA,iBAAA;EACA,kBAAA;EACA,YAAA;EACA,WAAA;CACA;;AAEA;EACA,YAAA;EACA,oBAAA;EACA,aAAA;EACA,iCAAA;CACA;;AAEA;EACA,YAAA;EACA,oBAAA;EACA,aAAA;CACA;;AAEA;EACA,aAAA;EACA,cAAA;EACA,aAAA;EACA,WAAA;EACA,gBAAA;EACA,YAAA;EACA,YAAA;CACA;;AAEA;EACA,eAAA;EACA,gBAAA;CACA;;AAEA;EACA,gBAAA;EACA,kBAAA;EACA,kBAAA;EACA,eAAA;CACA;;AAEA;EACA,mBAAA;EACA,gBAAA;EACA,oBAAA;EACA,eAAA;EACA,iBAAA;EACA,mBAAA;EACA,oBAAA;CACA;;AAEA;EACA,YAAA;EACA,YAAA;CACA","file":"login.vue","sourcesContent":["<template>\n  <div class=\"login-warp\">\n    <div class=\"login-logo\"><img src=\"../../../web/image/login.png\"></div>\n    <div class=\"login-content-icon\">\n      <img src=\"../../../web/image/icon.png\" class=\"login-title\">\n    </div>\n    <div class=\"login-content-user\">\n      <div class=\"login-content-user-name\">\n        <i class=\"iconfont icon-zhanghao login-input-icon\"></i>\n        <input type=\"text\" placeholder=\"学工号\" />\n      </div>\n      <div class=\"login-content-user-passwd\">\n        <i class=\"iconfont icon-mima login-input-icon\"></i>\n        <input type=\"password\" placeholder=\"密码\" />\n      </div>\n      <div class=\"login-user-btn\" @click=\"login()\">登录</div>\n    </div>\n    <div class=\"weui-footer login-footer\">\n      <p class=\"weui-footer__text\">Copyright &copy; 2017 西北农林科技大学体育部</p>\n    </div>\n  </div>\n</template>\n\n<script>\nexport default {\n  methods: {\n    login() {\n      window.location.href = \"index.html\";\n    }\n  }\n};\n</script>\n\n<style>\n.login-warp {\n  width: 100%;\n  height: 100%;\n  background: #f8f8f8;\n}\n\n.login-logo {\n  padding: 30px 20px;\n}\n\n.login-content-icon {\n  height: 80px;\n  width: 100%;\n}\n\n.login-title {\n  margin: 0px auto;\n  display: block;\n  width: 118px;\n  height: 72px;\n}\n\n.login-content-user {\n  margin-top: 20px;\n  padding: 0px 20px;\n  height: 60%;\n  width: 89%;\n}\n\n.login-content-user-name {\n  width: 100%;\n  background: #ffffff;\n  height: 48px;\n  border-bottom: 1px solid #cccccc;\n}\n\n.login-content-user-passwd {\n  width: 100%;\n  background: #ffffff;\n  height: 48px;\n}\n\n.login-content-user input {\n  height: 40px;\n  outline: none;\n  float: right;\n  width: 86%;\n  font-size: 16px;\n  color: #333;\n  border: 0px;\n}\n\ninput::-webkit-input-placeholder {\n  color: #a9a9a9;\n  font-size: 14px;\n}\n\n.login-input-icon {\n  font-size: 20px;\n  padding: 0px 10px;\n  line-height: 50px;\n  color: #bebebe;\n}\n\n.login-user-btn {\n  padding: 10px 40px;\n  font-size: 16px;\n  background: #259b24;\n  color: #ffffff;\n  margin-top: 20px;\n  text-align: center;\n  letter-spacing: 4px;\n}\n\n.login-footer {\n  width: 100%;\n  height: 10%;\n}\n</style>\n\n"],"sourceRoot":"webpack://"}]);

// exports


/***/ }),

/***/ 44:
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__.p + "build/img/icon.5b6101.png";

/***/ }),

/***/ 45:
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__.p + "build/img/login.2a279a.png";

/***/ }),

/***/ 56:
/***/ (function(module, exports) {

module.exports = "\n<router-view></router-view>\n";

/***/ }),

/***/ 57:
/***/ (function(module, exports, __webpack_require__) {

module.exports = "\n<div class=\"login-warp\">\n  <div class=\"login-logo\"><img src=\"" + __webpack_require__(45) + "\"></div>\n  <div class=\"login-content-icon\">\n    <img src=\"" + __webpack_require__(44) + "\" class=\"login-title\">\n  </div>\n  <div class=\"login-content-user\">\n    <div class=\"login-content-user-name\">\n      <i class=\"iconfont icon-zhanghao login-input-icon\"></i>\n      <input type=\"text\" placeholder=\"学工号\" />\n    </div>\n    <div class=\"login-content-user-passwd\">\n      <i class=\"iconfont icon-mima login-input-icon\"></i>\n      <input type=\"password\" placeholder=\"密码\" />\n    </div>\n    <div class=\"login-user-btn\" @click=\"login()\">登录</div>\n  </div>\n  <div class=\"weui-footer login-footer\">\n    <p class=\"weui-footer__text\">Copyright &copy; 2017 西北农林科技大学体育部</p>\n  </div>\n</div>\n";

/***/ }),

/***/ 65:
/***/ (function(module, exports, __webpack_require__) {

// style-loader: Adds some css to the DOM by adding a <style> tag

// load the styles
var content = __webpack_require__(31);
if(typeof content === 'string') content = [[module.i, content, '']];
// add the styles to the DOM
var update = __webpack_require__(1)(content, {});
if(content.locals) module.exports = content.locals;
// Hot Module Replacement
if(false) {
	// When the styles change, update the <style> tags
	if(!content.locals) {
		module.hot.accept("!!../../../node_modules/css-loader/index.js?sourceMap!../../../node_modules/vue-loader/lib/style-rewriter.js!../../../node_modules/vue-loader/lib/selector.js?type=style&index=0!./login.vue", function() {
			var newContent = require("!!../../../node_modules/css-loader/index.js?sourceMap!../../../node_modules/vue-loader/lib/style-rewriter.js!../../../node_modules/vue-loader/lib/selector.js?type=style&index=0!./login.vue");
			if(typeof newContent === 'string') newContent = [[module.id, newContent, '']];
			update(newContent);
		});
	}
	// When the module is disposed, remove the <style> tags
	module.hot.dispose(function() { update(); });
}

/***/ })

/******/ });
//# sourceMappingURL=login.bundle.js.map