const express = require('express');
const morgan = require('morgan');
const exphbs = require('express-handlebars');
const path = require('path');
const { pathToFileURL } = require('url');
const { extname, dirname } = require('path');
const flash = require('connect-flash');
const session = require('express-session');
const MysqlStore = require('express-mysql-session');
const { database }  = require('./keys');
const passport = require('passport');

// Inicializaciones 
const app = express();
require('./lib/passport');


//configuraciones 
app.set('port', process.env.PORT || 3000);
app.set('views', path.join(__dirname, 'views'));
app.engine('.hbs', exphbs({

    defaultLayout: 'main',
    layoutsDir: path.join(app.get('views'), 'layouts'),
    partialsDir: path.join(app.get('views'), 'partials'),
    extname: '.hbs',
    helpers: require('./lib/handlebars')

}));
app.set('views enginee', '.hbs');

//middleware
app.use(session({

    secret: 'pasenosmysqlsession',
    resave: false,
    saveUninitialized: false,
    store: new MysqlStore(database)
}));

app.use(flash());
app.use(morgan('dev'));
app.use(express.urlencoded({extended: false}));
app.use(express.json());

app.use(passport.initialize());
app.use(passport.session());


//variables globales
app.use((req, res, next) => {

    app.locals.success = req.flash('success');
    app.locals.message = req.flash('message');
    app.locals.user = req.user;
    next();
    
});




//Rutas
app.use(require('./routes'));
app.use(require('./routes/authentication'));
app.use('/homework', require('./routes/homework'));


//Archivos publicos
app.use(express.static(path.join(__dirname, 'public')));


// Inicializar el servidor
app.listen(app.get('port'), () =>{

    console.log('servidor en el puerto', app.get('port'));

});