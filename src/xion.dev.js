import UI from './ui/ui.js';
import Settings from './example/Settings/Settings.js';
import Todo from './example/Todo/Todo.js';

window.ui = {};
window.ui.settings = new Settings(null);
window.ui.popup = new UI.Popup(document.body,
    {
        title: 'User Settings',
        content: window.ui.settings
    }
);
window.ui.popup.render();

window.ui.todo = new Todo(document.body);
window.ui.todo.render();

