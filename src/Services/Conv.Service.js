import { request } from "../utils/request";

const conversationUrl = "/api/conversations/";
export const getConversations = async(params) => {
    const {friendId, userId} = params;
	const reqUrl = friendId ? conversationUrl+"/find/"+ friendId+"/"+userId : conversationUrl+userId;
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