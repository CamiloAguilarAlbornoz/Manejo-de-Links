const express = require('express');
const passport = require('passport');
const router = express.Router();
const pasport = require('passport');
const pool = require('../database');
const {isLoggedIn, isNotLoggedIn, signOut} = require('../lib/aut');
const helpers = require("../lib/helpers");

// ================= Registrarse ============
router.get('/signup', isNotLoggedIn, (req, res) => {
    res.render('auth/signup');
});

router.post('/signup', isNotLoggedIn, passport.authenticate('local.signup', {
    failureRedirect : '/login',
    failureFlash : true
}));

// =============== Iniciar sesion =============
router.get('/login', isNotLoggedIn, (req, res) => {
    res.render('auth/login');
});

router.post('/login', isNotLoggedIn, (req, res, next) => {
    passport.authenticate('local.login', {
        successRedirect : '/profile',
        failureRedirect : '/login',
        failureFlash : true
    })(req, res, next);
});

router.get('/profile', isLoggedIn, (req, res) => {
    res.render('profile');
});

// ================= Correo electronico para cambio de contrasela ==============
router.get('/email', isNotLoggedIn, (req, res) => {
    res.render('auth/getEmail');
});

router.post('/email', isNotLoggedIn, async (req, res) => {
    const {email_user} = req.body;
    const rows = await pool.query('SELECT * FROM users WHERE email_user = ?', [email_user]);
    if (rows.length > 0) {
        const user = rows[0];
        helpers.newPasswordSolicitude(email_user, user.id_user);
        req.flash('success', 'Se acaba de enviar un mensaje a su correo electronico con el procedimiento para actualizar su contraseña.');
        res.redirect('/email');
    } else {
        req.flash('message', 'No existe un usuario con el correo electronico ingresado.');
        res.redirect('/email');
    }
});

// ================= Cambiar contraseña ====================
router.get('/updatePass/:id', async (req, res) => {
    const {id} = req.params;
    const users = await pool.query('SELECT * FROM users WHERE id_user = ?', [id]);
    res.render('auth/updatePass', {user : users[0]});
});

router.post('/updatePass/:id', (req, res, next) => {
    const {id} = req.params;
    passport.authenticate('local.updatePass', {
        successRedirect : '/login',
        failureRedirect : '/updatePass/'.concat(id),
        failureFlash : true
    })(req, res, next);
});

// ================= Cerrar sesion ======================
router.get('/logout', isLoggedIn, (req, res, next) => {
    req.logOut(err => {
        if (err) {
            return next(err);
        }
        res.redirect('login');
    });
});

module.exports = router;