/******/ (function(modules) { // webpackBootstrap
/******/ 	var parentHotUpdateCallback = this["webpackHotUpdate"];
/******/ 	this["webpackHotUpdate"] = 
/******/ 	function webpackHotUpdateCallback(chunkId, moreModules) { // eslint-disable-line no-unused-vars
/******/ 		hotAddUpdateChunk(chunkId, moreModules);
/******/ 		if(parentHotUpdateCallback) parentHotUpdateCallback(chunkId, moreModules);
/******/ 	}
/******/ 	
/******/ 	function hotDownloadUpdateChunk(chunkId) { // eslint-disable-line no-unused-vars
/******/ 		var head = document.getElementsByTagName("head")[0];
/******/ 		var script = document.createElement("script");
/******/ 		script.type = "text/javascript";
/******/ 		script.charset = "utf-8";
/******/ 		script.src = __webpack_require__.p + "" + chunkId + "." + hotCurrentHash + ".hot-update.js";
/******/ 		head.appendChild(script);
/******/ 	}
/******/ 	
/******/ 	function hotDownloadManifest(callback) { // eslint-disable-line no-unused-vars
/******/ 		if(typeof XMLHttpRequest === "undefined")
/******/ 			return callback(new Error("No browser support"));
/******/ 		try {
/******/ 			var request = new XMLHttpRequest();
/******/ 			var requestPath = __webpack_require__.p + "" + hotCurrentHash + ".hot-update.json";
/******/ 			request.open("GET", requestPath, true);
/******/ 			request.timeout = 10000;
/******/ 			request.send(null);
/******/ 		} catch(err) {
/******/ 			return callback(err);
/******/ 		}
/******/ 		request.onreadystatechange = function() {
/******/ 			if(request.readyState !== 4) return;
/******/ 			if(request.status === 0) {
/******/ 				// timeout
/******/ 				callback(new Error("Manifest request to " + requestPath + " timed out."));
/******/ 			} else if(request.status === 404) {
/******/ 				// no update available
/******/ 				callback();
/******/ 			} else if(request.status !== 200 && request.status !== 304) {
/******/ 				// other failure
/******/ 				callback(new Error("Manifest request to " + requestPath + " failed."));
/******/ 			} else {
/******/ 				// success
/******/ 				try {
/******/ 					var update = JSON.parse(request.responseText);
/******/ 				} catch(e) {
/******/ 					callback(e);
/******/ 					return;
/******/ 				}
/******/ 				callback(null, update);
/******/ 			}
/******/ 		};
/******/ 	}

/******/ 	
/******/ 	
/******/ 	var hotApplyOnUpdate = true;
/******/ 	var hotCurrentHash = "79c5ae60029cad396de5"; // eslint-disable-line no-unused-vars
/******/ 	var hotCurrentModuleData = {};
/******/ 	var hotCurrentParents = []; // eslint-disable-line no-unused-vars
/******/ 	
/******/ 	function hotCreateRequire(moduleId) { // eslint-disable-line no-unused-vars
/******/ 		var me = installedModules[moduleId];
/******/ 		if(!me) return __webpack_require__;
/******/ 		var fn = function(request) {
/******/ 			if(me.hot.active) {
/******/ 				if(installedModules[request]) {
/******/ 					if(installedModules[request].parents.indexOf(moduleId) < 0)
/******/ 						installedModules[request].parents.push(moduleId);
/******/ 					if(me.children.indexOf(request) < 0)
/******/ 						me.children.push(request);
/******/ 				} else hotCurrentParents = [moduleId];
/******/ 			} else {
/******/ 				console.warn("[HMR] unexpected require(" + request + ") from disposed module " + moduleId);
/******/ 				hotCurrentParents = [];
/******/ 			}
/******/ 			return __webpack_require__(request);
/******/ 		};
/******/ 		for(var name in __webpack_require__) {
/******/ 			if(Object.prototype.hasOwnProperty.call(__webpack_require__, name)) {
/******/ 				Object.defineProperty(fn, name, (function(name) {
/******/ 					return {
/******/ 						configurable: true,
/******/ 						enumerable: true,
/******/ 						get: function() {
/******/ 							return __webpack_require__[name];
/******/ 						},
/******/ 						set: function(value) {
/******/ 							__webpack_require__[name] = value;
/******/ 						}
/******/ 					};
/******/ 				}(name)));
/******/ 			}
/******/ 		}
/******/ 		Object.defineProperty(fn, "e", {
/******/ 			enumerable: true,
/******/ 			value: function(chunkId, callback) {
/******/ 				if(hotStatus === "ready")
/******/ 					hotSetStatus("prepare");
/******/ 				hotChunksLoading++;
/******/ 				__webpack_require__.e(chunkId, function() {
/******/ 					try {
/******/ 						callback.call(null, fn);
/******/ 					} finally {
/******/ 						finishChunkLoading();
/******/ 					}
/******/ 	
/******/ 					function finishChunkLoading() {
/******/ 						hotChunksLoading--;
/******/ 						if(hotStatus === "prepare") {
/******/ 							if(!hotWaitingFilesMap[chunkId]) {
/******/ 								hotEnsureUpdateChunk(chunkId);
/******/ 							}
/******/ 							if(hotChunksLoading === 0 && hotWaitingFiles === 0) {
/******/ 								hotUpdateDownloaded();
/******/ 							}
/******/ 						}
/******/ 					}
/******/ 				});
/******/ 			}
/******/ 		});
/******/ 		return fn;
/******/ 	}
/******/ 	
/******/ 	function hotCreateModule(moduleId) { // eslint-disable-line no-unused-vars
/******/ 		var hot = {
/******/ 			// private stuff
/******/ 			_acceptedDependencies: {},
/******/ 			_declinedDependencies: {},
/******/ 			_selfAccepted: false,
/******/ 			_selfDeclined: false,
/******/ 			_disposeHandlers: [],
/******/ 	
/******/ 			// Module API
/******/ 			active: true,
/******/ 			accept: function(dep, callback) {
/******/ 				if(typeof dep === "undefined")
/******/ 					hot._selfAccepted = true;
/******/ 				else if(typeof dep === "function")
/******/ 					hot._selfAccepted = dep;
/******/ 				else if(typeof dep === "object")
/******/ 					for(var i = 0; i < dep.length; i++)
/******/ 						hot._acceptedDependencies[dep[i]] = callback;
/******/ 				else
/******/ 					hot._acceptedDependencies[dep] = callback;
/******/ 			},
/******/ 			decline: function(dep) {
/******/ 				if(typeof dep === "undefined")
/******/ 					hot._selfDeclined = true;
/******/ 				else if(typeof dep === "number")
/******/ 					hot._declinedDependencies[dep] = true;
/******/ 				else
/******/ 					for(var i = 0; i < dep.length; i++)
/******/ 						hot._declinedDependencies[dep[i]] = true;
/******/ 			},
/******/ 			dispose: function(callback) {
/******/ 				hot._disposeHandlers.push(callback);
/******/ 			},
/******/ 			addDisposeHandler: function(callback) {
/******/ 				hot._disposeHandlers.push(callback);
/******/ 			},
/******/ 			removeDisposeHandler: function(callback) {
/******/ 				var idx = hot._disposeHandlers.indexOf(callback);
/******/ 				if(idx >= 0) hot._disposeHandlers.splice(idx, 1);
/******/ 			},
/******/ 	
/******/ 			// Management API
/******/ 			check: hotCheck,
/******/ 			apply: hotApply,
/******/ 			status: function(l) {
/******/ 				if(!l) return hotStatus;
/******/ 				hotStatusHandlers.push(l);
/******/ 			},
/******/ 			addStatusHandler: function(l) {
/******/ 				hotStatusHandlers.push(l);
/******/ 			},
/******/ 			removeStatusHandler: function(l) {
/******/ 				var idx = hotStatusHandlers.indexOf(l);
/******/ 				if(idx >= 0) hotStatusHandlers.splice(idx, 1);
/******/ 			},
/******/ 	
/******/ 			//inherit from previous dispose call
/******/ 			data: hotCurrentModuleData[moduleId]
/******/ 		};
/******/ 		return hot;
/******/ 	}
/******/ 	
/******/ 	var hotStatusHandlers = [];
/******/ 	var hotStatus = "idle";
/******/ 	
/******/ 	function hotSetStatus(newStatus) {
/******/ 		hotStatus = newStatus;
/******/ 		for(var i = 0; i < hotStatusHandlers.length; i++)
/******/ 			hotStatusHandlers[i].call(null, newStatus);
/******/ 	}
/******/ 	
/******/ 	// while downloading
/******/ 	var hotWaitingFiles = 0;
/******/ 	var hotChunksLoading = 0;
/******/ 	var hotWaitingFilesMap = {};
/******/ 	var hotRequestedFilesMap = {};
/******/ 	var hotAvailibleFilesMap = {};
/******/ 	var hotCallback;
/******/ 	
/******/ 	// The update info
/******/ 	var hotUpdate, hotUpdateNewHash;
/******/ 	
/******/ 	function toModuleId(id) {
/******/ 		var isNumber = (+id) + "" === id;
/******/ 		return isNumber ? +id : id;
/******/ 	}
/******/ 	
/******/ 	function hotCheck(apply, callback) {
/******/ 		if(hotStatus !== "idle") throw new Error("check() is only allowed in idle status");
/******/ 		if(typeof apply === "function") {
/******/ 			hotApplyOnUpdate = false;
/******/ 			callback = apply;
/******/ 		} else {
/******/ 			hotApplyOnUpdate = apply;
/******/ 			callback = callback || function(err) {
/******/ 				if(err) throw err;
/******/ 			};
/******/ 		}
/******/ 		hotSetStatus("check");
/******/ 		hotDownloadManifest(function(err, update) {
/******/ 			if(err) return callback(err);
/******/ 			if(!update) {
/******/ 				hotSetStatus("idle");
/******/ 				callback(null, null);
/******/ 				return;
/******/ 			}
/******/ 	
/******/ 			hotRequestedFilesMap = {};
/******/ 			hotAvailibleFilesMap = {};
/******/ 			hotWaitingFilesMap = {};
/******/ 			for(var i = 0; i < update.c.length; i++)
/******/ 				hotAvailibleFilesMap[update.c[i]] = true;
/******/ 			hotUpdateNewHash = update.h;
/******/ 	
/******/ 			hotSetStatus("prepare");
/******/ 			hotCallback = callback;
/******/ 			hotUpdate = {};
/******/ 			var chunkId = 0;
/******/ 			{ // eslint-disable-line no-lone-blocks
/******/ 				/*globals chunkId */
/******/ 				hotEnsureUpdateChunk(chunkId);
/******/ 			}
/******/ 			if(hotStatus === "prepare" && hotChunksLoading === 0 && hotWaitingFiles === 0) {
/******/ 				hotUpdateDownloaded();
/******/ 			}
/******/ 		});
/******/ 	}
/******/ 	
/******/ 	function hotAddUpdateChunk(chunkId, moreModules) { // eslint-disable-line no-unused-vars
/******/ 		if(!hotAvailibleFilesMap[chunkId] || !hotRequestedFilesMap[chunkId])
/******/ 			return;
/******/ 		hotRequestedFilesMap[chunkId] = false;
/******/ 		for(var moduleId in moreModules) {
/******/ 			if(Object.prototype.hasOwnProperty.call(moreModules, moduleId)) {
/******/ 				hotUpdate[moduleId] = moreModules[moduleId];
/******/ 			}
/******/ 		}
/******/ 		if(--hotWaitingFiles === 0 && hotChunksLoading === 0) {
/******/ 			hotUpdateDownloaded();
/******/ 		}
/******/ 	}
/******/ 	
/******/ 	function hotEnsureUpdateChunk(chunkId) {
/******/ 		if(!hotAvailibleFilesMap[chunkId]) {
/******/ 			hotWaitingFilesMap[chunkId] = true;
/******/ 		} else {
/******/ 			hotRequestedFilesMap[chunkId] = true;
/******/ 			hotWaitingFiles++;
/******/ 			hotDownloadUpdateChunk(chunkId);
/******/ 		}
/******/ 	}
/******/ 	
/******/ 	function hotUpdateDownloaded() {
/******/ 		hotSetStatus("ready");
/******/ 		var callback = hotCallback;
/******/ 		hotCallback = null;
/******/ 		if(!callback) return;
/******/ 		if(hotApplyOnUpdate) {
/******/ 			hotApply(hotApplyOnUpdate, callback);
/******/ 		} else {
/******/ 			var outdatedModules = [];
/******/ 			for(var id in hotUpdate) {
/******/ 				if(Object.prototype.hasOwnProperty.call(hotUpdate, id)) {
/******/ 					outdatedModules.push(toModuleId(id));
/******/ 				}
/******/ 			}
/******/ 			callback(null, outdatedModules);
/******/ 		}
/******/ 	}
/******/ 	
/******/ 	function hotApply(options, callback) {
/******/ 		if(hotStatus !== "ready") throw new Error("apply() is only allowed in ready status");
/******/ 		if(typeof options === "function") {
/******/ 			callback = options;
/******/ 			options = {};
/******/ 		} else if(options && typeof options === "object") {
/******/ 			callback = callback || function(err) {
/******/ 				if(err) throw err;
/******/ 			};
/******/ 		} else {
/******/ 			options = {};
/******/ 			callback = callback || function(err) {
/******/ 				if(err) throw err;
/******/ 			};
/******/ 		}
/******/ 	
/******/ 		function getAffectedStuff(module) {
/******/ 			var outdatedModules = [module];
/******/ 			var outdatedDependencies = {};
/******/ 	
/******/ 			var queue = outdatedModules.slice();
/******/ 			while(queue.length > 0) {
/******/ 				var moduleId = queue.pop();
/******/ 				var module = installedModules[moduleId];
/******/ 				if(!module || module.hot._selfAccepted)
/******/ 					continue;
/******/ 				if(module.hot._selfDeclined) {
/******/ 					return new Error("Aborted because of self decline: " + moduleId);
/******/ 				}
/******/ 				if(moduleId === 0) {
/******/ 					return;
/******/ 				}
/******/ 				for(var i = 0; i < module.parents.length; i++) {
/******/ 					var parentId = module.parents[i];
/******/ 					var parent = installedModules[parentId];
/******/ 					if(parent.hot._declinedDependencies[moduleId]) {
/******/ 						return new Error("Aborted because of declined dependency: " + moduleId + " in " + parentId);
/******/ 					}
/******/ 					if(outdatedModules.indexOf(parentId) >= 0) continue;
/******/ 					if(parent.hot._acceptedDependencies[moduleId]) {
/******/ 						if(!outdatedDependencies[parentId])
/******/ 							outdatedDependencies[parentId] = [];
/******/ 						addAllToSet(outdatedDependencies[parentId], [moduleId]);
/******/ 						continue;
/******/ 					}
/******/ 					delete outdatedDependencies[parentId];
/******/ 					outdatedModules.push(parentId);
/******/ 					queue.push(parentId);
/******/ 				}
/******/ 			}
/******/ 	
/******/ 			return [outdatedModules, outdatedDependencies];
/******/ 		}
/******/ 	
/******/ 		function addAllToSet(a, b) {
/******/ 			for(var i = 0; i < b.length; i++) {
/******/ 				var item = b[i];
/******/ 				if(a.indexOf(item) < 0)
/******/ 					a.push(item);
/******/ 			}
/******/ 		}
/******/ 	
/******/ 		// at begin all updates modules are outdated
/******/ 		// the "outdated" status can propagate to parents if they don't accept the children
/******/ 		var outdatedDependencies = {};
/******/ 		var outdatedModules = [];
/******/ 		var appliedUpdate = {};
/******/ 		for(var id in hotUpdate) {
/******/ 			if(Object.prototype.hasOwnProperty.call(hotUpdate, id)) {
/******/ 				var moduleId = toModuleId(id);
/******/ 				var result = getAffectedStuff(moduleId);
/******/ 				if(!result) {
/******/ 					if(options.ignoreUnaccepted)
/******/ 						continue;
/******/ 					hotSetStatus("abort");
/******/ 					return callback(new Error("Aborted because " + moduleId + " is not accepted"));
/******/ 				}
/******/ 				if(result instanceof Error) {
/******/ 					hotSetStatus("abort");
/******/ 					return callback(result);
/******/ 				}
/******/ 				appliedUpdate[moduleId] = hotUpdate[moduleId];
/******/ 				addAllToSet(outdatedModules, result[0]);
/******/ 				for(var moduleId in result[1]) {
/******/ 					if(Object.prototype.hasOwnProperty.call(result[1], moduleId)) {
/******/ 						if(!outdatedDependencies[moduleId])
/******/ 							outdatedDependencies[moduleId] = [];
/******/ 						addAllToSet(outdatedDependencies[moduleId], result[1][moduleId]);
/******/ 					}
/******/ 				}
/******/ 			}
/******/ 		}
/******/ 	
/******/ 		// Store self accepted outdated modules to require them later by the module system
/******/ 		var outdatedSelfAcceptedModules = [];
/******/ 		for(var i = 0; i < outdatedModules.length; i++) {
/******/ 			var moduleId = outdatedModules[i];
/******/ 			if(installedModules[moduleId] && installedModules[moduleId].hot._selfAccepted)
/******/ 				outdatedSelfAcceptedModules.push({
/******/ 					module: moduleId,
/******/ 					errorHandler: installedModules[moduleId].hot._selfAccepted
/******/ 				});
/******/ 		}
/******/ 	
/******/ 		// Now in "dispose" phase
/******/ 		hotSetStatus("dispose");
/******/ 		var queue = outdatedModules.slice();
/******/ 		while(queue.length > 0) {
/******/ 			var moduleId = queue.pop();
/******/ 			var module = installedModules[moduleId];
/******/ 			if(!module) continue;
/******/ 	
/******/ 			var data = {};
/******/ 	
/******/ 			// Call dispose handlers
/******/ 			var disposeHandlers = module.hot._disposeHandlers;
/******/ 			for(var j = 0; j < disposeHandlers.length; j++) {
/******/ 				var cb = disposeHandlers[j];
/******/ 				cb(data);
/******/ 			}
/******/ 			hotCurrentModuleData[moduleId] = data;
/******/ 	
/******/ 			// disable module (this disables requires from this module)
/******/ 			module.hot.active = false;
/******/ 	
/******/ 			// remove module from cache
/******/ 			delete installedModules[moduleId];
/******/ 	
/******/ 			// remove "parents" references from all children
/******/ 			for(var j = 0; j < module.children.length; j++) {
/******/ 				var child = installedModules[module.children[j]];
/******/ 				if(!child) continue;
/******/ 				var idx = child.parents.indexOf(moduleId);
/******/ 				if(idx >= 0) {
/******/ 					child.parents.splice(idx, 1);
/******/ 				}
/******/ 			}
/******/ 		}
/******/ 	
/******/ 		// remove outdated dependency from module children
/******/ 		for(var moduleId in outdatedDependencies) {
/******/ 			if(Object.prototype.hasOwnProperty.call(outdatedDependencies, moduleId)) {
/******/ 				var module = installedModules[moduleId];
/******/ 				var moduleOutdatedDependencies = outdatedDependencies[moduleId];
/******/ 				for(var j = 0; j < moduleOutdatedDependencies.length; j++) {
/******/ 					var dependency = moduleOutdatedDependencies[j];
/******/ 					var idx = module.children.indexOf(dependency);
/******/ 					if(idx >= 0) module.children.splice(idx, 1);
/******/ 				}
/******/ 			}
/******/ 		}
/******/ 	
/******/ 		// Not in "apply" phase
/******/ 		hotSetStatus("apply");
/******/ 	
/******/ 		hotCurrentHash = hotUpdateNewHash;
/******/ 	
/******/ 		// insert new code
/******/ 		for(var moduleId in appliedUpdate) {
/******/ 			if(Object.prototype.hasOwnProperty.call(appliedUpdate, moduleId)) {
/******/ 				modules[moduleId] = appliedUpdate[moduleId];
/******/ 			}
/******/ 		}
/******/ 	
/******/ 		// call accept handlers
/******/ 		var error = null;
/******/ 		for(var moduleId in outdatedDependencies) {
/******/ 			if(Object.prototype.hasOwnProperty.call(outdatedDependencies, moduleId)) {
/******/ 				var module = installedModules[moduleId];
/******/ 				var moduleOutdatedDependencies = outdatedDependencies[moduleId];
/******/ 				var callbacks = [];
/******/ 				for(var i = 0; i < moduleOutdatedDependencies.length; i++) {
/******/ 					var dependency = moduleOutdatedDependencies[i];
/******/ 					var cb = module.hot._acceptedDependencies[dependency];
/******/ 					if(callbacks.indexOf(cb) >= 0) continue;
/******/ 					callbacks.push(cb);
/******/ 				}
/******/ 				for(var i = 0; i < callbacks.length; i++) {
/******/ 					var cb = callbacks[i];
/******/ 					try {
/******/ 						cb(outdatedDependencies);
/******/ 					} catch(err) {
/******/ 						if(!error)
/******/ 							error = err;
/******/ 					}
/******/ 				}
/******/ 			}
/******/ 		}
/******/ 	
/******/ 		// Load self accepted modules
/******/ 		for(var i = 0; i < outdatedSelfAcceptedModules.length; i++) {
/******/ 			var item = outdatedSelfAcceptedModules[i];
/******/ 			var moduleId = item.module;
/******/ 			hotCurrentParents = [moduleId];
/******/ 			try {
/******/ 				__webpack_require__(moduleId);
/******/ 			} catch(err) {
/******/ 				if(typeof item.errorHandler === "function") {
/******/ 					try {
/******/ 						item.errorHandler(err);
/******/ 					} catch(err) {
/******/ 						if(!error)
/******/ 							error = err;
/******/ 					}
/******/ 				} else if(!error)
/******/ 					error = err;
/******/ 			}
/******/ 		}
/******/ 	
/******/ 		// handle errors in accept handlers and self accepted module load
/******/ 		if(error) {
/******/ 			hotSetStatus("fail");
/******/ 			return callback(error);
/******/ 		}
/******/ 	
/******/ 		hotSetStatus("idle");
/******/ 		callback(null, outdatedModules);
/******/ 	}

/******/ 	// The module cache
/******/ 	var installedModules = {};

/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {

/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;

/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false,
/******/ 			hot: hotCreateModule(moduleId),
/******/ 			parents: hotCurrentParents,
/******/ 			children: []
/******/ 		};

/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, hotCreateRequire(moduleId));

/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;

/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}


