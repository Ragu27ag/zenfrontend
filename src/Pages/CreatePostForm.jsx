import React from "react";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import { useFormik } from "formik";
import * as yup from "yup";
import ErrorIcon from "@mui/icons-material/Error";
import { backendInstance } from "../Axios/axios";
import SnackBarComp from "../Components/SnackBarComp";

const CreatePostForm = ({ open, handleClose, market_id, user_id }) => {
  const [openSnack, setOpenSnack] = React.useState(false);

  const [dataMsg, setDataMsg] = React.useState("");

  const handleClick = () => {
    console.log("opened");
    setDataMsg("Created Successfully");
    setOpenSnack(true);
    handleClose();
  };

  const validation = yup.object().shape({
    post_type: yup.string().required("Enter the post_type"),
    post_url: yup.string().required("Enter the post_url"),
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
        document.getElementById("submitbutt").disabled = true;
        console.log(data);
        const obj = {
          ...data,
          market_id: market_id,
          user_id: user_id,
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
      } catch (error) {
        console.log(error);
        document.getElementById("submitbutt").disabled = false;
      }
    },

    validationSchema: validation,
  });
  return (
    <div>
      {" "}
      <div>
        <Dialog
          open={open}
          onClose={handleClose}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
        >
          <DialogTitle id="alert-dialog-title">{"Create Market"}</DialogTitle>
          <DialogContent sx={{ width: "600px", textAlign: "center" }}>
            <DialogContentText id="alert-dialog-description">
              <form id="leaveform" onSubmit={formVal.handleSubmit}>
                <label htmlFor="post_type">Post Type</label>
                <br />
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
                      <ErrorIcon
                        sx={{ fontSize: "15px", textAlign: "center" }}
                      />
                      &nbsp;
                      {formVal.errors.post_type}
                    </span>{" "}
                  </div>
                )}
                <br />
                <label htmlFor="post_url">Image Url</label>
                <br />
                <input
                  name="post_url"
                  type="post_url"
                  id="post_url"
                  value={formVal.values.post_url}
                  onChange={formVal.handleChange}
                  onBlur={formVal.handleBlur}
                />
                <br />
                {formVal.touched.post_url && formVal.errors.post_url && (
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
                      {formVal.errors.post_url}
                    </span>{" "}
                  </div>
                )}
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
      </div>
      <SnackBarComp
        openSnack={openSnack}
        setOpenSnack={setOpenSnack}
        dataMsg={dataMsg}
      />
    </div>
  );
};

export default CreatePostForm;
