function forEach(list, f) {
    for (var i = 0; i < list.length && !f(list[i], i++);) {}
};

class Xion {
    constructor(node,opts) {
        this.node = node;
        this.storage = {};
        this.cache = {};
        this.state = {};
        this.$ = {};
        // Mixin controller
        Object.assign(this,this.controller(opts||{}));
    }
    controller(){
        return this;
    }
    view() {
        return [];
    }
    render() {
        // if(this.shouldComponentUpdate()) return;
        this.build(this.node,this.view(),this.cache);
    }
    build(element, data, cache) {
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
            // TODO: DRY!
            forEach(Object.keys(attributes), function(key) {
                 // Binding
                if (key.substring(0, 2) == 'on') {
                    var fn = attributes[key];
                    var evt = function() {
                        fn.apply(this, arguments);
                        this.render()
                    }.bind(this);
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
                            forEach(Object.keys(attributes[key]), function(attr) {
                                cache.node.style[attr] = attributes[key][attr];
                            })
                        } else {
                            if(key=='id') this.$[attributes [key]] = cache.node;
                            //console.log(cache.node,key,attributes[key]);
                            //cache.node.setAttribute(key,attributes[key])
                            cache.node[key] = attributes[key];
                        }
                        cache.attrs[key] = attributes[key];
                    };
                };
            }.bind(this));
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
            else if(child.node) child.node.parentNode.removeChild(child.node);
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
                this.build(cache.node || element, child, cache.children[index]);
            } else if (typeof child === 'string') {
                if (!cache.children[index].node || cache.children[index].node.nodeValue !== child) {
                    cache.children[index] = {"node": document.createTextNode(child)};
                    if (cache.node && cache.node.tagName) cache.node.insertBefore(cache.children[index].node, cache.node.childNodes[index] ? cache.node.childNodes[index] : null);
                    else element.insertBefore(cache.children[index].node, cache.node.childNodes[index] ? cache.node.childNodes[index] : null);
                };
            } else if(child instanceof Xion) {
                child.node = cache.node || element;
                child.parent = this;
                child.render();
            };
        }.bind(this));
    };
}
export default Xion;