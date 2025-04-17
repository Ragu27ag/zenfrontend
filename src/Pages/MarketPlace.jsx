import React, { useCallback, useEffect, useMemo, useState } from "react";
import { Box, Button } from "@mui/material";
import { useNavigate } from "react-router-dom";
import backendInstance from "../Axios/axios";
import SnackBarComp from "../Components/SnackBarComp";
import { TextField, InputAdornment, IconButton } from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import OrderForm from "../Components/OrderForm";

const MarketPlace = () => {
  const [openSnack, setOpenSnack] = React.useState(false);
  const [dataMsg, setDataMsg] = React.useState("");
  const [query, setQuery] = useState("");
  const User = useMemo(
    () => JSON.parse(sessionStorage.getItem("user")) || {},
    []
  );

  const navigate = useNavigate();

  const [open, setOpen] = useState(false);

  const [currData, setCurrData] = useState({});

  const [arr, setArr] = useState([]);

  const getData = useCallback(async () => {
    try {
      const res = await backendInstance.post("/api/v1/get-products", {});
      // const resData = await backendInstance.get(`/applicationlist/${User.email}`);
      setArr(res.data.data);
    } catch (error) {
      console.log(error);
    }
  }, [setArr]);

  console.log("products arr", arr);

  useEffect(() => {
    // if (Object.keys(User).length === 0) {
    //   navigate("/login");
    // } else {
    getData();
    // }
  }, [getData]);

  const handleClose = () => {
    setDataMsg("Order Placed");
    setOpen(false);
  };

  return (
    <>
      {" "}
      <h1>Products</h1>
      <TextField
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Search..."
        variant="outlined"
        size="small"
        fullWidth
        sx={{ maxWidth: 400 }}
        InputProps={{
          endAdornment: (
            <InputAdornment position="end">
              <IconButton>
                <SearchIcon />
              </IconButton>
            </InputAdornment>
          ),
        }}
      />
      <Box
        sx={{
          display: "flex",
          flexWrap: "wrap",
          justifyContent: "space-around",
          borderRadius: "8px",
          // border: "1px solid red",
          margin: "5%",
          boxShadow: "rgba(0, 0, 0, 0.1) 0px 4px 12px",
          maxWidth: "90%",
        }}
      >
        {arr.length === 0 ? (
          <p style={{ margin: "5px", color: "#555A8F" }}>
            No products to show.
          </p>
        ) : (
          arr
            .filter((val) =>
              val?.product_name
                ?.toLowerCase()
                .includes(query?.toLocaleLowerCase())
            )
            .map((data) => (
              <div
                style={{
                  margin: "15px",
                  borderRadius: "8px",
                  // height: "300px",
                  width: "300px",
                  boxShadow: "rgba(0, 0, 0, 0.1) 0px 4px 12px",
                }}
              >
                <div
                  style={{
                    margin: "5px",
                    borderRadius: "8px",
                    height: "180px",
                  }}
                >
                  <img
                    src={data.product_image_url}
                    alt=""
                    style={{
                      width: "100%",
                      height: "100%",
                      objectFit: "cover",
                      borderRadius: "8px",
                    }}
                  />
                </div>
                <div
                  style={{
                    margin: "5px",
                    borderRadius: "8px",
                    padding: "8px",
                    height: "100px",
                  }}
                >
                  <p
                    style={{
                      margin: "5px",
                      fontSize: "15px",
                      fontWeight: "bolder",
                      color: "black",
                      whiteSpace: "nowrap",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                    }}
                  >
                    {data?.product_name}
                  </p>
                  <p
                    style={{
                      margin: "1px 5px 5px 5px",
                      color: "#555A8F",
                      fontSize: "10px",
                      fontWeight: "bolder",
                      whiteSpace: "nowrap",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                    }}
                  >
                    {data?.product_description}
                  </p>
                  <p
                    style={{
                      margin: "1px 5px 5px 5px",
                      color: "#555A8F",
                      fontSize: "15px",
                      whiteSpace: "nowrap",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                    }}
                  >
                    Rs : {data?.product_price}
                  </p>
                </div>

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
                  <Button
                    sx={{
                      backgroundColor: "buttcolor.main",
                      margin: "5px",
                      width: "100%",
                    }}
                    variant="contained"
                    id="markbutt"
                    onClick={() => {
                      setOpen(true);
                      setCurrData(data);
                    }}
                  >
                    VIEW
                  </Button>
                </div>
              </div>
            ))
        )}
        <OrderForm
          arr={currData}
          open={open}
          handleClose={handleClose}
          setOpenSnack={setOpenSnack}
        />
        <SnackBarComp
          openSnack={openSnack}
          setOpenSnack={setOpenSnack}
          dataMsg={dataMsg}
        />
      </Box>
    </>
  );
};

export default MarketPlace;
