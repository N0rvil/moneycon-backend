const User = require('../../models/user');
const { user }= require('./merge');

const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

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
    },
    changePassword: async (args, req) => {
        if (!req.isAuth) {
            throw new Error('Unauthenticated!');
        }
        const user = await User.findById(req.userId);

        const isEqual = await bcrypt.compare(args.changePasswordInput.oldPassword, user.password);
        if (!isEqual) {
          throw new Error ('Password is incorrect!');
        } 

        const hashedPassword = await bcrypt.hash(args.changePasswordInput.newPassword, 12);

        const newDataUser = await User.findOneAndUpdate(
            { _id: req.userId },
            { password: hashedPassword },
            { new: true }
        ) 
        
        const result = await newDataUser.save();
        
          return { ...result._doc, password: null, _id: result.id };
    }
}