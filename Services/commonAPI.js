import axios from 'axios'

export const commonAPI=async(httpMethod,url,reqBody,reqHeader)=>{
    let reqConfig={
        method:httpMethod,
        url,
        data:reqBody,
        headers:reqHeader?reqHeader:{
            "content-Type":"application/json"
        }
    }
    return await axios(reqConfig).then((response)=>{
        return response
    })
    .catch((error)=>{
        return error
    })
}