var Child = function(node,opts,mixins){
    Xion.call(this,node,opts,mixins)
};
Child.prototype = Object.create(Xion.prototype);

Child.prototype.controller = function(opts) {
    this.opts = opts;
}

Child.prototype.view = function(){
    return ['div',{class:'xion_child'},
        ['span',{id:'data'},this.opts.data],
    ];
}