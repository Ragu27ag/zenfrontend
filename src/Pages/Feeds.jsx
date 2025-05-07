import { Box, Button, IconButton, Typography, useTheme } from "@mui/material";
import Grid from "@mui/material/Grid";
import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
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
import logo from "../pics/Shopping Options.gif";
import bags from "../pics/bags.jpg";
import CreatePostForm from "./CreatePostForm.jsx";
import gifyy from "../pics/Tracking Order Online.gif";

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

  const [newComment, setNewComment] = useState({});

  // const [type, setType] = React.useState("");

  const [dataMsg, setDataMsg] = React.useState("");

  const [open, setOpen] = React.useState(false);

  // const [editData, setEditData] = useState({});

  // const [editAddData, setEditAddData] = useState({});

  const [openSnack, setOpenSnack] = React.useState(false);

  const [openPost, setOpenPost] = React.useState(false);

  const commentInput = useRef(null);

  const validation = yup.object().shape({
    comment: yup.string().required("Enter comment"),
  });

  const theme = useTheme();

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
        user_id: User[0]?.user_id,
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
      if (Object.keys(User)?.length === 0) {
        navigate("/login");
      } else {
        console.log("handle like");
        let obj = {
          post_id: data.post_id,
          user_id: User[0]?.user_id,
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

  const handleComment = async (data, isFromCmt) => {
    try {
      console.log("handle comment");
      let obj = {
        post_id: data.post_id,
      };
      const res = await backendInstance.post("/api/v1/get-post-comments", obj);
      console.log("res", res);
      if (res.data.message === "Comments") {
        setComments(res.data.data);
        if (isFromCmt) setOpen(true);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handlePostClose = useCallback(() => {
    setOpenPost(false);
  }, [setOpenPost]);

  const handleNewComment = async () => {
    if (Object.entries(newComment).length !== 0) {
      try {
        document.getElementById("commentsbutt").disabled = false;
        const res = await backendInstance.post(
          "/api/v1/post-comments",
          newComment
        );
        if (res.data.message === "Comments") {
          await getPost();
          await handleComment({ post_id: newComment?.post_id }, false);
          setNewComment({});
        }
      } catch (error) {
        console.log(error);
      }
    } else {
      console.log("newComment", newComment);
    }
  };

  return (
    <>
      <CreatePostForm
        open={openPost}
        handleClose={handlePostClose}
        market_id={arr[0]?.market_id}
        user_id={User[0]?.user_id}
      />
      <div
        style={{
          backgroundImage: `url(${bags})`,
          backgroundRepeat: "no-repeat",
          backgroundSize: "cover",
          // backgroundPosition: "center",
        }}
      >
        <h6
          style={{
            fontFamily: "Poppins, sans-serif",
            fontWeight: 600,
            fontSize: "54px",
            letterSpacing: "1px",
            color: "#1e3a8a",
            margin: "10px",
          }}
        >
          Herfemora
        </h6>
        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            justifyContent: "flex-end",
          }}
        >
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
        </div>
      </div>
      <div
        className="main-div"
        style={{
          display: "flex",
          flexFlowflow: "wrap",
          gap: "5px",
          marginTop: "20px",
          flexWrap: "wrap",
          // width: "100vw",
        }}
      >
        <Box
          sx={{
            flex: "1 1",
            overflow: "auto",
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
              margin: "0% 10% 10% 5%",
              // maxWidth: "500px",
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
                    backgroundColor: theme.palette.post.main,
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
                      fontFamily: "Poppins, sans-serif",
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
                      margin: "15px 0px 10px 5px",
                      fontSize: "15px",
                      fontWeight: "bolder",
                      color: "black",
                    }}
                  >
                    {data?.post_description}
                  </p>
                  <div
                    style={{
                      height: "350px",
                      margin: "5px",
                      borderRadius: "8px",
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
                      <video
                        controls
                        style={{
                          width: "100%",
                          height: "auto",
                          borderRadius: "8px",
                        }}
                      >
                        <source src={data.post_url} type="video/mp4" />
                        Your browser does not support the video tag.
                      </video>
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
                            if (Object.keys(User).length === 0) {
                              navigate("/login");
                            } else {
                              handleLike(data);
                            }
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
                            handleComment(data, true);
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
                      <textarea
                        name="comment"
                        type="comment"
                        id="comment"
                        value={
                          newComment.post_id == data.post_id
                            ? newComment.comment
                            : ""
                        }
                        onFocus={() =>
                          setNewComment({
                            ...newComment,
                            post_id: data.post_id,
                          })
                        }
                        ref={commentInput}
                        onChange={(e) => {
                          setNewComment({
                            ...newComment,
                            post_id: data.post_id,
                            user_id: User[0]?.user_id,
                            comment: e.target.value,
                          });
                        }}
                        placeholder="comment"
                        style={{
                          width: "100%",
                          border: "none",
                          borderBottom: "1px solid grey",
                          outline: "none",
                        }}
                      />
                      <br />
                      <button
                        id="commentsbutt"
                        type="submit"
                        style={{
                          background: "none",
                          border: "none",
                          position: "absolute",
                          top: 8,
                          right: 5,
                        }}
                        onClick={handleNewComment}
                      >
                        <SendIcon />
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </Box>
        </Box>
        <CommentBox arr={comment} open={open} handleClose={handleClose} />
        <Box
          sx={{
            width: "40%",
            backgroundImage: `url(${bags})`,
            backgroundRepeat: "repeat-y",
            backgroundSize: "contain",
            backgroundPosition: "center",
          }}
        >
          <img
            src={logo}
            height={500}
            width={500}
            style={{
              marginTop: "2px",
            }}
            alt="logo"
          />
          <img
            src={gifyy}
            height={500}
            width={500}
            style={{
              marginTop: "2px",
            }}
            alt="logo"
          />
        </Box>
      </div>
    </>
  );
};

export default Feeds;
