// @login & register
const express = require('express');
const router = express.Router();
const passport = require('passport');

const Profile = require('../../models/Profile');

// @route  GET api/profiles/test
// @desc   返回請求的json數據
// @access public
router.get('/test', (req, res) => {
  res.json({ msg: 'profile works' });
});

// @route  POST api/profiles/add
// @desc   創建訊息接口
// @access Private
router.post(
  '/add',
  passport.authenticate('jwt', { session: false }),
  (req, res) => {
    const profileFields = {};

    if (req.body.type) profileFields.type = req.body.type;
    if (req.body.describe) profileFields.describe = req.body.describe;
    if (req.body.income) profileFields.income = req.body.income;
    if (req.body.expend) profileFields.expend = req.body.expend;
    if (req.body.cash) profileFields.cash = req.body.cash;
    if (req.body.remark) profileFields.remark = req.body.remark;

    new Profile(profileFields).save().then(profile => {
      res.json(profile);
    });
  }
);

// @route  GET api/profiles
// @desc   獲取所有信息
// @access Private

router.get(
  '/',
  passport.authenticate('jwt', { session: false }),
  (req, res) => {
    Profile.find()
      .then(profile => {
        if (!profile) {
          return res.status(404).json('没有任何内容');
        }

        res.json(profile);
      })
      .catch(err => res.status(404).json(err));
  }
);

// @route  GET api/profiles/:id
// @desc   獲取單個訊息
// @access Private

router.get(
  '/:id',
  passport.authenticate('jwt', { session: false }),
  (req, res) => {
    Profile.findOne({ _id: req.params.id })
      .then(profile => {
        if (!profile) {
          return res.status(404).json('没有任何内容');
        }

        res.json(profile);
      })
      .catch(err => res.status(404).json(err));
  }
);

// @route  POST api/profiles/edit
// @desc   編輯訊息接口
// @access Private
router.post(
  '/edit/:id',
  passport.authenticate('jwt', { session: false }),
  (req, res) => {
    const profileFields = {};

    if (req.body.type) profileFields.type = req.body.type;
    if (req.body.describe) profileFields.describe = req.body.describe;
    if (req.body.income) profileFields.income = req.body.income;
    if (req.body.expend) profileFields.expend = req.body.expend;
    if (req.body.cash) profileFields.cash = req.body.cash;
    if (req.body.remark) profileFields.remark = req.body.remark;

    Profile.findOneAndUpdate(
      { _id: req.params.id },
      { $set: profileFields },
      { new: true }
    ).then(profile => res.json(profile));
  }
);

// @route  POST api/profiles/delete/:id
// @desc   删除訊息接口
// @access Private
router.delete(
  '/delete/:id',
  passport.authenticate('jwt', { session: false }),
  (req, res) => {
    Profile.findOneAndRemove({ _id: req.params.id })
      .then(profile => {
        profile.save().then(profile => res.json(profile));
      })
      .catch(err => res.status(404).json('刪除失败!'));
  }
);

module.exports = router;