/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;

/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;

/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";

/******/ 	// __webpack_hash__
/******/ 	__webpack_require__.h = function() { return hotCurrentHash; };

/******/ 	// Load entry module and return exports
/******/ 	return hotCreateRequire(0)(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

	var _uiUiJs = __webpack_require__(1);

	var _uiUiJs2 = _interopRequireDefault(_uiUiJs);

	console.log('UI');
	window.UI = _uiUiJs2['default'];

/***/ },
/* 1 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, '__esModule', {
	  value: true
	});

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

	var _SnackBarSnackBarJs = __webpack_require__(2);

	var _SnackBarSnackBarJs2 = _interopRequireDefault(_SnackBarSnackBarJs);

	var _TableTableJs = __webpack_require__(8);

	var _TableTableJs2 = _interopRequireDefault(_TableTableJs);

	var _TabsTabsJs = __webpack_require__(11);

	var _TabsTabsJs2 = _interopRequireDefault(_TabsTabsJs);

	var _PopupPopupJs = __webpack_require__(14);

	var _PopupPopupJs2 = _interopRequireDefault(_PopupPopupJs);

	var _SettingsSettingsJs = __webpack_require__(17);

	var _SettingsSettingsJs2 = _interopRequireDefault(_SettingsSettingsJs);

	exports['default'] = { SnackBar: _SnackBarSnackBarJs2['default'], Popup: _PopupPopupJs2['default'], Settings: _SettingsSettingsJs2['default'] };
	module.exports = exports['default'];

/***/ },
/* 2 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, '__esModule', {
	    value: true
	});

	var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

	var _get = function get(_x, _x2, _x3) { var _again = true; _function: while (_again) { var object = _x, property = _x2, receiver = _x3; _again = false; if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { _x = parent; _x2 = property; _x3 = receiver; _again = true; desc = parent = undefined; continue _function; } } else if ('value' in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } } };

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

	function _inherits(subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

	var _xionXionJs = __webpack_require__(3);

	var _xionXionJs2 = _interopRequireDefault(_xionXionJs);

	__webpack_require__(4);

	var SnackBar = (function (_Xion) {
	    _inherits(SnackBar, _Xion);

	    function SnackBar() {
	        _classCallCheck(this, SnackBar);

	        _get(Object.getPrototypeOf(SnackBar.prototype), 'constructor', this).apply(this, arguments);
	    }

	    _createClass(SnackBar, [{
	        key: 'controller',
	        value: function controller(opts) {
	            opts = opts || {};
	            this.toast = null;
	            this.animationDuration = 300;
	            this.duration = 5000;
	            return this;
	        }
	    }, {
	        key: 'view',
	        value: function view() {
	            return [['div', { 'class': 'zpbx_snackbar' }, this.drawToast(this.toast)]];
	        }

	        /**
	         * Draw one toast. Maybe in the future
	         * this component will contains multi toast
	         * architecture
	         * @param toast
	         * @returns {*}
	         */
	    }, {
	        key: 'drawToast',
	        value: function drawToast(toast) {
	            if (!toast) return [];
	            return ['div', { 'class': 'zpbx_toast ' + toast.status + (toast.error ? ' error' : ''), onclick: this.close.bind(this) }, [['div', { 'class': 'zpbx_toast-close' }], toast.msg]];
	        }

	        /**
	         * Add new toast. Will override
	         * old if it still displays.
	         * @param msg
	         * @param error
	         */
	    }, {
	        key: 'addToast',
	        value: function addToast(msg, error) {
	            var _this = this;

	            // Toast settings
	            this.toast = this.toast || {};
	            this.toast.msg = msg;
	            this.toast.status = 'opening';
	            this.toast.error = error || false;
	            this.render();
	            // Lifecycle
	            setTimeout(function () {
	                _this.toast.status = '';_this.render();
	                // Auth closing
	                setTimeout(function () {
	                    _this.t = setTimeout(function () {
	                        _this.close();
	                    }, _this.duration);
	                }, _this.animationDuration);
	            });
	        }

	        /**
	         * Close
	         */
	    }, {
	        key: 'close',
	        value: function close() {
	            var _this2 = this;

	            // Prevent trying to close this toast when time will end
	            clearInterval(this.t);
	            // If there is no any toast go away
	            if (!this.toast) return;
	            this.toast.status = 'closing';this.render();
	            // Remove toast after animation will be done
	            setTimeout(function () {
	                _this2.toast = null;_this2.render();
	            }, this.animationDuration);
	        }
	    }]);

	    return SnackBar;
	})(_xionXionJs2['default']);

	exports['default'] = SnackBar;
	module.exports = exports['default'];

