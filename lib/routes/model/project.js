var path = require('path');
var fs = require('fs');
var async = require('async');
var ObjectId = require('mongoose').Types.ObjectId;
module.exports = function(app, uri){
    if(!uri) uri = '/:account';

    app.param('project', populate)

    app.get(uri, render_list);
    app.get(uri + '/new', render_edit);
    app.get(uri + '/:project', render_detail);
    app.get(uri + '/:project/edit',render_edit);
    app.post(
        uri,
        [
            
            create
        ]
    );
    app.post(
        uri + '/:project',
        [
            
            update
        ]
    );


    function populate(req, res, next, id){
        var or_condition = []


        var checkForHexRegExp = new RegExp("^[0-9a-fA-F]{24}$");
        if(checkForHexRegExp.test(id)){
            or_condition.push({ _id:new ObjectId(id) });
        }
        
            or_condition.push({ namespace:id });
        
        if(or_condition.length == 0){
            return next();
        }
        var query = { $or: or_condition };
        app.model.Project.findOne(query, function(err, project){
            if(err){
                return next(err);
            }

            res.bootstrap('project', project);
            return next();
        })
    }

    function render_list(req, res, next){
        app.model.Project.find({}, function(err, project){
            if(err) return next(err);
            res.locals.project = project;
            res.render('model/project_list');
        });
    }
    function render_detail(req, res, next){
        if(!req.project){
            return next();
        }
        res.render('model/project_detail');
    }
    function render_edit(req, res, next){
        async.series([
            function(cb){
                if(!req.project){
                    //return next();
                    req.project = new app.model.Project();
                }
                return cb();
            },
            
            function(cb){

                res.render('model/project_edit');
            }
        ]);
    }
    function create(req, res, next){
        if(!req.user){
            return res.redirect('/');
        }
        if(!req.project){
            req.project = new app.model.Project();
        }
        return update(req, res, next);

    }

    function update(req, res, next){
        if(!req.user){
            return res.redirect('/');
        }
        if(!req.project){
            return next(new Error('Project not found'));
        }

        
            
                req.project.namespace = req.body.namespace;
            
        
            
                req.project.name = req.body.name;
            
        
            
                req.project.desc = req.body.desc;
            
        
            
                req.project.primary_repo = req.body.primary_repo;
            
        

        req.project.save(function(err, project){
            //app._refresh_locals();
            res.render('model/project_detail', { project: req.project.toObject() });
        });

    }

}