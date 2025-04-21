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
import { TextField } from "@mui/material";
import Textarea from "@mui/joy/Textarea";

const CreateProductForm = ({
  open,
  handleClose,
  market_id,
  user_id,
  market_name,
}) => {
  const [openSnack, setOpenSnack] = React.useState(false);

  const [file, setFile] = useState(null);
  const [fileType, setFileType] = useState("");
  const [dataMsg, setDataMsg] = React.useState("");

  const handleClick = () => {
    console.log("opened");
    setDataMsg("Created Successfully");
    setOpenSnack(true);
    handleClose();
  };

  const validation = yup.object().shape({
    product_name: yup.string().required("Enter the product_name"),
    product_description: yup.string().required("Enter the product_description"),
    product_price: yup.number().required("Enter the product_price"),
    stocks: yup.number().required("Enter the stocks"),
  });
  const formVal = useFormik({
    initialValues: {
      product_name: "",
      product_description: "",
      product_price: 0,
      stocks: 0,
      user_id: "",
      manufacturer_name: "",
    },

    onSubmit: async (data) => {
      try {
        console.log("dattaaa", data);
        if (file != null) {
          if (fileType.slice(0, fileType.indexOf("/")) == "image") {
            document.getElementById("submitbutt").disabled = true;
            const formData = new FormData();
            formData.append("file", file);
            formData.append("upload_preset", process.env.REACT_APP_PRESET);
            formData.append("cloud_name", process.env.REACT_APP_CLOUD_NAME);
            const img_res = await imageUploadInstance.post(
              `/${process.env.REACT_APP_CLOUD_NAME}/image/upload`,
              formData
            );
            const url = img_res?.data.secure_url;
            document.getElementById("submitbutt").disabled = true;
            console.log(data);
            const obj = {
              ...data,
              market_id: market_id,
              user_id: user_id,
              manufacturer_name: market_name,
              product_image_url: url,
            };
            const res = await backendInstance.post("/api/v1/add-product", obj);

            if (res.data.message === "Inserted Successfully") {
              formVal.resetForm();
              handleClick();
            } else {
              document.getElementById("submitbutt").disabled = false;
            }
            document.getElementById("submitbutt").disabled = false;
          } else {
            alert("Invalid file type");
            document.getElementById("submitbutt").disabled = false;
          }
        } else {
          alert("Upload the image to post");
          document.getElementById("submitbutt").disabled = false;
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
      {" "}
      <div>
        <Dialog
          open={open}
          onClose={handleClose}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
        >
          <DialogTitle id="alert-dialog-title">{"Create Product"}</DialogTitle>
          <DialogContent sx={{ width: "600px" }}>
            <DialogContentText id="alert-dialog-description">
              <form id="leaveform" onSubmit={formVal.handleSubmit}>
                <TextField
                  name="product_name"
                  id="product_name"
                  variant="outlined"
                  label="Product Name"
                  size="small"
                  value={formVal.values.product_name}
                  onChange={formVal.handleChange}
                  onBlur={formVal.handleBlur}
                  style={{ margin: "5px", color: "#555A8F" }}
                />
                <br />
                {formVal.touched.product_name &&
                  formVal.errors.product_name && (
                    <div
                      style={{
                        color: "red",
                        fontSize: "10px",
                        marginTop: "5px",
                      }}
                    >
                      <span>
                        <ErrorIcon
                          sx={{ fontSize: "10px", textAlign: "center" }}
                        />
                        &nbsp;
                        {formVal.errors.product_name}
                      </span>{" "}
                    </div>
                  )}
                <br />
                <textarea
                  name="product_description"
                  type="product_description"
                  id="product_description"
                  placeholder="Describe your Product"
                  size="small"
                  minRows={2}
                  maxRows={4}
                  value={formVal.values.product_description}
                  onChange={formVal.handleChange}
                  onBlur={formVal.handleBlur}
                  style={{ width: "50%", marginLeft: "5px" }}
                />
                <br />
                {formVal.touched.product_description &&
                  formVal.errors.product_description && (
                    <div
                      style={{
                        color: "red",
                        fontSize: "10px",
                        marginTop: "5px",
                      }}
                    >
                      <span>
                        <ErrorIcon
                          sx={{ fontSize: "10px", textAlign: "center" }}
                        />
                        &nbsp;
                        {formVal.errors.product_description}
                      </span>{" "}
                    </div>
                  )}
                <br />
                <TextField
                  name="product_price"
                  id="product_price"
                  type="number"
                  variant="outlined"
                  label="Price"
                  size="small"
                  style={{ margin: "5px", color: "#555A8F" }}
                  value={formVal.values.product_price}
                  onChange={formVal.handleChange}
                  onBlur={formVal.handleBlur}
                />
                <br />
                {formVal.touched.product_price &&
                  formVal.errors.product_price && (
                    <div
                      style={{
                        color: "red",
                        fontSize: "10px",
                        marginTop: "5px",
                      }}
                    >
                      <span>
                        <ErrorIcon
                          sx={{ fontSize: "10px", textAlign: "center" }}
                        />
                        &nbsp;
                        {formVal.errors.product_price}
                      </span>{" "}
                    </div>
                  )}
                <br />
                <TextField
                  name="stocks"
                  id="stocks"
                  type="number"
                  variant="outlined"
                  label="Stocks"
                  size="small"
                  style={{ margin: "5px", color: "#555A8F" }}
                  value={formVal.values.stocks}
                  onChange={formVal.handleChange}
                  onBlur={formVal.handleBlur}
                />
                <br />
                {formVal.touched.stocks && formVal.errors.stocks && (
                  <div
                    style={{
                      color: "red",
                      fontSize: "10px",
                      marginTop: "5px",
                    }}
                  >
                    <span>
                      <ErrorIcon
                        sx={{ fontSize: "10px", textAlign: "center" }}
                      />
                      &nbsp;
                      {formVal.errors.stocks}
                    </span>{" "}
                  </div>
                )}
                <br />
                <Button variant="contained" component="label">
                  Upload Image/Video
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
                &nbsp;&nbsp;
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

export default CreateProductForm;
