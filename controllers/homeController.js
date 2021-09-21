const Project = require("../schemas/projectSchema");
const { Category } = require("../schemas/categorySchema");
const User = require("../schemas/userSchema");

const homeController = {
  homeGetController: async (req, res) => {
    const project = req.query.project;
    const category = req.query.category;

    if (project && !category) {
      projects = await Project.find({
        title: { $regex: project, $options: "$i" },
      });
      res.render("projects", { projects: projects });
    } else if (project && category) {
      projects = await Project.find({
        title: { $regex: project, $options: "$i" },
        category: { $regex: category, $options: "$i" },
      });
      res.render("projects", { projects: projects });
    } else {
      try {
        let categories = await Category.find({}).sort({ title: 1 });
        if (req.isAuthenticated()) {
          // let user = await User.findById(req.user._id);
          // user.isAdmin = true;
          // user.save();
          res.render("home", {
            user: req.user,
            categories: categories.slice(0, 6),
          });
        } else {
          res.render("home", { categories: categories.slice(0, 6) });
        }
      } catch (error) {
        console.log(error);
        res.redirect("back");
      }
    }
  },
};

module.exports = homeController;
