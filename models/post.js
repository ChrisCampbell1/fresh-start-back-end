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
  category: { type: String, enum: ['Food', 'Fitness', 'BlogEntry'], required: true },
  journey: { type: Schema.Types.ObjectId, ref: 'Journey' },
  content: { type: String, required: true },
  likes: [{ type: Schema.Types.ObjectId, ref: 'Profile' }],
  comments: [commentSchema],
  photo: String,
}, {
  timestamps: true,
})

const Post = mongoose.model('Post', postSchema)

export { Post }