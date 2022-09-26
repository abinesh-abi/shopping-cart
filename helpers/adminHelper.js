const Admin = require("../model/admin")

module.exports ={
    getAdminByEmail:email=>{
        return new Promise((resolve, reject) => {
            Admin.findOne({ email})
            .then(data=> resolve(data))
            .catch(err=> reject(err))
            
        })
    }
}