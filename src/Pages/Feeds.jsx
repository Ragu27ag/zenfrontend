import { Box, Button, IconButton, Typography } from "@mui/material";
import Grid from "@mui/material/Grid";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { deepOrange, deepPurple } from "@mui/material/colors";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import { backendInstance } from "../Axios/axios.js";
import ThumbUpIcon from "@mui/icons-material/ThumbUp";
import ModeCommentIcon from "@mui/icons-material/ModeComment";
import CommentBox from "../Components/CommentBox.jsx";
import SendIcon from "@mui/icons-material/Send";
import * as yup from "yup";
import { useFormik } from "formik";
import ErrorIcon from "@mui/icons-material/Error";
import Avatar from "@mui/material/Avatar";
import logo from "../pics/WhatsApp Image 2025-04-13 at 7.24.04 PM.jpeg";
import bags from "../pics/bags.jpg";
import CreatePostForm from "./CreatePostForm.jsx";

const Feeds = () => {
  const User = useMemo(
    () => JSON.parse(sessionStorage.getItem("user")) || {},
    []
  );

  const navigate = useNavigate();

  const [arr, setArr] = useState([]);

  const [likes, setLikes] = useState([]);

  const [tasks, setTasks] = useState([]);

  const [currTask, setCurrTask] = useState(null);

  const [comment, setComments] = useState([]);

  // const [type, setType] = React.useState("");

  const [dataMsg, setDataMsg] = React.useState("");

  const [open, setOpen] = React.useState(false);

  // const [editData, setEditData] = useState({});

  // const [editAddData, setEditAddData] = useState({});

  const [openSnack, setOpenSnack] = React.useState(false);

  const [openPost, setOpenPost] = React.useState(false);

  const validation = yup.object().shape({
    comment: yup.string().required("Enter comment"),
  });

  const formVal = useFormik({
    initialValues: {
      comment: "",
      user_id: "",
      post_id: "",
    },
    onSubmit: async (data) => {
      try {
        document.getElementById("submitbutt").disabled = true;
        console.log(data);
        let obj = {
          ...data,
          product_name: arr.product_name,
          product_image_url: arr.product_image_url,
          product_price: arr.product_price,
          product_id: arr.product_id,
          market_id: arr.market_id,
          date_of_delivery: "",
          order_status: "Order Placed",
        };
        const res = await backendInstance.post("/api/v1/add-order", obj);
        console.log("res", res);
        if (res.data.message === "Inserted Successfully") {
          formVal.resetForm();
          handleClick();
        } else {
          document.getElementById("submitbutt").disabled = false;
        }
        console.log(res.arr);
        document.getElementById("submitbutt").disabled = false;
      } catch (error) {
        document.getElementById("submitbutt").disabled = false;
        console.log(error);
      }

      // if (res.arr.msg === "Inserted Successfully") {
      // }
    },
    validationSchema: validation,
  });

  const handleClose = () => {
    setOpen(false);
  };

  const getPost = useCallback(async () => {
    try {
      const res = await backendInstance.post("/api/v1/get-post", {});
      setArr(res.data.data);
    } catch (error) {
      console.log(error);
    }
  }, [setArr]);

  const getlikes = useCallback(async () => {
    try {
      const res = await backendInstance.post("/api/v1/get-post-likes", {
        user_id: User[0].user_id,
      });
      console.log("likes list", res.data.data);
      setLikes(res.data.data.map((data) => data?.post_id));
    } catch (error) {
      console.log(error);
    }
  }, [setLikes]);

  useEffect(() => {
    // if (Object.keys(User).length === 0) {
    //   navigate("/login");
    // } else {
    getPost();
    getlikes();
    // }
  }, [getPost, User]);

  console.log(tasks);
  console.log("arr", arr);
  console.log("likes", likes);

  console.log(currTask);

  const handleClick = (msg) => {
    console.log("opened");
    setDataMsg(msg);
    setCurrTask(document.getElementById("task").value);
    getPost();
    setOpenSnack(true);
  };

  const handleLike = async (data) => {
    try {
      if (Object.keys(User).length === 0) {
        navigate("/login");
      } else {
        console.log("handle like");
        let obj = {
          post_id: data.post_id,
          user_id: User[0].user_id,
        };
        const res = await backendInstance.post("/api/v1/add-post-likes", obj);
        if (res.data.message === "Liked Successfully") {
          await getlikes();
          await getPost();
        }
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleComment = async (data) => {
    try {
      console.log("handle comment");
      let obj = {
        post_id: data.post_id,
      };
      const res = await backendInstance.post("/api/v1/get-post-comments", obj);
      if (res.data.message === "Comments") {
        setComments(res.data.data);
        setOpen(true);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handlePostClose = useCallback(() => {
    setOpenPost(false);
  }, [setOpenPost]);

  return (
    <>
      <CreatePostForm
        open={openPost}
        handleClose={handlePostClose}
        market_id={arr[0]?.market_id}
        user_id={User[0].user_id}
      />
      <h1>Feeds</h1>
      <Button
        sx={{
          backgroundColor: "buttcolor.main",
          marginBottom: "15px",
        }}
        variant="contained"
        startIcon={<AddCircleOutlineIcon />}
        onClick={() => setOpenPost(true)}
      >
        Post Something
      </Button>
      <div
        className="main-div"
        style={{
          display: "flex",
          flexFlowflow: "wrap",
          gap: "24px",
          marginTop: "20px",
          flexWrap: "wrap",
          width: "100vw",
        }}
      >
        <Box
          sx={{
            flex: "1 1",
            overflow: "auto",
            minWidth: "380px",
            alignSelf: "stretch",
            flexGrow: "1",
            width: "60%",
          }}
        >
          <Box
            sx={{
              backgroundColor: "secondary.main",
              display: "flex",
              flexWrap: "wrap",
              justifyContent: "space-between",
              color: "white",
              borderRadius: "8px",
            }}
          ></Box>
          <Box
            sx={{
              // display: "flex",
              // flexWrap: "wrap",
              // justifyContent: "space-between",
              // alignItems: "center",
              borderRadius: "8px",
              // boxShadow: "rgba(0, 0, 0, 0.1) 0px 4px 12px",
              margin: "5% 10% 10% 10%",
              maxWidth: "800px",
            }}
          >
            {arr.length === 0 ? (
              <p style={{ margin: "5px", color: "#555A8F" }}>
                No feed to show.
              </p>
            ) : (
              arr.map((data) => (
                <div
                  style={{
                    height: "600px",
                    margin: "15px",
                    borderRadius: "8px",
                    boxShadow: "rgba(0, 0, 0, 0.1) 0px 4px 12px",
                  }}
                >
                  <Avatar
                    sx={{
                      bgcolor: deepOrange[500],
                      display: "inline-flex",
                      margin: "6px",
                    }}
                  >
                    {data?.market_name?.charAt(0)}
                  </Avatar>
                  <p
                    style={{
                      margin: "5px",
                      color: "#555A8F",
                      display: "inline-flex",
                      fontSize: "15px",
                      fontWeight: "bolder",
                      color: "black",
                    }}
                  >
                    {data?.market_name}
                  </p>
                  <p
                    style={{
                      margin: "5px",
                      color: "#555A8F",
                      fontSize: "12px",
                    }}
                  >
                    {data?.created_at}
                  </p>
                  <p
                    style={{
                      margin: "5px",
                      fontSize: "15px",
                      fontWeight: "bolder",
                      color: "black",
                    }}
                  >
                    {data?.post_description}
                  </p>
                  <div
                    style={{
                      border: "2px solid black",
                      height: "350px",
                      margin: "5px",
                      borderRadius: "8px",
                      border: "1px solid grey",
                    }}
                  >
                    {data.post_type == "Image" ? (
                      <img
                        src={data.post_url}
                        alt=""
                        style={{
                          height: "100%",
                          width: "100%",
                          // objectFit: "contain",
                        }}
                      />
                    ) : (
                      <iframe
                        width="100%"
                        height="100%"
                        src="https://www.youtube.com/embed/BAOdoV7jQVo?autoplay=1&mute=1"
                        title="YouTube video"
                        style={{ border: "none" }}
                        allow="autoplay; encrypted-media; fullscreen; picture-in-picture"
                        allowFullScreen
                      ></iframe>
                    )}
                    <div
                      style={{
                        height: "45px",
                        margin: "2px",
                        padding: "5px",
                        display: "flex",
                        // justifyContent: "space-between",
                        alignItems: "flex-start",
                        flexWrap: "wrap",
                      }}
                    >
                      <div
                        style={{
                          width: "50px",
                          display: "flex",
                          flexDirection: "row",
                          alignItems: "center",
                        }}
                      >
                        <button
                          style={{ background: "none", border: "none" }}
                          onClick={(e) => {
                            handleLike(data);
                          }}
                        >
                          <ThumbUpIcon
                            sx={{
                              color: likes.find((val) => val == data.post_id)
                                ? "blue"
                                : "none",
                            }}
                          />
                        </button>
                        <span>{data.likes_count}</span>
                      </div>
                      <div
                        style={{
                          display: "flex",
                          flexDirection: "row",
                          alignItems: "center",
                        }}
                      >
                        <button
                          style={{ background: "none", border: "none" }}
                          onClick={(e) => {
                            handleComment(data);
                          }}
                        >
                          <ModeCommentIcon />
                        </button>
                        <span>{data.comments_count}</span>
                      </div>
                    </div>
                    <div
                      style={{
                        height: "45px",
                        margin: "5px",
                        borderRadius: "8px",
                        border: "1px solid grey",
                        padding: "8px",
                        position: "relative",
                      }}
                    >
                      <form id="orderform" onSubmit={formVal.handleSubmit}>
                        <textarea
                          name="comment"
                          type="comment"
                          id="comment"
                          value={formVal.values.comment}
                          onChange={formVal.handleChange}
                          onBlur={formVal.handleBlur}
                          placeholder="comment"
                          style={{
                            width: "100%",
                            border: "none",
                            borderBottom: "1px solid grey",
                            outline: "none",
                          }}
                        />
                        <br />
                        {formVal.touched.comment && formVal.errors.comment && (
                          <div
                            style={{
                              color: "red",
                              fontSize: "15px",
                              position: "absolute",
                              top: "8px",
                              right: "60px",
                            }}
                          >
                            <span>
                              <ErrorIcon
                                sx={{ fontSize: "15px", textAlign: "center" }}
                              />
                              &nbsp;
                              {formVal.errors.comment}
                            </span>
                          </div>
                        )}
                        <button
                          id="submitbutt"
                          type="submit"
                          style={{
                            background: "none",
                            border: "none",
                            position: "absolute",
                            top: 8,
                            right: 5,
                          }}
                        >
                          <SendIcon />
                        </button>
                      </form>
                    </div>
                  </div>
                </div>
              ))
            )}
          </Box>
        </Box>
        <CommentBox arr={comment} open={open} handleClose={handleClose} />
        <Box sx={{ width: "40%" }}>
          <img
            src={logo}
            height={900}
            width={500}
            style={{
              marginTop: "5px",
              borderRadius: "8px",
              boxShadow: "rgba(0, 0, 0, 0.1) 0px 4px 12px",
            }}
            alt="logo"
          />
        </Box>
      </div>
    </>
  );
};

export default Feeds;
