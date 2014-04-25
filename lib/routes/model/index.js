module.exports = function(app){
    /**
     * Model Routes
     */
    
        require('./account')(app);
    
        require('./project')(app);
    
        require('./repo')(app);
    
        require('./application')(app);
    
        require('./accessToken')(app);
    
        require('./requestCode')(app);
    

}