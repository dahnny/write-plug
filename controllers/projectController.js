const Project = require('../schemas/projectSchema');
const User = require('../schemas/userSchema');

const projectController = {
    getController: async (req, res) => {
        let projects;
        const categoryName = req.query.category_name;

        const project = req.query.project;
        const category = req.query.category;
        try {

            if (categoryName) {

                projects = await Project.find({ category: categoryName, isApproved: true });
            } else {
                if (project && !category) {
                    projects = await Project.find({
                        title: { $regex: project, $options: '$i' },
                        isApproved: true
                    });

                } else if (project && category) {
                    projects = await Project.find({
                        title: { $regex: project, $options: '$i' },
                        category: { $regex: category, $options: '$i' },
                        isApproved: true
                    });

                } else {
                    projects = await Project.find({ isApproved: true });
                }

            }

        } catch (error) {
            console.log(error);
            req.flash('error', 'Error Occurred');
            res.redirect('back')
        }
        projects.forEach(async project => {
            let user = await User.find({username: project.username});
            console.log(user);
            if(user.length == 0){
                console.log('dmkaf');
                await Project.findByIdAndDelete(project._id);
            }
        });
        res.render('projects', { user: req.user, projects: projects });
    }
}

module.exports = projectController;