import { request } from "../../utils/request";
const loginUrl = "/api/auth/login";
const registerUrl = "/api/auth/register";
const addUserPath = "/add/user";
const findUsersPath = "/api/user/all";
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
	try {
		const data = await request(findUsersPath,{
            method: "GET",
        });	
		return data;
	} catch (error) {
		console.error("error occurred in search service...");
	}
}