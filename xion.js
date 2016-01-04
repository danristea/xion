(function(window) {
    'use strict';
    var version = 'v0.0.1'
    var UI = {};

    function forEach(list, f) {
        for (var i = 0; i < list.length && !f(list[i], i++);) {}
    };

    UI.mount = function(module, element, options) {
        var cache = {};
        var ctrl = new module.controller(options);
        UI.redraw = function() {
            build(element, module.view(ctrl), cache);
        };
        UI.redraw();
    };

    // recursive function that builds DOM structure
    // it works by comparing `data` with `cache`, and applies the diff to `element`
    //
    // @param {Element} element - The parent DOM element of the structure
    // @param {Array} data - JsonML data that is converted to DOM and built on `element`
    // @param {Object} cache - Object tree used to keep state in order to minimize inserts/removes

    function build(element, data, cache) {
        var node, id, className, tmp;
	var i = 0, tmpData = [], diffData = [], children = [];

        cache.children = cache.children || [];

        // check if first array item is string, update cache and any sugar attributes as appropriate
        if (typeof data[0] === 'string') {
            if (cache.node) node = cache.node;
            else cache.node = node = element.appendChild(document.createElement(data[0].match(/^\w+/)[0]));
            if (tmp = data[0].match(/#([\w\-]+)/)) {
                id = tmp[1];
                if (id && id !== node.id) node.id = id;
            } else if (node.id) node.removeAttribute('id');
            if (tmp = data[0].match(/\.[\w\-]+/g)) {
                className = tmp.join(' ').replace(/\./g, '');
                if (className && className !== node.className) node.className = className;
            } else if (node.className) node.removeAttribute('className');
            i = 1;
        };

        for (var l = data.length; i < l; i++) {
		
	    // flatten non-element array one level
            if (Array.isArray(data[i]) && Array.isArray(data[i][0])) {
                var frag = data.splice(i, 1)[0];
                for (var index = frag.length; index--;) data.splice(i, 0, frag[index]);
                i--;
                l = data.length;
                continue;
            };

            // object found, process attributes and build children array 
            if ({}.toString.call(data[i]) === "[object Object]") {
			    var attributes = data[i];
                if (cache.attrs) {
                    forEach(Object.keys(cache.attrs), function(key) {
                        if (!cache.attrs[key]) {
                            cache.attrs[key] = null;
                            delete cache.attrs[key];
                        };
                    });
                };
                forEach(Object.keys(attributes), function(key) {
                    if (key.substring(0, 2) == 'on') {
                        cache.events = cache.events || {};
                        var func = attributes[key];
                        var evt = function() {
                            func.apply(this, arguments);
                            UI.redraw();
                        };
                        cache.events[key] = cache.events[key] || Function;
                        if (cache.events[key].toString() !== func.toString()) {
                            cache.events[key] = func;
                            cache.node[key] = evt;
                        };
                    } else {
                        cache.attrs = cache.attrs || {};
                        if (attributes[key] !== cache.attrs[key]) {
                            if (key == 'class' || key == 'className') node.className = attributes[key];
			    else if (key == 'style') {
				forEach(Object.keys(attributes[key]), function(attr) {
				    node.style[attr] = attributes[key][attr];
				})
			    } else node[key] = attributes[key];
                            cache.attrs[key] = attributes[key];
                        };
                    };
                });
            } else tmpData.push(data[i]);
        };

        diffData = tmpData.slice(0);

        // loop through cached children and remove entries that do not exist in data
        forEach(cache.children, function(child, index) {
            var found, position;
            for (var i = 0, l = diffData.length; i < l; i++) {
                if ((typeof diffData[i] === 'string' && child.node.nodeValue && child.node.nodeValue == diffData[i]) ||
                    Array.isArray(diffData[i]) && child.node.tagName && child.node.tagName.toLowerCase() == diffData[i][0].match(/^\w+/)[0]) {
                    found = true;
                    position = tmpData.indexOf(diffData[i]);
                    diffData.splice(i, 1);
                    break;
                };
            };
            if (found) children[position] = child;
            else child.node.parentNode.removeChild(child.node);
        })
        cache.children = children;

        // loop through data and update where cache entry not found
        forEach(tmpData, function(child, index) {
            cache.children[index] = cache.children[index] || {};
            if (Array.isArray(child)) {
                if (node && !cache.children[index].node) {
                    var n = document.createElement(child[0].match(/^\w+/)[0]);
                    cache.children[index] = { "node": n };
		    cache.node.insertBefore(n, cache.node.childNodes[index] ? cache.node.childNodes[index] : null);
                };
                build(cache.node || element, child, cache.children[index], index);
            } else if (typeof child === 'string') {

                if (!cache.children[index].node || cache.children[index].node.nodeValue !== child) {

                    var n = document.createTextNode(child);
                    cache.children[index] = { "node": n };

		    if (node && node.tagName) cache.node.insertBefore(n, cache.node.childNodes[index] ? cache.node.childNodes[index] : null);
                    else element.insertBefore(n, cache.node.childNodes[index] ? cache.node.childNodes[index] : null);
                };
            };
        });
    };
    window.UI = window.UI || UI;
}(typeof window !== 'undefined' ? window : this));
