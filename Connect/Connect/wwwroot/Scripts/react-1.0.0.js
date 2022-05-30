var rc = rc || {};
rc.react = rc.react || {};

// Declarar funciones publicas
(function () {
	'use strict';
	Boolean.parse = function(val) { let falsy = /^(?:f(?:alse)?|no?|0+)$/i; return !falsy.test(val) && !!val; };

	rc.randomId = function(){ return (Math.random()+"").replace("0.",""); }
	
	rc.react.parseInput = function (e) {
		let _info = {};
		let _meta = null;
		let _data = null;
		
		_info.id = e.target.id || rc.randomId();
		_info.name = e.target.name || null;
		_info.label = e.target.label || null;
		_info.index = e.target.index || null;
		//_info.type = "VALUE";
		//_info.show_detail = null;
		_info.checked = null;
		
		switch(e.target.tagName) {
			case "INPUT":
				switch(e.target.type)
				{
					case "checkbox":
						_data = Boolean.parse(e.target.checked);
						_info.checked = _data;
						break;
					case "number":
						_data = e.target.value;
						_data = (!isNaN(_data))? Number(_data) : null;
						_info.checked = (_data != "");
						break;
					default:
						_data = e.target.value;
						_info.checked = (_data != "");
						break;
				}
				break;
			default:
				_data = e.target.value;
				_info.checked = (_data != "");
				break;
		}
		
		if(_info.checked)
			_meta = _info;
		else
			_data = null;
		
		return ({ info: _info, meta: _meta, data: _data });
	}
	
	rc.react.inputValue = function (e) {
		let _data = e.target.value;
		
		switch(e.target.tagName) {
			case "INPUT":
				switch(e.target.type)
				{
					case "checkbox":
						_data = Boolean.parse(e.target.checked);
						break;
					case "number":
						_data = e.target.value;
						_data = (!isNaN(_data))? Number(_data) : null;
						break;
				}
				break;
		}
		
		return _data;
	}

	rc.react.configNodeFlatten = function(obj, path, result) {
		if(!result)
			result = {};
		
		if(typeof obj == "object")
		{
			if(obj.isNode)
				result[path || "/"] = obj;
			else
			{
				path = (path)? (path + "/"): "";
				if(Array.isArray(obj))
				{
					obj.forEach(function(v,i)
					{
						configNodeFlatten(v, (path + i), result);
					});
				}
				else
				{
					for(k in obj)
					{
						configNodeFlatten(obj[k], (path + k), result);
					}
				}
			}
		}
		
		return result;
	}
	
	rc.react.configNodeList = function(result, obj, path) {
		if(!Array.isArray(result)) {
			console.error("rc.react.configNodeList: Se requere que el parametro 'result' sea array.");
			return;
		}
		
		if(typeof obj == "object") {
			if(obj.isNode)
			{
				obj.path = path || "/";
				result.push(obj);
			}
			else {
				path = (path)? (path + "/"): "";
				if(Array.isArray(obj)) {
					obj.forEach(function(v,i) {
						rc.react.configNodeList(result, v, (path + i));
					});
				}
				else {
					for(var k in obj) {
						rc.react.configNodeList(result, obj[k], (path + k));
					}
				}
			}
		}
	}
})();

