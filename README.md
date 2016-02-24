# Xion

Xion is a lightweight client-side library (in fact it's class) for building component like user interfaces. The main purpose of Xion is creating UI components fast without any difficult agreements regarding library methods, naming, hard syntax, etc. All what you have to know that you will be able to use Xion are JavaScript and [JsonML](http://www.jsonml.org/) only. Xion can be used like a constituent part of your custom library which has to be able to create some interfaces. 

##Download Xion.

```
npm install xion
git clone https://github.com/kysonic/xion
```

##Quick example.

This project uses ES6 via babel and webpack and it's reason why all of presented examples will be written using ES6 classes. Besides it's more convinient. If you don't want to use ES6 go [here](#here).

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
First paramater is **DOM node** component will be rendered in. Second is **options** transmited to component instance as defaults. Third is **Array of mixins** using in the * component instance*.

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

That means you can build nested component structure for your interfaces, we will speak about child compponents [below](#children).

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

### DOM links 

Xion has simple mechanism helping you retrieve DOM nodes from your component. For this you should to set id attribute to some node into your JsonML markup and get it through calling this.$['nodeID'].

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

### Events

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









