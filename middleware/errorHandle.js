function errorHandle(err, _, res, _) {
  console.log(err)
  res.render('err')
}

module.exports = errorHandle