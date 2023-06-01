const Koa = require("koa");
const router = require("koa-router")();
const app = new Koa();
const Top250Model = require("./models/top250");
const cors = require("koa2-cors");
const bodyParser = require("koa-bodyparser");
router.get("/top250", async ctx=>{
    var data = await Top250Model.find();
    ctx.body = {
        code:100,
        res:data,
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
app.use(bodyParser()); 
app.use(cors());
app.use(router.routes());
app.listen(8080);
