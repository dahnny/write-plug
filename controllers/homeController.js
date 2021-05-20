const Project = require('../schemas/projectSchema');
const {Category} = require('../schemas/categorySchema');

const categories = [
    {
        title: 'Agricultural Science',
        description: 'Agricultural studies that include farming e.t.c'
    },
    {
        title: 'Accounting',
        description: 'Accounting materials that include finance e.t.c'
    },

]

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
            
            if (req.isAuthenticated()) {
               
                let categories = await Category.find({});
                res.render('home', { user: req.user, categories : categories.slice(0,6) });
            } else {
                
                let categories = await Category.find({});
                res.render('home', {categories: categories});
            }
        }

    } 
}

module.exports = homeController;