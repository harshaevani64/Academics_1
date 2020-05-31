const Course = require('../models/course');
const Student = require('../models/student');

const middlewareObj = {}

middlewareObj.isLoggedIn = function(req,res,next){
    if(req.isAuthenticated()){
        return next();
    }
    res.redirect('/login');
}

middlewareObj.checkCourseOwnership = function(req,res,next){
    if(req.isAuthenticated()){
        Course.findById(req.params.id, function(err,foundCourse){
            if(err){
                res.redirect('back');
            } else{
                if(foundCourse.author.id.equals(req.user._id)){
                    next();
                } else{
                    res.redirect('back');
                }
            }
        });
    } else{
        res.redirect('back');
    }
}

middlewareObj.checkStudentOwnership = function(req,res,next){
    if(req.isAuthenticated()){
        Student.findById(req.params.student_id, function(err,foundStudent){
            if(err){
                res.redirect('back');
            } else{
                if(foundStudent.author.id.equals(req.user._id)){
                    next();
                } else{
                    res.redirect('back');
                }
            }
        });
    } else{
        res.redirect('back');
    }
}

module.exports = middlewareObj;