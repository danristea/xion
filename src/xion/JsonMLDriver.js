import Xion from './Xion.js';
/**
 * JsonML Driver for Xion.
 * Learn more about JsonML here - http://www.jsonml.org/
 * Briefly - ['tag-name',{attr:attrValue,...},[children]|textContent]
 * @type {{}}
 */
let JsonMLDriver = {
    /**
     * Basic method. Will be called recursively because of
     * JsonML's structure.
     */
    build(node, data, cache) {
        JsonMLDriver.createTag.call(this,node,data,cache);
        JsonMLDriver.flattenArray(data);
        JsonMLDriver.cleanCache(data,cache);
        JsonMLDriver.createChildren.call(this,node,data,cache);
    },
    /**
     * Create tag. First item of responded array
     * should be string, more precisely - name of tag. JsonMl supports
     * a couple of possible variants of element sequence:
     *  - [tagName,attrs,children]
     *  - [tagName,attrs]
     *  - [tagName,children]
     *  - [tagName]
     *  - String
     */
    createTag(node,data,cache) {
        if (typeof data[0] === 'string') {
            // Create node. Yes i know that we can create some real tag names checking. But i won't.
            cache.node = cache.node || node.appendChild(document.createElement(data[0]));
            data.shift();
            let attributes = {}.toString.call(data[0]) === "[object Object]" ? data.shift() : {};
            // Remove attributes which was removed from data but still exist into cache.
            if (cache.attrs) {
                Object.keys(cache.attrs).forEach((key)=>{
                    // This key doesn't meet in data attributes
                    if (!attributes[key]) {
                        if (key == 'class' && cache.node.getAttribute('className')) cache.node.removeAttribute('className');
                        else cache.node.removeAttribute(key);
                        delete cache.attrs[key];
                    };
                });
            } else cache.attrs = {};
            JsonMLDriver.workWithAttributes.call(this,attributes,cache);
        }
    },
    /**
     * Bind function if was added on* attribute.
     * setAttributes in another case.
     */
    workWithAttributes(attributes,cache){
        Object.keys(attributes).forEach((key)=>{
            // Events
            if (key.substring(0, 2) == 'on') {
                let fn = attributes[key];
                if(typeof fn!=='function') return;
                // If there is no any function binded to cache
                cache.attrs[key] = cache.attrs[key] || Function;
                // If cached function is different update cache.
                if (cache.attrs[key] !== fn) {
                    cache.attrs[key] = fn;
                    cache.node[key] = fn.bind(this);
                }
            } else {
                if (attributes[key] !== cache.attrs[key]) {
                    // Class
                    if (key == 'class' || key == 'className') cache.node.className = attributes[key];
                    // Styles
                    else if (key == 'style') {
                        Object.keys(attributes[key]).forEach(function(attr) {
                            cache.node.style[attr] = attributes[key][attr];
                        })
                    } else {
                        // Provides real DOM links through id attribute
                        if(key=='id') this.$[attributes [key]] = cache.node;
                        cache.node[key] = attributes[key];
                    }
                    // Store attributes
                    cache.attrs[key] = attributes[key];
                }
            }
        });
    },
    /**
     * Flatten array. Changes array structure
     * appropriate JsonML syntax.
     */
    flattenArray(data) {
        for (let i = 0, l = data.length; i < l; i++) {
            if (Array.isArray(data[i]) && Array.isArray(data[i][0])) {
                let frag = data.splice(i, 1)[0];
                for (let index = frag.length; index--;) data.splice(i, 0, frag[index]);
                i--;
                l = data.length;
                continue;
            }
        }
    },
    /**
     * Clean cache. If data was changed we have to
     * change cache as well. Old cached nodes and attributes
     * must be destroyed.
     */
    cleanCache(data,cache) {
        cache.children = cache.children || [];
        let diffData = [], children = [];
        diffData = data.slice(0);
        // Go through cache children
        cache.children.forEach((child, index)=>{
            let found, position;
            // Data difference
            for (let i = 0, l = diffData.length; i < l; i++) {
                if ((typeof diffData[i] === 'string' && child.node.nodeValue && child.node.nodeValue == diffData[i]) ||
                    Array.isArray(diffData[i]) && child.node.tagName && child.node.tagName.toLowerCase() == diffData[i][0]) {
                    found = true;
                    position = data.indexOf(diffData[i]);
                    diffData.splice(i, 1);
                    break;
                }
            }
            // If child was found - update it, else - remove
            if (found) children[position] = child;
            else if(child.node) child.node.parentNode.removeChild(child.node);
        });
        // Save changed child
        cache.children = children;
    },
    /**
     * JsonML has a tree structure. In order to this we
     * have to create children such like this how was made
     * root element.
     */
    createChildren(node,data,cache) {
        // Go through each child
        data.forEach((child, index)=>{
            cache.children[index] = cache.children[index] || {};
            // If it's Array we have to build new element
            if (Array.isArray(child)) {
                // Create node at first
                if (cache.node && !cache.children[index].node) {
                    cache.children[index] = {"node": document.createElement(child[0])};
                    cache.node.insertBefore(cache.children[index].node, cache.node.childNodes[index] ? cache.node.childNodes[index] : null);
                }
                // Build children
                JsonMLDriver.build.call(this,cache.node || node, child, cache.children[index]);
            }
            // If it's string we have to create new TextNode
            else if (typeof child === 'string') {
                if (!cache.children[index].node || cache.children[index].node.nodeValue !== child) {
                    cache.children[index] = {"node": document.createTextNode(child)};
                    if (cache.node && cache.node.tagName) {
                        cache.node.insertBefore(cache.children[index].node, cache.node.childNodes[index] ? cache.node.childNodes[index] : null);
                    }
                    else {
                        node.insertBefore(cache.children[index].node, cache.node.childNodes[index] ? cache.node.childNodes[index] : null);
                    }
                }
            }
            // If it's component we have to setup root node and render it.
            else if(child instanceof Xion) {
                child.node = cache.node || node;
                child.parent = this;
                child.render();
            }
        });
    }
}
export default JsonMLDriver;