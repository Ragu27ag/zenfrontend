import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import backendInstance from "../Axios/axios";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import { useNavigate } from "react-router-dom";
import { useFormik } from "formik";
import * as yup from "yup";
import ErrorIcon from "@mui/icons-material/Error";
import { Button } from "@mui/material";
import SnackBarComp from "../Components/SnackBarComp";

const MockInterView = () => {
  const User = useMemo(
    () => JSON.parse(sessionStorage.getItem("user")) || {},
    []
  );
  const navigate = useNavigate();

  const [data, setdata] = useState([]);
  // const [_result, setResult] = useState([]);
  const [detailss, setDetails] = useState({});
  const [open, setOpen] = React.useState(true);
  const divRef = useRef(null);

  const getData = useCallback(async () => {
    const res = await backendInstance.get(`/mock/${User.email}`);
    setdata(res.data);
    // setResult({ ...data });
  }, [setdata, User.email]);

  // const getAdminData = useCallback(async () => {
  //   const resultData = await backendInstance.get(`/mock`);
  // }, []);

  useEffect(() => {
    if (Object.keys(User).length === 0) {
      navigate("/login");
    } else {
      if (User.role === "student") {
        getData();
      } else {
        // getAdminData();
      }
    }
  }, [User, navigate, getData]);

  const [openSnack, setOpenSnack] = React.useState(false);

  const [dataMsg, setDataMsg] = React.useState("");

  const handleClick = () => {
    console.log("opened");
    setDataMsg("Added Successfully");
    setOpenSnack(true);
    getData();
    // getAdminData();
  };

  const handleDetails = (lev) => {
    setOpen(true);
    setDetails({ ...lev });
  };

  setTimeout(() => {
    divRef?.current?.scrollIntoView();
  }, 1000);

  const validation = yup.object().shape({
    name: yup.string().required("Enter name"),
    email: yup.string().email().required("Enter email"),
    date: yup.string().required("Enter the date"),
    interviewer: yup.string().required("Enter the interviewer"),
    attended: yup.string().required("Enter the attended"),
    comments: yup.string().required("Enter the comments"),
    score: yup
      .number()
      .min(0, "Should be minimum 0")
      .max(5, "Should be maximum 5")
      .required("Enter the score"),
    overall: yup
      .number()
      .min(0, "Should be minimum 0")
      .max(5, "Should be maximum 5")
      .required("Enter the overall score"),
    recurl: yup.string().required("Enter the url"),
  });

  const formData = useFormik({
    initialValues: {
      name: "",
      email: "",
      date: "",
      interviewer: "",
      round: "",
      attended: "",
      comments: "",
      score: "",
      overall: "",
      recurl: "",
    },
    onSubmit: async (data) => {
      document.getElementById("submitbutt").disabled = true;
      console.log(data);
      const res = await backendInstance.post("/mock", data);
      console.log(res.data);

      if (res.data.msg === "Inserted Successfully") {
        handleClick();
        document.getElementById("submitform").reset();
      } else {
        document.getElementById("submitbutt").disabled = false;
      }
      document.getElementById("submitbutt").disabled = false;
    },
    validationSchema: validation,
  });
  return (
    <div>
      {User.role === "student" ? (
        <div style={{}}>
          <div style={{}}>
            <TableContainer component={Paper}>
              <Table sx={{ minWidth: 650 }} aria-label="simple table">
                <TableHead>
                  <TableRow>
                    <TableCell sx={{ color: "head.main" }}>Round</TableCell>
                    <TableCell sx={{ color: "head.main" }} align="right">
                      Interview Date
                    </TableCell>
                    <TableCell sx={{ color: "head.main" }} align="right">
                      {" "}
                      Score
                    </TableCell>
                    <TableCell sx={{ color: "head.main" }} align="right">
                      {" "}
                      Overall Score
                    </TableCell>
                    <TableCell sx={{ color: "head.main" }} align="center">
                      Recording
                    </TableCell>
                    <TableCell sx={{ color: "head.main" }} align="center">
                      Comments
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {data.map((lev) => (
                    <TableRow
                      key={lev.date}
                      sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                    >
                      <TableCell
                        sx={{ color: "mild.main" }}
                        component="th"
                        scope="row"
                      >
                        {lev.round}
                      </TableCell>
                      <TableCell sx={{ color: "mild.main" }} align="right">
                        {lev.date}
                      </TableCell>
                      <TableCell sx={{ color: "mild.main" }} align="right">
                        {lev.score || "-"}
                      </TableCell>
                      <TableCell sx={{ color: "mild.main" }} align="right">
                        {lev.overall}
                      </TableCell>
                      <TableCell sx={{ color: "mild.main" }} align="right">
                        {" "}
                        <p
                          style={{
                            whiteSpace: "nowrap",
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                            maxWidth: "100px",
                          }}
                        >
                          {lev.recurl}
                        </p>
                      </TableCell>
                      <TableCell sx={{ color: "mild.main" }} align="right">
                        <p
                          style={{
                            whiteSpace: "nowrap",
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                            maxWidth: "100px",
                          }}
                        >
                          {lev.comments}
                        </p>
                      </TableCell>
                      <TableCell sx={{ color: "mild.main" }} align="right">
                        {" "}
                        <Button
                          variant="contained"
                          size="small"
                          sx={{ backgroundColor: "buttcolor.main" }}
                          onClick={() => handleDetails(lev)}
                        >
                          Details
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </div>
          {open && (
            <div style={{ marginTop: "30px" }} ref={divRef}>
              {data
                .filter((filt) => filt.date === detailss.date)
                .map((val) => (
                  <div
                    style={{
                      border: "1px solid grey",
                      borderRadius: "8px",
                      boxShadow: "rgba(0, 0, 0, 0.1) 0px 4px 12px",
                    }}
                  >
                    <div style={{ margin: "5px" }}>
                      <Button
                        variant="contained"
                        size="small"
                        sx={{ backgroundColor: "buttcolor.main" }}
                        onClick={() => setOpen(false)}
                      >
                        Close
                      </Button>
                      <p style={{ color: "#555A8F" }}>
                        <span style={{ color: "#7E8E9F" }}>
                          Name :&nbsp;&nbsp;&nbsp;
                        </span>
                        {val.name}
                      </p>
                      <p style={{ color: "#555A8F" }}>
                        <span style={{ color: "#7E8E9F" }}>
                          Interview Date : &nbsp;
                        </span>
                        {val.date}
                      </p>{" "}
                      <p style={{ color: "#555A8F" }}>
                        <span style={{ color: "#7E8E9F" }}>
                          Interviewer : &nbsp;
                        </span>
                        {val.interviewer}
                      </p>{" "}
                      <p style={{ color: "#555A8F" }}>
                        <span style={{ color: "#7E8E9F" }}>
                          Interview Round : &nbsp;
                        </span>
                        {val.round}
                      </p>{" "}
                      <p style={{ color: "#555A8F" }}>
                        <span style={{ color: "#7E8E9F" }}>
                          Attended : &nbsp;&nbsp;
                        </span>
                        {val.attended}
                      </p>{" "}
                      <p
                        style={{
                          overflowWrap: "break-word",
                          width: "300px",
                          color: "#555A8F",
                        }}
                      >
                        <span style={{ color: "#7E8E9F" }}>
                          Comments : &nbsp;&nbsp;
                        </span>
                        {val.comments}
                      </p>{" "}
                      <p style={{ color: "#555A8F" }}>
                        <span style={{ color: "#7E8E9F" }}>
                          Logical Score : &nbsp;&nbsp;
                        </span>
                        {val.score}
                      </p>{" "}
                      <p style={{ color: "#555A8F" }}>
                        <span style={{ color: "#7E8E9F" }}>
                          Overall Score : &nbsp;&nbsp;
                        </span>
                        {val.overall}
                      </p>{" "}
                      <p style={{ color: "#555A8F" }}>
                        <span style={{ color: "#7E8E9F" }}>
                          Recording Url : &nbsp;&nbsp;
                        </span>
                        {val.recurl}
                      </p>
                    </div>
                  </div>
                ))}
            </div>
          )}
        </div>
      ) : (
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
              width: "300px",
              textAlign: "center",
              borderRadius: "8px",
              boxShadow: "rgba(0, 0, 0, 0.1) 0px 4px 12px",
            }}
          >
            <form id="submitform" onSubmit={formData.handleSubmit}>
              <label style={{ color: "#555A8F" }} htmlFor="name">
                Name
              </label>
              <br />
              <input
                name="name"
                id="name"
                onChange={formData.handleChange}
                onBlur={formData.handleBlur}
                value={formData.name}
              />
              {formData.touched.name && formData.errors.name && (
                <div
                  style={{
                    color: "red",
                    fontSize: "15px",
                    marginTop: "15px",
                  }}
                >
                  <span>
                    <ErrorIcon sx={{ fontSize: "15px", textAlign: "center" }} />
                    &nbsp;
                    {formData.errors.name}
                  </span>{" "}
                </div>
              )}
              <br />
              <label style={{ color: "#555A8F" }} htmlFor="email">
                Student Email
              </label>
              <br />
              <input
                type="email"
                name="email"
                id="email"
                onChange={formData.handleChange}
                onBlur={formData.handleBlur}
                value={formData.email}
              />
              {formData.touched.email && formData.errors.email && (
                <div
                  style={{
                    color: "red",
                    fontSize: "15px",
                    marginTop: "15px",
                  }}
                >
                  <span>
                    <ErrorIcon sx={{ fontSize: "15px", textAlign: "center" }} />
                    &nbsp;
                    {formData.errors.email}
                  </span>{" "}
                </div>
              )}
              <br />
              <label style={{ color: "#555A8F" }} htmlFor="date">
                Interview Date
              </label>
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
                    <ErrorIcon sx={{ fontSize: "15px", textAlign: "center" }} />
                    &nbsp;
                    {formData.errors.date}
                  </span>{" "}
                </div>
              )}
              <br />
              <label style={{ color: "#555A8F" }} htmlFor="interviewer">
                Interviewer
              </label>
              <br />
              <input
                name="interviewer"
                id="interviewer"
                onChange={formData.handleChange}
                onBlur={formData.handleBlur}
                value={formData.interviewer}
              />
              {formData.touched.interviewer && formData.errors.interviewer && (
                <div
                  style={{
                    color: "red",
                    fontSize: "15px",
                    marginTop: "15px",
                  }}
                >
                  <span>
                    <ErrorIcon sx={{ fontSize: "15px", textAlign: "center" }} />
                    &nbsp;
                    {formData.errors.interviewer}
                  </span>{" "}
                </div>
              )}
              <br />
              <br />{" "}
              <label style={{ color: "#555A8F" }} htmlFor="round">
                Round
              </label>
              <br />
              <input
                name="round"
                id="round"
                onChange={formData.handleChange}
                onBlur={formData.handleBlur}
                value={formData.round}
              />
              {formData.touched.round && formData.errors.round && (
                <div
                  style={{
                    color: "red",
                    fontSize: "15px",
                    marginTop: "15px",
                  }}
                >
                  <span>
                    <ErrorIcon sx={{ fontSize: "15px", textAlign: "center" }} />
                    &nbsp;
                    {formData.errors.round}
                  </span>{" "}
                </div>
              )}
              <br />
              <br />{" "}
              <label style={{ color: "#555A8F" }} htmlFor="attended">
                Attended
              </label>
              <br />
              <input
                name="attended"
                id="attended"
                onChange={formData.handleChange}
                onBlur={formData.handleBlur}
                value={formData.attended}
              />
              {formData.touched.attended && formData.errors.attended && (
                <div
                  style={{
                    color: "red",
                    fontSize: "15px",
                    marginTop: "15px",
                  }}
                >
                  <span>
                    <ErrorIcon sx={{ fontSize: "15px", textAlign: "center" }} />
                    &nbsp;
                    {formData.errors.attended}
                  </span>{" "}
                </div>
              )}
              <br />
              <br />{" "}
              <label style={{ color: "#555A8F" }} htmlFor="comments">
                Comments
              </label>
              <br />
              <textarea
                rows={10}
                cols={30}
                id="comments"
                name="comments"
                onChange={formData.handleChange}
                onBlur={formData.handleBlur}
                value={formData.comments}
              ></textarea>
              {formData.touched.comments && formData.errors.comments && (
                <div
                  style={{
                    color: "red",
                    fontSize: "15px",
                    marginTop: "15px",
                  }}
                >
                  <span>
                    <ErrorIcon sx={{ fontSize: "15px", textAlign: "center" }} />
                    &nbsp;
                    {formData.errors.comments}
                  </span>{" "}
                </div>
              )}
              <br />
              <br />{" "}
              <label style={{ color: "#555A8F" }} htmlFor="score">
                Logical Score
              </label>
              <br />
              <input
                name="score"
                id="score"
                onChange={formData.handleChange}
                onBlur={formData.handleBlur}
                value={formData.score}
              />
              {formData.touched.score && formData.errors.score && (
                <div
                  style={{
                    color: "red",
                    fontSize: "15px",
                    marginTop: "15px",
                  }}
                >
                  <span>
                    <ErrorIcon sx={{ fontSize: "15px", textAlign: "center" }} />
                    &nbsp;
                    {formData.errors.score}
                  </span>{" "}
                </div>
              )}
              <br />
              <br />
              <label style={{ color: "#555A8F" }} htmlFor="overall">
                Overall{" "}
              </label>
              <br />
              <input
                name="overall"
                id="overall"
                onChange={formData.handleChange}
                onBlur={formData.handleBlur}
                value={formData.overall}
              />
              {formData.touched.overall && formData.errors.overall && (
                <div
                  style={{
                    color: "red",
                    fontSize: "15px",
                    marginTop: "15px",
                  }}
                >
                  <span>
                    <ErrorIcon sx={{ fontSize: "15px", textAlign: "center" }} />
                    &nbsp;
                    {formData.errors.overall}
                  </span>{" "}
                </div>
              )}
              <br />
              <br />
              <label style={{ color: "#555A8F" }} htmlFor="recurl">
                Recording Url
              </label>
              <br />
              <input
                type="url"
                name="recurl"
                id="recurl"
                onChange={formData.handleChange}
                onBlur={formData.handleBlur}
                value={formData.recurl}
              />
              {formData.touched.recurl && formData.errors.recurl && (
                <div
                  style={{
                    color: "red",
                    fontSize: "15px",
                    marginTop: "15px",
                  }}
                >
                  <span>
                    <ErrorIcon sx={{ fontSize: "15px", textAlign: "center" }} />
                    &nbsp;
                    {formData.errors.recurl}
                  </span>{" "}
                </div>
              )}
              <br />
              <br />
              <Button
                variant="contained"
                sx={{ backgroundColor: "buttcolor.main", margin: "10px" }}
                type="submit"
                id="submitbutt"
              >
                submit{" "}
              </Button>
              &nbsp;&nbsp;&nbsp;
            </form>
          </div>
        </div>
      )}
      <SnackBarComp
        openSnack={openSnack}
        setOpenSnack={setOpenSnack}
        dataMsg={dataMsg}
      />
    </div>
  );
};

export default MockInterView;
