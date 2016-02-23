import JsonMLDriver from './JsonMLDriver.js';
import clone from './clone.js';
var driver = new WeakMap();
/**
 * Xion is simple JavaScript class helping to create
 * component like user interfaces. It's easy to learn. It doesn't
 * contain hard syntax or extensive core methods. You should know JS,
 * Driver syntax and this.render method only.
 */
class Xion {
    constructor(node,opts,mixins) {
        // Root node using for HTML rendering
        this.node = node;
        // Like a model
        this.storage = {};
        // To prevent permanent redrawing of DOM
        this.cache = {};
        // Provide DOM links through id attribute into markup
        this.$ = {};
        // States
        this.previousState = null;
        this.state = null;
        // Mixin controller to exclude using constructor in components
        Object.assign(this.constructor.prototype,this.controller(opts||{}));
        // Private
        driver.set(this,JsonMLDriver);
        // Mixins
        if(!Array.isArray(mixins)) return;
        mixins.forEach((mixin)=>{
            if({}.toString.call(mixin) !== "[object Object]" ) return;
            Object.assign(this.constructor.prototype,mixin);
        });
    }
    /**
     * Controller. In fact controller is mixin for basic
     * constructor. This was made to prevent using constructor
     * into child component. Besides somebody could forget that he\she
     * need to setup super(node,options).
     * @returns {Xion}
     */
    controller(opts){
        return this;
    }
    /**
     * View. Must return data for selected driver. View method
     * should be invoked in context of current instance.
     * @returns {Array}
     */
    view() {
        return [];
    }
    /**
     * Update view. And children views too.
     */
    render() {
        if(this.shouldRender && typeof this.shouldRender==='function' && !this.shouldRender(this.previousState)) return;
        if(this.state) this.previousState = clone(this.state);
        driver.get(this).build.call(this,this.node,this.view(),this.cache);
    }
}
export default Xion;