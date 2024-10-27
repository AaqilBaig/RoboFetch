const router = require("express").Router();
const passport = require("passport");

router.get('/login/success', (req, res) => {
    if (req.isAuthenticated()) {
        res.json({ user: req.user });
      } else {
        console.log("not authenticated");
      } 
})
router.get('/login/failed', (req, res) => {
    console.log('logging in')
    res.status(401).json({
        error: true,
        message: "Login failed"
    })
})


router.get('/google', passport.authenticate('google', { scope: ['profile', 'email'] }));

router.get('/google/callback', 
  passport.authenticate('google', { failureRedirect: '/' }),
  (req, res) => {
    res.redirect('http://localhost:5173/'); // Redirect to home or any other route after successful authentication
  }
);

router.get('/logout', (req, res) => {
  req.logout(err => {
    if (err) {
      return res.status(500).send('Failed to logout');
    }
    req.session.destroy(err => {
      if (err) {
        return res.status(500).send('Failed to destroy session');
      }
      res.clearCookie('connect.sid', { path: '/' });
      res.send('Logged out successfully');
    });
  });
});

module.exports = router;
