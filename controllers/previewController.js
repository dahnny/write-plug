const Project = require('../schemas/projectSchema');

const previewController = {
    previewGetController : async (req, res)=>{
        const projectId = req.query.p;
        try {
            let project = await Project.findById(projectId); 
            res.render('preview', {project: project}); 
        } catch (error) {
            console.log(error);
            req.flash('error', error.message);
            res.redirect('back');           
        }       
    
    }

}

module.exports = previewController;