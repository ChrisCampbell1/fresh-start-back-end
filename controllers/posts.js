import { Post } from '../models/post.js'
import { Profile } from '../models/profile.js'

const index = async (req, res) => {
  try {
    const posts = await Post.find({})
      .populate('author', 'name')
      .populate('journey', 'name')
    posts.sort((a, b) => a.likes.length - b.likes.length)
    res.status(200).json(posts)
  } catch (err) {
    console.log(err)
    res.status(500).json(err)
  }
}

const create = async (req, res) => {
  try {
    req.body.author = req.user.profile

    // might need to handle photo data here

    const post = await Post.create(req.body)
    const profile = await Profile.findByIdAndUpdate(req.user.profile,
      { $push: {posts: post} },
      { new: true }
    )
    post.author = profile
    res.status(201).json(post)
  } catch (err) {
    console.log(err)
    res.status(500).json(err)
  }
}

const show = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id)
      .populate('author', 'name')
      .populate('journey', 'name')
      .populate('comments.author', 'name')
    res.status(200).json(post)
  } catch (err) { 
    console.log(err);
    res.status(500).json(err)
  }
}

const update = async (req, res) => {
  try {
    const post = await Post.findByIdAndUpdate(req.params.id, req.body, { new: true })
      .populate('author', 'name')
    res.status(200).json(post)
  } catch (err) {
    console.log(err)
    res.status(500).json(err)
  }
}

const deletePost = async (req, res) => {
  try {
    const post = await Post.findByIdAndDelete(req.params.id)
    const profile = await Profile.findById(req.user.profile)
    profile.posts.pull(req.params.id)
    await profile.save()
    res.status(200).json(post)
  } catch (err) {
    res.status(500).json(err)
  }
}

const addLike = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id)
    post.likes.push(req.user.profile)
    await post.save()
    res.status(204).json({ msg: 'OK' })
  } catch (err) {
    console.log(err)
    res.status(500).json(err)
  }
}

const createComment = async (req, res) => {
  try {
    req.body.author = req.user.profile
    const post = await Post.findById(req.params.id)
    post.comments.push(req.body)
    await post.save()

    const newComment = post.comments[post.comments.length - 1]
    
    const profile = await Profile.findById(req.user.profile)
    newComment.author = profile

    res.status(201).json(newComment)
  } catch (err) {
    console.log(err);
    res.status(500).json(err)
  }
}

const deleteComment = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id)
    post.comments.pull(req.params.commentId)
    await post.save()
    res.status(200).json({ msg: 'OK' })
  } catch (err) {
    console.log(err);
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
  update,
  deletePost as delete,
  addLike,

  createComment,
  deleteComment,
}