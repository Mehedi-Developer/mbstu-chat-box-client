import { request } from "../utils/request";
const loginUrl = "/api/auth/login";
const registerUrl = "/api/auth/register";
const addUserPath = "/add/user";
const findUsersPath = "/api/user";
export const authUser = async(params) => {
    const {key, body} = params;
	const reqUrl = key === "login" ? loginUrl : registerUrl;
	// console.log({body});
	try {
		const data = await request(reqUrl,{
            method: "POST",
            body: JSON.stringify(body)
        });		
		return data;
	} catch (error) {
		console.error("error occurred in search service...");
	}
}
export const setUser = async(params) => {
    const {body} = params;
	// console.log({body});
	try {
		const data = await request(addUserPath,{
            method: "POST",
            body: JSON.stringify(body)
        });		
		return data;
	} catch (error) {
		console.error("error occurred in search service...");
	}
}

export const getUsers = async() => {
	const reqUrl = findUsersPath+"/all";
	try {
		const data = await request(reqUrl,{
            method: "GET",
        });	
		return data;
	} catch (error) {
		console.error("error occurred in search service...");
	}
}

export const getFriendUser = async(params) => {
	const {friendId, userId} = params;
	const reqUrl = friendId ? findUsersPath+`?userId=${friendId}` : findUsersPath+`?userId=${userId}`;
	try {
		const data = await request(reqUrl,{
            method: "GET",
        });	
		return data;
	} catch (error) {
		console.error("error occurred in search service...");
	}
}