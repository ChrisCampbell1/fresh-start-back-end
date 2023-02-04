import { Journey } from '../models/journey.js'

const index = async (req, res) => {
  try {
    const journeys = await Journey.find({})
      .populate('subscribers')
      .populate('reviews.author')
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
}