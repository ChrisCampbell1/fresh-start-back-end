import { Post } from '../models/post.js'
import { Profile } from '../models/profile.js'
import { v2 as cloudinary } from 'cloudinary'

const index = async (req, res) => {
  try {
    const profile = await Profile.findById(req.user.profile)
    const posts = await Post.find({ author: profile.following })
      .populate('author', ['name', 'photo'])
      .populate('journey', 'name')
    posts.sort((a, b) => new Date(b.createdAt).valueOf() - new Date(a.createdAt).valueOf())
    res.status(200).json(posts)
  } catch (err) {
    console.log(err)
    res.status(500).json(err)
  }
}

const create = async (req, res) => {
  try {
    req.body.author = req.user.profile
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
      .populate('author', ['name', 'photo'])
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
    const userProfile = req.user.profile;
    const index = post.likes.findIndex(profile => profile.toString() === userProfile.toString());
    if (index === -1) {
      post.likes.push(userProfile)
      await post.save()
      res.status(204).json({ msg: 'OK' })
    } else {
      res.status(400).json({ msg: 'Duplicate like from the same user' })
    }
  } catch (err) {
    console.log(err)
    res.status(500).json(err)
  }
}

const removeLike = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id)
    const userProfile = req.user.profile;
    const index = post.likes.findIndex(profile => profile.toString() === userProfile.toString());
    if (index !== -1) {
      post.likes.pull(userProfile)
      await post.save()
      res.status(204).json({ msg: 'OK' })
    } else {
      res.status(400).json({ msg: 'Profile not found in the likes array' })
    }
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


const addPhoto = async(req, res) => {
  try {
    const imageFile = req.files.photo.path
    const post = await Post.findById(req.params.id);
    const image = await cloudinary.uploader.upload(imageFile, { tags: `${req.user.email}` });
    post.photo = image.url;
    const savedPost = await post.save();
    res.status(201).json(savedPost.photo);
    } catch (err) {
    console.log(err);
    res.status(500).json(err);
    }
  }

export {
  index,
  create,
  show,
  update,
  deletePost as delete,
  addLike,
  removeLike,
  createComment,
  deleteComment,
  addPhoto,
}