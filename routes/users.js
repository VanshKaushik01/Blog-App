const {Router} = require('express');
const User = require('../models/users');
const router= Router();

router.get('/signup', (req, res) => {
    res.render('signup', {
        user: req.user // Pass user to template
    });
});

router.get('/signin', (req, res) => {
    res.render('signin', {
        user: req.user, // Pass user to template
        error: null     // Initialize error to avoid undefined checks
    });
});

router.post('/signin', async (req, res) => {
    const { email, password } = req.body;
    try {
        const token = await User.matchPasswordandGenerateToken(email, password);
        console.log(token);
        return res.cookie("token",token).redirect('/');
    } catch (err) {
        console.log(err.message);  // Good for debugging
        return res.render('signin', { error: 'Invalid email or password' });
    }
});

router.post('/signup', async(req, res) => {
    const {fullName, email, password} = req.body;
    await User.create({fullName, email, password});
    return res.redirect('/');
});

module.exports = router;