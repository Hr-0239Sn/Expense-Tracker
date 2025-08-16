const moongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const userSchema = new moongoose.Schema({
    fullName: {
        type: String,
        required: true,
    },  
    email: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
    },
    profileImageUrl: {
        type: String,
        default: null,
    },

},
{
    timestamps: true,
});

// hash password before saving
userSchema.pre('save', async function(next) {
    if (!this.isModified('password')) 
        return next();
    
    // const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, 10);
    next();
});
// compare password
userSchema.methods.comparePassword = async function(candidatePassword) {
    return await bcrypt.compare(candidatePassword, this.password);
};

module.exports = moongoose.model('User', userSchema);