const express = require('express');
const router = express.Router();
const passport = require('passport');
const { isLoggedIn } = require('../lib/auth'); //este método proteje la ruta del perfil, si el usuario este autenticado
const { isNotLoggedIn } = require('../lib/auth'); // este método es lo contrario a lo anterior, en caso de que no este autenticado

//Registro de usuario
router.get('/signup',isNotLoggedIn, (req, res) => {
    res.render('auth/signup.hbs');
});

router.post('/signup', isNotLoggedIn, passport.authenticate('local.signup', {

    successRedirect: '/profile',
    falilureRedirect: '/signup',
    failureFlash: true
    

}));

//Inicio de usuario
router.get('/signin', isNotLoggedIn, (req, res) => {

    res.render('auth/signin.hbs');

});

router.post('/signin', isNotLoggedIn, (req, res, next) =>{

    passport.authenticate('local.signin', {
        successRedirect: '/profile',
        failureRedirect: '/signin',
        failureFlash: true

    }) (req, res, next);


});


//Perfiles de los usuarios
router.get('/profile', isLoggedIn, (req, res) => {

    res.render('profile.hbs');

});


// Cerrar sesión
router.get('/logout', isLoggedIn, (req, res) => {

    req.logOut();
    res.redirect('/signin');



});




module.exports = router;