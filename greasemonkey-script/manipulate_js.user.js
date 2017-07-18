// ==UserScript==
// @name        manipulate_js
// @description modify the javascript executed on a site
// @include     http://example.com/*
// @version     1
// @grant       none
// @run-at      document-start
// @require     replacing.js
// ==/UserScript==

var changed=0;

window.addEventListener('beforescriptexecute', function(e) {
	var src = e.target.src;
	if (src.search(/script_to_be_removed\.js/) != -1) {
		changed++;
		console.log("prohibited "+src+" from executing");
		e.preventDefault();
		
	}
  if(src.search(/script_to_be_replaced\.js/) != -1){
    changed++;
		console.log("prohibited "+src+" from executing, and replacing it with something else");
		e.preventDefault();
		append(toappend);//toappend is the function defined in replacing.js
  }
}, true);


function append(s) {	 
	document.head.appendChild(document.createElement('script'))
		.innerHTML = s.toString().replace(/^function.*{|}$/g, '');
}
