import { Profile } from '../models/profile.js'
import { v2 as cloudinary } from 'cloudinary'

const index = async (req, res) => {
  try {
    const profiles = await Profile.find({})
      .populate('journeys', ['name', 'photo'])
    res.json(profiles)
  } catch (err) {
    console.log(err);
    res.status(500).json(err);
  }
}

const addPhoto = async(req, res) => {
  try {
    const imageFile = req.files.photo.path
    const profile = await Profile.findById(req.params.id);
    const image = await cloudinary.uploader.upload(imageFile, { tags: `${req.user.email}` });
    profile.photo = image.url;
    const savedProfile = await profile.save();
    res.status(201).json(savedProfile.photo);
    } catch (err) {
    console.log(err);
    res.status(500).json(err);
    }
  }

const show = async (req, res) => {
  try {
    const profile = await Profile.findById(req.params.id)
      .populate('followers', ['name', 'photo'])
      .populate('following', ['name', 'photo'])
      .populate('journeys', 'name')
      .populate('posts')
    res.status(200).json(profile)
  } catch (err) {
    console.log(err)
    res.status(500).json(err)
  }
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

export {
  index,
  addPhoto,
  show,
  follow,
  unfollow,
}
