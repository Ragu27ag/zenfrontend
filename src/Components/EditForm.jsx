import React from "react";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import { useFormik } from "formik";
import * as yup from "yup";
import backendInstance from "../Axios/axios";
import ErrorIcon from "@mui/icons-material/Error";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import SnackBarComp from "./SnackBarComp";

const EditForm = ({ arr, open, handleClose, getClass, getAdditionalClass }) => {
  const [openSnack, setOpenSnack] = React.useState(false);

  const [dataMsg, setDataMsg] = React.useState("");

  const handleClick = () => {
    console.log("opened");
    setDataMsg("Added Successfully");
    setOpenSnack(true);
    handleClose();
    getClass();
    getAdditionalClass();
  };

  const validation = yup.object().shape({
    module: yup.string().required("Enter module"),
    day: yup
      .number()
      .min(1, "Days should be greater than 1 day")
      .max(40, "Roadmap sessions should be greater than 40 days")
      .required("Enter day"),
    title: yup.string().required("Enter the title"),
    date: yup.string().required("Enter the date"),
    time: yup.string().required("Enter the time"),
    contents: yup.string().required("Enter the contents"),
    preread: yup.string(),
    activities: yup.string(),
    type: yup.string().required("Enter the type"),
  });

  const formData = useFormik({
    initialValues: {
      module: "",
      day: "",
      title: "",
      date: "",
      time: "",
      contents: "",
      preread: "",
      activities: "",
      type: "",
    },
    onSubmit: async (data) => {
      try {
        document.getElementById("submitbutt").disabled = true;
        let allow = true;
        console.log(data);
        arr.forEach((cla) => {
          if (cla.day === data.day && data.type === "roadmap") {
            alert(
              "Class already exist either delete the existing one or edit the existing one"
            );
            allow = false;
          }
        });

        if (Number(data.day) > 40) {
          alert(
            "Roadmap sessions are full try adding this as additional session"
          );
          allow = false;
        }

        if (data.type === "additional" && allow) {
          const res = await backendInstance.post("/additionalClass", data);
          if (res.data.msg === "Inserted Successfully") {
            handleClick();
          } else {
            document.getElementById("submitbutt").disabled = false;
          }

          console.log(res.data);
        }
        if (data.type === "roadmap" && allow) {
          const res = await backendInstance.post("/classes", data);
          if (res.data.msg === "Inserted Successfully") {
            handleClick();
          } else {
            document.getElementById("submitbutt").disabled = false;
          }
          console.log(res.data);
        }
        document.getElementById("submitbutt").disabled = false;
      } catch (error) {
        console.log(error);
      }

      // if (res.data.msg === "Inserted Successfully") {
      // }
    },
    validationSchema: validation,
  });

  return (
    <div>
      <div>
        {" "}
        <div>
          <Dialog
            open={open}
            onClose={handleClose}
            aria-labelledby="alert-dialog-title"
            aria-describedby="alert-dialog-description"
          >
            <DialogTitle id="alert-dialog-title">{"Add classes"}</DialogTitle>
            <DialogContent sx={{ width: "400px", textAlign: "center" }}>
              <DialogContentText id="alert-dialog-description">
                <div>
                  {" "}
                  <form onSubmit={formData.handleSubmit}>
                    <label htmlFor="module">Subject</label>
                    <br />
                    <input
                      name="module"
                      id="module"
                      onChange={formData.handleChange}
                      onBlur={formData.handleBlur}
                      value={formData.module}
                      //   defaultValue={
                      //     editData.module === "" && editAddData.module === ""
                      //       ? ""
                      //       : editData.module || editAddData.module
                      //   }
                    />
                    {formData.touched.module && formData.errors.module && (
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
                          {formData.errors.module}
                        </span>{" "}
                      </div>
                    )}
                    <br />
                    <label htmlFor="day">Day</label>
                    <br />
                    <input
                      name="day"
                      id="day"
                      onChange={formData.handleChange}
                      onBlur={formData.handleBlur}
                      value={formData.day}
                    />
                    {formData.touched.day && formData.errors.day && (
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
                          {formData.errors.day}
                        </span>{" "}
                      </div>
                    )}
                    <br />
                    <label htmlFor="title">Title</label>
                    <br />
                    <input
                      type="title"
                      name="title"
                      id="title"
                      onChange={formData.handleChange}
                      onBlur={formData.handleBlur}
                      value={formData.title}
                    />
                    {formData.touched.title && formData.errors.title && (
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
                          {formData.errors.title}
                        </span>{" "}
                      </div>
                    )}
                    <br />
                    <label htmlFor="date">Date</label>
                    <br />
                    <input
                      type="date"
                      name="date"
                      id="date"
                      onChange={formData.handleChange}
                      onBlur={formData.handleBlur}
                      value={formData.date}
                    />
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
                    <br /> <label htmlFor="time">Time</label>
                    <br />
                    <input
                      type="time"
                      name="time"
                      id="time"
                      onChange={formData.handleChange}
                      onBlur={formData.handleBlur}
                      value={formData.time}
                    />
                    {formData.touched.time && formData.errors.time && (
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
                          {formData.errors.time}
                        </span>{" "}
                      </div>
                    )}
                    <br />
                    <br /> <label htmlFor="contents">Contents</label>
                    <br />
                    <textarea
                      rows={10}
                      cols={30}
                      id="contents"
                      name="contents"
                      onChange={formData.handleChange}
                      onBlur={formData.handleBlur}
                      value={formData.contents}
                    ></textarea>
                    {formData.touched.contents && formData.errors.contents && (
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
                          {formData.errors.contents}
                        </span>{" "}
                      </div>
                    )}
                    <br />
                    <br /> <label htmlFor="preread">Pre Read</label>
                    <br />
                    <textarea
                      rows={10}
                      cols={30}
                      id="preread"
                      name="preread"
                      onChange={formData.handleChange}
                      onBlur={formData.handleBlur}
                      value={formData.preread}
                    ></textarea>
                    {formData.touched.preread && formData.errors.preread && (
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
                          {formData.errors.preread}
                        </span>{" "}
                      </div>
                    )}
                    <br />
                    <br /> <label htmlFor="activities">Activites</label>
                    <br />
                    <textarea
                      rows={10}
                      cols={30}
                      id="activities"
                      name="activities"
                      onChange={formData.handleChange}
                      onBlur={formData.handleBlur}
                      value={formData.activities}
                    ></textarea>
                    {formData.touched.activities &&
                      formData.errors.activities && (
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
                            {formData.errors.activities}
                          </span>{" "}
                        </div>
                      )}
                    <br />
                    <FormControl fullWidth>
                      <InputLabel id="demo-simple-select-label">
                        Type
                      </InputLabel>
                      <Select
                        labelId="demo-simple-select-label"
                        id="demo-simple-select"
                        value={formData.type}
                        label="Type"
                        name="type"
                        onChange={formData.handleChange}
                      >
                        <MenuItem value={"roadmap"}>Roadmap</MenuItem>
                        <MenuItem value={"additional"}>Additional</MenuItem>
                      </Select>
                    </FormControl>
                    <br />
                    {formData.touched.type && formData.errors.type && (
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
                          {formData.errors.type}
                        </span>{" "}
                      </div>
                    )}
                    <br />
                    <br />
                    <Button
                      variant="contained"
                      sx={{ backgroundColor: "buttcolor.main" }}
                      type="submit"
                      id="submitbutt"
                    >
                      submit{" "}
                    </Button>
                    &nbsp;&nbsp;&nbsp;
                  </form>
                </div>
              </DialogContentText>
            </DialogContent>
          </Dialog>
        </div>
      </div>
      <SnackBarComp
        openSnack={openSnack}
        setOpenSnack={setOpenSnack}
        dataMsg={dataMsg}
      />
    </div>
  );
};

export default EditForm;
