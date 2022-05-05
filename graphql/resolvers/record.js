const record = require('../../models/record');
const Record = require('../../models/record');
const User = require('../../models/user');
const { transformRecord } = require('./merge');

module.exports = {
  createRecord: async (args, req) => {
    if (!req.isAuth) {
      throw new Error('Unauthenticated!');
    }
    const creator = await User.findById(req.userId);
    if (!creator) {
      throw new Error('User not found.');
    }
    const record = new Record({
      type: args.recordInput.type,
      category: args.recordInput.category,
      amount: +args.recordInput.amount,
      date: args.recordInput.date,
      toBalance: args.recordInput.type === 'income' ? creator.balance + args.recordInput.amount : creator.balance - args.recordInput.amount,
      creator: req.userId,
    });

    let createdRecord;
      try {
        const result = await record.save();
        createdRecord = transformRecord(result);
        if (!creator) {
          throw new Error('User not found.');
        }
        if (args.recordInput.type === 'income') {
          await User.findOneAndUpdate({ _id: req.userId }, { 
            balance: creator.balance + args.recordInput.amount,
          });
        } else {
          await User.findOneAndUpdate({ _id: req.userId }, { 
            balance: creator.balance - args.recordInput.amount,
          });
        }
        
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
        if (record.type === 'income' && record.category === 'sallary' && record.amount === 0 && record.toBalance === 0) {
          return
        } else {
          last30DaysRecords.push(record);
        }
      }
    })
    return last30DaysRecords
  },
  getSpendingsRecords: async (args, req) => {
    
    if (!req.isAuth) {
      throw new Error('Unauthenticated!');
    }
    const records = await Record.find({ creator: req.userId, type: 'spendings' })
    
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
  getLastMonthRecords: async (args, req) => {
    if (!req.isAuth) {
      throw new Error('Unauthenticated!');
    }
    const records = await Record.find({ creator: req.userId })

    const last30DaysRecords = [];
    const todayDate = new Date();
    
    records.map((record) => {
      const recordDate = new Date(record.date);
      const Difference = (todayDate.getTime() - recordDate.getTime()) / (1000 * 3600 * 24);
      if (Difference < 31) {
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
      // toBalance: originalRecord.type === 'income' ? originalRecord.toBalance + (args.recordInput.amount - originalRecord.amount) : originalRecord.toBalance - (args.recordInput.amount - originalRecord.amount),
     });

    let difference
    if (originalRecord.type === 'income') {
      difference = args.recordInput.amount - originalRecord.amount
    } else {
      difference = originalRecord.amount - args.recordInput.amount
    }

    const records = await Record.updateMany({date:{$gte: originalRecord.date}}, {
      $inc: { toBalance: difference },
    })

     if (record.type === 'income') {
      await User.findOneAndUpdate({ _id: req.userId }, { 
        balance: creator.balance + args.recordInput.amount - originalRecord.amount,
      });
    } else {
      await User.findOneAndUpdate({ _id: req.userId }, { 
        balance: creator.balance - args.recordInput.amount + originalRecord.amount,
      });
    }
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
    await record.delete();
    const creator =  await User.findOne({ _id: req.userId });
    if (record.type === 'income') {
      await User.findOneAndUpdate({ _id: req.userId }, { 
        balance: creator.balance - record.amount,
      });
    } else {
      await User.findOneAndUpdate({ _id: req.userId }, { 
        balance: creator.balance + record.amount,
      });
    }
    creator.save();
    return record;
  },
  

};