/***/ },
/* 3 */
/***/ function(module, exports) {

	'use strict';

	Object.defineProperty(exports, '__esModule', {
	    value: true
	});

	var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

	function forEach(list, f) {
	    for (var i = 0; i < list.length && !f(list[i], i++);) {}
	};

	var Xion = (function () {
	    function Xion(node, opts) {
	        _classCallCheck(this, Xion);

	        this.node = node;
	        this.storage = {};
	        this.cache = {};
	        this.state = {};
	        this.$ = {};
	        // Mixin controller
	        Object.assign(this, this.controller(opts || {}));
	    }

	    _createClass(Xion, [{
	        key: 'controller',
	        value: function controller() {
	            return this;
	        }
	    }, {
	        key: 'view',
	        value: function view() {
	            return [];
	        }
	    }, {
	        key: 'render',
	        value: function render() {
	            // if(this.shouldComponentUpdate()) return;
	            this.build(this.node, this.view(), this.cache);
	        }
	    }, {
	        key: 'build',
	        value: function build(element, data, cache) {
	            var diffData = [],
	                children = [];

	            cache.children = cache.children || [];

	            // check if first array item is string, update cache and attributes as appropriate
	            if (typeof data[0] === 'string') {
	                cache.node = cache.node || element.appendChild(document.createElement(data[0]));
	                data.shift();
	                var attributes = ({}).toString.call(data[0]) === "[object Object]" ? data.shift() : {};

	                if (cache.attrs) {
	                    forEach(Object.keys(cache.attrs), function (key) {
	                        if (!attributes[key]) {
	                            if (key == 'class' && cache.node.getAttribute('className')) cache.node.removeAttribute('className');else cache.node.removeAttribute(key);
	                            cache.attrs[key] = null;
	                            delete cache.attrs[key];
	                        };
	                    });
	                } else cache.attrs = {};
	                // TODO: DRY!
	                forEach(Object.keys(attributes), (function (key) {
	                    // Binding
	                    if (key.substring(0, 2) == 'on') {
	                        var fn = attributes[key];
	                        var evt = (function () {
	                            fn.apply(this, arguments);
	                            this.render();
	                        }).bind(this);
	                        cache.attrs[key] = cache.attrs[key] || Function;
	                        if (cache.attrs[key].toString() !== fn.toString()) {
	                            cache.attrs[key] = fn;
	                            cache.node[key] = evt;
	                        };
	                    } else {
	                        if (attributes[key] !== cache.attrs[key]) {
	                            // Class
	                            if (key == 'class' || key == 'className') cache.node.className = attributes[key];
	                            // Styles
	                            else if (key == 'style') {
	                                    forEach(Object.keys(attributes[key]), function (attr) {
	                                        cache.node.style[attr] = attributes[key][attr];
	                                    });
	                                } else {
	                                    if (key == 'id') this.$[attributes[key]] = cache.node;
	                                    //console.log(cache.node,key,attributes[key]);
	                                    //cache.node.setAttribute(key,attributes[key])
	                                    cache.node[key] = attributes[key];
	                                }
	                            cache.attrs[key] = attributes[key];
	                        };
	                    };
	                }).bind(this));
	            };

	            for (var i = 0, l = data.length; i < l; i++) {
	                // flatten non-element array one level

	                if (Array.isArray(data[i]) && Array.isArray(data[i][0])) {
	                    var frag = data.splice(i, 1)[0];
	                    for (var index = frag.length; index--;) data.splice(i, 0, frag[index]);
	                    i--;
	                    l = data.length;
	                    continue;
	                };
	            };

	            diffData = data.slice(0);

	            // loop through cached children and remove entries that do not exist in data
	            forEach(cache.children, function (child, index) {
	                var found, position;
	                for (var i = 0, l = diffData.length; i < l; i++) {
	                    if (typeof diffData[i] === 'string' && child.node.nodeValue && child.node.nodeValue == diffData[i] || Array.isArray(diffData[i]) && child.node.tagName && child.node.tagName.toLowerCase() == diffData[i][0]) {
	                        found = true;
	                        position = data.indexOf(diffData[i]);
	                        diffData.splice(i, 1);
	                        break;
	                    };
	                };
	                if (found) children[position] = child;else if (child.node) child.node.parentNode.removeChild(child.node);
	            });
	            cache.children = children;

	            // loop through data and update where cache entry not found
	            forEach(data, (function (child, index) {
	                cache.children[index] = cache.children[index] || {};
	                if (Array.isArray(child)) {
	                    if (cache.node && !cache.children[index].node) {
	                        cache.children[index] = { "node": document.createElement(child[0]) };
	                        cache.node.insertBefore(cache.children[index].node, cache.node.childNodes[index] ? cache.node.childNodes[index] : null);
	                    };
	                    this.build(cache.node || element, child, cache.children[index]);
	                } else if (typeof child === 'string') {
	                    if (!cache.children[index].node || cache.children[index].node.nodeValue !== child) {
	                        cache.children[index] = { "node": document.createTextNode(child) };
	                        if (cache.node && cache.node.tagName) cache.node.insertBefore(cache.children[index].node, cache.node.childNodes[index] ? cache.node.childNodes[index] : null);else element.insertBefore(cache.children[index].node, cache.node.childNodes[index] ? cache.node.childNodes[index] : null);
	                    };
	                } else if (child instanceof View) {
	                    child.node = cache.node || element;
	                    child.parent = this;
	                    child.render();
	                };
	            }).bind(this));
	        }
	    }]);

	    return Xion;
	})();

	exports['default'] = Xion;
	module.exports = exports['default'];

/***/ },
/* 4 */
/***/ function(module, exports, __webpack_require__) {

	// style-loader: Adds some css to the DOM by adding a <style> tag

	// load the styles
	var content = __webpack_require__(5);
	if(typeof content === 'string') content = [[module.id, content, '']];
	// add the styles to the DOM
	var update = __webpack_require__(7)(content, {});
	if(content.locals) module.exports = content.locals;
	// Hot Module Replacement
	if(true) {
		// When the styles change, update the <style> tags
		if(!content.locals) {
			module.hot.accept(5, function() {
				var newContent = __webpack_require__(5);
				if(typeof newContent === 'string') newContent = [[module.id, newContent, '']];
				update(newContent);
			});
		}
		// When the module is disposed, remove the <style> tags
		module.hot.dispose(function() { update(); });
	}

/***/ },
/* 5 */
/***/ function(module, exports, __webpack_require__) {

	exports = module.exports = __webpack_require__(6)();
	// imports


	// module
	exports.push([module.id, "\r\n/** TOAST **/\r\n.zpbx_toast {\r\n    width: 200px;\r\n    background: #32b3c4;\r\n    border-radius: 3px;\r\n    color: #fff;\r\n    text-align: center;\r\n    padding: 10px;\r\n    opacity: 0.8;\r\n    position: fixed;\r\n    left: 50%;\r\n    margin-left: -100px;\r\n    top: 50px;\r\n    transform: translateY(0px);\r\n    transition: transform .3s, opacity .3s;\r\n    opacity: 1;\r\n    cursor: pointer;\r\n}\r\n.zpbx_toast.error {\r\n    background: #eb324c;\r\n}\r\n.zpbx_toast.opening {\r\n    transform: translateY(-40px);\r\n    opacity: 0;\r\n    transition: transform .3s, opacity .3s;\r\n}\r\n.zpbx_toast.closing {\r\n    transform: translateY(40px);\r\n    opacity: 0;\r\n    transition: transform .3s, opacity .3s;\r\n}\r\n.zpbx_toast-close {\r\n    width: 10px;\r\n    height: 10px;\r\n    background: url(https://cdn3.iconfinder.com/data/icons/google-material-design-icons/48/ic_close_48px-128.png) no-repeat;\r\n    background-size: cover;\r\n    cursor: pointer;\r\n    position: absolute;\r\n    left: 100%;\r\n    margin-left: -15px;\r\n    top: 5px;\r\n}\r\n/** TOAST **/", ""]);

	// exports


/***/ },
/* 6 */
/***/ function(module, exports) {

	/*
		MIT License http://www.opensource.org/licenses/mit-license.php
		Author Tobias Koppers @sokra
	*/
	// css base code, injected by the css-loader
	"use strict";

	module.exports = function () {
		var list = [];

		// return the list of modules as css string
		list.toString = function toString() {
			var result = [];
			for (var i = 0; i < this.length; i++) {
				var item = this[i];
				if (item[2]) {
					result.push("@media " + item[2] + "{" + item[1] + "}");
				} else {
					result.push(item[1]);
				}
			}
			return result.join("");
		};

		// import a list of modules into the list
		list.i = function (modules, mediaQuery) {
			if (typeof modules === "string") modules = [[null, modules, ""]];
			var alreadyImportedModules = {};
			for (var i = 0; i < this.length; i++) {
				var id = this[i][0];
				if (typeof id === "number") alreadyImportedModules[id] = true;
			}
			for (i = 0; i < modules.length; i++) {
				var item = modules[i];
				// skip already imported module
				// this implementation is not 100% perfect for weird media query combinations
				//  when a module is imported multiple times with different media queries.
				//  I hope this will never occur (Hey this way we have smaller bundles)
				if (typeof item[0] !== "number" || !alreadyImportedModules[item[0]]) {
					if (mediaQuery && !item[2]) {
						item[2] = mediaQuery;
					} else if (mediaQuery) {
						item[2] = "(" + item[2] + ") and (" + mediaQuery + ")";
					}
					list.push(item);
				}
			}
		};
		return list;
	};

/***/ },
/* 7 */
/***/ function(module, exports, __webpack_require__) {

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
		if(false) {
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

	function createLinkElement(options) {
		var linkElement = document.createElement("link");
		linkElement.rel = "stylesheet";
		insertStyleElement(options, linkElement);
		return linkElement;
	}

	function addStyle(obj, options) {
		var styleElement, update, remove;

		if (options.singleton) {
			var styleIndex = singletonCounter++;
			styleElement = singletonElement || (singletonElement = createStyleElement(options));
			update = applyToSingletonTag.bind(null, styleElement, styleIndex, false);
			remove = applyToSingletonTag.bind(null, styleElement, styleIndex, true);
		} else if(obj.sourceMap &&
			typeof URL === "function" &&
			typeof URL.createObjectURL === "function" &&
			typeof URL.revokeObjectURL === "function" &&
			typeof Blob === "function" &&
			typeof btoa === "function") {
			styleElement = createLinkElement(options);
			update = updateLink.bind(null, styleElement);
			remove = function() {
				removeStyleElement(styleElement);
				if(styleElement.href)
					URL.revokeObjectURL(styleElement.href);
			};
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

		if(media) {
			styleElement.setAttribute("media", media)
		}

		if(styleElement.styleSheet) {
			styleElement.styleSheet.cssText = css;
		} else {
			while(styleElement.firstChild) {
				styleElement.removeChild(styleElement.firstChild);
			}
			styleElement.appendChild(document.createTextNode(css));
		}
	}

	function updateLink(linkElement, obj) {
		var css = obj.css;
		var media = obj.media;
		var sourceMap = obj.sourceMap;

		if(sourceMap) {
			// http://stackoverflow.com/a/26603875
			css += "\n/*# sourceMappingURL=data:application/json;base64," + btoa(unescape(encodeURIComponent(JSON.stringify(sourceMap)))) + " */";
		}

		var blob = new Blob([css], { type: "text/css" });

		var oldSrc = linkElement.href;

		linkElement.href = URL.createObjectURL(blob);

		if(oldSrc)
			URL.revokeObjectURL(oldSrc);
	}


/***/ },
/* 8 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, '__esModule', {
	    value: true
	});

	var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

	var _get = function get(_x, _x2, _x3) { var _again = true; _function: while (_again) { var object = _x, property = _x2, receiver = _x3; _again = false; if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { _x = parent; _x2 = property; _x3 = receiver; _again = true; desc = parent = undefined; continue _function; } } else if ('value' in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } } };

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

	function _inherits(subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

	var _xionXionJs = __webpack_require__(3);

	var _xionXionJs2 = _interopRequireDefault(_xionXionJs);

	__webpack_require__(9);

	var Table = (function (_Xion) {
	    _inherits(Table, _Xion);

	    function Table() {
	        _classCallCheck(this, Table);

	        _get(Object.getPrototypeOf(Table.prototype), 'constructor', this).apply(this, arguments);
	    }

	    _createClass(Table, [{
	        key: 'controller',
	        value: function controller(opts) {
	            this.head = opts.head || [];
	            this.body = opts.body || [];
	        }
	    }, {
	        key: 'view',
	        value: function view() {
	            return ['table', { 'class': 'zpbx_table' }, ['thead', this.drawHead()], ['tbody', this.drawBody()]];
	        }
	    }, {
	        key: 'drawHead',
	        value: function drawHead() {
	            return this.head.map(function (th) {
	                return ['th', th.text];
	            });
	        }
	    }, {
	        key: 'drawBody',
	        value: function drawBody() {
	            var _this = this;

	            return this.body.map(function (tr, k) {
	                return ['tr', tr.map(function (td, i) {
	                    if (td.prop && td.prop.onclick) td.prop.onclick = td.prop.onclick.bind(_this.parent, td, i, tr, k);
	                    return ['td', td.prop || {}, td.text];
	                })];
	            });
	        }
	    }]);

	    return Table;
	})(_xionXionJs2['default']);

	exports['default'] = Table;
	module.exports = exports['default'];

/***/ },
/* 9 */
/***/ function(module, exports, __webpack_require__) {

	// style-loader: Adds some css to the DOM by adding a <style> tag

	// load the styles
	var content = __webpack_require__(10);
	if(typeof content === 'string') content = [[module.id, content, '']];
	// add the styles to the DOM
	var update = __webpack_require__(7)(content, {});
	if(content.locals) module.exports = content.locals;
	// Hot Module Replacement
	if(true) {
		// When the styles change, update the <style> tags
		if(!content.locals) {
			module.hot.accept(10, function() {
				var newContent = __webpack_require__(10);
				if(typeof newContent === 'string') newContent = [[module.id, newContent, '']];
				update(newContent);
			});
		}
		// When the module is disposed, remove the <style> tags
		module.hot.dispose(function() { update(); });
	}

/***/ },
/* 10 */
/***/ function(module, exports, __webpack_require__) {

	exports = module.exports = __webpack_require__(6)();
	// imports


	// module
	exports.push([module.id, "/** TABLE **/\r\n.zpbx_table {\r\n    width: 100%;\r\n}\r\n.zpbx_table th {\r\n    text-align: left;\r\n    padding: 5px 0;\r\n}\r\n.zpbx_table td {\r\n    padding: 0 5px 0 0;\r\n}\r\n.zpbx_table .zpbx_table-select {\r\n    text-decoration: underline;\r\n    cursor: pointer;\r\n}\r\n.zpbx_table-link {\r\n    text-decoration: underline;\r\n    cursor: pointer;\r\n}", ""]);

	// exports


/***/ },
/* 11 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, '__esModule', {
	    value: true
	});

	var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

	var _get = function get(_x, _x2, _x3) { var _again = true; _function: while (_again) { var object = _x, property = _x2, receiver = _x3; _again = false; if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { _x = parent; _x2 = property; _x3 = receiver; _again = true; desc = parent = undefined; continue _function; } } else if ('value' in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } } };

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

	function _inherits(subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

	var _xionXionJs = __webpack_require__(3);

	var _xionXionJs2 = _interopRequireDefault(_xionXionJs);

	__webpack_require__(12);

	var Tabs = (function (_Xion) {
	    _inherits(Tabs, _Xion);

	    function Tabs() {
	        _classCallCheck(this, Tabs);

	        _get(Object.getPrototypeOf(Tabs.prototype), 'constructor', this).apply(this, arguments);
	    }

	    _createClass(Tabs, [{
	        key: 'controller',
	        value: function controller(opts) {
	            this.selected = 0;
	            this.tabs = opts.tabs || [];
	            this.onSelect = opts.onSelect || null;
	        }
	    }, {
	        key: 'view',
	        value: function view() {
	            return ['div', { 'class': 'zpbx_tabs' }, ['div', { 'class': 'zpbx_tabs-control' }, this.drawControl()], ['div', { 'class': 'zpbx_tabs-content' }, this.drawContent()]];
	        }
	    }, {
	        key: 'drawControl',
	        value: function drawControl() {
	            var _this = this;

	            return this.tabs.map(function (tab, i) {
	                return ['div', {
	                    'class': 'zpbx_tabs-control-item' + (_this.selected == i ? ' selected' : ''),
	                    onclick: _this.select.bind(_this, i)
	                }, tab.label, ['div', { 'class': 'zpbx_tabs-control-item-line' }]];
	            });
	        }
	    }, {
	        key: 'drawContent',
	        value: function drawContent() {
	            var _this2 = this;

	            return this.tabs.map(function (tab, i) {
	                return ['div', { 'class': 'zpbx_tabs-content-item' + (_this2.selected == i ? '' : ' hide') }, typeof tab.content == 'function' ? tab.content() : tab.content];
	            });
	        }
	    }, {
	        key: 'select',
	        value: function select(selected) {
	            if (selected == this.selected) return;
	            this.selected = selected;this.render();
	            if (this.onSelect) this.onSelect(this.selected);
	        }
	    }]);

	    return Tabs;
	})(_xionXionJs2['default']);

	exports['default'] = Tabs;
	module.exports = exports['default'];

/***/ },
/* 12 */
/***/ function(module, exports, __webpack_require__) {

	// style-loader: Adds some css to the DOM by adding a <style> tag

	// load the styles
	var content = __webpack_require__(13);
	if(typeof content === 'string') content = [[module.id, content, '']];
	// add the styles to the DOM
	var update = __webpack_require__(7)(content, {});
	if(content.locals) module.exports = content.locals;
	// Hot Module Replacement
	if(true) {
		// When the styles change, update the <style> tags
		if(!content.locals) {
			module.hot.accept(13, function() {
				var newContent = __webpack_require__(13);
				if(typeof newContent === 'string') newContent = [[module.id, newContent, '']];
				update(newContent);
			});
		}
		// When the module is disposed, remove the <style> tags
		module.hot.dispose(function() { update(); });
	}

/***/ },
/* 13 */
/***/ function(module, exports, __webpack_require__) {

	exports = module.exports = __webpack_require__(6)();
	// imports


	// module
	exports.push([module.id, ".zpbx_tabs {\r\n\r\n}\r\n.zpbx_tabs .zpbx_tabs-control {\r\n    padding: 10px 0 0 0;\r\n    border-bottom: 1px solid #ccc;\r\n}\r\n.zpbx_tabs .zpbx_tabs-control .zpbx_tabs-control-item {\r\n    position: relative;\r\n    display: inline-block;\r\n    cursor: pointer;\r\n    padding: 8px 20px;\r\n    border: 1px solid #ccc;\r\n    border-bottom: none;\r\n    border-radius: 3px 3px 0 0;\r\n    background: #f2f2f2;\r\n}\r\n.zpbx_tabs-control-item-line {\r\n    display: none;\r\n    position: absolute;\r\n    width: 100%;\r\n    height: 3px;\r\n    top: 100%;\r\n    left: 0;\r\n    background: #fff;\r\n}\r\n.zpbx_tabs .zpbx_tabs-control .zpbx_tabs-control-item.selected {\r\n    background: #fff;\r\n}\r\n.zpbx_tabs .zpbx_tabs-control .zpbx_tabs-control-item.selected .zpbx_tabs-control-item-line {\r\n    display: block;\r\n}\r\n.zpbx_tabs .zpbx_tabs-content {\r\n    width: 800px;\r\n    border: 1px solid #ccc;\r\n    border-top: none;\r\n}\r\n.zpbx_tabs .zpbx_tabs-content .zpbx_tabs-content-item {\r\n\r\n}\r\n.zpbx_tabs .zpbx_tabs-content .zpbx_tabs-content-item.hide {\r\n    display: none;\r\n}\r\n", ""]);

	// exports


/***/ },
/* 14 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, '__esModule', {
	    value: true
	});

	var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

	var _get = function get(_x, _x2, _x3) { var _again = true; _function: while (_again) { var object = _x, property = _x2, receiver = _x3; _again = false; if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { _x = parent; _x2 = property; _x3 = receiver; _again = true; desc = parent = undefined; continue _function; } } else if ('value' in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } } };

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

	function _inherits(subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

	var _xionXionJs = __webpack_require__(3);

	var _xionXionJs2 = _interopRequireDefault(_xionXionJs);

	__webpack_require__(15);

	var Popup = (function (_Xion) {
	    _inherits(Popup, _Xion);

	    function Popup() {
	        _classCallCheck(this, Popup);

	        _get(Object.getPrototypeOf(Popup.prototype), 'constructor', this).apply(this, arguments);
	    }

	    _createClass(Popup, [{
	        key: 'controller',
	        value: function controller(opts) {
	            this.opened = false;
	            this.content = opts.content || function () {
	                return [];
	            };
	            this.zIndex = opts.zIndex;
	            this.title = opts.title;
	        }
	    }, {
	        key: 'view',
	        value: function view() {
	            return ['div', { 'class': 'zpbx_popup' + (this.opened ? ' opened' : ''), id: 'popup' }, ['div', { 'class': 'zpbx_overlay', onclick: this.close, id: 'overlay', style: { zIndex: this.zIndex } }], ['div', { 'class': 'zpbx_window', id: 'window', style: { zIndex: this.zIndex } }, ['div', { 'class': 'zpbx_window-title' }, this.title], ['div', { 'class': 'zpbx_window-close', onclick: this.close }], ['div', { 'class': 'zpbx_window-content' }, typeof this.content == 'function' ? this.content() : this.content]]];
	        }

	        /**
	         * Close popup
	         */
	    }, {
	        key: 'close',
	        value: function close() {
	            this.opened = false;
	            this.render();
	        }

	        /**
	         * Toggle popup
	         */
	    }, {
	        key: 'toggle',
	        value: function toggle() {
	            var _this = this;

	            this.opened = !this.opened;
	            this.$.window.classList.toggle('animation');
	            this.render();
	            // Positions
	            setTimeout(function () {
	                _this.$.window.classList.toggle('animation');
	                _this.reposition();
	            });
	        }
	    }, {
	        key: 'reposition',
	        value: function reposition() {
	            var bound = this.$.window.getBoundingClientRect();
	            this.$.window.style.marginLeft = -(bound.width / 2) + 'px';
	            this.$.window.style.marginTop = -(bound.height / 2) + 'px';
	        }
	    }]);

	    return Popup;
	})(_xionXionJs2['default']);

	exports['default'] = Popup;
	module.exports = exports['default'];

