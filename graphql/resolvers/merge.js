const User = require('../../models/user');
const Record = require('../../models/record');
const category = require('../../models/category');

const records = async recordIds => {
  try {
    const records = await Record.find({ _id: { $in: recordIds } });
    return records.map(record => {
      return transformRecord(record);
    });
  } catch (err) {
    throw err;
  }
};


const user = async userId => {
try {
  const user = await User.findById(userId);
  return {
    ...user._doc,
    _id: user.id,
    records: records(user._doc.records)
  };
} catch (err) {
  throw err;
}
};

const transformRecord = record => {
  return {
      ...record._doc,
      _id: record.id,
      date: new Date(record._doc.date).toISOString(),
      creator: user.bind(this, record.creator)
  }
};


// const singleRecord = async recordId => {
//   try {
//       const record = await Record.findById(recordId);
//       return transformRecord(record);
//   } catch (err) {
//       throw err;
//   }
// }

exports.user = user;
exports.transformRecord = transformRecord;



