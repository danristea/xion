require('./Popup.css');
import Xion from '../../xion/Xion.js';

class Popup extends Xion {
    controller(opts) {
        this.opened = false;
        this.content = opts.content||function(){return[]};
        this.zIndex = opts.zIndex;
        this.title = opts.title;
    }
    view() {
        return ['div',{class:'xion_popup'+(this.opened?' opened':''),id:'popup'},
            ['div',{class:'xion_overlay',onclick:this.close,id:'overlay',style:{zIndex:this.zIndex}}],
            ['div',{class:'xion_window',id:'window',style:{zIndex:this.zIndex}},
                ['div',{class:'xion_window-title'},this.title],
                ['div',{class:'xion_window-close',onclick:this.close}],
                ['div',{class:'xion_window-content'},typeof this.content=='function'?this.content():this.content]
            ]
        ]
    }
    /**
     * Close popup
     */
    close() {
        this.opened = false;
        this.render();
    }
    /**
     * Toggle popup
     */
    toggle() {
        this.opened = !this.opened;
        this.$.window.classList.toggle('animation');
        this.render();
        // Positions
        setTimeout(()=>{
            this.$.window.classList.toggle('animation');
            this.reposition();
        });
    }
    reposition(){
        var bound = this.$.window.getBoundingClientRect();
        this.$.window.style.marginLeft = -(bound.width/2)+'px';
        this.$.window.style.marginTop = -(bound.height/2)+'px';
    }
}
export default Popup;