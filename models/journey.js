import mongoose from 'mongoose'

const Schema = mongoose.Schema

const reviewSchema = new Schema({
  author: { type: Schema.Types.ObjectId, ref: 'Profile' },
  rating: { type: Number, required: true, min: 0, max: 5 },
  content: { type: String, required: true },
}, {
  timestamps: true,
})

const journeySchema = new Schema({
  name: { type: String, required: true },
  description: { type: String, required: true },
  subscribers: [{ type: Schema.Types.ObjectId, ref: 'Profile' }],
  reviews: [reviewSchema],
})

const Journey = mongoose.model('Journey', journeySchema)

export { Journey }