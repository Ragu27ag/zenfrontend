import { useFormik } from "formik";
import React, { useEffect, useMemo } from "react";
import * as yup from "yup";
import Box from "@mui/material/Box";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import { Button } from "@mui/material";
import ErrorIcon from "@mui/icons-material/Error";
import { useNavigate } from "react-router-dom";
import backendInstance from "../Axios/axios";
import SnackBarComp from "../Components/SnackBarComp";

const AddQueries = () => {
  const User = useMemo(
    () => JSON.parse(sessionStorage.getItem("user")) || {},
    []
  );
  console.log(User.email);
  const navigate = useNavigate();

  const [openSnack, setOpenSnack] = React.useState(false);

  const [dataMsg, setDataMsg] = React.useState("");

  const handleClick = () => {
    console.log("opened");
    setDataMsg("Added Successfully");
    setOpenSnack(true);
  };

  const validation = yup.object().shape({
    category: yup.string().required("Enter Category"),
    language: yup.string().required("Enter language"),
    querytitle: yup.string().required("Enter Title"),
    description: yup.string().required("Enter Description"),
    from: yup.string().required("Enter available time"),
    till: yup.string().required("Enter available time"),
  });
  const queryForm = useFormik({
    initialValues: {
      category: "",
      language: "",
      querytitle: "",
      description: "",
      from: "",
      till: "",
    },

    onSubmit: async (data) => {
      try {
        document.getElementById("submitbutt").disabled = true;
        let id = "ZEN" + Math.floor(1000 + Math.random() * 9000);
        const obj = {
          ...data,
          email: User.email,
          quesId: id,
          assignedTo: "",
          name: User.name,
        };
        console.log(obj);
        const res = await backendInstance.post("/queries", obj);
        console.log(res.data);
        if (res.data.msg === "Inserted Successfully") {
          document.getElementById("submitbutt").disabled = true;
          handleClick();
          setTimeout(() => navigate("/queries"), 2000);
        } else {
          document.getElementById("submitbutt").disabled = false;
        }
        document.getElementById("submitbutt").disabled = false;
      } catch (error) {
        console.log(error);
      }
    },

    validationSchema: validation,
  });

  useEffect(() => {
    if (Object.keys(User).length === 0) {
      navigate("/login");
    }
  }, [User, navigate]);

  return (
    <div
      style={{
        display: "flex",
        flexWrap: "wrap",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <div
        style={{
          border: "1px solid grey",
          padding: "10px",
          boxShadow: "rgba(0, 0, 0, 0.1) 0px 4px 12px",
          borderRadius: "8px",
        }}
      >
        <form onSubmit={queryForm.handleSubmit}>
          <p>Topic</p>
          <div style={{ display: "flex", justifyContent: "center" }}>
            <Box
              sx={{
                color: "black",
                width: "200px",
              }}
            >
              <FormControl fullWidth>
                <InputLabel id="demo-simple-select-label" color="dark">
                  Select Category
                </InputLabel>
                <Select
                  labelId="demo-simple-select-label"
                  id="demo-simple-select"
                  value={queryForm.values.category}
                  label="Category"
                  name="category"
                  onChange={queryForm.handleChange}
                  onBlur={queryForm.handleBlur}
                >
                  <MenuItem value={"Zenclass-related"}>
                    Zen class related
                  </MenuItem>
                  <MenuItem value={"Placement-related"}>
                    Placement related
                  </MenuItem>
                  <MenuItem value={"Cordination-related"}>
                    Cordination related
                  </MenuItem>
                  <MenuItem value={"Prebootcamp-related"}>
                    Pre-bootcamp related
                  </MenuItem>
                </Select>
                {queryForm.touched.category && queryForm.errors.category && (
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
                      {queryForm.errors.category}
                    </span>{" "}
                  </div>
                )}
              </FormControl>
              {}
            </Box>
          </div>
          <div style={{ display: "flex", justifyContent: "center" }}>
            <Box sx={{ width: 200, color: "black" }} mt={2}>
              <FormControl fullWidth>
                <InputLabel id="demo-simple-select-label" color="dark">
                  select Language
                </InputLabel>
                <Select
                  labelId="demo-simple-select-label"
                  id="demo-simple-select"
                  value={queryForm.values.language}
                  label="language"
                  name="language"
                  onChange={queryForm.handleChange}
                  onBlur={queryForm.handleBlur}
                >
                  <MenuItem value={"Tamil"}>Tamil</MenuItem>
                  <MenuItem value={"English"}>English</MenuItem>
                  <MenuItem value={"Hindi"}>Hindi</MenuItem>
                </Select>
                {queryForm.touched.language && queryForm.errors.language && (
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
                      {queryForm.errors.language}
                    </span>{" "}
                  </div>
                )}
              </FormControl>
            </Box>
          </div>
          <p>Details</p>
          <div style={{ marginTop: "10px", textAlign: "center" }}>
            <label htmlFor="title">Query Title</label>
            <br />
            <input
              name="querytitle"
              id="querytitle"
              onChange={queryForm.handleChange}
              value={queryForm.values.querytitle}
              onBlur={queryForm.handleBlur}
            />
            <br />
            {queryForm.touched.querytitle && queryForm.errors.querytitle && (
              <div
                style={{ color: "red", fontSize: "15px", marginTop: "15px" }}
              >
                <span>
                  <ErrorIcon sx={{ fontSize: "15px", textAlign: "center" }} />
                  &nbsp;
                  {queryForm.errors.querytitle}
                </span>{" "}
              </div>
            )}
            <br />
            <label htmlFor="description">Query Description</label>
            <br />
            <textarea
              rows={10}
              cols={30}
              name="description"
              id="description"
              onChange={queryForm.handleChange}
              value={queryForm.values.description}
              onBlur={queryForm.handleBlur}
            ></textarea>
            <br />
            {queryForm.touched.description && queryForm.errors.description && (
              <div
                style={{ color: "red", fontSize: "15px", marginTop: "15px" }}
              >
                <span>
                  <ErrorIcon sx={{ fontSize: "15px", textAlign: "center" }} />
                  &nbsp;
                  {queryForm.errors.description}
                </span>{" "}
              </div>
            )}
          </div>
          <p>Your available Time ? ( Ours : 9:00 AM - 7:00 PM )</p>
          <div style={{ marginTop: "10px", textAlign: "center" }}>
            <label htmlFor="from">From</label>
            <br />
            <input
              name="from"
              id="from"
              type="time"
              onChange={queryForm.handleChange}
              value={queryForm.values.from}
              onBlur={queryForm.handleBlur}
            />
            <br />
            {queryForm.touched.from && queryForm.errors.from && (
              <div
                style={{ color: "red", fontSize: "15px", marginTop: "15px" }}
              >
                <span>
                  <ErrorIcon sx={{ fontSize: "15px", textAlign: "center" }} />
                  &nbsp;
                  {queryForm.errors.from}
                </span>{" "}
              </div>
            )}
            <br />
            <label htmlFor="till">Till</label>
            <br />
            <input
              name="till"
              id="till"
              type="time"
              onChange={queryForm.handleChange}
              value={queryForm.values.till}
              onBlur={queryForm.handleBlur}
            />
            <br />
            {queryForm.touched.till && queryForm.errors.till && (
              <div
                style={{ color: "red", fontSize: "15px", marginTop: "15px" }}
              >
                <span>
                  <ErrorIcon sx={{ fontSize: "15px", textAlign: "center" }} />
                  &nbsp;
                  {queryForm.errors.till}
                </span>{" "}
              </div>
            )}
          </div>
          <div style={{ marginTop: "10px", textAlign: "center" }}>
            <Button
              sx={{ backgroundColor: "buttcolor.main" }}
              variant="contained"
              onClick={() => navigate("/queries")}
            >
              Cancel
            </Button>
            &nbsp;&nbsp;&nbsp;
            <Button
              sx={{ backgroundColor: "buttcolor.main" }}
              variant="contained"
              type="submit"
              id="submitbutt"
            >
              Create
            </Button>
            <SnackBarComp
              openSnack={openSnack}
              setOpenSnack={setOpenSnack}
              dataMsg={dataMsg}
            />
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddQueries;
