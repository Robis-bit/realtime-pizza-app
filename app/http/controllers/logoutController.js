const User=require('../../models/user')

function logoutController(){
    return {
      
     
        logout(req, res) {
            req.logout()
            delete req.session.cart
            return res.redirect('/login')  
          }
    }
}

module.exports=logoutController