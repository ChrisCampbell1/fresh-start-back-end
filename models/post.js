import mongoose from 'mongoose'

const Schema = mongoose.Schema

const commentSchema = new Schema({
  author: { type: Schema.Types.ObjectId, ref: 'Profile'},
  content: { type: String, required: true},
}, {
  timestamps: true,
})

const postSchema = new Schema({
  author: { type: Schema.Types.ObjectId, ref: 'Profile' },
  title: { type: String, required: true },
  category: { type: String, enum: ['Food', 'Fitness', 'Blog Entry'], required: true },
  journey: { type: Schema.Types.ObjectId, ref: 'Journey' },
  content: { type: String, required: true },
  photos: [String],
  comments: [commentSchema],
  likes: [{ type: Schema.Types.ObjectId, ref: 'Profile' }],
}, {
  timestamps: true,
})

const Post = mongoose.model('Post', postSchema)

export { Post }