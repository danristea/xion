describe('Xion Test Suite',function(){

    describe('Xion Basics',function(){
        var xion = new Xion(document.body);
        it('Is there Xion?',function(){
            expect(Xion).to.be.a('Function');
        });
        it('Xion instance basic methods',function(){
            expect(xion.render).to.be.a('function');
            expect(xion.controller).to.be.a('function');
            expect(xion.view).to.be.a('function');
        });
        it('Xion instance basic properties',function(){
            expect(xion.node.tagName.toUpperCase()).to.equal('BODY');
            expect(xion.storage).to.be.an('Object');
            expect(xion.cache).to.be.an('Object');
            expect(xion.$).to.be.an('Object');
            expect(xion.previousState).to.equal(null);
            expect(xion.state).to.equal(null);
        });
    });

    var component = new Component(document.body,{items:['1','2','3']});
    describe('Xion component',function(){
        component.render();
        it('Xion rendering',function(){
            var root = document.querySelector('.xion_component');
            expect(root).to.have.class('xion_component');
            expect(component.node.querySelector('.xion_component')).to.have.class('xion_component');
            expect(root.querySelector('#list')).to.have.attribute('id','list');
            expect(root.querySelectorAll('.xion_component-list-item').length).to.equal(3)
        });
        it('Xion cache',function(){
            expect(component.cache).to.be.an('Object');
            expect(component.cache.node.tagName.toUpperCase()).to.equal('DIV');
            expect(component.cache.children).to.be.an('Array');
            expect(component.cache.attrs).to.be.an('Object');
        });
        it('Xion DOM links',function(){
            expect(component.$).to.be.an('Object');
            expect(component.$.list.tagName.toUpperCase()).to.equal('UL');
        });
        it('Xion events',function(){
            var item = component.$.list.querySelector('li');
            if(item.click) {
                item.click();
                var reflex = document.getElementById('click');
                expect(reflex).to.have.html('1');
            }
        });
        it('Xion state',function(){
            expect(component.state).to.be.an('Object');
            expect(component.state.v).to.equal(1);
            component.state.v = 1;
            component.render();
            expect(component.$.state).to.have.html('State param = 1');
            component.state.v = 2;
            component.render();
            expect(component.$.state).to.have.html('State param = 2');
        });
    });

    describe('Xion child components',function(){
        var child = new Child(null,{data:'Child data'},[XionMixin]);
        component.child = child;
        component.render();
        it('Xion child rendering',function(){
            var childRoot = component.$.root.querySelector('.xion_child');
            expect(childRoot).to.have.class('xion_child');
            expect(childRoot.querySelector('#data')).to.have.html('Child data');
        });
        it('Xion child parent link',function(){
            expect(component.child.parent instanceof component.constructor).to.be.true;
            expect(component.child.parent.click(1)).to.equal(1);
        });
    });

    describe('Xion mixins',function(){
        it('Mixin method',function(){
            expect(component.child.mixinMethod()).to.equal('mixinMethod');
        });
    });

});