const passport = require("passport")
const LocalStrategy = require("passport-local").Strategy;
const pool = require("../database");
const helpers = require("../lib/helpers");
const {signOut} = require('../lib/aut');

let countFailedSession = 0;

passport.use('local.updatePass', new LocalStrategy({
    usernameField: 'id_user',
    passwordField: 'password_user',
    passReqToCallback: true
}, async (req, id_user, password_user, done) => {
    if(password_user.length >= 8) {
        if (helpers.hasSpecialChars(password_user)) {
            if (helpers.hasNumbers(password_user) && helpers.hasLetters(password_user)) {
                const rows = await pool.query('SELECT * FROM users WHERE id_user = ?', [id_user]);
                const user = rows[0];
                if (user.isEnabled) {
                    password_user = await helpers.encryptPassword(password_user);
                    const newUser = {
                        password_user
                    };
                    await pool.query('UPDATE users set ? WHERE id_user = ?', [newUser, id_user]);
                    return done(null, user, req.flash('success', 'La contraseña se ha actualizado satisfactoriamente.'));
                }
                return done(null, false, req.flash('message', 'Esta cuenta se encuentra deshabilitada.'));
            }
        }
    }
    return done(null, false, req.flash('message', 'La contraseña debe ser alfanumerica, debe contener caracteres especiales y debe tener al menos 8 caracteres.'));
}));

passport.use('local.login', new LocalStrategy({
    usernameField: 'email_user',
    passwordField: 'password_user',
    passReqToCallback: true
}, async (req, email_user, password_user, done) => {
    const rows = await pool.query('SELECT * FROM users WHERE email_user = ?', [email_user]);
    if (rows.length > 0) {
        const user = rows[0];
        if (user.isEnabled) {
            if (user.password_user != 'pordefecto') {
                const validPassword = await helpers.comparePassword(password_user, user.password_user);
                if (validPassword) {
                    countFailedSession = 0;
                    signOut;
                    return done(null, user, req.flash('success', 'Bienvenido '.concat(user.fullname)));
                } else {
                    countFailedSession++;
                    if (countFailedSession == 3) {
                        const isEnabled = false;
                        newUser = {
                            isEnabled
                        }
                        await pool.query('UPDATE users set ? WHERE id_user = ?', [newUser, user.id_user]);
                        return done(null, false, req.flash('message', 'Ha fallado 3 veces en iniciar sesion por lo que su cuenta fue deshabilitada.'));
                    }
                }
            } else if (password_user == 'pordefecto') {
                helpers.sendEmail(email_user, password_user, user.id_user);
                return done(null, false, req.flash('success', 'Le recomendamos cambiar la contraseña, revise su correo electrónico.'));
            }
        } else {
            return done(null, false, req.flash('message', 'Esta cuenta se encuentra deshabilitada'));        
        }
    }
    return done(null, false, req.flash('message', 'Uno de los campos ha sido ingresado incorrectamente'));
}));

passport.use('local.signup', new LocalStrategy({
    usernameField: 'email_user',
    passwordField: 'password_user',
    passReqToCallback: true
}, async (req, email_user, password_user, done) => {
    const { fullname } = req.body;
    const newUser = {
        email_user,
        password_user,
        fullname
    }
    try {
        const result = await pool.query('INSERT INTO users set ?', [newUser]);
        helpers.sendEmailWelcome(email_user, password_user);
        return done(null, false, req.flash('success', 'El registro se hizo satisfactoriamente.'));   
    } catch (error) {
        return done(null, false, req.flash('message', 'Ha ingresado un correo electrónico que ya fue registrado'));     
    }
}));

passport.serializeUser((user, done) => {
    done(null, user.id_user);
});

passport.deserializeUser(async (id, done) => {
    const rows = await pool.query('SELECT * FROM users WHERE id_user = ?', [id]);
    done(null, rows[0]);
});