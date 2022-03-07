const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const User = require('../../models/user');
const Session = require('../../models/session');
const Category = require('../../models/category');
const Record = require('../../models/record');
require('dotenv').config()

SECRET_KEY = process.env.SECRET_KEY;

module.exports = {
  createUser: async args => {
    try {
      const existingUser = await User.findOne({ email: args.userInput.email });
      if (existingUser) {
        throw new Error('User exists already.');
      }
      const hashedPassword = await bcrypt.hash(args.userInput.password, 12);

      const user = new User({
        email: args.userInput.email,
        password: hashedPassword
      });

      if (user) {
        const category = new Category({ 
          name: 'sallary',
          color: '#00FF19',
          type: 'income',
          creator: user._id
        })

        if (category) {
          const record = new Record({
            type: 'income',
            category: 'sallary',
            amount: 0,
            date: new Date(),
            toBalance: 0,
            creator: user._id,
          })

          const resRec = await record.save();
        }
        const resCat = await category.save();
      }

      const result = await user.save();

      return { ...result._doc, password: null, _id: result.id };
    } catch (err) {
      throw err;
    }
  },
  login: async ({ email, password }) => {
    const user = await User.findOne({ email: email })
    if (!user) {
      throw new Error('User does not exist!');
    } 
    const isEqual = await bcrypt.compare(password, user.password);
    if (!isEqual) {
      throw new Error ('Password is incorrect!');
    }
    
    const token = jwt.sign({ userId: user.id, email: user.email, time: new Date() }, SECRET_KEY, {
      expiresIn: '1h'
    });

    const session = new Session({
      token: token,
      creator: user.id
    });

    await session.save();

    return { userId: user.id, token: token, tokenExpiration: 1 }
  }
};