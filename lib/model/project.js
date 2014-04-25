'use strict';
module.exports = function(app){

    var Schema = app.mongoose.Schema;

    var fields = {
        _id: { type: Schema.Types.ObjectId },
    
        
            namespace:{ type:String },
        
    
        
            name:{ type:String },
        
    
        
            desc_raw:String,
            desc_rendered:String,
        
    
        
            primary_repo:{ type:String },
        
    
        cre_date:Date
    };

    var projectSchema = new Schema(fields);

    projectSchema.virtual('uri').get(function(){
        
            return '/projects/' + this.namespace;
        
    });

    
        
    
        
    
        
            projectSchema.virtual('desc').get(function(){
                return this.desc_rendered;
            }).set(function(value){
                var markdown = require('markdown').markdown;
                this.desc_raw = value;
                this.desc_rendered = markdown.toHTML(value);
            });

        
    
        
    


    projectSchema.pre('save', function(next){
        if(!this._id){
            this._id = new app.mongoose.Types.ObjectId();
        }
        return next();
    });

    if (!projectSchema.options.toObject) projectSchema.options.toObject = {};
    projectSchema.options.toObject.transform = function (doc, ret, options) {
        ret.uri = doc.uri;
        
            

            
        
            

            
        
            
                ret.desc = doc.desc_rendered;
                ret.desc_raw = doc.desc_raw;
            
        
            

            
        
    }

    return app.mongoose.model('Project', projectSchema);
}