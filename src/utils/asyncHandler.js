const asyncHandler = (fun) =>{
     (req,res,next)=>{
        Promise.resolve(fun(req,res,next)).catch((error=>next(error)));
    }
}

// we have send the function as an argument. above code returns req,res,next which promise return. If promise resolve the next code will execute. And if the function fails to execute catch() will catch the error and send it to the express error-handling middleware   

module.exports = asyncHandler;

//below is higher order function
// const asyncHandler = (fun)=>async(req,res,next)=>{
//     try{
//         await fun()
//     }catch(error){
//         res.status(error.code || 500).json({
//             success:false,
//             message:error.message
//         })
        
//     }
// }

// The whole purpose to create the asyncHandle function is to make the code modular. Like before we used write the code in async/await and o handle error in try/catch for each function. So to avoid the repetability we can write the util code. We can write the function in this wrapper by clling it