/***/ },
/* 15 */
/***/ function(module, exports, __webpack_require__) {

	// style-loader: Adds some css to the DOM by adding a <style> tag

	// load the styles
	var content = __webpack_require__(16);
	if(typeof content === 'string') content = [[module.id, content, '']];
	// add the styles to the DOM
	var update = __webpack_require__(7)(content, {});
	if(content.locals) module.exports = content.locals;
	// Hot Module Replacement
	if(true) {
		// When the styles change, update the <style> tags
		if(!content.locals) {
			module.hot.accept(16, function() {
				var newContent = __webpack_require__(16);
				if(typeof newContent === 'string') newContent = [[module.id, newContent, '']];
				update(newContent);
			});
		}
		// When the module is disposed, remove the <style> tags
		module.hot.dispose(function() { update(); });
	}

/***/ },
/* 16 */
/***/ function(module, exports, __webpack_require__) {

	exports = module.exports = __webpack_require__(6)();
	// imports


	// module
	exports.push([module.id, "\r\n/** POPUP **/\r\n.zpbx_popup {\r\n\r\n}\r\n.zpbx_overlay {\r\n    position: fixed;\r\n    width: 100%;\r\n    height: 100%;\r\n    background: rgba(0,0,0,0.4);\r\n    display: none;\r\n    z-index: 100;\r\n}\r\n.zpbx_popup.opened .zpbx_overlay {\r\n    display: block;\r\n}\r\n.zpbx_window {\r\n    position: absolute;\r\n    display: inline-block;\r\n    padding: 20px;\r\n    background: #fff;\r\n    border-radius: 4px;\r\n    left: 50%;\r\n    top: 50%;\r\n    display: none;\r\n    opacity: 1;\r\n    transform: translateY(0px);\r\n    transition: opacity .4s,transform .2s;\r\n    z-index: 101;\r\n}\r\n.zpbx_popup.opened .zpbx_window {\r\n    display: block;\r\n}\r\n.zpbx_window.animation {\r\n    opacity: 0;\r\n    transform: translateY(-40px);\r\n    transition: opacity .4s,transform .2s;\r\n}\r\n.zpbx_window .zpbx_window-close {\r\n    width: 20px;\r\n    height: 20px;\r\n    background: url(https://cdn3.iconfinder.com/data/icons/google-material-design-icons/48/ic_close_48px-128.png) no-repeat;\r\n    background-size: cover;\r\n    cursor: pointer;\r\n    position: absolute;\r\n    left: 100%;\r\n    margin-left: -25px;\r\n    top: 5px;\r\n}\r\n.zpbx_window .zpbx_window-title {\r\n    font-family: \"Helvetica Neue\", Helvetica, Arial, sans-serif;\r\n    font-size: 18px;\r\n    font-weight: 700;\r\n    color: #09345d;\r\n    text-align: center;\r\n    text-transform: uppercase;\r\n    padding-bottom: 5px;\r\n}\r\n.zpbx_window .zpbx_window-content {\r\n    font-family: \"Helvetica Neue\", Helvetica, Arial, sans-serif;\r\n    font-size: 14px;\r\n    color: #09345d;\r\n}\r\n.zpbx_window .zpbx_window-content h2 {\r\n    font-size: 18px;\r\n    font-weight: 700;\r\n    color: #002041;\r\n}\r\n/** POPUP **/", ""]);

	// exports


/***/ },
/* 17 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, '__esModule', {
	    value: true
	});

	var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

	var _get = function get(_x, _x2, _x3) { var _again = true; _function: while (_again) { var object = _x, property = _x2, receiver = _x3; _again = false; if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { _x = parent; _x2 = property; _x3 = receiver; _again = true; desc = parent = undefined; continue _function; } } else if ('value' in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } } };

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

	function _inherits(subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

	var _xionXionJs = __webpack_require__(3);

	var _xionXionJs2 = _interopRequireDefault(_xionXionJs);

	var _TabsTabsJs = __webpack_require__(11);

	var _TabsTabsJs2 = _interopRequireDefault(_TabsTabsJs);

	var Settings = (function (_Xion) {
	    _inherits(Settings, _Xion);

	    function Settings() {
	        _classCallCheck(this, Settings);

	        _get(Object.getPrototypeOf(Settings.prototype), 'constructor', this).apply(this, arguments);
	    }

	    _createClass(Settings, [{
	        key: 'controller',
	        value: function controller() {}
	    }, {
	        key: 'view',
	        value: function view() {
	            return ['div', { 'class': 'zpbx_settings' }];
	        }
	    }]);

	    return Settings;
	})(_xionXionJs2['default']);

	exports['default'] = Settings;
	module.exports = exports['default'];

/***/ }
/******/ ]);