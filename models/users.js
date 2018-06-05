const mongoose = require('mongoose');
const validator = require('validator');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    trim: true,
    minlength: 1,
    unique: true,
    validate: {
      validator: validator.isEmail,
      message: '{VALUE} is not a valid email',
    }
  },
  password: {
    type: String,
    require: true,
    minlength: 6,
  },
  todo: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Todo',
  },
  tokens: [{
    access: {
      type: String,
      required: true,
    },
    token: {
      type: String,
      required: true,
    },
  }]
});

userSchema.methods.toJSON = function() {
  const user = this;
  return {_id: user.id, email: user.email};
};

userSchema.methods.createToken = function() {
  const user = this;
  const access = 'auth';
  const token = jwt.sign({_id: user._id, access}, process.env.JWT_SECRET).toString();
  user.tokens.push({access, token});

  return user.save().then(() => {
    return token;
  });
};

userSchema.methods.removeToken = function(token) {
  const user = this;

  return user.update({
    $pull: {
      tokens: {token}
    }
  });
};

userSchema.statics.findByToken = function(token) {
  const user = this;
  let decoded;

  try {
    decoded = jwt.verify(token, process.env.JWT_SECRET);
  } catch (e) {
    return Promise.reject();
  }

  return user.findOne({
    '_id': decoded._id,
    'tokens.token': token,
    'tokens.access': 'auth',
  });
};

userSchema.statics.findByCredentials = function(email, password) {
  const user = this;

  return user.findOne({ email }).then((user) => {
    if(!user) {
      return Promise.reject();
    };

    return new Promise((resolve, reject) => {
      bcrypt.compare(password, user.password, (err, res) => {
        if(res) {
          resolve(user);
        } else {
          reject();
        };
      });
    });
  });
};

userSchema.pre('save', function(next) {
  const user = this;

  if (!user.isModified('password')) {
    return next();
  };

  return bcrypt
    .hash(user.password, 10)
    .then(hashedPassword => {
      user.password = hashedPassword;
      return next();
    }, (e) => {
      return next(e);
    });
});

const User = mongoose.model('User', userSchema);

module.exports = User;
