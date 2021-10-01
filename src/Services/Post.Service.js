import { request } from "../utils/request";
const postUrlByUserName = "/api/posts/profile/";
const postUrlByUserId = "/api/posts/timeline/";
export const getPosts = async(params) => {
    const {key, userId, username} = params;
	const reqUrl = username ? postUrlByUserName+username : postUrlByUserId+userId;
	// console.log({body});
	try {
		const data = await request(reqUrl,{
            method: "GET",
            // body: JSON.stringify(body)
        });		
		return data;
	} catch (error) {
		console.error("error occurred in search service...");
	}
}

export const likePost = async(params) => {
    const {key, postId, userId} = params;
	const reqUrl = "/api/posts/" + postId + "/like";
	// console.log({body});
	try {
		const data = await request(reqUrl,{
            method: "PUT",
            body: JSON.stringify({userId})
        });		
		return data;
	} catch (error) {
		console.error("error occurred in search service...");
	}
}
