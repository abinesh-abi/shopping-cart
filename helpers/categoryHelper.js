const Category = require("../model/category");

module.exports = {
    findCategory:()=>{
        return new Promise((resolve, reject) => {
            Category.find().then((category) => resolve(category))
            .catch((error) => reject(error))
        })
    },findOneCategory:(name)=>{
        return new Promise((resolve, reject) => {
            Category.findOne({name}).then((category) => resolve(category))
            .catch((error) => reject(error))
        })
    },addCategory:(name)=>{
        return new Promise((resolve, reject) => {
            new Category({name}).save().then((category) => resolve(category))
            .catch((error) => reject(error))
        })
    },editCategory: (_id,name)=>{
        return new Promise((resolve, reject) => {
            Category.findOneAndUpdate({_id},{$set:{name}}).then(data =>{
                resolve(data);
            }).catch(err => reject(err));
        })
    },deleteCategory: (_id)=>{
        return new Promise((resolve, reject) => {
            Category.findOneAndDelete({_id}).then(data =>{
                resolve(data);
            }).catch(err => reject(err));
        })
    },editCategoryOffer: (_id,offer)=>{
        return new Promise((resolve, reject) => {
            Category.findOneAndUpdate({_id},{$set:{offer}}).then(data =>{
                resolve(data);
            }).catch(err => reject(err));
        })
    },categoryFindOneById: (_id)=>{
        return new Promise((resolve, reject) => {
            Category.findOne({_id}).then(data =>{
                resolve(data);
            }).catch(err => reject(err));
        })
    },categoryExistOrNot: (_id,name)=>{
        return new Promise((resolve, reject) => {
            Category.findOne({_id:{$ne:_id},name}).then(data =>{
                resolve(data);
            }).catch(err => reject(err));
        })
    }

}