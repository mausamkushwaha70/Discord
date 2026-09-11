import mongoose from "mongoose";

const serverSchema = new mongoose.Schema({
    name:{
        type:String,
        required:true
    },
    description:{
        type:String,
    },
    owner:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"user"
    },
    icon:{
        type:String,
        default:""
    },
    banner:{
        type:String,
        default:""
    },
    isPublic:{
        type:Boolean,
        default:false
    },
    inviteCode:{
        type:String,
        required:true
    }
},
{
    timestamps:true
})


const serverModel = mongoose.model("server",serverSchema)
export default serverModel;