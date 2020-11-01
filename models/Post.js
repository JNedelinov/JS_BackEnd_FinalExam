const mongoose = require('mongoose');
const validator = require('validator');
const Schema = mongoose.Schema;

const PostSchema = new Schema(
  {
    title: {
      type: String,
      unique: true,
      required: [true, 'The title is required'],
      minlength: [4, 'The title must be at least 4 characters long'],
    },
    description: {
      type: String,
      required: [true, 'The description is required'],
      minlength: [20, 'The description must be at least 20 characters long'],
    },
    imageUrl: {
      type: String,
      required: [true, 'The image URL is required'],
      validate: {
        validator: (value) =>
          validator.isURL(value, {
            protocols: ['http', 'https', 'ftp'],
            require_tld: true,
            require_protocol: true,
          }),
        message: 'Must be a Valid URL',
      },
    },
    duration: {
      type: String,
      required: [true, 'The duration must be set'],
      validate: {
        validator: function(v) {
          return /(\d+) (weeks|week)/.test(v);
        }, 
        message: 'Invalid entered duration. It should be like this - 4 weeks'
      }
    },
    creatorId: String,
    usersLiked: [{ type: mongoose.Schema.Types.ObjectId, ref: 'user' }],
  },
  { timestamps: true }
);

const Post = mongoose.model('post', PostSchema);
module.exports = Post;