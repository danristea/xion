# Xion

Xion is a lightweight (4.6kb) client-side library (in fact it's class) for building component like user interfaces. The main purpose of Xion is creating UI components fast, without any difficult agreements regarding library methods, naming, hard syntax, etc. All what you have to know that you will be able to use Xion are JavaScript and [JsonML](http://www.jsonml.org/) only. Xion can be used like a constituent part of your custom library which has to create some interfaces. 

##Download Xion.

```
npm install xion
git clone https://github.com/kysonic/xion
```

##Quick example.

This project uses ES6 via babel and webpack and it's reason why all of presented examples will be written using ES6 classes. Besides it's more convinient. If you don't want to use ES6 go [here](#xion-without-es6-classes).

Todo.js 

```
import styles from './Todo.css';
import Xion from '../../xion/Xion.js';

class Todo extends Xion {
    controller(opts) {
        this.items = opts.items||[];
        return this;
    }
    view() {
        return ['div',{class:'xe_todo'},
            ['ul',{class:'xe_todo-items'},this.drawItems()],
            ['input',{class:'xe_todo-input',type:'text',placeholder:'Enter item title',id:'input'}],
            ['button',{class:'xe_todo-button',onclick:this.add},'ADD #'+(parseInt(this.items.length)+1)]
        ]
    }
    drawItems() {
        return this.items.map((item,i)=>{
            return ['li',{class:'xe_todo-item'},
                ['span',{class:'xe_todo-item-title'},item.title],
                ['div',{class:'xe_todo-item-remove',onclick:this.remove.bind(this,i)}]
            ];
        });
    }
    add() {
        if(!this.$.input.value) return;
        this.items.push({title:this.$.input.value});
        this.render();
        this.$.input.value = '';
    }
    remove(i) {
        this.items.splice(i,1);
        this.render();
    }
}

export default Todo;
```

main.js 

```
import Todo from '../components/Todo.js';

var todo = new Todo(document.body,{items:[{title:'First task'}]});
todo.render(); 

```

Check this [example](https://github.com/kysonic/xion/tree/master/src/example/Todo). 

##Basic concepts.

Following text will consist of descriptions of basic ideas which largely was stolen from React, Riot, Polymer, etc. 

### Instantiation.

```
import UI from 'xion.ui.js'; 

var popup = new UI.Popup(document.body,{title:'My Popup!'},[Mixin]);
```
First paramater is **DOM node** component will be rendered in. Second is **options** transmited to component instance as defaults. Third is **Array of [mixins](#mixins-and-components-inheritance)** using in the *component instance*.

By default the component won't render. You should invoke render() method manually. 

```
popup.render(); 
```
It was made because of one of basic Xion concepts - full control. There is no any unexpected, uncontrolled updating. You and only you will decide when your component should update its view. 

### Structure. 

Any Xion component should be a **class**. There is only one required method which must be included into the class - **view()**. Otherwise your component will render great emptiness. The view method has to return [JsonML](http://www.jsonml.org/). 

```
import Xion from 'xion';

class Component extends Xion {
    view() {
        return ['div',{class:'xion_component'},'Component Here!'];
    }
}

export default Component;
```

JsonML is markup language allowing you to build HTML. You can learn it using links above, but briefly it can be desribed like that: 

```
['tag-name',{attr:attrValue,...},[children]|textContent]
```

Xion extends the concept a little bit to provide nested components: 

```
['tag-name',{attr:attrValue,...},[children]|textContent|xionComponent]
```

That means you can build nested component structure for your interfaces, we will speak about child compponents [below](#child-components).

Any Xion component can contain **contoller()** method. In fact the controller is mixin transmiting options and mixins bypassing constructor. It was made because otherwise you would have to transmit all required parameters in component constructor that could be less convinient than described approach.

Component.js: 

```
import Xion from 'xion';

class Component extends Xion {
    controller(opts) {
        this.items = opts.items; // Default items transmited trhough Component constructor. 
    }
}

export default Component;
```

main.js 

```
import Component from './components/Component.js';
var component = new Component(document.body,{items:[...]}); // items here
component.render(); 
```

### DOM links. 

Xion has simple mechanism helping you retrieve DOM nodes from your component. For this you should to set id attribute to some node into your JsonML markup and get it through calling *this.$['nodeID']*.

Component.js 

```
import Xion from 'xion';

class Component extends Xion {
    view() {
        return ['div',{class:'xion_component',id:'root'},
            ['h1',{class:'xion_component-title',id:'title'},'Component here!']
        ];
    }
}

export default Component;
```

main.js 

```
import Component from './components/Component.js';

var component = new Component(document.body);
console.log(component.$); // {} - There are no links yet
component.render(); 
console.log(component.$); // {root: <div .../>,title: <h1 .../>}
```

### Events.

Xion doesn't have any special syntax to define event listeners. In this case you can use simple HTML attributes like: onclick,oninput,onchange, etc. 

```
import Xion from 'xion';

class Component extends Xion {
    view() {
        return ['div',{class:'xion_component',id:'root'},
            ['button',{class:'xion_component-button',id:'button',onclick:this.click},'Click me']
        ];
    }
    click() {
        console.log('Button was clicked.');
    }
}

export default Component;
```

###Child components.

One of basic concept providing comfortable interface development - nested components. In Xion it was implemented pretty easy - you have to put child component in JsonML markup of your parent component. 

Child.js

```
import Xion from 'xion';

class Child extends Xion {
    view() {
        return ['div',{class:'xion_child',id:'root'},'Child markup'];
    }
    childMethod() {
        this.parent.parentMethod();
    }
}

export default Child;
```

Component.js

```
import Xion from 'xion';
import Child from '../Child.js';

class Component extends Xion {
    controller() {
        this.child = new Child(null,{});
    }
    view() {
        return ['div',{class:'xion_component',id:'root'},this.child];
    }
    parentMethod() {
        console.log('Parent method was invoked from child component.');
    }
}

export default Child;
```
Any child component will contain special property - parent - link on parent instance. If you will call render method of parent component the child component *will be updated as well*, but reverse statement is wrong. Also you can update only child component's view calling 

```
this.child.render();
```

### States.

Like React Xion has states, but there is no necessity to use this.setState to update view. View can be updated only through this.render() method. States can be used to prevent useless view updating. If you want to use states in your component you have to define **this.state** property in your component class, otherwise state procudures won't be used.   

```
import Xion from 'xion';

class Component extends Xion {
    controller() {
        this.state = {v:1}
    }
    view() {
        return ['div',{class:'xion_component',id:'root'},'V='+this.state.v];
    }
}
```

To define whether your component should update you have to include **shouldRender()** method in your component class. If the method will return true - component view will be updated, else - nope. 

```
import Xion from 'xion';

class Component extends Xion {
    controller() {
        this.state = {v:1}
    }
    view() {
        return ['div',{class:'xion_component',id:'root'},'V='+this.state.v];
    }
    shouldRender(previousState) {
        if(!previousState) return true; // If state wasn't defined - render
        return previousState.v!=this.state.v; 
    }
}
```

### Mixins and components inheritance. 

If you want to extend functionality of your *certain component instance* you have to use mixins. Mixins it is objects containing some methods wich will be mixed with the component instance. To do this you have to add mixin(-s) like a third paramter of component constructor: 

XionMixin.js

```
export default {
    mixinMethod() {
        console.log('Mixin method was called.');
    }
}
```

main.js 

```
import UI from 'xion.ui.js'; 
import XionMixin from './XionMixin.js';

var popup = new UI.Popup(document.body,{title:'My Popup!'},[XionMixin]);
popup.render();
popup.mixinMethod(); // Mixin method was called.
```

If you want to make some component based on another component you can just extend your component class. 

MyPopup.js 

```
import UI from 'xion.ui.js'; 

class MyPopup extends UI.Popup {
    changePopupTitle(title) {
        this.title = title;
        this.render(); 
    }
}

export default MyPopup;
```

###Caching. 

To prevent permanent full DOM reconstructing Xion uses caching. All of Xion components have *this.cache* property which consists current DOM states. For instance, this.cache.node - root node, this.cache.attrs - its attributes, this.cache.children - its children. When render() method will be called, component cache system will check differences between new view markup and current rendered DOM and resolve it properly. 

Anyway Xion wasn't made like system for building big data interfaces. There are no any collection manipulation methods like this.push('items',{...}) in Polymer. 

## Xion without ES6 classes. 

If you want to use Xion without any transpilers you can load Xion directly and write: 

```
<script src="../build/xion.min.js"></script>

<script>
    var Component = function(node,opts,mixins){
        Xion.call(this,node,opts,mixins)
    };
    Component.prototype = Object.create(Xion.prototype);
    
    Component.prototype.view = function() {
        return ['div',{class:'xion_component',id:'root'},'Component built without es6 classes.'];
    }
    
    var component = new Component(document.body);
    component.render(); 
</script>
```
You can find more examples into [tests](https://github.com/kysonic/xion/tree/master/tests). 

##Bundles. 

Build folder of this project contains a few bundles:

| Bundle name            | Description                |
|------------------------|----------------------------|
| xion.min.js            | Contains Xion class only.  |
| xion.min.es6.js        | Contains Xion class and required ES6 polyfills.|
| xion.min.ui.js         | Contains Xion class and required ES6 polyfills and UI set. (in progress)|

##Examples. 

To leran more about Xion you can check [component](https://github.com/kysonic/xion/tree/master/src/example) and [ui](https://github.com/kysonic/xion/tree/master/src/ui) examples.

##Tests.

Run tests:  

```
npm test
```

## Bugs, enhancements, suggestions.

If you want to help make this project better you can add your suggestions [here](https://github.com/kysonic/xion/issues). This also applies to bugs and enhancements. 

## Contributing.

1. Fork the repo. 
2. Write your code. 
3. Submit your pull request to dev branch of this project. 









