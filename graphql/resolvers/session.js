const Session = require('../../models/session');
// const User = require('../../models/user');
const { user }= require('./merge');

module.exports = {
  getSession: async ({ token }) => {
    const session = await Session.findOne({ token: token })
    if (!session) {
      throw new Error('Session does not exist!');
    } 
    if (token !== session.token) {
      throw new Error ('Token is incorrect!');
    }

    // const user = await User.findOne({ _id: session.creator })

    return { creator: user(session.creator) }
  }
};