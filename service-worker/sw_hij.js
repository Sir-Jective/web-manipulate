var mock = true;

this.addEventListener('install', function(event) {
	event.waitUntil(self.skipWaiting());
});

this.addEventListener('activate', function(event) {
	event.waitUntil(self.clients.claim());
});

this.addEventListener('fetch', function(event) {//getting from cache. mocking is done on writing to cache.
	if(mock){
		event.respondWith(
			caches.open('v1')
			.then(function(cache){
				return cache.match(event.request)
			})
			.then(function(res){
				if(res){
					console.log("SW: found in the cache. mocking.");
					return res;
				}//found
				console.log("SW: not in the cache. no mocking.");
				return fetch(event.request);//not found
			})
		);
	}
});

this.addEventListener('message',function(event){
	var data=event.data;
	if(data=="test"){
		event.source.postMessage("SW received a \""+data+"\". Mock = "+JSON.stringify(mock));
		return;
	}
	if(data=="enable mocking"){
		mock=true;
		event.source.postMessage("mocking enabled");
		return;
	}
	if(data=="disable mocking"){
		mock=false;
		event.source.postMessage("mocking disabled");
		return;
	}
	if(data.substr(0,7)=="remove "){
		var j=JSON.parse(data.substr(7));
		caches.open('v1')
		.then(function(cache) {
			return cache.delete(j.reqUrl)})
		.then(function(response) {
				event.source.postMessage("deleted \""+j.reqUrl+"\" from mocking");
		});
		return;
	}
	if(data.substr(0,4)=="add "){
		var j=JSON.parse(data.substr(4));
		var request=j.reqUrl;
		var responseInit = {
			status: 200,
			statusText: 'OK',
			headers: j.headers
		};
		var response=new Response(j.body, responseInit);
		caches.open('v1')
		.then(function(cache) {
			return cache.put(request,response);
		})
		.then(function(){
			event.source.postMessage("added \""+j.reqUrl+"\" to mocking, with the specified response");
		});
		return;
	}
	event.source.postMessage("SW received: "+data);
});
