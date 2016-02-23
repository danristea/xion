var Component = function(node,opts,mixins){
    Xion.call(this,node,opts,mixins)
};
Component.prototype = Object.create(Xion.prototype);

Component.prototype.controller = function(opts) {
    this.opts = opts;
    this.state = {
        v: 1
    }
}

Component.prototype.view = function(){
    return ['div',{class:'xion_component',id:'root'},
        ['span',{id:'state'},'State param = '+this.state.v],
        ['ul',{id:'list',class:'xion_component-list'}, this.drawChild()],
        this.child||null
    ];
}

Component.prototype.drawChild = function(){
    return this.opts.items.map(function(item,i){
       return ['li',{class:'xion_component-list-item',onclick:this.click.bind(this,item,i)},item];
    }.bind(this));
}

Component.prototype.click = function(item,i){
    var div = document.createElement('div');
    div.setAttribute('id','click');
    div.innerHTML = item;
    document.body.appendChild(div);
    return item;
}

Component.prototype.shouldRender = function(previousState) {
    if(!previousState) return true;
    return previousState.v!=this.state.v;
}