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

const LeaveForm = ({ open, handleClose, userMail, userName }) => {
  const [openSnack, setOpenSnack] = React.useState(false);

  const [dataMsg, setDataMsg] = React.useState("");

  const handleClick = () => {
    console.log("opened");
    setDataMsg("Applied Successfully");
    setOpenSnack(true);
    handleClose();
  };

  const validation = yup.object().shape({
    days: yup
      .number()
      .min(1, "Days should be greater than 1 day")
      .required("Enter Days"),
    date: yup.string().required("Enter the data"),
    reason: yup.string().required("Enter the reason"),
  });
  const formData = useFormik({
    initialValues: {
      days: "",
      date: "",
      reason: "",
    },

    onSubmit: async (data) => {
      try {
        document.getElementById.disabled = true;
        console.log(data.date, data.days);
        let toDate = new Date(data.date);
        toDate.setDate(toDate.getDate() + (data.days - 1));
        console.log(data);
        const obj = {
          ...data,
          to: toDate,
          email: userMail,
          approval: "",
          name: userName,
        };
        console.log(obj);
        const res = await backendInstance.post("/leave", obj);

        if (res.data.msg === "Inserted Successfully") {
          document.getElementById("days").value = "";
          document.getElementById("date").value = "";
          document.getElementById("reason").value = "";
          handleClick();
        } else {
          document.getElementById.disabled = false;
        }
        document.getElementById.disabled = false;
      } catch (error) {
        console.log(error);
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
          <DialogTitle id="alert-dialog-title">{"Add Leave"}</DialogTitle>
          <DialogContent sx={{ width: "400px", textAlign: "center" }}>
            <DialogContentText id="alert-dialog-description">
              <form id="leaveform" onSubmit={formData.handleSubmit}>
                <label htmlFor="days">Days</label>
                <br />
                <input
                  name="days"
                  id="days"
                  value={formData.values.days}
                  onChange={formData.handleChange}
                  onBlur={formData.handleBlur}
                />
                <br />
                {formData.touched.days && formData.errors.days && (
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
                      {formData.errors.days}
                    </span>{" "}
                  </div>
                )}
                <br />
                <label htmlFor="date">Date</label>
                <br />
                <input
                  name="date"
                  type="date"
                  id="date"
                  value={formData.values.date}
                  onChange={formData.handleChange}
                  onBlur={formData.handleBlur}
                />
                <br />
                {formData.touched.date && formData.errors.date && (
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
                      {formData.errors.date}
                    </span>{" "}
                  </div>
                )}
                <br />
                <label htmlFor="reason">Reason</label>
                <br />
                <textarea
                  name="reason"
                  id="reason"
                  value={formData.values.reason}
                  onChange={formData.handleChange}
                  onBlur={formData.handleBlur}
                ></textarea>
                <br />
                {formData.touched.reason && formData.errors.reason && (
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
                      {formData.errors.reason}
                    </span>{" "}
                  </div>
                )}
                <br />
                <Button
                  onClick={handleClose}
                  sx={{ backgroundColor: "buttcolor.main" }}
                  variant="contained"
                  disableRipple={"true"}
                >
                  Cancel
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
                  Apply
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

export default LeaveForm;
