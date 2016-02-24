import Xion from '../../xion/Xion.js';
import UI from '../../ui/ui.js';
import UserSettings from './UserSettings/UserSettings.js';

class Settings extends Xion {
    controller() {
        this.userSettings = new UserSettings(null);
        this.tabs = new UI.Tabs(null, {
            onSelect: this.tabSelect.bind(this),
            tabs: [
                {
                    label: 'User settings',
                    content: this.userSettings
                },
                {
                    label: 'Inject pure JsonML',
                    content: function(){
                        return ['h1','Pure JsonML']
                    }
                }
            ]
        });
    }
    view() {
        return ['div',{class:'xe_settings'},this.tabs]
    }
    tabSelect() {
        this.parent.reposition();
    }
}
export default Settings;