import React, { useCallback, useEffect, useMemo, useState } from "react";
import { Box, Button, Grid, Rating } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { backendInstance } from "../Axios/axios";
import SnackBarComp from "../Components/SnackBarComp";
import { TextField, InputAdornment, IconButton } from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import bags from "../pics/bags.jpg";

const MyOrders = () => {
  const [openSnack, setOpenSnack] = React.useState(false);
  const [dataMsg, setDataMsg] = React.useState("");
  const [query, setQuery] = useState("");
  const User = useMemo(
    () => JSON.parse(sessionStorage.getItem("user")) || {},
    []
  );

  const [starState, setStarState] = useState(false);

  const [arr, setArr] = useState([]);

  const [rating, setRating] = useState(0);

  const getOrdersData = useCallback(async () => {
    try {
      const res = await backendInstance.post("/api/v1/get-order", {
        user_id: User[0]?.user_id,
      });
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
    getOrdersData();
    // }
  }, [getOrdersData]);

  const handleRating = useCallback(
    async (product_id) => {
      if (starState) {
        console.log("ratiiing", rating);
        document.getElementById("ratebutt").disabled = true;

        try {
          const res = await backendInstance.post("/api/v1/add-product-rating", {
            star_rating: `${rating}`,
            product_id: product_id,
            user_id: User[0]?.user_id,
          });
          console.log("res", res);
          if (res.data.message === "Inserted Successfully") {
            await getOrdersData();
            starState(false);
          } else {
            document.getElementById("ratebutt").disabled = false;
          }
        } catch (error) {
          console.log("star error", error);
          document.getElementById("ratebutt").disabled = false;
        }
      }
    },
    [starState, rating]
  );

  const handleOrderCancel = async (data) => {
    console.log("cancelled");
    try {
      document.getElementById("cancelbutt").disabled = true;
      const res = await backendInstance.post("/api/v1/update-order", data);
      console.log("res", res);
      if (res.data.message === "Updated Successfully") {
        await getOrdersData();
        starState(false);
      } else {
        document.getElementById("cancelbutt").disabled = false;
      }
    } catch (error) {
      console.log("star error", error);
      document.getElementById("cancelbutt").disabled = false;
    }
  };

  console.log("rating", rating);

  return (
    <>
      <h1>Orders</h1>
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
          // borrder: "1px solid red",
          margin: "8%",
          boxShadow: "rgba(0, 0, 0, 0.1) 0px 4px 12px",
          maxWidth: "70%",
          backgroundImage: `url(${bags})`,
          backgroundRepeat: "no-repeat",
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        {" "}
        <Grid container spacing={1}>
          {arr?.length === 0 ? (
            <div>
              {" "}
              <p style={{ margin: "5px", color: "#555A8F" }}>
                No products to show.
              </p>
            </div>
          ) : (
            arr
              ?.filter((val) =>
                val?.product_name
                  ?.toLowerCase()
                  .includes(query?.toLocaleLowerCase())
              )
              .map((data) => (
                <Grid
                  key={data.order_id}
                  size={8}
                  sx={{
                    margin: "15px",
                    borderRadius: "8px",
                    // height: "300px",
                    backgroundColor: "#FAFAFA",
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
                      To : {data?.customer_name} {data?.billing_address}
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
                      Status : {data?.order_status}
                    </p>{" "}
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
                      Date of Delivery : {data?.date_of_delivery || "-"}
                    </p>
                  </div>

                  <div
                    style={{
                      margin: "5px",
                      padding: "8px",
                      display: "flex",
                      justifyContent: "space-around",
                      alignItems: "center",
                      height: "20px",
                    }}
                  >
                    <Rating
                      onChange={(event, newValue) => {
                        setRating(newValue);
                      }}
                      name="star"
                      defaultValue={data?.star_rating}
                    />
                    <Button
                      sx={{
                        backgroundColor: "buttcolor.main",
                      }}
                      variant="contained"
                      size="small"
                      id="ratebutt"
                      onClick={() => {
                        setStarState(true);
                        handleRating(data?.product_id);
                      }}
                    >
                      Add Rate
                    </Button>
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
                    {data.order_status != "Cancelled" ? (
                      <Button
                        sx={{
                          backgroundColor: "buttcolor.main",
                          margin: "5px",
                          width: "100%",
                        }}
                        variant="contained"
                        id="cancelbutt"
                        onClick={() =>
                          handleOrderCancel({
                            order_id: data.order_id,
                            order_status: "Cancelled",
                            product_id: data.product_id,
                          })
                        }
                      >
                        Cancel Order
                      </Button>
                    ) : (
                      <div>
                        <p>Cancelled</p>
                      </div>
                    )}
                  </div>
                </Grid>
              ))
          )}
        </Grid>
        <SnackBarComp
          openSnack={openSnack}
          setOpenSnack={setOpenSnack}
          dataMsg={dataMsg}
        />
      </Box>
    </>
  );
};

export default MyOrders;
