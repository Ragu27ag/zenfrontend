import { Button } from "@mui/material";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import StorefrontIcon from "@mui/icons-material/Storefront";
import { useNavigate } from "react-router-dom";
import backendInstance from "../Axios/axios";
import SnackBarComp from "../Components/SnackBarComp";
import CreateMarketForm from "./CreateMarketForm";
import CreatePostForm from "./CreatePostForm";
import CreateProductForm from "./CreateProductForm";
import { DemoContainer } from "@mui/x-date-pickers/internals/demo";
import EditIcon from "@mui/icons-material/Edit";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import dayjs from "dayjs";

const MyMarketPlace = () => {
  const [open, setOpen] = React.useState(false);
  const [openProduct, setOpenProduct] = React.useState(false);
  const [openPost, setOpenPost] = React.useState(false);

  const navigate = useNavigate();

  const User = useMemo(
    () => JSON.parse(sessionStorage.getItem("user")) || {},
    []
  );

  // console.log("User", User);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const [arr, setArr] = useState([]);
  const [orders, setOrders] = useState([]);

  const marketplace = useCallback(async () => {
    try {
      const data = await backendInstance.post(`/api/v1/get-market`, {
        user_id: User[0].user_id,
      });
      setArr(data.data.data);
      const firstMarketId = data.data.data[0]?.market_id;
      if (firstMarketId) {
        const res = await backendInstance.post("/api/v1/get-order", {
          market_id: firstMarketId,
        });
        setOrders(res.data.data);
      }
    } catch (error) {
      console.log(error);
    }
  }, [User[0].user_id, setArr, setOrders]);

  console.log("market arr", arr);

  // const getOrders = useCallback(async () => {
  //   try {
  //     const res = await backendInstance.post("/api/v1/get-order", {
  //       market_id: arr[0]?.market_id,
  //     });
  //     setOrders(res.data.data);
  //   } catch (error) {
  //     console.log(error);
  //   }
  // }, [setOrders]);

  useEffect(() => {
    // if (Object.keys(User).length === 0) {
    //   navigate("/login");
    // } else {
    marketplace();
    // getOrders();
    // }
  }, [marketplace]);

  const handleClose = useCallback(() => {
    setOpen(false);
    marketplace();
  }, [setOpen, marketplace]);

  const handlePostClose = useCallback(() => {
    setOpenPost(false);
    marketplace();
  }, [setOpenPost, marketplace]);

  const handleProductClose = useCallback(() => {
    setOpenProduct(false);
    marketplace();
  }, [setOpenProduct, marketplace]);

  const [openSnack, setOpenSnack] = React.useState(false);

  const [proDisabled, setProDisabled] = useState([]);

  const [delData, setDelData] = useState({});

  const [dataMsg, setDataMsg] = React.useState("");

  const handleClick = (msg) => {
    console.log("opened");
    setDataMsg(msg);
    setOpenSnack(true);
  };

  const handleUpdate = async (e) => {
    try {
      e.preventDefault();
      const data = await backendInstance.post(`/api/v1/update-order`, delData);
      if (data.data.message == "Updated Successfully") {
        handleClick("Updated Successfully");
        marketplace();
        setProDisabled([]);
      }
    } catch (error) {
      console.log("error", error);
    }
  };

  console.log("del", delData);
  console.log("prodisabled", proDisabled);

  return (
    <div>
      <>
        <CreateMarketForm
          open={open}
          handleClose={handleClose}
          user_id={User[0].user_id}
        />
        <CreatePostForm
          open={openPost}
          handleClose={handlePostClose}
          market_id={arr[0]?.market_id}
          user_id={User[0].user_id}
        />
        <CreateProductForm
          open={openProduct}
          handleClose={handleProductClose}
          market_id={arr[0]?.market_id}
          user_id={User[0].user_id}
          market_name={arr[0]?.market_name}
        />
        {arr.length > 0 ? (
          <>
            <div>
              <h1
                style={{
                  fontFamily: "Poppins, sans-serif",
                  fontWeight: 600,
                  fontSize: "64px",
                  letterSpacing: "1px",
                  color: "#2C3E50",
                  marginBottom: "0px",
                }}
              >
                {arr[0]?.market_name}
              </h1>{" "}
              <p
                style={{
                  fontFamily: "Poppins, sans-serif",
                  fontWeight: 400,
                  fontSize: "14px",
                  color: "#7F8C8D",
                  letterSpacing: "0.5px",
                  margin: "2px",
                }}
              >
                {arr[0]?.market_address}
              </p>
            </div>
            <div
              style={{
                marginTop: "10px",
                display: "flex",
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
              &nbsp;&nbsp;&nbsp;
              <Button
                sx={{
                  backgroundColor: "buttcolor.main",
                  marginBottom: "15px",
                }}
                variant="contained"
                startIcon={<AddCircleOutlineIcon />}
                onClick={() => setOpenProduct(true)}
              >
                Sell Product
              </Button>
            </div>
            <div style={{ height: 400, width: "100%" }}>
              <TableContainer component={Paper}>
                <Table sx={{ minWidth: 650 }} aria-label="simple table">
                  <TableHead>
                    <TableRow>
                      <TableCell>Product Name</TableCell>
                      <TableCell>Price</TableCell>
                      <TableCell>Quantity</TableCell>
                      <TableCell>Status</TableCell>
                      <TableCell>Date of delivery</TableCell>
                      <TableCell>Update</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody sx={{}}>
                    {orders.map((lev) => (
                      <TableRow
                        key={lev.order_id}
                        sx={{
                          "&:last-child td, &:last-child th": { border: 0 },
                        }}
                      >
                        <TableCell
                          sx={{ color: "mild.main" }}
                          component="th"
                          scope="row"
                        >
                          {lev.product_name}
                        </TableCell>
                        <TableCell sx={{ color: "mild.main" }}>
                          {lev?.product_price}
                        </TableCell>
                        <TableCell
                          sx={{
                            color: "mild.main",
                          }}
                        >
                          <span style={{}}>{lev.quantity}</span>
                        </TableCell>
                        <TableCell sx={{ color: "mild.main" }} width={100}>
                          <select
                            disabled={
                              proDisabled?.includes(`${lev?.order_id}`)
                                ? false
                                : true
                            }
                            name="post_type"
                            id="post_type"
                            defaultValue={lev.order_status}
                            onChange={(e) =>
                              setDelData({
                                ...delData,
                                order_status: e.target.value,
                                product_id: lev?.product_id,
                                order_id: lev?.order_id,
                              })
                            }
                            style={{
                              // padding: "8px",
                              borderRadius: "4px",
                              border: "1px solid #ccc",
                              fontFamily: "Poppins, sans-serif",
                              // width: "100%",
                            }}
                          >
                            <option value="" disabled>
                              Select Order status
                            </option>
                            <option value="Order Placed">Order Placed</option>
                            <option value="Order Confirmed">
                              Order Confirmed
                            </option>
                            <option value="Dispatched">Dispatched</option>
                            <option value="Shipped">Shipped</option>
                          </select>
                        </TableCell>
                        <TableCell
                          sx={{
                            color: "mild.main",
                          }}
                        >
                          {proDisabled?.includes(`${lev?.order_id}`) ? (
                            <LocalizationProvider dateAdapter={AdapterDayjs}>
                              {/* <DemoContainer components={["DatePicker"]}> */}
                              <DatePicker
                                disabled={
                                  proDisabled?.includes(`${lev?.order_id}`)
                                    ? false
                                    : true
                                }
                                label="Delivery"
                                onChange={(newValue) =>
                                  setDelData({
                                    ...delData,
                                    date_of_delivery: newValue
                                      ? newValue.format("YYYY-MM-DD")
                                      : "",
                                    product_id: lev?.product_id,
                                    order_id: lev?.order_id,
                                  })
                                }
                                // defaultValue={lev.date_of_delivery}
                                value={dayjs(delData.date_of_delivery)}
                              />
                              {/* </DemoContainer> */}
                            </LocalizationProvider>
                          ) : (
                            <span style={{}}>{lev.date_of_delivery}</span>
                          )}
                        </TableCell>
                        <TableCell
                          sx={{
                            color: "white",
                          }}
                        >
                          {proDisabled?.includes(`${lev?.order_id}`) && (
                            <span style={{ backgroundColor: "#FF9A28" }}>
                              <Button
                                autoFocus
                                sx={{ backgroundColor: "buttcolor.main" }}
                                variant="contained"
                                type="submit"
                                disableRipple="true"
                                id="submitbutt"
                                size="small"
                                onClick={(e) => handleUpdate(e)}
                              >
                                Update
                              </Button>
                            </span>
                          )}
                          &nbsp;
                          <span style={{ backgroundColor: "#FF9A28" }}>
                            <Button
                              autoFocus
                              sx={{ backgroundColor: "buttcolor.main" }}
                              variant="contained"
                              type="submit"
                              disableRipple="true"
                              id="submitbutt"
                              size="small"
                              onClick={() => setProDisabled([lev?.order_id])}
                            >
                              <EditIcon />
                            </Button>
                          </span>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </div>
          </>
        ) : (
          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              justifyContent: "space-around",
              alignItems: "center",
              borderRadius: "8px",
              // border: "1px solid red",
              margin: "15%",
              boxShadow: "rgba(0, 0, 0, 0.1) 0px 4px 12px",
              textAlign: "center",
              // maxWidth: "50%",
            }}
          >
            <h1>
              Hey It seems you haven't opened your market.Lets create a market
              and start engrossing it.
            </h1>
            <Button
              sx={{ backgroundColor: "buttcolor.main", marginBottom: "15px" }}
              variant="contained"
              size="large"
              startIcon={<StorefrontIcon />}
              onClick={handleClickOpen}
            >
              Create Market
            </Button>
          </div>
        )}
      </>
      <SnackBarComp
        openSnack={openSnack}
        setOpenSnack={setOpenSnack}
        dataMsg={dataMsg}
      />
    </div>
  );
};

export default MyMarketPlace;
