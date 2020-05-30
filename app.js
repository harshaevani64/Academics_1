const express = require('express');
const path = require('path');
const chalk = require('chalk');
const bodyParser = require('body-parser');
const app = express();
const mongoose = require('mongoose');
const passport = require('passport');
const LocalStrategy = require('passport-local');
const methodOverride = require('method-override');
const User = require('./models/user');
const Course = require('./models/course');
const Student = require('./models/student');
const indexRoutes = require('./routes/index');
const courseRoutes = require('./routes/courses');
const studentRoutes = require('./routes/students');

// App config
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static(path.join(__dirname,"public")));
app.use(methodOverride('_method'));

// Setup mongoose
const mongoDB = 'mongodb+srv://dbUser:dbUser@cluster0-gthlp.mongodb.net/test?retryWrites=true&w=majority'
mongoose.connect(mongoDB, {useNewUrlParser: true,useUnifiedTopology: true});
let db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));

// Passport Config
app.use(require('express-session')({
    secret: "Hail Hitler",
    resave: false,
    saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use(function(req,res,next){
    res.locals.currentUser = req.user;
    next();
});

app.use('/',indexRoutes);
app.use('/courses', courseRoutes);
app.use('/courses/:id/enroll', studentRoutes);

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(chalk.bgGreen(`server running on port ${PORT}...`));
});