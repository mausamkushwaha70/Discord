const registerController = async (req , res)=>{
    const {username, fullName, email, phone, password, dob} = req.body;
    const file = req.file

    if(!username || !fullName || !email || !password){
        return res.status(400).json({
            success:false,
            message:"all field are required"
        })
    }

    // const uploadFile = 

}