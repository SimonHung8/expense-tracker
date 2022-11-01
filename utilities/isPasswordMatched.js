function isPasswordMatched(value, req) {
  if (value !== req.body.password) throw new Error('請輸入相同密碼')
  return true
}

module.exports = isPasswordMatched