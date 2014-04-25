'use strict';
module.exports = function(app){
    
        app.model.Account =  require('./account')(app);
    
        app.model.Project =  require('./project')(app);
    
        app.model.Repo =  require('./repo')(app);
    
        app.model.Application =  require('./application')(app);
    
        app.model.AccessToken =  require('./accessToken')(app);
    
        app.model.RequestCode =  require('./requestCode')(app);
    
}