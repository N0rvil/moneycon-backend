const Category = require('../../models/category');
const User = require('../../models/user');

module.exports = {
    createCategory: async (args, req) => {    
        if (!req.isAuth) {
          throw new Error('Unauthenticated!');
        }
        const existingCategory = await Category.findOne({ creator: req.userId , name: args.categoryInput.name, type: args.categoryInput.type });
        if (existingCategory) {
            throw new Error('Category exists already.');
        }
        const category = new Category({
          name: args.categoryInput.name.toLowerCase(),
          color: args.categoryInput.color,
          type: args.categoryInput.type,
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
      getIncomeCategories: async (args, req) => {
        if (!req.isAuth) {
          throw new Error('Unauthenticated!');
        }
        const category = await Category.find({ creator: req.userId, type: 'income' })
        return category.map(category => {
          return category;
        });
    },
    getSpendingsCategories: async (args, req) => {
      if (!req.isAuth) {
        throw new Error('Unauthenticated!');
      }
      const category = await Category.find({ creator: req.userId, type: 'spendings' })
      return category.map(category => {
        return category;
      });
  },
    deleteCategory: async (args, req) => {
        if (!req.isAuth) {
          throw new Error('Unauthenticated!');
        }
        await Category.deleteOne({ _id: args.deleteCategoryInput.id })
        await User.findOneAndUpdate(
          { _id: req.userId },
          { $pull: { categories: { _id: args.deleteCategoryInput.id } } },
          { new: true }
        )
        
        const category = await Category.find({ creator: req.userId, type: args.deleteCategoryInput.type })
        return category.map(category => {
          return category;
        });
        
    },
      
};