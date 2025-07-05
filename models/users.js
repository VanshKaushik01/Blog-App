const { Schema, model}=require('mongoose');
const {createHmac, randomBytes} = require('crypto');
const {createTokenForUser} = require('../services/authentication');

const userSchema = new Schema({
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
    salt:{
        type: String,
    },
    profilePicture: {
        type: String,
        default: '/images/avatar.png',
    },
    role: {
        type: String,
        enum: ['USER', 'ADMIN'],
        default: 'USER',
    },
},{timestamps: true},
);

userSchema.pre('save', function(next) {
    const user = this;
    if (!user.isModified('password')) return;

        const salt = randomBytes(16).toString('hex');
        const hashedPassword = createHmac('sha256', salt).update(user.password).digest('hex');

        this.password = hashedPassword;
        this.salt = salt;
    next();
});

userSchema.static("matchPasswordandGenerateToken",async function(email , password){
    const user=await this.findOne({email});
    if(!user) throw new Error('User not found');
    
    const salt = user.salt;
    const hashedPassword = user.password;

    const UserProvidedhash=createHmac('sha256', salt).update(password).digest('hex');
   
    if(UserProvidedhash !== hashedPassword) throw new Error('Invalid password');
    const Token=createTokenForUser(user);
    return Token;
})
const user= model('user', userSchema);

module.exports = user;