const authResolver = require('./auth');
const sessionResolver = require('./session');
const recordResolver = require('./record');
const categoryResolver = require('./category');

const rootResolver = {
    ...authResolver,
    ...sessionResolver,
    ...recordResolver,
    ...categoryResolver,
};

module.exports = rootResolver;