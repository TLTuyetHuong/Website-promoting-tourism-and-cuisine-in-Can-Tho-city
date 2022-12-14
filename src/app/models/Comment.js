const mongoose = require('mongoose');
const mongooseDelete = require('mongoose-delete');
const Schema = mongoose.Schema;

const Comment = new Schema({
	posts: { type: String, require: true},
	comment: { type: String, require: true},
    like: { type: Number, default: 0},
    rate: { type: String, default: '3'},
	date: { type: String},
    status: { type: String, default: 'Bình thường'},
}, {
    timestamps: true,
});

// Add slugins
Comment.plugin(mongooseDelete, { 
    deletedAt : true ,
    overrideMethods: 'all' ,
});

module.exports = mongoose.model('Comment', Comment, 'comments');
