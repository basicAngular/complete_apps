var express = require('express');
var router = express.Router();
var bcrypt = require('bcryptjs');
var User = require('../models/user')
/* GET users listing. */
router.post('/', (req, res) => {
  const user = new User({
    firstname: req.body.firstname,
    lastname: req.body.lastname,
    email: req.body.email,
    password: bcrypt.hashSync(req.body.password, 10)
  })
  user.save(function (err, result) {
    if (err) {
      return res.status(500).json({
        title: 'something went wrong',
        error: err
      })
    }
    res.status(200).json({
      message: 'Successfull',
      obj: req.body.email
    })
    // console.log(result)
  })
})


module.exports = router;
