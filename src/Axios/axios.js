import axios from "axios";

const backendInstance = axios.create({
  baseURL: process.env.REACT_APP_URL,
  timeout: 5000,
});

backendInstance.interceptors.request.use(
  function (req) {
    const User = JSON.parse(sessionStorage.getItem("user")) || {};
    console.log(User);
    const newObj = {
      ...req,
      headers: {
        ...req.headers,
        accesstoken: User.accesstoken,
      },
    };
    return newObj;
  },
  function (error) {
    return Promise.reject.error;
  }
);

backendInstance.interceptors.response.use((response, error) => {
  if (error) {
    return Promise.reject.error;
  } else {
    return response;
  }
});

export default backendInstance;
