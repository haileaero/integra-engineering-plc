import crypto from 'crypto'

const ADMIN_USERNAME = process.env.ADMIN_USERNAME
const ADMIN_PASSWORD_HASH = process.env.ADMIN_PASSWORD_HASH

function hashPassword(password) {
  return crypto
    .createHash('sha256')
    .update(password)
    .digest('hex')
}

export default function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({
      success: false,
      message: 'Method not allowed'
    })
  }

  const { username, password } = req.body || {}

  if (!username || !password) {
    return res.status(400).json({
      success: false,
      message: 'Username and password are required.'
    })
  }

  const passwordHash = hashPassword(password)

  if (
    username === ADMIN_USERNAME &&
    passwordHash === ADMIN_PASSWORD_HASH
  ) {
    return res.status(200).json({
      success: true,
      message: 'Login successful.'
    })
  }

  return res.status(401).json({
    success: false,
    message: 'Invalid username or password.'
  })
}