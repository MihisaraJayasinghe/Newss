import mongoose from 'mongoose';

const NewsSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Please provide a title for the news article'],
  },
  content: {
    type: String,
    required: [true, 'Please provide content for the news article'],
  },
  category: {
    type: String,
    required: [true, 'Please provide a category for the news article'],
    enum: ['Politics', 'Sports', 'Technology', 'Entertainment', 'World', 'Local'], // Example categories, modify as needed
  },
  author: {
    type: String,
    required: [true, 'Please provide an author for the news article'],
  },
  publishedAt: {
    type: Date,
    default: Date.now, // Automatically set the publication date to the current time
  },
  
  stype:{
    type:String,
    default: null, // Default value for non-pinned articles
  },
  tag: {
    type: [String], // An array of strings to store tags
    default: [], // Default to an empty array
  },
  imageUrl: {
    type: String, // URL for an image if provided
  },
  videoUrl: {
    type: String, // URL for a video if provided
  },
  mediaPreference: {
    type: String,
    enum: ['image', 'video'],
    default: 'image', // Default preference is image if not set
  },
});

// Check if the model already exists to avoid redeclaring the model multiple times
export default mongoose.models.News || mongoose.model('News', NewsSchema);
