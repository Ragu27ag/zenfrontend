import React, { useMemo, useState } from "react";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import { useFormik } from "formik";
import * as yup from "yup";
import { backendInstance } from "../Axios/axios";
import { Box, Input, TextField } from "@mui/material";
import ErrorIcon from "@mui/icons-material/Error";
import Rating from "@mui/material/Rating";
import { useNavigate } from "react-router-dom";
import GooglePayButton from "@google-pay/button-react";

const OrderForm = ({ arr, open, handleClose, setOpenSnack }) => {
  const User = useMemo(
    () => JSON.parse(sessionStorage.getItem("user")) || {},
    []
  );
  const [buy, setBuy] = useState(false);
  const [gpay, setGpay] = useState(false);
  const [orderDetails, setOrderDtails] = useState({});
  const navigate = useNavigate();

  const handleClick = () => {
    setBuy(false);
    console.log("opened");
    handleClose();
    setOpenSnack(true);
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
          user_id: User[0]?.user_id,
        };
        setOrderDtails(obj);
      } catch (error) {
        document.getElementById("submitbutt").disabled = false;
        console.log(error);
      }
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
      <DialogTitle key={arr.product_id} id="alert-dialog-title">
        {arr.product_name}
      </DialogTitle>
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
              boxShadow: "rgba(0, 0, 0, 0.1) 0px 4px 12px",
              backgroundColor: "#FAFAFA",
              // maxWidth: "90%",
            }}
          >
            <div
              style={{
                margin: "5px",
                borderRadius: "8px",
                boxShadow: "rgba(0, 0, 0, 0.1) 0px 4px 12px",

                height: "380px",
              }}
            >
              <img
                src={arr.product_image_url}
                alt=""
                style={{
                  width: "100%",
                  height: "100%",
                  borderRadius: "8px",
                  objectFit: "cover",
                }}
              />
            </div>
            <div
              style={{
                margin: "5px",
                borderRadius: "8px",
                padding: "8px",
              }}
            >
              <p
                style={{
                  margin: "5px",
                  color: "black",
                  fontSize: "25px",
                  whiteSpace: "nowrap",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                }}
              >
                {arr?.product_name}
              </p>
              <p
                style={{
                  margin: "1px 5px 5px 5px",
                  color: "#555A8F",
                  fontSize: "18px",
                }}
              >
                {arr?.product_description}
              </p>
              <p
                style={{
                  margin: "1px 5px 5px 5px",
                  color: "#555A8F",
                  fontSize: "18px",
                }}
              >
                Rs : {arr?.product_price}
              </p>
            </div>
            <div
              style={{
                margin: "5px",
                borderRadius: "8px",
                padding: "8px",
              }}
            >
              <p
                style={{
                  margin: "1px 5px 5px 5px",
                  color: "#555A8F",
                  fontSize: "15px",
                }}
              >
                Manufacturrer : {arr?.manufacturer_name}
              </p>
              <p
                style={{
                  margin: "1px 5px 5px 5px",
                  color: "#555A8F",
                  fontSize: "15px",
                }}
              >
                Address : {arr?.manufacturer_address || "-"}
              </p>
            </div>

            <div
              style={{
                margin: "5px",
                borderRadius: "8px",
                padding: "8px",
              }}
            >
              <p
                style={{
                  margin: "1px 5px 5px 5px",
                  color: "#555A8F",
                  fontSize: "15px",
                }}
              >
                Available : {arr?.stocks}
              </p>
              <p
                style={{
                  margin: "1px 5px 5px 5px",
                  color: "#555A8F",
                  fontSize: "15px",
                }}
              >
                <Rating name="read-only" value={arr?.star_rating} readOnly />
              </p>
            </div>

            {/* <div
              style={{
                margin: "5px",
                borderRadius: "8px",
                border: "1px solid grey",
                padding: "8px",
              }}
            >
              <p
                style={{
                  margin: "1px 5px 5px 5px",
                  color: "#555A8F",
                  fontSize: "15px",
                }}
              >
                {arr?.comments}
              </p>
            </div> */}

            <div
              style={{
                margin: "5px",
                padding: "8px",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                flexWrap: "wrap",
              }}
            >
              {!buy && (
                <Button
                  sx={{
                    backgroundColor: "buttcolor.main",
                    margin: "5px",
                    width: "100%",
                  }}
                  variant="contained"
                  id="markbutt"
                  onClick={() => {
                    if (Object.keys(User)?.length === 0) {
                      navigate("/login");
                    } else {
                      setBuy(true);
                    }
                  }}
                >
                  BUY
                </Button>
              )}
            </div>
            {buy && (
              <div
                style={{
                  margin: "5px",
                  borderRadius: "8px",
                  height: "380px",
                }}
              >
                <h4>Shipping Details : </h4>
                <div
                  style={{
                    margin: "5px",
                    borderRadius: "8px",
                    padding: "10px",
                  }}
                >
                  <form id="orderform" onSubmit={formVal.handleSubmit}>
                    <label htmlFor="customer_name">Customer Name</label>
                    <br />
                    <input
                      name="customer_name"
                      id="customer_name"
                      value={formVal.values.customer_name}
                      onChange={formVal.handleChange}
                      onBlur={formVal.handleBlur}
                    />
                    <br />
                    {formVal.touched.customer_name &&
                      formVal.errors.customer_name && (
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
                            {formVal.errors.customer_name}
                          </span>{" "}
                        </div>
                      )}
                    <br />
                    <label htmlFor="billing_address">Billing Address</label>
                    <br />
                    <textarea
                      name="billing_address"
                      type="billing_address"
                      id="billing_address"
                      value={formVal.values.billing_address}
                      onChange={formVal.handleChange}
                      onBlur={formVal.handleBlur}
                    />
                    <br />
                    {formVal.touched.billing_address &&
                      formVal.errors.billing_address && (
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
                            {formVal.errors.billing_address}
                          </span>{" "}
                        </div>
                      )}
                    <br />
                    <label htmlFor="quantity">Quantity</label>
                    <br />
                    <input
                      type="number"
                      name="quantity"
                      id="quantity"
                      min={1}
                      max={+arr.stocks}
                      value={formVal.values.quantity}
                      onChange={formVal.handleChange}
                      onBlur={formVal.handleBlur}
                    />
                    <br />
                    {formVal.touched.quantity && formVal.errors.quantity && (
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
                          {formVal.errors.quantity}
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
                      size="large"
                      onClick={() => {
                        console.log("forma", formVal.values);
                        if (formVal.values.customer_name != "") setGpay(true);
                      }}
                    >
                      Place Order
                    </Button>
                  </form>
                </div>
              </div>
            )}
            {gpay && (
              <div className="p-4" style={{ margin: "10px" }}>
                <GooglePayButton
                  environment="TEST"
                  paymentRequest={{
                    apiVersion: 2,
                    apiVersionMinor: 0,
                    allowedPaymentMethods: [
                      {
                        type: "CARD",
                        parameters: {
                          allowedAuthMethods: ["PAN_ONLY", "CRYPTOGRAM_3DS"],
                          allowedCardNetworks: ["MASTERCARD", "VISA"],
                        },
                        tokenizationSpecification: {
                          type: "PAYMENT_GATEWAY",
                          parameters: {
                            gateway: "example",
                            gatewayMerchantId: "exampleGatewayMerchantId",
                          },
                        },
                      },
                    ],
                    merchantInfo: {
                      merchantId: "12345678901234567890",
                      merchantName: "Demo Merchant",
                    },
                    transactionInfo: {
                      totalPriceStatus: "FINAL",
                      totalPriceLabel: "Total",
                      totalPrice: `${
                        arr.product_price * formVal.values.quantity
                      }`,
                      currencyCode: "INR",
                      countryCode: "IN",
                    },
                  }}
                  onLoadPaymentData={async (paymentRequest) => {
                    console.log("Payment data loaded:", paymentRequest);
                    console.log("order details", orderDetails);
                    // handle successful payment here
                    const res = await backendInstance.post(
                      "/api/v1/add-order",
                      orderDetails
                    );
                    console.log("res", res);
                    if (res.data.message === "Inserted Successfully") {
                      formVal.resetForm();
                      handleClick();
                      setGpay(false);
                    } else {
                      document.getElementById("submitbutt").disabled = false;
                    }
                    console.log(res.arr);
                    document.getElementById("submitbutt").disabled = false;
                  }}
                />
              </div>
            )}
          </Box>
        </DialogContentText>
      </DialogContent>
    </Dialog>
  );
};

export default OrderForm;
