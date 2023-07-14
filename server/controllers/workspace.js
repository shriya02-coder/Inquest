const ObjectId = require('mongoose').Types.ObjectId; 

const Workspace = require('../models/workspace');
const classCode = require('../models/classCode');
const User = require('../models/user');
const Draft = require('../models/draft');
const Editor = require("../models/editor")




exports.createWorkspace = async (req, res, next) => {
    let currClassCode;
    await classCode.findOne().then(obj => {
        currClassCode = obj.code + 1;
        obj.code = currClassCode;
        obj.save();
    }).catch(err => {
        err.statusCode = 500;
        next(err);
    })

    const newWorkspace = new Workspace({
        adminName: req.body.adminName,
        adminEmail: req.body.adminEmail,
        desc: req.body.desc,
        classCode: currClassCode, 
        className: req.body.className
    })
    
    newWorkspace.save()
        .then(result => {
            User.findOne({email: req.body.adminEmail}).then(user => {
                user.classesOwned.push(currClassCode);
                user.save();
            }).catch(err => {
                next(err);
            })
            res.status(201).json({message: "Workspace created successfully"});
        })
        .catch(err => {
            next(err);
        })
}

exports.getWorkspaces = (req, res, next) => {
    const type = req.body.type;
    const userEmail = req.body.userEmail;
    if (type === "owned") {
        Workspace.find({adminEmail: userEmail})
            .then(results => {
                res.json(results);
            }).catch(err => {
                next(err);
            })
    } else if (type === "enrolled") {
        User.findOne({email: userEmail})
            .then(user => {
                Workspace.find({classCode: user.classesEnrolled})
                    .then(results => {
                        res.json(results);
                    })
                    .catch(err => {
                        next(err);
                    })
            }).catch(err => {
                next(err);
            })
    } else {
        const err = new Error("Invalid params");
        err.statusCode = 422;
        next(err);
    }
}

exports.joinWorkspace = (req, res, next) => {
    const userEmail = req.body.userEmail;
    const classCode = req.body.classCode;
    Workspace.findOne({classCode: classCode})
        .then(workspace => {
            if (!workspace) {
                const err = new Error("Workspace with given class code does not exists.");
                err.statusCode = 403;
                next(err);
            }
            if (workspace.members.indexOf(userEmail) >= 0) {
                const err = new Error("User already Enrolled.");
                err.statusCode = 403;
                next(err);
            }
            workspace.members.push(userEmail);
            return workspace.save();
        })
        .then(result => {
            return User.findOne({email: userEmail});
        })
        .then(user => {
            if (user.classesOwned.indexOf(classCode) >= 0) {
                const err = new Error("Users cannot enroll in class created by themselves.")
                err.statusCode = 403;
                next(err);
            }
            user.classesEnrolled.push(classCode);
            return user.save();
        })
        .then(result => {
            res.json({message: "Class joined successfully!"});
        })
        .catch(err => {
            next(err);
        })
}

exports.deleteWorkspace = (req, res, next) => {
    const classCode = req.body.classCode;
    // console.log(classCode);
    Workspace.findOneAndDelete({classCode: classCode})
        .then(async workspace => {
            if (!workspace) {
                const err = new Error("ClassCode does not exists");
                err.statusCode = 422;
                next(err);
            } 

            workspace.members.forEach(async memberEmail => {
                await User.findOne({email: memberEmail})
                    .then(user => {
                        if (user) {
                            user.classesEnrolled = user.classesEnrolled.filter(classEnrolledCode => {
                                return classEnrolledCode.toString() !== classCode;
                            });

                            user.classesOwned = user.classesOwned.filter(classOwnedCode => {
                                return classOwnedCode.toString() !== classCode;
                            });

                            user.save();
                        }
                    })
                    .catch(err => {
                        next(err);
                    })
            })

        })
        .catch(err => {
            next(err);
        })
}

exports.getWorkspace = (req, res, next) => {
    const classCode = req.body.classCode;
    Workspace.findOne({classCode: classCode})
        .then(workspace => {
            if (!workspace) {
                const err = new Error("Invalid classcode.");
                err.statusCode = 422;
                next(err);
            }

            res.json(workspace);
        })
        .catch(err => {
            next(err);
        })
}

exports.createDraft = (req, res, next) => {
    // console.log(req.body);

    const classCode = req.body.classCode;
    const name = req.body.name;
    const creatorEmail = req.body.creatorEmail;

    const draft = new Draft({
        classCode: classCode,
        name: name,
        creatorEmail: creatorEmail
    })

    draft.save()
        .then(result => {
            res.json({message: "Draft created successfully"});
        })
        .catch(err => {
            next(err);
        })
}

exports.getDrafts = (req, res, next) => {
    const classCode = req.body.classCode;
    Draft.find({classCode: classCode}).sort({dueDate: 1})
        .then(results => {
            res.json(results);
        })
        .catch(err => {
            next(err);
        })
}

exports.getDraft = (req, res, next) => {
    const draftId = req.body.draftId;
    console.log(draftId)
    // Draft.findById(draftId)
    //     .then(draft => {
    //         User.findOne({email: draft.creatorEmail})
    //             .then(user => {
    //                 res.json({...draft._doc, creatorName: user.name});
    //             })
    //             .catch(err => {
    //                 next(err);
    //             })
    //     })
    //     .catch(err => {
    //         next(err);
    //     })




}



exports.getReminders = (req, res, next) => {
    const userEmail = req.body.userEmail;
    let reminders = [];
    User.findOne({email: userEmail})
        .then(async user => {
            if (!user) {
                const err = new Error("User does not exists.");
                err.statusCode = 422;
                next(err);
            }
            for(let enrolledClassCode of user.classesEnrolled) {
                await Draft.find({classCode: enrolledClassCode, dueDate: {$gte: Date.now()}})
                    .then(results => {
                        reminders = reminders.concat(results);
                    })
            }

            reminders.sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate));
            res.json(reminders);
        })
        .catch(err => {
            next(err);
        })
}

exports.getCollaborators = (req, res, next) => {
    const classCode = req.body.classCode;
    Workspace.findOne({classCode: classCode})
        .then(async workspace => {
            let users = [];
            for (let email of workspace.members) {
                await User.findOne({email: email})
                    .then(user => {
                        users.push({email: user.email, name: user.name, _id: user._id});
                    })
            }
            res.json(users);
        })
        .catch(err => {
            next(err);
        })
}