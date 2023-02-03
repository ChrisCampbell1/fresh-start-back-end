import mongoose from 'mongoose'

const Schema = mongoose.Schema

const profileSchema = new Schema({
  name: String,
  photo: String,
  posts: [{ type: Schema.Types.ObjectId, ref: 'Post' }],
  journies: [{ type: Schema.Types.ObjectId, ref: 'Journey' }],
  likedPosts: [{ type: Schema.Types.ObjectId, ref: 'Profile' }],
  followers: [{ type: Schema.Types.ObjectId, ref: 'Profile' }],
  following: [{ type: Schema.Types.ObjectId, ref: 'Profile' }],
},{
  timestamps: true,
})

const Profile = mongoose.model('Profile', profileSchema)

export { Profile }
