import UI from './ui/ui.js';
import Settings from './example/Settings/Settings.js';
window.ui = {};
window.ui.settings = new Settings(null);
window.ui.popup = new UI.Popup(document.body,
    {
        content: window.ui.settings
    }
);
window.ui.popup.render();