import mongoose from 'mongoose';

const linkSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
    maxlength: 100
  },
  url: {
    type: String,
    required: true,
    trim: true
  },
  app: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'App',
    required: true
  },
  credentials: [{
    name: {
      type: String,
      required: true,
      trim: true
    },
    value: {
      type: String,
      default: ''
    },
    visibility: {
      type: String,
      enum: ['public', 'private'],
      default: 'private'
    }
  }],
  status: {
    type: String,
    enum: ['active', 'inactive'],
    default: 'active'
  },
  sortOrder: {
    type: Number,
    default: 0
  }
}, {
  timestamps: true,
  collection: 'nav_links'
});

linkSchema.index({ app: 1 });
linkSchema.index({ status: 1 });
linkSchema.index({ sortOrder: 1 });

const Link = mongoose.model('Link', linkSchema);

export default Link;