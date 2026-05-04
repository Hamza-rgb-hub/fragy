import axios from "axios";

const API = axios.create({
  baseURL: "https://fragy.onrender.com/api",
  withCredentials: true,
});

API.interceptors.request.use((req) => {
  const token = localStorage.getItem("token");
  if (token) {
    req.headers.Authorization = `Bearer ${token}`;
  }
  return req;
});

export default API;


// import axios from "axios";

// const API = axios.create({
//   baseURL: "https://fragy.onrender.com/api",
//   withCredentials: true,
// });

// API.interceptors.request.use((req) => {
//   const user = JSON.parse(localStorage.getItem("user"));

//   if (user?.token) {
//     req.headers.Authorization = `Bearer ${user.token}`;
//   }

//   return req;
// });

// export default API;