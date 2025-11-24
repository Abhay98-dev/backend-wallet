import ratelimit from "../config/upstash.js";

const rateLimiter=async(req,res,next)=>{
    try{
        //here we can use ip address or user id based on our requirement
        //currently kepping it simple with a static key
        const{success}=await ratelimit.limit("my-rate-limit")
        if(!success){
            return res.status(429).json({message:"Too many requests, pleasr try again later"})
        }

        next()
    }catch(err){
        console.error("Rate Limiter Error: ",err)
        next()
    }
}

export default rateLimiter