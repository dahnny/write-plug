const Project = require('../schemas/projectSchema');
const {Category} = require('../schemas/categorySchema');


const homeController = {
    homeGetController :  async (req, res) => {
        const project = req.query.project;
        const category = req.query.category;

        if (project && !category) {
            projects = await Project.find({ title: project });
            res.render('projects', { projects: projects });

        } else if (project && category) {
            projects = await Project.find({ title: project, category: category });
            res.render('projects', { projects: projects });

        } else {
            try {
                let categories = await Category.find({}); 
                if (req.isAuthenticated()) {                
                    res.render('home', { user: req.user, categories : categories.slice(0,6) });
                } else {
                    res.render('home', {categories: categories.slice(0,6)});
                }  
            } catch (error) {
                console.log(error);
                res.redirect('back');
            }

        }

    } 
}

module.exports = homeController;