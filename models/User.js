const mongoose = require('mongoose');
const bcrypt   = require('bcryptjs');
const SALT_WORK_FACTOR = 10;

const UserSchema = new mongoose.Schema({
  user_id: {type: String, unique: true },         // Unique identifier for the user
  name: {
    first_name: String,
    last_name: String
  },
  email:{type: String, require: true, unique: true },            
  password: {type: String, require: true},                                // Encrypted password
  phone: {type: Number, unique: true },            
  address: {
    street: String,
    city: String,
    state: String,
    number: Number,
    postal_code: String,
    country: String
  },
  role: String,
  preferences: {
    language: String,       // Preferred language
    notifications: {
      email: "boolean",
      sms: "boolean",
      push: "boolean"
    }
  },
  account_status: "string",   // e.g., "active", "suspended", "deleted"
  document_account: {
    cpf:            {type: String, unique: true },
    rg:             {type: String, unique: true },
    date_of_birth:  Date,                   // Format: YYYY-MM-DD
    sex:           String,
    mother_name:            String,
    father_name:            String,},       // Account creation timestamp
  created_at: Date,       // Account creation timestamp
  updated_at: Date        // Last update timestamp
}, { collection: 'users'  
});


UserSchema.pre('save', async function (next) {
 // only hash the password if it has been modified (or is new)
if (!this.isModified('password')) return next();

// generate a salt
bcrypt.genSalt(SALT_WORK_FACTOR, function(err, salt) {
    if (err) return next(err);

    // hash the password along with our new salt
    bcrypt.hash(this.password, salt, function(err, hash) {
        if (err) return next(err);

        // override the cleartext password with the hashed one
        this.password = hash;
        next();
    })
  });
})

UserSchema.methods.comparePassword = async function(candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

module.exports = mongoose.model('users', UserSchema);
