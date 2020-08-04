const config = require('config');
const validator = require('validator');

const {mongoose} = require('./../db/mongoose');


let SlideSchema = new mongoose.Schema({
    code: {
        type: String,
        required: true,
        trim: true
    },
    img_url: {
        type: String,
        required: true,
        trim: true,
        validate: {
            validator: validator.isURL,
            message: '{Value} is not valid uri addresss'
        }
    },
    titel: {
        type: String,
        required: false,
        trim:true
    },
    text: {
        type: String,
        required: false,
        trim:true
    },
    action: {
        type: String,
        required: false,
        trim:true
    },
  
});

let Slide = mongoose.model('Slide', SlideSchema);

module.exports = {
    Slide
};