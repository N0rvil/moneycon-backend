const record = require('../../models/record');
const Record = require('../../models/record');
const User = require('../../models/user');
const { transformRecord } = require('./merge');

module.exports = {
  createRecord: async (args, req) => {
    if (!req.isAuth) {
      throw new Error('Unauthenticated!');
    }
    const record = new Record({
      type: args.recordInput.type,
      category: args.recordInput.category,
      amount: +args.recordInput.amount,
      date: args.recordInput.date,
      creator: req.userId,
    });

    let createdRecord;
      try {
        const result = await record.save();
        createdRecord = transformRecord(result);
        const creator = await User.findById(req.userId);
        if (!creator) {
          throw new Error('User not found.');
        }
        await User.findOneAndUpdate({ _id: req.userId }, { 
          balance: creator.balance + args.recordInput.amount,
        });
        creator.records.push(record);
        await creator.save();
        return createdRecord;
      } catch (err) {
        console.log(err);
        throw err;
      }
  },
  getIncomeRecords: async (args, req) => {
    
    if (!req.isAuth) {
      throw new Error('Unauthenticated!');
    }
    const records = await Record.find({ creator: req.userId, type: 'income' })
    
    const last30DaysRecords = [];
    const todayDate = new Date();
    
    records.map((record) => {
      const recordDate = new Date(record.date);
      const Difference = (todayDate.getTime() - recordDate.getTime()) / (1000 * 3600 * 24);
      if (Difference < 30) {
        last30DaysRecords.push(record);
      }
    })
    return last30DaysRecords
  },
  editRecord: async (args, req) => {
    if (!req.isAuth) {
      throw new Error('Unauthenticated!');
    }
    const creator = await User.findOne({ _id: req.userId })
    const originalRecord = await Record.findOne({ _id: args.recordInput._id });
    const record = await Record.findOneAndUpdate({ _id: args.recordInput._id }, { 
      amount: args.recordInput.amount,
      category: args.recordInput.category,
     });

    await User.findOneAndUpdate({ _id: req.userId }, { 
      balance: creator.balance + args.recordInput.amount - originalRecord.amount,
    });
    await record.save();
    return record;
  },
  getSingleRecord: async (args, req) => {
    if (!req.isAuth) {
      throw new Error('Unauthenticated!');
    }
    const record = await Record.findOne({ _id: args.recordId });
    return record;
  },
  deleteRecord: async (args, req) => {
    if (!req.isAuth) {
      throw new Error('Unauthenticated!');
    }
    const record = await Record.findOne({ _id: args.recordId });
    await Record.deleteOne({ _id: args.recordId });
    return record;
  },
  

};