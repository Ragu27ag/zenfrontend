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

const CreateMarketForm = ({ open, handleClose, user_id }) => {
  const [openSnack, setOpenSnack] = React.useState(false);

  const [dataMsg, setDataMsg] = React.useState("");

  const handleClick = () => {
    console.log("opened");
    setDataMsg("Created Successfully");
    setOpenSnack(true);
    handleClose();
  };

  const validation = yup.object().shape({
    market_name: yup.string().required("Enter the market_name"),
    market_description: yup.string().required("Enter the market_description"),
    market_address: yup.string().required("Enter the market_address"),
    market_image_url: yup.string().required("Enter the market_image_url"),
  });
  const formVal = useFormik({
    initialValues: {
      market_name: "",
      market_description: "",
      market_address: "",
      market_image_url: "",
    },

    onSubmit: async (data) => {
      try {
        document.getElementById("submitbutt").disabled = true;
        console.log(data);
        const obj = {
          ...data,
          user_id: user_id,
        };
        const res = await backendInstance.post("/api/v1/add-market", obj);

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
                <label htmlFor="market_name">Market Name</label>
                <br />
                <input
                  name="market_name"
                  id="market_name"
                  value={formVal.values.market_name}
                  onChange={formVal.handleChange}
                  onBlur={formVal.handleBlur}
                />
                <br />
                {formVal.touched.market_name && formVal.errors.market_name && (
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
                      {formVal.errors.market_name}
                    </span>{" "}
                  </div>
                )}
                <br />
                <label htmlFor="market_description">Describe your store</label>
                <br />
                <textarea
                  name="market_description"
                  type="market_description"
                  id="market_description"
                  value={formVal.values.market_description}
                  onChange={formVal.handleChange}
                  onBlur={formVal.handleBlur}
                />
                <br />
                {formVal.touched.market_description &&
                  formVal.errors.market_description && (
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
                        {formVal.errors.market_description}
                      </span>{" "}
                    </div>
                  )}
                <br />
                <label htmlFor="market_address">Address</label>
                <br />
                <textarea
                  name="market_address"
                  id="market_address"
                  value={formVal.values.market_address}
                  onChange={formVal.handleChange}
                  onBlur={formVal.handleBlur}
                ></textarea>
                <br />
                {formVal.touched.market_address &&
                  formVal.errors.market_address && (
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
                        {formVal.errors.market_address}
                      </span>{" "}
                    </div>
                  )}
                <br />
                <label htmlFor="market_image_url">Market Image Url</label>
                <br />
                <input
                  name="market_image_url"
                  id="market_image_url"
                  value={formVal.values.market_image_url}
                  onChange={formVal.handleChange}
                  onBlur={formVal.handleBlur}
                />
                <br />
                {formVal.touched.market_image_url &&
                  formVal.errors.market_image_url && (
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
                        {formVal.errors.market_image_url}
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

export default CreateMarketForm;
