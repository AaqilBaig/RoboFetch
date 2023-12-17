const router = require("express").Router();
const passport = require("passport");

router.get('/login/success', (req, res) => {
    if (req.user) {
        res.status(200).json({
            error: false,
            message: "User has successfully authenticated",
            user: req.user,
        })
    }
    else {
        res.status(403).json({
            error: true,
            message: "NOt Authorized"
        })
    }
})
router.get('/login/failed', (req, res) => {
    res.status(401).json({
        error: true,
        message: "Login failed"
    })
})


router.get("/google", passport.authenticate('google', ['profile', 'email']));

router.get(
  "/google/callback",
  passport.authenticate("google", {
    failureRedirect: "/login/failed",
    successRedirect: "http://localhost:5173/",
  })
);

// router.get('logout', (req, res) => {
//     req.logout();
//     res.redirect('http://localhost:3000/')
// })

module.exports = router;
