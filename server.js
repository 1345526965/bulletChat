let WebSocket = require('ws')
// redis的客户端
let redis = require('redis')
let client = redis.createClient()  //key value
// let wss = new WebSocket.Server({port:6379})
var WebSocketServer = require('ws').Server,
wss = new WebSocketServer({ port: 3000 });
// 原生的websocket就两个常用的方法 on（'message'） send()
let clientsArr = [] //针对多个用户的弹幕  1
client.on('ready',function(res){
    console.log('ready');
});

client.set('lubenwei', '2121212', function (err, res) {
    // todo..
});
wss.on('connection',function(ws){
	clientsArr.push(ws) //针对多个用户的弹幕  2
	// 针对刷新处理的
	client.lrange('barrages',0,-1,function(err,applies){
		applies = applies.map(item=>JSON.parse(item ))
	    ws.send(JSON.stringify(
		{type:'INIT',
		data:applies}
		))	
		
	})
	ws.on('message',function(data){
		// "{value,time,color,speed}"
		client.rpush('barrages',data,redis.print)
		clientsArr.forEach(w=>{  // 针对多个用户的弹幕  3
			ws.send(JSON.stringify({type:'ADD',data:JSON.parse(data)}) )
		})
		
	})
	//用户离开 删除弹幕 4
	ws.on('close',function(){
		clientsArr.filter(client=>client!=ws)
	})
})
// var WebSocketServer = require('ws').Server,
// wss = new WebSocketServer({ port: 3000 });
// wss.on('connection', function (ws) {
//     console.log('client connected');
//     ws.on('message', function (message) {
//         console.log(message);
//     });
// });