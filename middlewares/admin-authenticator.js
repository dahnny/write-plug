const User = require('../schemas/userSchema')

async function adminAuthenticate(req, res, next){
    const userId = req.params.user;

    try {
        if(userId){
            let user = await User.findById(userId);
            if(user.isAdmin == true){
                next();
            }else{
                req.flash('error', 'This user is not an admin');
                res.redirect('back');
            }
        }else{
            res.redirect('back');
        }       
    } catch (error) {
        console.log(error);
        req.flash('error', 'Error Occured');
        res.redirect('back');
    }
}

module.exports = adminAuthenticate;