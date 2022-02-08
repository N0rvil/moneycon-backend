const User = require('../../models/user');
const { user }= require('./merge');

module.exports = {
    changeCurrency: async (args, req) => {
        if (!req.isAuth) {
            throw new Error('Unauthenticated!');
        }
        const user = await User.findOneAndUpdate(
            { _id: req.userId },
            { currency: args.changeCurrencyInput.currency },
            { new: true }
          )  
        
          const result = await user.save();
        
          return { ...result._doc, password: null, _id: result.id };
    }
}