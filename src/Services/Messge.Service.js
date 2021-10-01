import { request } from "../utils/request";

const messageUrl = "/api/messages";
export const setMessage = async(params) => {
    const {message} = params;
	const reqUrl = messageUrl;
	// console.log({message});
	try {
		const data = await request(reqUrl,{
            method: "POST",
            body: JSON.stringify(message)
        });		
		return data;
	} catch (error) {
		console.error("error occurred in search service...");
	}
}