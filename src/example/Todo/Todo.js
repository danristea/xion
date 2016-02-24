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