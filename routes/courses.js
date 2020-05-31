const express = require('express');
const router = express.Router({mergeParams: true});
const Course = require('../models/course');
const middleware = require('../middlewares');

router.get('/', (req,res) => {
    Course.find({}, (err, foundCourses) => {
        if(err){
            console.log(err);
            res.redirect('back');
        } else {
            res.render('courses/courses',{courses:foundCourses})
        }
    });
});

router.post('/', middleware.isLoggedIn, (req,res) => {
    const topic = req.body.topic;
    const title = req.body.title;
    const image = req.body.image;
    const price = req.body.price;
    const description = req.body.description;
    const author = {
        id: req.user._id,
        username: req.user.username,
        fullname: req.user.fullname
    };
    const newCourse = {
        topic,
        title,
        image,
        price,
        description,
        author
    };
    Course.create(newCourse,(err, newlyCreated) => {
        if(err){
            console.log(err);
        } else {
            res.redirect('/courses');
        }
    });
});

router.get('/new', middleware.isLoggedIn, (req,res) => {
    res.render('courses/new');
});

router.get('/:id', middleware.isLoggedIn, (req,res) => {
    Course.findById(req.params.id).populate("students").exec((err, foundCourse) => {
        if(err){
            console.log(err);
        }else{
            let flag = false;
            if(req.user){
                foundCourse.students.forEach(student => {
                    if(String(student.author.id) === String(req.user._id)){
                        flag = true;
                    }
                });
            }
            res.render('courses/show',{course:foundCourse, flag});
        }
    });
});

router.get('/:id/edit', middleware.checkCourseOwnership, (req,res) => {
    Course.findById(req.params.id,(err, foundCourse) => {
        if(err){
            console.log(err);
        } else {
            res.render('courses/edit',{course:foundCourse})
        }
    });
});

router.put('/:id', middleware.checkCourseOwnership, (req, res) => {
    Course.findByIdAndUpdate(req.params.id, req.body.course, (err, updatedcourse) => {
        if(err){
            console.log(err);
        } else {
            res.redirect('/courses/'+req.params.id);
        }
    });
});

router.delete('/:id', middleware.checkCourseOwnership, (req,res) => {
    Course.findByIdAndRemove(req.params.id,(err) => {
        if(err){
            console.log(err);
        } else {
            res.redirect('/courses');
        }
    });
});

router.get('/:id/attendence',middleware.isLoggedIn, (req,res) => {
    Course.findById(req.params.id).populate("students").exec((err, foundCourse) => {
        if(err){
            console.log(err);
        }else{
            res.render('courses/attendence',{course:foundCourse});
        }
    });
});

module.exports = router;