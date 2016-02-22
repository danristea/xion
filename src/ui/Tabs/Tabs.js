require('./Tabs.css');
import Xion from '../../xion/Xion.js';

class Tabs extends Xion {
    controller(opts) {
        this.selected = 0;
        this.tabs = opts.tabs || [];
        this.onSelect = opts.onSelect || null;
    }
    view() {
        return ['div',{class:'xion_tabs'},
            ['div',{class:'xion_tabs-control'},this.drawControl()],
            ['div',{class:'xion_tabs-content'},this.drawContent()]
        ]
    }
    drawControl(){
        return this.tabs.map((tab,i)=>{
           return ['div',{
               class:'xion_tabs-control-item'+(this.selected==i?' selected':''),
               onclick: this.select.bind(this,i)
           },tab.label,
               ['div',{class:'xion_tabs-control-item-line'}]]
        });
    }
    drawContent() {
        return this.tabs.map((tab,i)=>{
            return ['div',{class:'xion_tabs-content-item'+(this.selected==i?'':' hide')},typeof tab.content=='function'?tab.content():tab.content]
        });
    }
    select(selected) {
        if(selected==this.selected) return;
        this.selected = selected; this.render();
        if(this.onSelect) this.onSelect(this.selected);
    }
}

export default Tabs;