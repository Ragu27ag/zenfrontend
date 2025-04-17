import axios from "axios";

const backendInstance = axios.create({
  baseURL: process.env.REACT_APP_URL,
  timeout: 300000,
});

const imageUploadInstance = axios.create({
  baseURL: "https://api.cloudinary.com/v1_1",
  timeout: 300000,
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
    console.log("req", req);
    console.log("newObj", newObj);
    return newObj;
  },
  function (error) {
    console.log("error", error);
    return Promise.reject.error;
  }
);

backendInstance.interceptors.response.use((response, error) => {
  // if (error) {
  //   return Promise.reject.error;
  // } else {
  //   return response;
  // }
  return response;
});

export { backendInstance, imageUploadInstance };
