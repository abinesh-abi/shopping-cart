const User = require("../model/users");

module.exports = {
  viewProfile: (userId) => {
    return new Promise((resolve, reject) => {
      User.findOne({ _id: userId }).then((user) => resolve(user));
    });
  },
  viewProfileByIdAndEmail: (email, number) => {
    return new Promise((resolve, reject) => {
      User.findOne({ number, email }).then((user) => {
        resolve(user)
      });
    });
  },
  editProfile: (userId, body) => {
    return new Promise((resolve, reject) => {
      User.updateOne({ _id: userId }, { $set: { ...body } }).then((user) => {
        resolve(user);
      });
    });
  },
  addAddress: (userId,address) => {
    return new Promise((resolve, reject) => {
      // User.updateOne({ _id: userId }, { $push: {address:address} })
      User.updateOne({ _id: userId }, { $push: {address} })
      .then((user)=>{
        resolve(user);
      }).catch((err) => {
       reject(err)
      })
    });
  },
  editAddress:(userId,address,num) => {
    return new Promise((resolve, reject) => {
    User.updateOne({ _id: userId}, { $set:{ [`address.${num}`]:address}})
    .then((user)=>{
      resolve(user)
    }).catch((err) => {
      reject(err)
    })
    })
  },
  deleteAddress:(userId,index)=>{
    return new Promise((resolve, reject) => {
      User.updateOne({ _id: userId},{ $unset: {[`address.${index}`]:1 }})
      .then(() => { 
      User.updateOne({ _id: userId},{$pull:{address:null}})
      .then((data) => {
        resolve(data);
      })
      .catch((err) => reject(err)); 
      })  
    })
  }
};
