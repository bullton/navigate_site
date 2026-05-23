import mongoose from 'mongoose';

const appSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
    maxlength: 200
  },
  slug: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true
  },
  description: {
    type: String,
    default: '',
    maxlength: 1000
  },
  url: {
    type: String,
    required: true,
    trim: true
  },
  icon: {
    type: String,
    default: 'AppWindow'
  },
  category: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Category',
    default: null
  },
  tags: {
    type: [String],
    default: []
  },
  status: {
    type: String,
    enum: ['active', 'inactive', 'maintenance'],
    default: 'active'
  },
  featured: {
    type: Boolean,
    default: false
  },
  sortOrder: {
    type: Number,
    default: 0
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
      default: 'public'
    },
    order: {
      type: Number,
      default: 0
    }
  }],
  metadata: {
    viewCount: {
      type: Number,
      default: 0
    },
    lastAccessedAt: {
      type: Date,
      default: null
    }
  }
}, {
  timestamps: true,
  collection: 'nav_apps'
});

appSchema.index({ slug: 1 });
appSchema.index({ status: 1 });
appSchema.index({ featured: 1 });
appSchema.index({ sortOrder: 1 });
appSchema.index({ category: 1 });

appSchema.pre('save', function(next) {
  if (this.isModified('status') && this.status === 'active') {
    this.metadata.lastAccessedAt = new Date();
  }
  next();
});

const App = mongoose.model('App', appSchema);

export default App;