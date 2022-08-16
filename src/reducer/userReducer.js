const INITIAL_STATE = {
    idusers: 0,
    username: "",
    fullname: "",
    email: "",
    user_bio: "",
    user_status: 0,
    user_profileimage: "",
    idstatus: 0,
    status: "",
};

export const userReducer = (state = INITIAL_STATE, action) => {
    //console.log("data action", action)
    switch (action.type) {
        case "LOGIN_SUCCESS":
            delete action.payload.password;
            //console.log(action.payload);
            return {...state, ...action.payload};
        case "LOGOUT_SUCCESS":
            return INITIAL_STATE;
        default:
            return state;
    };
};