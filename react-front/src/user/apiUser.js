export const read=(userId,token) => {
    return fetch(`${process.env.REACT_APP_API_URL}/user/${userId}`, {
        method:"GET",
        headers: {
        Accept:"application/json",
         "Content-type":"application/json",
         Authorization:`Bearer ${token}`
      }
   })
   .then(response => {
       //console.log(response);
       return response.json();
   }) 
   .catch(err => console.log(err));  
};
//fetch() method is promise based so we use then to receive response

export const update=(userId,token,user) => {
   // console.log("User data",user);
    return fetch(`${process.env.REACT_APP_API_URL}/user/${userId}`, {
        method:"PUT",
        headers: {
        Accept:"application/json",
        Authorization:`Bearer ${token}` //we are sending form data so we are not including header Content type:application/json
      },
      body:user
   })
   .then(response => {
       return response.json();
   }) 
   .catch(err => console.log(err));  
};

export const remove=(userId,token) => {
    return fetch(`${process.env.REACT_APP_API_URL}/user/${userId}`, {
        method:"DELETE",
        headers: {
        Accept:"application/json",
         "Content-type":"application/json",
         Authorization:`Bearer ${token}`
      }
   })
   .then(response => {
      // console.log(response);
       return response.json();
   }) 
   .catch(err => console.log(err));  
};

export const list = () => {
    return fetch(`${process.env.REACT_APP_API_URL}/users`, {
        method:"GET"
   })
   .then(response => {
       console.log(response);
       return response.json();
   }) 
   .catch(err => console.log(err));  
};
