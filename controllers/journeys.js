import { Journey } from '../models/journey.js'
import { Profile } from '../models/profile.js'

const index = async (req, res) => {
  try {
    const journeys = await Journey.find({})
    journeys.sort((a, b) => a.subscribers.length - b.subscribers.length)
    res.status(200).json(journeys)
  } catch (err) {
    console.log(err)
    res.status(500).json(err)
  }
}

const create = async (req, res) => {
  try {
    const journey = await Journey.create(req.body)
    res.status(201).json(journey)
  } catch (err) {
    console.log(err)
    res.status(500).json(err)
  }
}

const show = async (req, res) => {
  try {
    const journey = await Journey.findById(req.params.id)
      .populate('subscribers')
      .populate('reviews.author')
    res.status(200).json(journey)
  } catch (err) {
    console.log(err)
    res.status(500).json(err)
  }
}

const createReview = async (req, res) => {
  try {
    req.body.author = req.user.profile
    const journey = await Journey.findById(req.params.id)
    journey.reviews.push(req.body)
    await journey.save()

    const newReview = journey.reviews[journey.reviews.length - 1]
    const profile = await Profile.findById(req.user.profile)
    newReview.author = profile

    res.status(201).json(newReview)
  } catch (err) {
    console.log(err)
    res.status(500).json(err)
  }
}

// Controller Stub

// const index = async (req, res) => {
//   try {

//   } catch (err) {
//     console.log(err)
//     res.status(500).json(err)
//   }
// }

export {
  index,
  create,
  show,
  createReview
}