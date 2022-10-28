const mongoose = require('mongoose');
const slug = require('mongoose-slug-generator');
const Schema = mongoose.Schema;

mongoose.plugin(slug);

const DiaDiem = new Schema({
    name: { type: String, require: true},
    address: { type: String, require: true},
    place: { type: String},
    image: { type: String, require: true},
    morning: { type: String},
    afternoon: { type: String},
    price: { type: String},
    description: { type: Object},
    map: { type: String},
    slug: { type: String, slug: 'name', unique: true }
},{
    timestamps: true,
});

module.exports = mongoose.model('DiaDiem', DiaDiem, 'diadiems');
