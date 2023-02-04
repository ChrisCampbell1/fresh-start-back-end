import { Journey } from '../models/journey'

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
}