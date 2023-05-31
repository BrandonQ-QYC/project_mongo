const Koa = require("koa");
const router = require("koa-router")();
const app = new Koa();
const Top250Model = require("./models/top250");
router.get("/top250", async ctx=>{
    var data = await Top250Model.find();
    ctx.body = {
        code:200,
        res:data,
        msg:"GET /top20  success"
    }
})
app.use(router.routes());
app.listen(8080);
