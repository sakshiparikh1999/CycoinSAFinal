var mongoose = require('mongoose');

const validator = require('validator');

/**********RegistrationSchema**********/
var UserRegistrationSchema = mongoose.Schema({

    name:{
        type:String,
        required:true
    },
    email:{
        type:String,
        required:true,
        trim:true,
        unique:true,
        validate:{
            validator:validator.isEmail,
            message:'{VALUE} Entered Invalid Email'
        }
    },

    email_verify_status:{
        type:String,
        enum: ['true', 'false'],
        default:'false'
    },

    login_status:{
        type:String,
        enum: ['true', 'false'],
        default:'false'
    },
    mobile_no:{
        type:String,
        default:''
    },
    password:{
        type:String,
    },

    // deleted_at: {
    //     type: String,
    //     default: ''
    // },

    // deleted_by: {
    //     type:String,
    //     default: ''
    // },
    status:{
        type:String,
        enum: ['active', 'inactive'],
        default:'active'
    },

    deleted:{
        type:String,
        enum: ['0', '1'],
        default:'0'
    },
    otp:{
        type:String,
    },
    dateOfBirth:{
         type:String,
         default:''
    },
    placeOfBirth:{
        type:String,
        default:''
    },
    updateAddress:{
        currentAddress:{
            type:String,
            default:''
        },
        City:{
            type:String,
            default:''
         },
         postalCode:{
            type:String,
            default:''
        }
    },
    otherDetails:{
        nationality:{
            type:String,
            default:''
        },
        nationalityid:{
            type:String,
            default:''
        },
        varification_num:{
            type:String,
            default:''
        }
    },
    kycUpdate:{
        docType:{
            type:String,
            default:''
        },
        fileName:{
            type:String,
            default:''
        },
        expirydate:{
            type: String,
            default: ''
        },
        docIdNumber:{
            type:String,
            default:''
        },
        docVerified:{
            type:String,
            enum:['Reject','Approved','Pending','Waiting'],
            default:'Pending'
        }
    },
    // deviceToken:{
    //     type: String,
    //     default: ''
    // },
    emailnotification:{
        type: String,
        default:'false'
    },
    activitynotification:{
        type: String,
        default:'false'
    },
    country_code:{
        type:String,
        default:''
    },
    country_name:{
        type:String,
        default:""
    },
    // passphrase:{
    //     type:String,
    //     default:""
    // },
    // isGeneratedPassphrase:{
    //     type:String,
    //     default:"0"
    // }
    // publicKey:{
    //     type:String,
    //     default:''
    // },
    // secretKey:{
    //     type:String,
    //     default:''
    // },

},{ timestamps: true });

var Registration =  mongoose.model('user_registration', UserRegistrationSchema);
module.exports = {
    Registration : Registration
};