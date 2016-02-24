require('./Table.css');
import Xion from '../../xion/Xion.js';
class Table extends Xion {
    controller(opts) {
        this.head = opts.head || [];
        this.body = opts.body || [];
    }
    view() {
        return ['table',{class:'xion_table'},
            ['thead',this.drawHead()],
            ['tbody',this.drawBody()]
        ]
    }
    drawHead(){
        return this.head.map((th)=>{
            return ['th',th.text]
        })
    }
    drawBody() {
        return this.body.map((tr,k)=>{
            return ['tr', tr.map((td,i)=>{
                if(td.prop&&td.prop.onclick) td.prop.onclick = td.prop.onclick.bind(this.parent,td,i,tr,k);
                return ['td',td.prop||{},td.text]
            })]
        })
    }
}

export default Table;