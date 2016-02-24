# Xion

Xion is a lightweight client-side library (in fact it's class) for building component like user interfaces. The main purpose of Xion is creating UI components fast without any difficult agreements regarding library methods, naming, hard syntax, etc. All what you have to know that you will be able to use Xion is JavaScript and JsonML only. Xion can be used like a constituent part of your custom library which have to be able to create some interfaces. 

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
import Todo from '../component/Todo.js';

var todo = new Todo(document.body,{items:[{title:'First task'}]});
todo.render(); 

```

Check this [example](https://github.com/kysonic/xion/tree/master/src/example/Todo). 

##Basic concepts.




