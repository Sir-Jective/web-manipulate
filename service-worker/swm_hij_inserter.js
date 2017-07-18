document.body.innerHTML="";
document.body.innerHTML=unescape("%3C%21DOCTYPE%20HTML%3E%0A%3Cstyle%3E%0A%23t1%20%3E%20tbody%20%3E%20tr%20%3E%20td%20%7B%0A%09border%3A%201px%20solid%20black%3B%0A%7D%0A%0A%3C/style%3E%0A%3Ctable%20id%3D%22t1%22%3E%0A%3Ctbody%3E%0A%3Ctr%3E%0A%3Ctd%3E%0A%3Ctable%3E%0A%3Ctr%3E%3Ctd%3E%3Clabel%3Estate%3C/label%3E%3C/td%3E%3Ctd%3E%3Cdiv%20id%3D%22state%22%3E%3C/div%3E%3C/td%3E%3C/tr%3E%0A%3Ctr%3E%3Ctd%3E%3Clabel%3Ecommunication%3C/label%3E%3C/td%3E%3Ctd%3E%3Ctextarea%20id%3D%22comm%22%20style%3D%22height%3A200px%3Bwidth%3A300px%3B%22%3E%3C/textarea%3E%3C/td%3E%3C/tr%3E%0A%3Ctr%3E%3Ctd%3E%3Cbutton%20id%3D%22check%28%29%22%3ECheck%20current%20state%3C/button%3E%3C/td%3E%3C/tr%3E%0A%3Ctr%3E%3Ctd%3E%3Cbutton%20id%3D%22register%28%29%22%3EInstall%20SW%3C/button%3E%3C/td%3E%3C/tr%3E%0A%3Ctr%3E%3Ctd%3E%3Cbutton%20id%3D%22send%28%29%22%3Esend%20%22test%22%20to%20SW%3C/button%3E%3C/td%3E%3C/tr%3E%0A%3Ctr%3E%3Ctd%3E%3Cbutton%20id%3D%22unregister%28%29%22%3Euninstall%3C/button%3E%3C/td%3E%3C/tr%3E%0A%3C/table%3E%0A%3C/td%3E%0A%3Ctd%3E%0A%3Ctable%3E%0A%3Ctr%3E%3Ctd%3E%3Clabel%3Epage%3C/label%3E%3C/td%3E%3Ctd%3E%3Cinput%20id%3D%22page%22%20style%3D%22width%3A300px%3B%22%3E%3C/td%3E%3C/tr%3E%0A%3Ctr%3E%3Ctd%3E%3Clabel%3Eheaders%3C/label%3E%3C/td%3E%3Ctd%3E%3Cinput%20id%3D%22headers%22%20style%3D%22width%3A300px%3B%22%3E%3C/td%3E%3C/tr%3E%0A%3Ctr%3E%3Ctd%3E%3Clabel%3E%28mocked%29%20result%3C/label%3E%3C/td%3E%3Ctd%3E%3Ctextarea%20id%3D%22mock%22%20style%3D%22height%3A200px%3Bwidth%3A300px%3B%22%3E%3C/textarea%3E%3C/td%3E%3C/tr%3E%0A%3Ctr%3E%3Ctd%3E%3Cbutton%20id%3D%22mock%28%29%22%3Eenable%20mocking%2C%20for%20this%20page%20and%20this%20result%3C/button%3E%3C/td%3E%3C/tr%3E%0A%3Ctr%3E%3Ctd%3E%3Cbutton%20id%3D%22unmock%28%29%22%3Edisable%20mocking%2C%20for%20this%20page%3C/button%3E%3C/td%3E%3C/tr%3E%0A%3Ctr%3E%3Ctd%3E%3Cbutton%20id%3D%22mock_dis%28%29%22%3Etemporarily%20disable%20mocking%3C/button%3E%3C/td%3E%3C/tr%3E%0A%3Ctr%3E%3Ctd%3E%3Cbutton%20id%3D%22mock_en%28%29%22%3Etemporarily%20re-enable%20mocking%3C/button%3E%3C/td%3E%3C/tr%3E%0A%3C/table%3E%0A%3C/td%3E%0A%3C/tr%3E%0A%3C/tbody%3E%0A%3C/table%3E");
document.getElementById("check()").onclick=check;
document.getElementById("register()").onclick=register;
document.getElementById("send()").onclick=(()=>send("test"));
document.getElementById("unregister()").onclick=unregister;
document.getElementById("headers").value="{\"Content-Type\":\"text/html\"}";
document.getElementById("mock()").onclick=mock;
document.getElementById("unmock()").onclick=unmock;
document.getElementById("mock_en()").onclick=mock_en;
document.getElementById("mock_dis()").onclick=mock_dis;


function check(){
	if ('serviceWorker' in navigator) {
		navigator.serviceWorker.getRegistrations().then(
			function(regs){
				if(regs.length==0){
					state("service worker not installed.");
					return;
				}
				if(regs.length>1){
					state("morethan 2 sw installed.");
					return;
				}
				var reg=regs[0];
				if(reg.installing) {
					state("service worker is installing. Please close all tabs of this site.");
				}
				else if(reg.waiting) {
					state("service worker waiting. Please close all tabs of this site.");
				} 
				else if(reg.active) {
					state("service worker active.");
				}
			}
		).catch(function(error) {
		state("Error: "+error);
	});
	}
	else{
		state("service workers not available.");
	}
}

function register(){
	var loc=prompt("From where? e.g. \"/sw_hij.js\"");
	var scope=prompt("For where? e.g. \"/\"");
	navigator.serviceWorker.register(loc, { scope: scope }).then(function(reg) {
		if(reg.installing) {
			state("this service worker was just installed now. Please reload.");
		} 
		else if(reg.waiting) {
			state("this service worker waiting. Please close all tabs of this site.");
		} 
		else if(reg.active) {
			state("this service worker active.");
		}
		
	}).catch(function(error) {
		// registration failed
		state("this registring service worker failed. Error: "+error);
	});
}

function unregister(){
	navigator.serviceWorker.getRegistrations().then(function(registrations) {
		for(let registration of registrations) {
			registration.unregister()
		}
	});
}

function send(m){
	document.getElementById("comm").value+="Send: "+m.toString()+"\r\n";
	navigator.serviceWorker.controller.postMessage(m);
	console.log("send: ",m);
}

function state(s){
	document.getElementById("state").innerHTML=s;
}

//receive
function regReceive(){
	navigator.serviceWorker.addEventListener('message',function(event){
		document.getElementById("comm").value+="Receive: "+event.data.toString()+"\r\n";
		console.log("receive: ",event.data);
	});
}

//mock
function mock_en(){
	send("enable mocking");
}

function mock_dis(){
	send("disable mocking");
}

function mock(){
	var j={reqUrl:document.getElementById("page").value,headers:JSON.parse(document.getElementById("headers").value),body:document.getElementById("mock").value};
	send("add "+JSON.stringify(j));
}

function unmock(){
	var j={reqUrl:document.getElementById("page").value};
	send("remove "+JSON.stringify(j));
}

check();
regReceive();
