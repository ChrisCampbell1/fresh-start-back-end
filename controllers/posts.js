import { Post } from '../models/post.js'
import { Profile } from '../models/profile.js'

const index = async (req, res) => {
  try {
    const posts = await Post.find({})
    posts.sort((a, b) => a.likes.length - b.likes.length)
    res.status(200).json(posts)
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
  index
}