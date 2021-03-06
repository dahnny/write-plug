
const cloudinary = require('../helpers/cloudinaryConfig')

//Schemas
const Project = require('../schemas/projectSchema');
const { Category } = require('../schemas/categorySchema');

function displayErrorMessage() {
    req.flash('error', 'Error Occurred');
    res.redirect('back');
   
}

const uploadController = {
    uploadGetRequest:
        async (req, res) => {
            try {
                let categories = await Category.find({});
                let projects = await Project.find({ username: req.user.username });
                res.render('upload', { user: req.user, categories: categories, noOfUploadedProjects: projects.length });

            } catch (error) {
                req.flash('error', error.message);
                 console.log(error);
                res.redirect('back');
            }

        },

    addProject: async (req, res) => {
        const topic = req.body.projectTopic;
        const category = req.body.projectCategory;
        let preview = req.body.preview;

        // preview = preview.replace(/&/g, '&amp;');
        // preview = preview.replace(/</g, '&lt;');
        // preview = preview.replace(/>/g, '&gt;');
        // preview = preview.replace(/"/g, '&quot;');
        // preview = preview.replace(/'/g, '&apos');
        // console.log(preview);

        if(req.user.subAccountDetails == {} || req.user.subAccountDetails == undefined){
            req.flash('info', 'Please verify your bank account before you can upload a project');
            res.redirect('/payment-details');
        }
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
            console.log(error);
            displayErrorMessage();
        }
    }

}

module.exports = uploadController;