const express = require('express');
const router = express.Router({mergeParams: true});
const Course = require('../models/course');
const Student = require('../models/student');
const middleware = require('../middlewares');

router.post('/', middleware.isLoggedIn, (req,res) => {
    Course.findById(req.params.id, (err,course) => {
        if(err){
            console.log(err);
            res.redirect('/courses');
        } else{
            Student.create(req.body.student, (err,student) => {
                if(err){
                    console.log(err);
                } else {
                    student.author.id = req.user._id;
                    student.author.username = req.user.username;
                    student.author.fullname = req.user.fullname;
                    student.author.email = req.user.email;
                    student.save();
                    course.students.push(student);
                    course.save();
                    res.redirect('/courses/'+course._id);
                }
            });
        }
    });
});

router.get('/:student_id/edit', middleware.checkStudentOwnership, (req,res) => {
    Student.findById(req.params.student_id, (err, foundStudent) => {
        if(err){
            res.redirect('back');
        } else {
            res.render('students/edit',{student:foundStudent,course_id:req.params.id})
        }
    });
});

router.put('/:student_id', middleware.checkStudentOwnership, (req,res) => {
    Student.findByIdAndUpdate(req.params.student_id, req.body.student,(err,updatedStudent) => {
        if(err){
            res.redirect('back');
        } else {
            res.redirect('/courses/'+req.params.id);
        }
    });
});

router.delete('/:student_id', middleware.checkCourseOwnership, (req,res) => {
    Student.findByIdAndRemove(req.params.student_id,(err) => {
        if(err){
            res.redirect('back');
        } else {
            console.log('Success');
            res.redirect('/courses/'+req.params.id);
        }
    });
});

module.exports = router;