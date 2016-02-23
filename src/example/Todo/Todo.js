import Xion from '../../xion/Xion.js';

class Todo extends Xion {
    controller() {
        this.state = {
            items: []
        }
        this.useAdd2=false;
    }
    view() {
        return ['div',{class:'xe_todo'},
            ['ul',{class:'xe_todo-items'},this.drawItems()],
            ['input',{class:'xe_todo-input',type:'text',placeholder:'Enter item title',id:'xetInput'}],
            ['button',{class:'xe_todo-button',onclick:this.useAdd2?this.add2:this.add},'ADD #'+(parseInt(this.state.items.length)+1)],
            ['button',{class:'xe_todo-button',onclick:this.showState},'ShowState']
        ]
    }
    drawItems() {
        return this.state.items.map((item)=>{
            return ['li',{class:'xe_todo-item'},item.title];
        });
    }
    add() {
        console.log('Add1');
        this.state.items.push({title:this.$.xetInput.value});
        this.render();
        this.$.xetInput.value = '';
    }
    add2() {
        console.log('Add2');
        this.state.items.push({title:this.$.xetInput.value});
        this.render();
        this.$.xetInput.value = '';
    }
    shouldRender(previousState) {
        if(!previousState) return true;
        // Compare
        return previousState.items.length!=this.state.items.length;
    }
    showState() {
       console.log( this.state );
        this.useAdd2 = true;
    }
}

export default Todo;