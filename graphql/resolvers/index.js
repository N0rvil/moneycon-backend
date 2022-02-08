const authResolver = require('./auth');
const sessionResolver = require('./session');
const recordResolver = require('./record');
const categoryResolver = require('./category');
const settingsResolver = require('./settings');

const rootResolver = {
    ...authResolver,
    ...sessionResolver,
    ...recordResolver,
    ...categoryResolver,
    ...settingsResolver,
};

module.exports = rootResolver;