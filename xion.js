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
        var diffData = [], children = [];

        cache.children = cache.children || [];

        // check if first array item is string, update cache and attributes as appropriate
        if (typeof data[0] === 'string') {
            cache.node = cache.node || element.appendChild(document.createElement(data[0]));
            data.shift();
            var attributes = {}.toString.call(data[0]) === "[object Object]" ? data.shift() : {};

            if (cache.attrs) {
                forEach(Object.keys(cache.attrs), function(key) {
                    if (!attributes[key]) {
                        if (key == 'class' && cache.node.getAttribute('className')) cache.node.removeAttribute('className');
			else cache.node.removeAttribute(key);
                        cache.attrs[key] = null;
                        delete cache.attrs[key];
                    };
                });
            } else cache.attrs = {};

            forEach(Object.keys(attributes), function(key) {
                if (key.substring(0, 2) == 'on') {
                    var fn = attributes[key];
                    var evt = function() {
                        fn.apply(this, arguments);
                        UI.redraw();
                    };
                    cache.attrs[key] = cache.attrs[key] || Function;
                    if (cache.attrs[key].toString() !== fn.toString()) {
                        cache.attrs[key] = fn;
                        cache.node[key] = evt;
                    };
                } else {
                    if (attributes[key] !== cache.attrs[key]) {
                        if (key == 'class' || key == 'className') cache.node.className = attributes[key];
                        else if (key == 'style') {
                            forEach(Object.keys(attributes[key]), function(attr) {
                                cache.node.style[attr] = attributes[key][attr];
                            })
                        } else cache.node[key] = attributes[key];
                        cache.attrs[key] = attributes[key];
                    };
                };
            });
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
        forEach(cache.children, function(child, index) {
            var found, position;
            for (var i = 0, l = diffData.length; i < l; i++) {
                if ((typeof diffData[i] === 'string' && child.node.nodeValue && child.node.nodeValue == diffData[i]) ||
                    Array.isArray(diffData[i]) && child.node.tagName && child.node.tagName.toLowerCase() == diffData[i][0]) {
                    found = true;
                    position = data.indexOf(diffData[i]);
                    diffData.splice(i, 1);
                    break;
                };
            };
            if (found) children[position] = child;
            else child.node.parentNode.removeChild(child.node);
        })
        cache.children = children;

        // loop through data and update where cache entry not found
        forEach(data, function(child, index) {
            cache.children[index] = cache.children[index] || {};
            if (Array.isArray(child)) {
                if (cache.node && !cache.children[index].node) {
                    cache.children[index] = {"node": document.createElement(child[0])};
                    cache.node.insertBefore(cache.children[index].node, cache.node.childNodes[index] ? cache.node.childNodes[index] : null);
                };
                build(cache.node || element, child, cache.children[index]);
            } else if (typeof child === 'string') {
                if (!cache.children[index].node || cache.children[index].node.nodeValue !== child) {
                    cache.children[index] = {"node": document.createTextNode(child)};
                    if (cache.node && cache.node.tagName) cache.node.insertBefore(cache.children[index].node, cache.node.childNodes[index] ? cache.node.childNodes[index] : null);
                    else element.insertBefore(cache.children[index].node, cache.node.childNodes[index] ? cache.node.childNodes[index] : null);
                };
            };
        });
    };
    window.UI = window.UI || UI;
}(typeof window !== 'undefined' ? window : this));
