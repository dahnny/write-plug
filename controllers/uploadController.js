
const cloudinary = require('../helpers/cloudinaryConfig')

//Schemas
const Project = require('../schemas/projectSchema');

function displayErrorMessage(){
    req.flash('error', 'Error Occurred');
    res.redirect('back');
    console.log('error');
}

const uploadController = {

    addProject: async (req, res) => {
        const topic = req.body.projectTopic;
        const category = req.body.projectCategory;
        const preview = req.body.preview;

        if (!req.file) {
            displayErrorMessage();
        }
        try {
            let result = await cloudinary.uploader.upload(req.file.path, {
                resource_type: 'raw'
            });

            if (result) {
                let newProject = new Project({
                    title: topic,
                    preview: preview,
                    username: req.user.username,
                    file: result.secure_url,
                    category: category
                });

                let project;

                project = await newProject.save();
                req.flash('success', 'Upload Successful')
                res.redirect('back')
            }


        } catch (error) {
            displayErrorMessage();
        }
    }

}

module.exports = uploadController;