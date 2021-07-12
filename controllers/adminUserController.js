const User = require('../schemas/userSchema');

module.exports = {
    adminGetUser : async (req, res)=>{
        let deleteId = req.query.delete;

        try {
            if(deleteId){
                await User.findByIdAndDelete(deleteId);
                req.flash('success', 'User has been deleted');
                res.redirect('back')
            }else{
                let users = await User.find();
                res.render('admin/admin-users', {user: req.user, users: users})
            }

        } catch (error) {
            console.log(error);
            res.redirect('back');
        }
    }
}