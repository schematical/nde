var path = require('path');
var fs = require('fs');
var async = require('async');
var ObjectId = require('mongoose').Types.ObjectId;
module.exports = function(app, uri){
    if(!uri) uri = '/:account/:project/repos';

    app.param('repo', populate)

    app.get(uri, render_list);
    app.get(uri + '/new', render_edit);
    app.get(uri + '/:repo', render_detail);
    app.get(uri + '/:repo/edit',render_edit);
    app.post(
        uri,
        [
            
            create
        ]
    );
    app.post(
        uri + '/:repo',
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
        app.model.Repo.findOne(query, function(err, repo){
            if(err){
                return next(err);
            }

            res.bootstrap('repo', repo);
            return next();
        })
    }

    function render_list(req, res, next){
        app.model.Repo.find({}, function(err, repo){
            if(err) return next(err);
            res.locals.repo = repo;
            res.render('model/repo_list');
        });
    }
    function render_detail(req, res, next){
        if(!req.repo){
            return next();
        }
        res.render('model/repo_detail');
    }
    function render_edit(req, res, next){
        async.series([
            function(cb){
                if(!req.repo){
                    //return next();
                    req.repo = new app.model.Repo();
                }
                return cb();
            },
            
            function(cb){

                res.render('model/repo_edit');
            }
        ]);
    }
    function create(req, res, next){
        if(!req.user){
            return res.redirect('/');
        }
        if(!req.repo){
            req.repo = new app.model.Repo();
        }
        return update(req, res, next);

    }

    function update(req, res, next){
        if(!req.user){
            return res.redirect('/');
        }
        if(!req.repo){
            return next(new Error('Repo not found'));
        }

        
            
                req.repo.namespace = req.body.namespace;
            
        
            
                req.repo.name = req.body.name;
            
        
            
                req.repo.desc = req.body.desc;
            
        
            
                req.repo.url = req.body.url;
            
        

        req.repo.save(function(err, repo){
            //app._refresh_locals();
            res.render('model/repo_detail', { repo: req.repo.toObject() });
        });

    }

}