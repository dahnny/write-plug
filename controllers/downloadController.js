const download = require('download');
const fs = require('fs');

const Download = require('../schemas/downloadSchema');
const Project = require('../schemas/projectSchema');

module.exports = {
    downloadGet: async (req, res) => {
        const token = req.params.token;

        let projectDownload = await Download.findOne({ token: token });
        if (projectDownload) {
            try {
                let project = await Project.findById(projectDownload.projectId);
                let path = `${__dirname}/files/${token}.docx`;
                download(project.file).pipe(fs.createWriteStream(path));
                res.download(path, () => {
                    fs.unlink(path, async ()=>{
                        await Download.findOneAndDelete({ token: token });
                    });
                });
            } catch (error) {
                req.flash('error', 'Error Occurred');
                console.log(error);
                res.redirect('back');
            }
        } else {
            req.flash('error', 'This file does not exist');
            res.redirect('/projects');
        }
    }
}