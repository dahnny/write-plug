const { Category } = require('../schemas/categorySchema');

module.exports = {
    categoryGetController: async (req, res) => {
        const title = req.query.title;
        const description = req.query.description;
        const deleteTitle = req.query.deleteTitle;
        try {
            if (title) {
                let newCategory = new Category({
                    title: title,
                    description: description
                });
                console.log(newCategory);
                await newCategory.save();
                res.redirect(`/admin-categories/${req.user._id}`);

            } else if (deleteTitle) {
                await Category.findOneAndDelete({title: deleteTitle});
                res.redirect(`/admin-categories/${req.user._id}`);
            }
            else {
                let categories = await Category.find().sort({title : 1});
                res.render('admin/admin-category', { categories: categories, user: req.user });
            }
        } catch (error) {
            console.log(error);
            req.flash('error', 'Error occurred');
            res.redirect('back');
        }

    }
}