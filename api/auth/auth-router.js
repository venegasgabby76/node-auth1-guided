const router = require("express").Router();
const users = require("../users/users-model");
const bycrypt = require("bcryptjs");

router.post("/register", async (req, res) => {
  let user = req.body;

  const hash = bycrypt.hashSync(user.password, 10);
  user.password = hash;

  try {
    const savedUser = await users.add(user);
    res.status(201).json(savedUser);
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "error adding user",
    });
  }
});

router.post("/login", async (req, res) => {
  let { username, password } = req.body;

  try {
    const user = await users.findBy({ username }).first();

    if (user && bycrypt.compareSync(password, user.password)) {
        req.session.user = user;
      res.status(200).json({
        message: `Welcome ${user.username}`,
      });
    } else {
      res.status(401).json({
        message: "invalid credentials",
      });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "error logging in",
    });
  }
});


router.delete('/logout', (req, res) => {
  if (req.session) {
      // check out the documentation for this method at
      // https://www.npmjs.com/package/express-session, under
      // Session.destroy().
      req.session.destroy((err) => {
          if (err) {
              res.status(400).json({ message: 'error logging out:', error: err });
          } else {
              res.json({ message: 'logged out' });
          }
      });
  } else {
      res.end();
  }
});

module.exports = router;
