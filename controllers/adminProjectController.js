const Project = require('../schemas/projectSchema');


module.exports = {
    adminProjectGetController: async (req, res) => {
        let projectId = req.query.approve;


        try {
            if (projectId) {
                let project = await Project.findById(projectId);
                console.log(project.isApproved);
                project.isApproved = !project.isApproved;
                await project.save();
                res.redirect('back');
            } else {
                let projects = await Project.find();
                res.render('admin/admin-projects', { user: req.user, projects: projects })
            }

        } catch (error) {
            console.log(error);
            req.flash('error', 'Error Occurred');
            res.redirect('back');
        }
    },
    adminDeleteProject: async (req, res) => {
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