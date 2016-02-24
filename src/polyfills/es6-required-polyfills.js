(function(global) {
    var defineProperty = Object.defineProperty;
    var counter = Date.now() % 1e9;
    var WeakMap = function(data) {
        var i, s;
        this.name = '__st' + (Math.random() * 1e9 >>> 0) + (counter++ + '__');
        // If data is iterable (indicated by presence of a forEach method), pre-populate the map
        data && data.forEach && data.forEach(function (item) {
            this.set.apply(this, item);
        }, this);
    };
    WeakMap.prototype["set"] = function(key, value) {
        if (typeof key !== 'object' && typeof key !== 'function')
            throw new TypeError('Invalid value used as weak map key');

        var entry = key[this.name];
        if (entry && entry[0] === key)
            entry[1] = value;
        else
            defineProperty(key, this.name, {value: [key, value], writable: true});
        return this;
    };
    WeakMap.prototype["get"] = function(key) {
        var entry;
        return (entry = key[this.name]) && entry[0] === key ?
            entry[1] : undefined;
    };
    WeakMap.prototype["delete"] = function(key) {
        var entry = key[this.name];
        if (!entry || entry[0] !== key) return false;
        entry[0] = entry[1] = undefined;
        return true;
    };
    WeakMap.prototype["has"] = function(key) {
        var entry = key[this.name];
        if (!entry) return false;
        return entry[0] === key;
    };

    global.WeakMap = WeakMap;
})(window);
Object.assign = function assign(target, source) {
    for (var index = 1, key, src; index < arguments.length; ++index) {
        src = arguments[index];
        for (key in src) {
            if (Object.prototype.hasOwnProperty.call(src, key)) {
                target[key] = src[key];
            }
        }
    }
    return target;
};