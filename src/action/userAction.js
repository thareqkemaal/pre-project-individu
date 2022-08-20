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

export const likedPost = (data) => {
    //console.log("liked", data)
    return {
        type: "LIKED_POST",
        payload: data
    }
};

export const deleteLiked = (data) => {
    //console.log("delete liked", data)
    return {
        type: "DELETE_LIKED",
        payload: data
    }
};

export const updateStatus = (data) => {
    return {
        type: "UPDATE_STATUS",
        payload: data
    }
}