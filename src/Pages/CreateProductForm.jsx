import React from "react";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import { useFormik } from "formik";
import * as yup from "yup";
import ErrorIcon from "@mui/icons-material/Error";
import backendInstance from "../Axios/axios";
import SnackBarComp from "../Components/SnackBarComp";

const CreateProductForm = ({
  open,
  handleClose,
  market_id,
  user_id,
  market_name,
}) => {
  const [openSnack, setOpenSnack] = React.useState(false);

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
    product_image_url: yup.string().required("Enter the product_image_url"),
    product_price: yup.number().required("Enter the product_price"),
    stocks: yup.number().required("Enter the stocks"),
  });
  const formVal = useFormik({
    initialValues: {
      product_name: "",
      product_description: "",
      product_image_url: "",
      product_price: 0,
      stocks: 0,
      user_id: "",
      manufacturer_name: "",
    },

    onSubmit: async (data) => {
      try {
        document.getElementById("submitbutt").disabled = true;
        console.log(data);
        const obj = {
          ...data,
          market_id: market_id,
          user_id: user_id,
          manufacturer_name: market_name,
        };
        const res = await backendInstance.post("/api/v1/add-product", obj);

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
          <DialogTitle id="alert-dialog-title">{"Create Product"}</DialogTitle>
          <DialogContent sx={{ width: "600px", textAlign: "center" }}>
            <DialogContentText id="alert-dialog-description">
              <form id="leaveform" onSubmit={formVal.handleSubmit}>
                <label htmlFor="product_name">Product Name</label>
                <br />
                <input
                  name="product_name"
                  id="product_name"
                  value={formVal.values.product_name}
                  onChange={formVal.handleChange}
                  onBlur={formVal.handleBlur}
                />
                <br />
                {formVal.touched.product_name &&
                  formVal.errors.product_name && (
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
                        {formVal.errors.product_name}
                      </span>{" "}
                    </div>
                  )}
                <br />
                <label htmlFor="product_description">
                  Describe your Product
                </label>
                <br />
                <textarea
                  name="product_description"
                  type="product_description"
                  id="product_description"
                  value={formVal.values.product_description}
                  onChange={formVal.handleChange}
                  onBlur={formVal.handleBlur}
                />
                <br />
                {formVal.touched.product_description &&
                  formVal.errors.product_description && (
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
                        {formVal.errors.product_description}
                      </span>{" "}
                    </div>
                  )}
                <br />
                <label htmlFor="product_image_url">Product Image Url</label>
                <br />
                <input
                  name="product_image_url"
                  id="product_image_url"
                  value={formVal.values.product_image_url}
                  onChange={formVal.handleChange}
                  onBlur={formVal.handleBlur}
                />
                <br />
                {formVal.touched.product_image_url &&
                  formVal.errors.product_image_url && (
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
                        {formVal.errors.product_image_url}
                      </span>{" "}
                    </div>
                  )}
                <br />
                <label htmlFor="product_price">Price</label>
                <br />
                <input
                  name="product_price"
                  id="product_price"
                  type="number"
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
                        fontSize: "15px",
                        marginTop: "15px",
                      }}
                    >
                      <span>
                        <ErrorIcon
                          sx={{ fontSize: "15px", textAlign: "center" }}
                        />
                        &nbsp;
                        {formVal.errors.product_price}
                      </span>{" "}
                    </div>
                  )}
                <br />
                <label htmlFor="stocks">Stocks</label>
                <br />
                <input
                  name="stocks"
                  id="stocks"
                  type="number"
                  value={formVal.values.stocks}
                  onChange={formVal.handleChange}
                  onBlur={formVal.handleBlur}
                />
                <br />
                {formVal.touched.stocks && formVal.errors.stocks && (
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
                      {formVal.errors.stocks}
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

export default CreateProductForm;
