const express = require('express');
const path = require('path');
const dotenv = require('dotenv');
const morgan = require('morgan');
const exphbs = require('express-handlebars');
const session = require('express-session');
const MongoStore = require('connect-mongo');
const passport = require('passport');
const methodOverride = require('method-override');
const flash = require('connect-flash');

// Intializing express
const app = express();

app.use(flash());
// DOTENV
dotenv.config({ path: './config/config.env' });

// Static files
app.use(express.static(path.join(__dirname, 'public')));

// Passport
require('./config/passport')(passport);

// Formating form data
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

// Method Override for updating and deleting data
app.use(
  methodOverride(function (req, res) {
    if (req.body && typeof req.body === 'object' && '_method' in req.body) {
      // look in urlencoded POST bodies and delete it
      var method = req.body._method;
      delete req.body._method;
      return method;
    }
  })
);

// Connecting Mongo
require('./config/db');

// Helpers
const {
  formatDate,
  fromNow,
  stripTags,
  truncate,
  editIcon,
  select,
} = require('./helpers/hbs');

// Handlebars Template
app.engine(
  '.hbs',
  exphbs({
    helpers: {
      formatDate,
      fromNow,
      stripTags,
      truncate,
      editIcon,
      select,
    },
    extname: '.hbs',
    defaultLayout: 'main',
  })
);
app.set('view engine', '.hbs');

// Session
app.use(
  session({
    secret: 'Blogs',
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({ mongoUrl: process.env.MONGO_URI }),
  })
);

// Passport middleware
app.use(passport.initialize());
app.use(passport.session());

// Global Vars
app.use((req, res, next) => {
  res.locals.user = req.user || null;
  res.locals.success_msg = req.flash('success_msg');
  res.locals.error_msg = req.flash('error_msg');
  res.locals.warning_msg = req.flash('warning_msg');
  next();
});

// Setting up the morgan
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

// Routes
app.use('/', require('./routes/blogs'));
app.use('/index', require('./routes/index'));
app.use('/auth', require('./routes/auth'));

// Listening at the server
const PORT = process.env.PORT || 5000;

app.listen(PORT, () =>
  console.log(`Server running on ${process.env.NODE_ENV} mode in ${PORT}`)
);
