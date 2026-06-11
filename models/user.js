const  mongoose  =  require("mongoose");
const {plugin} = require('@typegoose/typegoose')
const uniqueValidator = require("mongoose-unique-validator").default;

const userSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true
    },
    password: {
      type: String,
      required: true,
      trim: true,
      
    },
    firstName: {
      type: String,
      required: true,
      trim: true,
      minLength: [3, 'First Name too short'],
      maxLength: [50, 'First Name too long']
    },
    lastName: {
      type: String,
      required: true,
      trim: true,
      minLength: [3, 'Last Name too short'],
      maxLength: [50, 'Last Name too long']
    },
  },
  { timestamps: true }
);

userSchema.set('toJSON', {
  transform: (document,returnedObject) => {
    returnedObject.id  =  returnedObject._id.toString()
    delete returnedObject._id
    delete returnedObject.__v
    delete returnedObject.password  
    delete returnedObject.createdAt
    delete returnedObject.updatedAt
  }
})

userSchema.plugin(uniqueValidator.default || uniqueValidator);

module.exports  =  mongoose.model('User', userSchema)