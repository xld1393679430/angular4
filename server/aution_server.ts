var express  = require('express');
var Server = require('ws').Server;
var path = require('path');
const  app = express();
app.use('/',express.static(path.join(__dirname,'..','client')))
const products = [
    {   "id":1,
        "title":"第一个商品",
        "price":1.99,
        "rating":1.5,
        "desc":"这是第一个商品",
        "categories":['电子产品','硬件设备']
    },
    {   "id":2,
        "title":"第二个商品",
        "price":2.99,
        "rating":2.5,
        "desc":"这是第二个商品",
        "categories":['图书']
    },
    {   "id":3,
        "title":"第三个商品",
        "price":3.99,
        "rating":3.5,
        "desc":"这是第三个商品",
        "categories":['硬件设备']
    },
    {   "id":4,
        "title":"第四个商品",
        "price":4.99,
        "rating":4.5,
        "desc":"这是第四个商品",
        "categories":['电子产品','硬件设备']
    },
    {   "id":5,
        "title":"第五个商品",
        "price":5.99,
        "rating":5.5,
        "desc":"这是第五个商品",
        "categories":['电子产品']
    },
    {   "id":6,
        "title":"第六个商品",
        "price":6.99,
        "rating":6.5,
        "desc":"这是第六个商品",
        "categories":['图书']
    },
];


const comments = [
    {   "id": 1,
        "productId": 1,
        "timestamp":'2017-02-02 22:22:22',
        "user":'张三',
        "rating":3,
        "content":'东西不错1'
    },
    {   "id": 2,
        "productId": 1,
        "timestamp":'2017-02-02 22:22:22',
        "user":'张四',
        "rating":3,
        "content":'东西不错1'
    },
    {   "id": 3,
        "productId": 1,
        "timestamp":'2017-02-02 22:22:22',
        "user":'张五',
        "rating":3,
        "content":'东西不错1'
    },
    {   "id": 4,
        "productId": 2,
        "timestamp":'2017-02-02 22:22:22',
        "user":'张六',
        "rating":3,
        "content":'东西不错1'
    },

];


app.get('/',(req,res)=>{
    res.send("Hello Express");
})
//查询products接口的数据
app.get('/api/products',(req,res)=>{
    let result = products;
    let params = req.query;
    if(params.title){
        result = result.filter((p) => p.title.indexOf(params.title) !== -1);
    }
    if(params.price && result.length > 0){
        result = result.filter((p) => p.price <= parseInt((params.price)));
    }
    if(params.category !== '-1' && result.length > 0){
        result = result.filter((p) => p.categories.indexOf(params.category) !== -1);
    }
    res.json( result );

})

//通过products中某件商品的id查询商品
app.get('/api/product/:id',(req,res)=>{
    res.json( products.find((product)=>product.id == req.params.id));
})

app.get('/api/product/:id/comments',(req,res)=>{
    res.json( comments.filter((comment) => comment.productId == req.params.id) );
})
const server = app.listen(8000,'localhost',()=>{
    console.log("服务地址已启动，地址是：http://localhost:8000")
})
const wsServer = new Server({'port':'8085'});
wsServer.on("connection",websocket =>{
    websocket.send("这个销售是服务器主动推送的");
    websocket.on("message",message =>{
        console.log("接收到小仙" + message)
    })
})


setInterval(()=>{
    if(wsServer.clients){
        wsServer.clients.forEach(client => {
            client.send("这是定时推送消息")
        })
    }
},2000)