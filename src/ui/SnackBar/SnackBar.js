require('./SnackBar.css');
import Xion from '../../xion/Xion.js';

class SnackBar extends Xion {
    controller(opts){
        opts = opts || {}
        this.toast = null;
        this.animationDuration = 300;
        this.duration = 5000;
        return this;
    }
    view(){
        return [
            ['div',{class:'xion_snackbar'}, this.drawToast(this.toast)]
        ]
    }
    /**
     * Draw one toast. Maybe in the future
     * this component will contains multi toast
     * architecture
     * @param toast
     * @returns {*}
     */
    drawToast(toast){
        if(!toast) return [];
        return ['div',{class:'xion_toast '+(toast.status)+(toast.error?' error':''),onclick:this.close.bind(this)},
            [
                ['div',{class:'xion_toast-close'}],
                toast.msg
            ]
        ];
    }

    /**
     * Add new toast. Will override
     * old if it still displays.
     * @param msg
     * @param error
     */
    addToast(msg,error) {
        // Toast settings
        this.toast = this.toast || {};
        this.toast.msg = msg;
        this.toast.status = 'opening';
        this.toast.error = error || false;
        this.render();
        // Lifecycle
        setTimeout(()=>{
            this.toast.status = '';this.render();
            // Auth closing
            setTimeout(()=>{
                this.t = setTimeout(()=>{
                    this.close();
                },this.duration);
            },this.animationDuration);
        });
    }
    /**
     * Close
     */
    close(){
        // Prevent trying to close this toast when time will end
        clearInterval(this.t);
        // If there is no any toast go away
        if(!this.toast) return;
        this.toast.status = 'closing'; this.render();
        // Remove toast after animation will be done
        setTimeout(()=>{
            this.toast = null; this.render();
        },this.animationDuration);
    }
}
export default SnackBar;