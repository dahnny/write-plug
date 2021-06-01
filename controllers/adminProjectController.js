const Project = require('../schemas/projectSchema');


module.exports = {
    adminProjectGetController: async(req, res)=>{
        try {
            let projects = await Project.find();
            res.render('admin/admin-projects', {user: req.user, projects : projects})
        } catch (error) {
            
        }
    },
    adminDeleteProject: async(req, res)=>{
        const id = req.query.delete;
        try {
            await Project.findByIdAndDelete(id);
            res.redirect('back');   
        } catch (error) {
            console.log(error);
            res.redirect('back');
        }
        
    }
}