const homeController=require('../app/http/controllers/homeController')
const authController=require('../app/http/controllers/authController')
const logoutController=require('../app/http/controllers/logoutController')
const orderController=require('../app/http/controllers/orderController')
const cartController=require('../app/http/controllers/customer/cartController')
 const AdminOrderController=require('../app/http/controllers/admin/orderController')
 const statusController=require('../app/http/controllers/admin/statusController')
const guest=require('../app/http/middlewares/guest')
const auth=require('../app/http/middlewares/auth')
const admin=require('../app/http/middlewares/admin')
function initRoutes(app){
    app.get('/',homeController().index)
 
    app.get('/login',guest,authController().login)
    app.post('/login',authController().postLogin)
    app.get('/resister',guest,authController().resister)
    app.post('/resister',authController().postResister)

    app.get('/cart',cartController().index)
    app.post('/update-cart',cartController().update)
    
    



    app.post('/logout',logoutController().logout)

    //customer route
    app.post('/orders',auth,orderController().store)
    app.get('/customers/orders',auth,orderController().index)
    app.get('/customers/orders/:id',auth,orderController().show)

    //admin routes
     app.get('/admin/orders',admin,AdminOrderController().index)
     app.post('/admin/order/status',admin,statusController().update)

     
    }


module.exports=initRoutes