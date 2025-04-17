import React, { useState } from "react";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import { useFormik } from "formik";
import * as yup from "yup";
import SnackBarComp from "./SnackBarComp";
import { Box, Input, TextField } from "@mui/material";
import ErrorIcon from "@mui/icons-material/Error";
import CustomNumberInput from "./CustomIncDecButton";
import { backendInstance } from "../Axios/axios";

const CommentBox = ({ arr, open, handleClose }) => {
  const [openSnack, setOpenSnack] = React.useState(false);
  const [buy, setBuy] = useState(false);

  const [dataMsg, setDataMsg] = React.useState("");
  const [qty, setQty] = React.useState(1);

  const handleClick = () => {
    setBuy(false);
    console.log("opened");
    setDataMsg("Added Successfully");
    setOpenSnack(true);
    handleClose();
  };

  const validation = yup.object().shape({
    customer_name: yup.string().required("Enter customer_name"),
    billing_address: yup.string().required("Enter the billing_address"),
    quantity: yup.number().required("Enter the quantity"),
  });

  const formVal = useFormik({
    initialValues: {
      customer_name: "",
      billing_address: "",
      quantity: 0,
      product_name: "",
      product_image_url: "",
      product_price: 0,
      product_id: "",
      market_id: "",
      date_of_delivery: "",
      order_status: "",
      order_id: "",
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

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description"
      sx={{}}
    >
      <DialogTitle id="alert-dialog-title">{arr.product_name}</DialogTitle>
      <DialogContent sx={{ width: "600px" }}>
        <DialogContentText id="alert-dialog-description">
          <Box
            sx={{
              // display: "flex",
              // flexWrap: "wrap",
              // justifyContent: "space-around",
              borderRadius: "8px",
              // border: "1px solid red",
              margin: "5%",
              // boxShadow: "rgba(0, 0, 0, 0.1) 0px 4px 12px",
              // maxWidth: "90%",
            }}
          >
            {arr.map((data) => (
              <div
                style={{
                  margin: "5px",
                  padding: "8px",
                  width: "100%",
                  borderRadius: "8px",
                  boxShadow: "rgba(0, 0, 0, 0.1) 0px 4px 12px",
                }}
              >
                <p style={{ fontSize: "15px", margin: "0px" }}>
                  {data.user_name}
                </p>
                <p style={{ fontSize: "14px", margin: "0px" }}>
                  {data.comments}
                </p>
              </div>
            ))}
          </Box>
        </DialogContentText>
      </DialogContent>
      <SnackBarComp
        openSnack={openSnack}
        setOpenSnack={setOpenSnack}
        dataMsg={dataMsg}
      />
    </Dialog>
  );
};

export default CommentBox;
