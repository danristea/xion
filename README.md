# xion
Lightweight client-side MVC framework that uses JsonML syntax and virtual DOM diffing.

Simple App example to demonstrate proof of concept:

	var data = ['project A','project B','project C'];
	var storage = {
	    data: 'empty'
	}

	var table = {};
	table.controller = function() {
		this.thead = 'thead';
	    this.tbody = 'tbody';
		this.getData = function(fn) {     
            setTimeout( function(){ storage.data = data; fn(); UI.redraw(); }, 2000);
		}
		return this;
	};
	table.view = function(ctrl) {
		var tbody = function () {
		    if (typeof storage.data === 'string') return ['tr', ['td', storage.data]];
			else return ['tr', storage.data.map(function(val){ return ['td', val] }) ]
		}
	    return [['thead',['tr',['th','Priority 1'],['th','Priority 2'],['th','Priority 3']]],['tbody', tbody()]];
	};

    var app = {};
	app.controller = function (arg) {
		this.table = new table.controller();
		this.status = arg.status;
		this.date = arg.date;
		this.loadedAt = 'N/A';
		this.swap = function () {
			if (Array.isArray(storage.data)) {
			    var last = storage.data.pop();
			    storage.data.push(storage.data.shift());
			    storage.data.unshift(last);
			}
			else alert('Nothing to swap, load data first.');	
		}
		var _this = this;
		this.load = function() {
		    _this.status = 'loading... ';
			_this.table.getData(function(){ 
			    _this.status='loaded';
				_this.loadedAt = new Date().toString();
			});
		};
		return this;
	};
	app.view = function(ctrl) {
	    return [
			['h1', 'Main App'],
			['div', 'Started At : ', ctrl.date],
			['hr'],
			['div', ['button', 'Load', {"onclick" : ctrl.load}],
				['div', 'Status : ', ctrl.status],
				['div', 'Last loaded : ', ctrl.loadedAt],
				['button','Swap',  {"onclick": ctrl.swap} ],
				['table', table.view(ctrl.table)]
			]
		];
	};
	
	var initobj = {status:'ready', date: new Date().toString()};
    UI.mount(app, document.body, initobj);
