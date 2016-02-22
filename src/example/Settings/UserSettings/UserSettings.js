import s from './UserSettings.css';
import Xion from '../../../xion/Xion.js';
import UI from '../../../ui/ui.js';

class UserSettings extends Xion {
    controller() {
        this.table = new UI.Table(null,
            {
                head: [{text:'Login'},{text:'Email'},{text:'Role'}],
                body: []
            }
        );
        this.getData();
    }
    view() {
        return ['div',{class: 'xe_user_settings'},
            ['input',{type:'text',placeholder:'Enter search term',oninput:this.filter,id:'filter'}],
            this.table
        ]
    }
    getData() {
        setTimeout(()=>{
            this.table.body = [
                [{text:'kysonic'},{text:'soooyc@gmail.com'},{text:'admin',prop:{onclick:this.changeRole,class:'xe_user_settings-role'}}],
                [{text:'baton'},{text:'a.miroshnichenko@zebratelecom.ru'},{text:'admin',prop:{onclick:this.changeRole,class:'xe_user_settings-role'}}],
                [{text:'nigga'},{text:'black@zebratelecom.ru'},{text:'user',prop:{onclick:this.changeRole,class:'xe_user_settings-role'}}]
            ];
            this.storage.body = this.table.body;
            this.table.render();
        },2000);
    }
    filter() {
        this.table.body = this.storage.body.filter((item)=>{
            return new RegExp('.*'+this.$.filter.value+'.*').test(item[1].text);
        });
        this.render();
    }
    changeRole(td) {
        td.text = td.text=='admin'?'user':'admin';
        this.table.render();
    }
}

export default UserSettings;