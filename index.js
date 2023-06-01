const Koa = require("koa");
const router = require("koa-router")();
const app = new Koa();
const Top250Model = require("./models/top250");
const cors = require("koa2-cors");
const bodyParser = require("koa-bodyparser");
const koaBody = require('koa-body')
app.use(koaBody({

    multipart: true,
    formidable: {
        maxFileSize: 200*1024*1024,
    keepExtensions: true
    }
}));
router.get("/top250", async ctx=>{
    var {start, limit} = ctx.query;
    if (start == undefined){
        start = 0
    }
    if(limit == undefined){
        limit = 5
    }
    var data = await Top250Model.find().skip(Number(start)).limit(Number(limit));
    var total = await Top250Model.find().count();
    ctx.body = {
        code:100,
        res:data,
        total,
        msg:"GET /top20  success"
    }
})
/* apply like collection */
router.post("/collect", async ctx=>{
    var id = ctx.request.body.id;
    var res = await Top250Model.updateOne({_id:id},{collected:true});
    console.log(res)
    if(res.modifiedCount == 1){
        ctx.body = {
            code:200,
            msg:"You like it"
        }
    }else{
        ctx.body = {
            code:401,
            msg:"Warning: You already collect it."
        }
    }
})
/* cancel collect*/
router.post("/collect/cancel", async ctx=>{
    var id = ctx.request.body.id;
    var res = await Top250Model.updateOne({_id:id},{collected:false});
    console.log(res)
    if(res.modifiedCount == 1){
        ctx.body = {
            code:200,
            msg:"You do not like it"
        }
    }else{
        ctx.body = {
            code:400,
            msg:"Warning: You already cancel it"
        }
    }
})
/* delete data */
router.post("/delete", async ctx=>{
    var id = ctx.request.body.id;
    var res = await Top250Model.deleteOne({_id:id});
    console.log(res)
    if(res.deletedCount){
        ctx.body = {
            code:200,
            msg:"delete success"
        }
    }
})
router.post("/doAdd",async ctx=>{
    console.log(ctx.request.body);
    /* 那么这里可以取得文字相关的信息 */
    var {title,slogo,evaluate,rating,labels,collected} = ctx.request.body;
    
})
app.use(bodyParser()); 
app.use(cors());
app.use(router.routes());
app.listen(8080);
