import { Profile } from '../models/profile.js'
import { v2 as cloudinary } from 'cloudinary'

function index(req, res) {
  Profile.find({})
  .then(profiles => res.json(profiles))
  .catch(err => {
    console.log(err)
    res.status(500).json(err)
  })
}

function addPhoto(req, res) {
  const imageFile = req.files.photo.path
  Profile.findById(req.params.id)
  .then(profile => {
    cloudinary.uploader.upload(imageFile, {tags: `${req.user.email}`})
    .then(image => {
      profile.photo = image.url
      profile.save()
      .then(profile => {
        res.status(201).json(profile.photo)
      })
    })
    .catch(err => {
      console.log(err)
      res.status(500).json(err)
    })
  })
}

const follow = async (req, res) => {
  try {
    const followedProfile = await Profile.findById(req.params.id)
    followedProfile.followers.push(req.user.profile)
    await followedProfile.save()

    const followingProfile = await Profile.findById(req.user.profile)
    followingProfile.following.push(req.params.id)
    await followingProfile.save()

    res.status(204).json({ msg: 'OK' })
  } catch (err) {
    console.log(err)
    res.status(500).json(err)
  }
}

const unfollow = async (req, res) => {
  try {
    const followedProfile = await Profile.findById(req.params.id)
    followedProfile.followers.pull(req.user.profile)
    await followedProfile.save()

    const followingProfile = await Profile.findById(req.user.profile)
    followingProfile.following.pull(req.params.id)
    await followingProfile.save()

    res.status(204).json({ msg: 'OK' })
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
  addPhoto,
  follow,
  unfollow,
}
