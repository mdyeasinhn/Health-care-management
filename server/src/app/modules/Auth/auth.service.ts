const loginUser = async (payload : {
    email : string,
    password : string
}) => {
    console.log('logged in user', payload)
}

export const AuthService = {
    loginUser,
}