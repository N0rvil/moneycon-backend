const Category = require('../../models/category');
const User = require('../../models/user');

module.exports = {
    createCategory: async (args, req) => {    
        if (!req.isAuth) {
          throw new Error('Unauthenticated!');
        }
        const existingCategory = await Category.findOne({ name: args.categoryInput.name });
        if (existingCategory) {
            throw new Error('Category exists already.');
        }
        const category = new Category({
          name: args.categoryInput.name,
          color: args.categoryInput.color,
          creator: req.userId,
        });
        
        let createdCategory;
          try {
            const result = await category.save();
            createdCategory = result;
            const creator = await User.findById(req.userId);
            if (!creator) {
              throw new Error('User not found.');
            }
            creator.categories.push(category);
            await creator.save();
            return createdCategory;
          } catch (err) {
            console.log(err);
            throw err;
          }
        // return { ...result._doc, _id: result.id };
      },
      getCategories: async (args, req) => {
        if (!req.isAuth) {
          throw new Error('Unauthenticated!');
        }
        const category = await Category.find({ creator: req.userId })
        return category.map(category => {
          return category;
        });
    },
    deleteCategory: async (args, req) => {
        if (!req.isAuth) {
          throw new Error('Unauthenticated!');
        }
        await Category.deleteOne({ _id: args.categoryId })
        
        const category = await Category.find({ creator: req.userId })
        return category.map(category => {
          return category;
        });
        
    },
      
};