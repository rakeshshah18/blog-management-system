// const { required } = require("joi");
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

const newUserSchema = new mongoose.Schema({
    userName: { 
        type: String,
        required: true, 
        minlength: 3, 
        maxlength: 20 
    },
    email: { 
        type: String, 
        required: true, 
        unique: true 
    },
    password: { 
        type: String, 
        required: true, 
        minlength: 8 
    },
    age: { 
        type: Number, 
        required: true, 
        min: 18, 
        max: 100 
    },
});

newUserSchema.pre("save", async function (next) {
    // const bcrypt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, 10);
    next();

})
newUserSchema.methods.comparePassword = async function (password) {
    return bcrypt.compare(password, this.password);
}


module.exports = mongoose.model('User', newUserSchema);
