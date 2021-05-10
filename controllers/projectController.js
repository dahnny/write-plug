const Project = require('../schemas/projectSchema');

const projectController = {
    getController: async (req, res) => {
        let projects;
        const categoryName = req.query.category_name;

        const project = req.query.project;
        const category = req.query.category;
        try {

            if (categoryName) {

                projects = await Project.find({ category: categoryName });
            } else {
                if (project && !category) {
                    projects = await Project.find({ title: project });

                } else if (project && category) {
                    projects = await Project.find({ title: project, category: category });

                } else {
                    projects = await Project.find();
                }

            }

        } catch (error) {
            console.log(error);
            req.flash('error', 'Error Occured');
            res.redirect('back')
        }
        res.render('projects', { projects: projects });
    }
}

module.exports = projectController;