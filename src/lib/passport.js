const passport = require('passport');
const localStrategy = require('passport-local').Strategy;
const pool = require('../database');
const helpers = require('../lib/helpers');


///Registro de usuarios
passport.use('local.signup', new localStrategy({

    usernameField: 'username',
    passwordField: 'password',
    passReqToCallback: true

}, async(req, username, password, done) => {

    const { fullname } = req.body;
    const newUser = {

        username,
        password,
        fullname
        
    };

    newUser.password = await helpers.encryptPassword(password);

    const result = await pool.query('INSERT INTO usuarios SET ?', [newUser]);
    newUser.id = result.insertId;
    return done(null, newUser);

    //console.log(result);

}));

//Para que usuario inicie su propia sesión, sin afectar a los otros usuarios.
passport.serializeUser((user, done) =>{

    done(null, user.id);

});

//Lo contrario del serializeUser
passport.deserializeUser(async(id, done) => {

    const rows = await pool.query('SELECT * FROM usuarios WHERE id = ?', [id]);
    done(null, rows[0]);



});

/// Inicio de sesión por usuarios
passport.use('local.signin', new localStrategy({

    usernameField: 'username',
    passwordField: 'password',
    passReqToCallback: true


}, async(req, username, password, done) => {

    console.log(req.body);

    const rows = await pool.query('SELECT * FROM usuarios WHERE username =?', [username]);

    if(rows.length > 0){

        const user = rows[0];
        const validPassword = await helpers.matchPassword(password, user.password);

        if(validPassword){

            done(null, user, req.flash('success', 'Bienvenido ' + user.username));

        }else{

            done(null, false, req.flash('message','Contraseña incorrecta'));

        }

    }else{
        
        return done(null, false, req.flash('message','El nombre de usuario no existe'));

    }


    /*console.log(req.body);
    console.log(username);
    console.log(password);*/

} ));
