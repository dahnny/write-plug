const Project = require('../schemas/projectSchema');
const User = require('../schemas/userSchema');

const previewController = {
    previewGetController: async (req, res) => {
        const projectId = req.query.p;
        try {
            let project = await Project.findById(projectId);
            let foundUser = await User.findOne({ username: project.username });
            res.render('preview', { foundUser: foundUser, project: project });
        } catch (error) {
            console.log(error);
            req.flash('error', error.message);
            res.redirect('back');
        }

    }

}

module.exports = previewController;