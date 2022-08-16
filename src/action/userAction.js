export const loginAction = (data) => {
    // console.log("Data dari page Login", data)
    return {
        type: "LOGIN_SUCCESS",
        payload: data
    }
};

// kalau contoh logout tidak pake payload
export const logoutAction = () => {
    return {
        type: "LOGOUT_SUCCESS"
    }
};