var model;
var model2;

if (window.localStorage.locStData) {
    model = JSON.parse(window.localStorage.locStData);    
} else {
    model = {
		dataArr: []
	};   
}

var app = angular.module("app",['ngSanitize', 'ui.bootstrap']);	