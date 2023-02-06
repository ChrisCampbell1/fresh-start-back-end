import { Journey } from '../models/journey.js'
import { Profile } from '../models/profile.js'
import { v2 as cloudinary } from 'cloudinary'

const index = async (req, res) => {
  try {
    const journeys = await Journey.find({})
    journeys.sort((a, b) => b.subscribers.length - a.subscribers.length)
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
    console.log(`Received request for journey with id: ${req.params.id}`)
    const journey = await Journey.findById(req.params.id)
      .populate({path: 'subscribers', select: ['name', 'journeys']})
      .populate('reviews.author', ['name', 'photo'])
    console.log(`Retrieved journey:`, journey)
    res.status(200).json(journey)
  } catch (err) {
    console.error(`Error retrieving journey:`, err)
    res.status(500).json(err)
  }
}

const addSubscriber = async (req, res) => {
  try {
    const journey = await Journey.findById(req.params.id)
    const userProfile = req.user.profile;
    const index = journey.subscribers.findIndex(profile => profile.toString() === userProfile.toString());
    if (index === -1) {
      journey.subscribers.push(userProfile)
      await journey.save()

      const profile = await Profile.findById(req.user.profile)
      profile.journeys.push(req.params.id)
      await profile.save()

      res.status(200).json(profile)
    } else {
      res.status(400).json({ msg: 'Duplicate subscription from the same user' })
    }
  } catch (err) {
    console.log(err)
    res.status(500).json(err)
  }
}

const removeSubscriber = async (req, res) => {
  try {
    const journey = await Journey.findById(req.params.id)
    const userProfile = req.user.profile;
    const index = journey.subscribers.findIndex(profile => profile.toString() === userProfile.toString());
    if (index !== -1) {
      journey.subscribers.pull(userProfile)
      await journey.save()

      const profile = await Profile.findById(req.user.profile)
      profile.journeys.pull(req.params.id)
      await profile.save()

      res.status(204).json({ msg: 'OK' })
    } else {
      res.status(400).json({ msg: 'User is not subscribed to this journey' })
    }
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

const deleteReview = async (req, res) => {
  try {
    const journey = await Journey.findById(req.params.id)
    journey.reviews.pull(req.params.reviewId)
    await journey.save()
    res.status(204).json({ msg: 'OK' })
  } catch (err) {
    console.log(err)
    res.status(500).json(err)
  }
}

const addPhoto = async (req, res) => {
  try {
    const imageFile = req.files.photo.path
    const journey = await Journey.findById(req.params.id);
    const image = await cloudinary.uploader.upload(imageFile, { tags: `${req.user.email}` });
    journey.photo = image.url;
    const savedJourney = await journey.save();
    res.status(201).json(savedJourney.photo);
    } catch (err) {
    console.log(err);
    res.status(500).json(err);
  }
}


export {
  index,
  create,
  show,
  addSubscriber,
  removeSubscriber,
  createReview,
  deleteReview,
  addPhoto
}