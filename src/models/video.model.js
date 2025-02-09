const mongoose = require("mongoose");
const mongooseAggregatePagination = require("mongoose-aggregate-paginate-v2");

const videoSchema = new mongoose.Schema(
  {
    videoFile:{
        type:String,
        required:true
    },
    thumbnail:{
        type:String,
        required:true
    }, 
    title:{
        type:String,
        required:true
    },  
    description:{
        type:String,
        required:true
    }, 
    duration:{
        type:Number,
        required:true
    }, 
    views:{
        type:Number,
        default:0
    }, 
    isPublished:{
        type:Boolean,
        default:true
    },
    owner:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"user"
    }
  },
  {
    timestamps: true,
  }
);

videoSchema.plugin(mongooseAggregatePagination);

const VIDEO_MODEL = mongoose.model("video", videoSchema);

module.exports = VIDEO_MODEL;
