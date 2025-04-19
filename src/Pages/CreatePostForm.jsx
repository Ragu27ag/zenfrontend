import React, { useState } from "react";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import { useFormik } from "formik";
import * as yup from "yup";
import ErrorIcon from "@mui/icons-material/Error";
import { backendInstance, imageUploadInstance } from "../Axios/axios";
import SnackBarComp from "../Components/SnackBarComp";
import bags from "../pics/bags.jpg";

const CreatePostForm = ({ open, handleClose, market_id, user_id }) => {
  const [openSnack, setOpenSnack] = useState(false);

  const [dataMsg, setDataMsg] = useState("");

  const [file, setFile] = useState(null);
  const [fileType, setFileType] = useState("");

  const handleClick = () => {
    console.log("opened");
    setDataMsg("Created Successfully");
    setOpenSnack(true);
    handleClose();
  };

  const validation = yup.object().shape({
    post_type: yup.string().required("Enter the post_type"),
    post_description: yup.string().required("Enter the post_description"),
  });
  const formVal = useFormik({
    initialValues: {
      post_type: "",
      post_url: "",
      post_description: "",
      user_id: "",
      market_id: "",
    },

    onSubmit: async (data) => {
      try {
        if (file != null) {
          if (
            data.post_type
              .toLowerCase()
              .includes(fileType.slice(0, fileType.indexOf("/")))
          ) {
            document.getElementById("submitbutt").disabled = true;
            const formData = new FormData();
            formData.append("file", file);
            formData.append("upload_preset", "ml_default");
            formData.append("cloud_name", "dhh1svmyo");
            const img_res = await imageUploadInstance.post(
              "/dhh1svmyo/image/upload",
              formData
            );
            console.log(img_res.data);
            const url = img_res.data.secure_url;
            console.log(data);
            const obj = {
              ...data,
              market_id: market_id,
              user_id: user_id,
              post_url: url,
            };
            console.log("obj", obj);
            const res = await backendInstance.post("/api/v1/add-post", obj);

            if (res.data.message === "Inserted Successfully") {
              formVal.resetForm();
              handleClick();
            } else {
              document.getElementById("submitbutt").disabled = false;
            }
            document.getElementById("submitbutt").disabled = false;
          } else {
            alert("Invalid file type");
          }
        } else {
          alert("Upload the image to post");
        }
      } catch (error) {
        console.log(error);
        document.getElementById("submitbutt").disabled = false;
      }
    },

    validationSchema: validation,
  });
  return (
    <div>
      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">{"Create Post"}</DialogTitle>
        <DialogContent
          sx={{
            width: "600px",
            textAlign: "center",
          }}
        >
          <DialogContentText
            id="alert-dialog-description"
            sx={{
              backgroundImage: `url(${bags})`,
              backgroundRepeat: "no-repeat",
              backgroundSize: "contain",
              backgroundPosition: "center",
            }}
          >
            <form id="leaveform" onSubmit={formVal.handleSubmit}>
              <select
                name="post_type"
                id="post_type"
                value={formVal.values.post_type}
                onChange={formVal.handleChange}
                onBlur={formVal.handleBlur}
                style={{
                  padding: "8px",
                  borderRadius: "4px",
                  border: "1px solid #ccc",
                  fontFamily: "Poppins, sans-serif",
                  // width: "100%",
                  marginTop: "10px",
                }}
              >
                <option value="" disabled>
                  Select Post Type
                </option>
                <option value="Image">Image</option>
                <option value="Video">Video</option>
              </select>
              <br />
              {formVal.touched.post_type && formVal.errors.post_type && (
                <div
                  style={{
                    color: "red",
                    fontSize: "15px",
                    marginTop: "15px",
                  }}
                >
                  <span>
                    <ErrorIcon sx={{ fontSize: "15px", textAlign: "center" }} />
                    &nbsp;
                    {formVal.errors.post_type}
                  </span>{" "}
                </div>
              )}
              <br />
              <Button variant="contained" component="label">
                Upload Image
                <input
                  type="file"
                  hidden
                  accept="image/*,video/*"
                  onChange={(e) => {
                    const selectedFile = e.target.files[0];
                    console.log("selectedFile.type", selectedFile.type);
                    setFile(selectedFile);
                    setFileType(selectedFile.type);
                  }}
                  size="small"
                />
              </Button>
              <br />
              <br />
              <label htmlFor="post_description">Description</label>
              <br />
              <textarea
                name="post_description"
                id="post_description"
                value={formVal.values.post_description}
                onChange={formVal.handleChange}
                onBlur={formVal.handleBlur}
              ></textarea>
              <br />
              {formVal.touched.post_description &&
                formVal.errors.post_description && (
                  <div
                    style={{
                      color: "red",
                      fontSize: "15px",
                      marginTop: "15px",
                    }}
                  >
                    <span>
                      <ErrorIcon
                        sx={{ fontSize: "15px", textAlign: "center" }}
                      />
                      &nbsp;
                      {formVal.errors.post_description}
                    </span>{" "}
                  </div>
                )}
              <br />
              <Button
                autoFocus
                sx={{ backgroundColor: "buttcolor.main" }}
                variant="contained"
                type="submit"
                disableRipple="true"
                id="submitbutt"
              >
                Create
              </Button>
            </form>
          </DialogContentText>
        </DialogContent>
      </Dialog>
      <SnackBarComp
        openSnack={openSnack}
        setOpenSnack={setOpenSnack}
        dataMsg={dataMsg}
      />
    </div>
  );
};

export default CreatePostForm;
