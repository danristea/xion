/**
 * Deep clone
 * @param src - source object
 * @returns {*}
 */
export default function clone(src) {
    function mixin(dest, source, copyFunc) {
        var name, s, i, empty = {};
        for(name in source){
            s = source[name];
            if(!(name in dest) || (dest[name] !== s && (!(name in empty) || empty[name] !== s))){
                dest[name] = copyFunc ? copyFunc(s) : s;
            }
        }
        return dest;
    }
    if(!src || typeof src != "object" || Object.prototype.toString.call(src) === "[object Function]"){
        return src;
    }
    if(src.nodeType && "cloneNode" in src){
        return src.cloneNode(true); // Node
    }
    if(src instanceof Date){
        return new Date(src.getTime());
    }
    if(src instanceof RegExp){
        return new RegExp(src);
    }
    var r, i, l;
    if(src instanceof Array){
        r = [];
        for(i = 0, l = src.length; i < l; ++i){
            if(i in src){
                r.push(clone(src[i]));
            }
        }
    }else{
        r = src.constructor ? new src.constructor() : {};
    }
    return mixin(r, src,clone);
}
