// FILE: server/src/controllers/auth.controller.js
// ONLY CHANGE: The googleCallback function at the bottom
// Pass token in redirect URL instead of cookie (fixes cross-domain issue)
// Everything else above is identical — do not change any other function

import jwt from 'jsonwebtoken'
import User from '../models/User.js'

const sendToken = (user, status, res) => {
  const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE || '7d',
  })
  res.cookie('token', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
    maxAge: 7 * 24 * 60 * 60 * 1000,
  })
  res.status(status).json({
    success: true,
    user: {
      _id:       user._id,
      firstName: user.firstName,
      lastName:  user.lastName,
      email:     user.email,
      role:      user.role,
      phone:     user.phone,
      avatar:    user.avatar,
      addresses: user.addresses,
      wishlist:  user.wishlist,
    },
  })
}

export const register = async (req, res) => {
  try {
    const { firstName, lastName, email, password, phone, newsletter } = req.body
    if (await User.findOne({ email }))
      return res.status(400).json({ success: false, message: 'Email already registered' })
    const user = await User.create({ firstName, lastName, email, password, phone, newsletter })
    sendToken(user, 201, res)
  } catch (err) {
    res.status(500).json({ success: false, message: err.message })
  }
}

export const login = async (req, res) => {
  try {
    const { email, password } = req.body
    const user = await User.findOne({ email }).select('+password')
    if (!user || !(await user.matchPassword(password)))
      return res.status(401).json({ success: false, message: 'Invalid email or password' })
    sendToken(user, 200, res)
  } catch (err) {
    res.status(500).json({ success: false, message: err.message })
  }
}

export const logout = (req, res) => {
  res.cookie('token', '', { httpOnly: true, expires: new Date(0) })
  res.json({ success: true, message: 'Logged out' })
}

export const getMe = async (req, res) => {
  const user = await User.findById(req.user._id)
    .populate('wishlist', 'name slug price coverImage gradientFrom gradientTo')
  res.json({ success: true, user })
}

export const updateProfile = async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(
      req.user._id,
      { firstName: req.body.firstName, lastName: req.body.lastName, phone: req.body.phone },
      { new: true }
    )
    res.json({ success: true, user })
  } catch (err) {
    res.status(500).json({ success: false, message: err.message })
  }
}

export const updatePassword = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select('+password')
    if (!(await user.matchPassword(req.body.currentPassword)))
      return res.status(401).json({ success: false, message: 'Current password incorrect' })
    user.password = req.body.newPassword
    await user.save()
    res.json({ success: true, message: 'Password updated' })
  } catch (err) {
    res.status(500).json({ success: false, message: err.message })
  }
}

export const addAddress = async (req, res) => {
  try {
    const user = await User.findById(req.user._id)
    if (req.body.isDefault) user.addresses.forEach(a => (a.isDefault = false))
    user.addresses.push(req.body)
    await user.save()
    res.json({ success: true, addresses: user.addresses })
  } catch (err) {
    res.status(500).json({ success: false, message: err.message })
  }
}

export const toggleWishlist = async (req, res) => {
  try {
    const user = await User.findById(req.user._id)
    const pid  = req.params.productId
    const idx  = user.wishlist.indexOf(pid)
    idx > -1 ? user.wishlist.splice(idx, 1) : user.wishlist.push(pid)
    await user.save()
    res.json({ success: true, wishlist: user.wishlist })
  } catch (err) {
    res.status(500).json({ success: false, message: err.message })
  }
}

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// FIXED googleCallback — passes token in URL instead of cookie
// Cross-domain cookies are blocked by browsers, so we pass the
// JWT token as a URL param. The frontend reads it and stores it.
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
export const googleCallback = async (req, res) => {
  try {
    const user = req.user
    if (!user) return res.redirect(`${process.env.CLIENT_URL}/login?error=google_failed`)

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: process.env.JWT_EXPIRE || '7d',
    })

    // Also set the cookie (works for same-domain and some cross-domain setups)
    res.cookie('token', token, {
      httpOnly: true,
      secure: true,
      sameSite: 'none',
      maxAge: 7 * 24 * 60 * 60 * 1000,
    })

    // Pass token in URL so frontend can use it even if cookie is blocked
    res.redirect(`${process.env.CLIENT_URL}/auth/callback?token=${token}`)
  } catch (err) {
    res.redirect(`${process.env.CLIENT_URL}/login?error=server_error`)
  }
}