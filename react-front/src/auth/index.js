export const signup = user => { 
    //making post request to backend url using fetch()
    return fetch(`${process.env.REACT_APP_API_URL}/signup`, { 
        method: "POST",
        headers: {
            Accept: "application/json",
            "Content-Type": "application/json"
        },
        body: JSON.stringify(user)
    })
    .then(response => {
        return response.json();
    })
    .catch(err => console.log(err));
};

export const signin = user => {
    //making post request to backend url using fetch()
    return fetch(`${process.env.REACT_APP_API_URL}/signin`, {
        method: "POST",
        headers: {
            Accept: "application/json",
            "Content-Type": "application/json"
        },
        body: JSON.stringify(user)
    })
    .then(response => {
        return response.json();
    })
    .catch(err => {
        return err;
    });
};

export const authenticate = (jwt,next) => {
    //authentication method stores the token in the local storage 
    if(typeof window !== 'undefined') { //if window object is available for local storage
       //we want to access local storage
       localStorage.setItem("jwt",JSON.stringify(jwt));
       next();
    }
};

export const signout = (next) => { //here signout method takes function as an argument i.e. next
    //removing "jwt" from locaStorage this is signout from client-side
    if(typeof window !== 'undefined') localStorage.removeItem("jwt");
    next();//next() will redirect user to certain page after signout

    //we also need to send request to backend as well to signout from server side
    return fetch(`${process.env.REACT_APP_API_URL}/signout`, {
        method: "GET"
    })
    .then(response => {
        console.log("signout",response);
        return response.json();
    })
    .catch(err => console.log(err));
    }

export const isAuthenticated = () => {
    if(typeof window == "undefined") return false;
    if(localStorage.getItem("jwt")){
        return JSON.parse(localStorage.getItem("jwt"));
    } else {
        return false;
    }
};