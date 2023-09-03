import { Button, Typography } from "@mui/material";
import React, { useState } from "react";
import Box from "@mui/material/Box";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import backendInstance from "../Axios/axios";
import SnackBarComp from "./SnackBarComp";

const WebcodeCapstone = ({ data, User, result, handleClose }) => {
  const [openBox, setOpenBox] = useState(false);
  const [type, setType] = React.useState("");
  const [sub, setSub] = React.useState(true);

  const terms = [
    "You agree to not share this confidential document with anyone.",
    "You agree to open-source your code (it may even look good on your profile!). Do not mention our company’s name anywhere in the code.",
    "We will never use your source code under any circumstances for any commercial purposes; this is just a basic assessment task.",
    "For capstone, the use case has to be identified by the developer.",
    "NOTE: Any violation of Terms and conditions is strictly prohibited. You are bound to adhere to it.",
  ];

  let obj = {};

  const [descObj, setDescObj] = useState({} || {});

  const [openSnack, setOpenSnack] = React.useState(false);

  const [dataMsg, setDataMsg] = React.useState("");

  const handleClick = () => {
    console.log("opened");
    setDataMsg("Added Successfully");
    setOpenSnack(true);
    handleClose();
    setOpenBox(false);
  };

  console.log(result);

  const handleOpen = (val) => {
    setSub(true);
    console.log(val);
    setOpenBox(!openBox);
    setDescObj({ ...val });
    result.forEach((res) => {
      if (val.title === res.title) {
        setSub(false);
      }
    });
    if (result.length === 0) {
      setSub(true);
    }
    console.log(descObj);
    // setReqArr(descObj.requirement.split("\n"));
  };

  console.log(descObj);

  const handleChange = (event) => {
    setType(event.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log(e);
    document.getElementById("submitbutt").disabled = true;
    Array.from(e.target.elements).forEach((ele) => {
      if (ele.nodeName === "INPUT") {
        obj[ele.name] = ele.value;
      }
    });
    obj = {
      ...obj,
      name: User.name,
      batch: descObj.batch,
      email: User.email,
      title: descObj.title,
      type: descObj.type,
      marks: "",
      evaluated: false,
    };

    const res = await backendInstance.post("/webcapsubmit", obj);

    if (res.data.msg === "Inserted Successfully") {
      handleClick();
      let addform = document.getElementById("submitform");
      addform.reset();
    } else {
      document.getElementById("submitbutt").disabled = false;
    }

    document.getElementById("submitbutt").disabled = false;

    console.log(obj);
  };

  const handleAdd = async (e) => {
    document.getElementById("submitbutt").disabled = true;
    e.preventDefault();
    console.log(e);
    Array.from(e.target.elements).forEach((ele) => {
      if (ele.nodeName === "INPUT" || ele.nodeName === "TEXTAREA") {
        obj[ele.name] = ele.value;
      }
    });
    obj = {
      ...obj,
      email: User.email,
      terms: terms,
    };

    console.log(obj);
    const res = await backendInstance.post("/webcodecapstone", obj);
    if (res.data.msg === "Inserted Successfully") {
      handleClick();
      let addform = document.getElementById("addform");
      addform.reset();
    } else {
      document.getElementById("submitbutt").disabled = false;
    }

    document.getElementById("submitbutt").disabled = false;
  };

  const handleMark = async (e, val) => {
    document.getElementById("markbutton").disabled = true;
    console.log(val);
    e.preventDefault();
    let marks = {};
    Array.from(e.target.elements).forEach((ele) => {
      if (ele.nodeName === "INPUT" || ele.nodeName === "TEXTAREA") {
        marks[ele.name] = ele.value;
      }
    });

    if (marks.marks > 10 || marks.marks <= 0) {
      alert("Marks should not be greater than 10 or less than 0 ");
      document.getElementById("markbutton").disabled = false;
    } else {
      marks = {
        ...marks,
        email: val.email,
        type: val.type,
        title: val.title,
        evaluated: true,
      };

      const res = await backendInstance.put("/webcapsubmit", marks);

      if (res) {
        handleClick();
        let addform = document.getElementById("markform");
        addform.reset();
      } else {
        document.getElementById("markbutton").disabled = false;
      }

      document.getElementById("markbutton").disabled = false;
    }
  };

  console.log(descObj, result, sub);
  console.log(User.role, data);

  // useEffect(() => {});

  return (
    <div
      style={{
        display: "flex",
        flexWrap: "wrap",
        justifyContent: "space-around",
      }}
    >
      {User.role === "student" ? (
        <>
          <div style={{ marginTop: "50px" }}>
            {data.map((val) => {
              return (
                <div
                  onClick={() => handleOpen(val)}
                  style={{
                    border: "1px solid grey",
                    boxShadow: "rgba(0, 0, 0, 0.1) 0px 4px 12px",
                    display: "flex",
                    justifyContent: "space-around",
                    width: "400px",
                    marginTop: "10px",
                    borderRadius: "8px",
                  }}
                >
                  <p>
                    <Typography variant="h6" sx={{ color: "head.main" }}>
                      {User.name}
                    </Typography>
                    <span style={{ fontSize: "12px", color: "#7E8E9F" }}>
                      ({val.batch} - {val?.type?.toUpperCase()})
                    </span>
                    <br />
                    <span style={{ fontSize: "12px", color: "#7E8E9F" }}>
                      {val.title}
                    </span>
                  </p>

                  <div>
                    {result.map(
                      (res) =>
                        res.title === val.title && (
                          <p>
                            {" "}
                            Marks :
                            <span
                              style={{
                                border: "1px solid #FF9828",
                              }}
                            >
                              {" "}
                              {res.marks === "" ? "-" : res.marks}
                            </span>
                          </p>
                        )
                    )}
                    <p style={{ backgroundColor: "#FF9828", color: "#555A8F" }}>
                      {val.type}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
          <div style={{ maxWidth: "500px" }}>
            {" "}
            {openBox && (
              <div
                style={{
                  border: "1px solid grey",
                  boxShadow: "rgba(0, 0, 0, 0.1) 0px 4px 12px",
                  borderRadius: "8px",
                }}
              >
                <div
                  style={{
                    marginTop: "15px",
                    display: "flex",
                    justifyContent: "space-between",
                    padding: "5px",
                  }}
                >
                  {" "}
                  <p>
                    <Typography variant="h5" sx={{ color: "head.main" }}>
                      {User.name}
                    </Typography>
                    <span style={{ fontSize: "12px", color: "#7E8E9F" }}>
                      ({descObj.batch} - {descObj.type.toUpperCase()}
                      )<br />
                      {descObj.title.toUpperCase()}
                    </span>
                  </p>
                  <div>
                    <p style={{ backgroundColor: "#FF9828", color: "#555A8F" }}>
                      {descObj.type}
                    </p>
                  </div>
                </div>
                <div>
                  <p>
                    <Typography variant="h6">Description</Typography>
                    {descObj.description}
                  </p>
                </div>
                <div>
                  <Typography variant="h6">Requirements</Typography>
                  {descObj?.requirement.split("\n").map((req) => (
                    <li style={{ color: "#555A8F", padding: "5px" }}>{req}</li>
                  ))}
                </div>
                <br />
                <div>
                  <Typography variant="h6" gutterBottom>
                    Terms and Conditons
                  </Typography>
                  {terms?.map((req) => (
                    <li style={{ color: "#555A8F", padding: "5px" }}>{req}</li>
                  ))}
                </div>
                <div
                  style={{
                    marginTop: "15px",
                    color: "#555A8F",
                    padding: "5px",
                  }}
                >
                  <Typography variant="h6" gutterBottom>
                    Submit your code
                  </Typography>
                  <form id="submitform" onSubmit={handleSubmit}>
                    <label htmlFor="fesourcecode">
                      Front-end Source code :{" "}
                    </label>
                    &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                    <input
                      id="fesourcecode"
                      name="fesourcecode"
                      type="url"
                      required
                    />
                    <br />
                    <br />
                    <label htmlFor="besourcecode">
                      Back-end Source code :{" "}
                    </label>
                    &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                    <input
                      id="besourcecode"
                      name="besourcecode"
                      type="url"
                      required
                    />
                    <br />
                    <br />
                    <label htmlFor="fedeploy">Front-end Deployed URL : </label>
                    &nbsp;&nbsp;&nbsp;
                    <input id="fedeploy" name="fedeploy" type="url" required />
                    <br />
                    <br />
                    <label htmlFor="bedeploy">Back-end Deployed URL : </label>
                    &nbsp;&nbsp;&nbsp;
                    <input id="bedeploy" name="bedeploy" type="url" required />
                    <br />
                    <br />
                    {sub ? (
                      <Button
                        variant="contained"
                        sx={{ backgroundColor: "buttcolor.main" }}
                        type="submit"
                        id="submitbutt"
                      >
                        SUBMIT
                      </Button>
                    ) : (
                      <div>
                        {result
                          .filter((resval) => descObj.title === resval.title)
                          .map((res) => (
                            <>
                              <p>
                                Marks : <span>{res.marks}</span>
                              </p>
                              <p>
                                Comments : <span>{res.comments}</span>
                              </p>
                              <div>
                                <label htmlFor="fesourcecode">
                                  Front-end Source code :
                                </label>
                                &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                                <span>{res.fesourcecode}</span>
                                <br />
                                <br />
                                <label htmlFor="besourcecode">
                                  Back-end Source code :
                                </label>
                                &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                                <span>{res.besourcecode}</span>
                                <br />
                                <br />
                                <label htmlFor="fedeploy">
                                  Front-end Deployed URL :
                                </label>
                                &nbsp;&nbsp;&nbsp;
                                <span>{res.fedeploy}</span>
                                <br />
                                <br />
                                <label htmlFor="bedeploy">
                                  Back-end Deployed URL :
                                </label>
                                &nbsp;&nbsp;&nbsp;
                                <span>{res.bedeploy}</span>
                              </div>
                            </>
                          ))}
                      </div>
                    )}
                  </form>
                </div>
              </div>
            )}
          </div>
        </>
      ) : (
        <>
          <a href="#add" style={{ textDecoration: "none" }}>
            Add Project
          </a>
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              flexWrap: "wrap",
              alignItems: "center",
            }}
          >
            {data
              .filter((res) => res.evaluated === false)
              .map((val) => {
                return (
                  <div
                    style={{
                      border: "1px solid grey",
                      margin: "10px",
                      boxShadow: "rgba(0, 0, 0, 0.1) 0px 4px 12px",
                      borderRadius: "8px",
                    }}
                  >
                    <div style={{ margin: "5px" }}>
                      <Typography sx={{ color: "head.main" }}>
                        {val.name} - ({val.email})
                      </Typography>
                      <p>
                        {val.batch} - {val.type}
                      </p>
                    </div>
                    <div style={{ margin: "5px" }}>
                      <p>{val.title}</p>
                    </div>
                    <div style={{ margin: "5px" }}>
                      <p>
                        <span style={{ color: "#7E8E9F" }}>
                          Front end source code :{" "}
                        </span>
                        {val.fesourcecode}
                      </p>
                      <p>
                        <span style={{ color: "#7E8E9F" }}>
                          Back end source code :{" "}
                        </span>
                        {val.besourcecode}
                      </p>
                      <p>
                        <span style={{ color: "#7E8E9F" }}>
                          Front end deployed Url :{" "}
                        </span>
                        {val.fedeploy}
                      </p>
                      <p>
                        <span style={{ color: "#7E8E9F" }}>
                          Back end deployed Url :{" "}
                        </span>
                        {val.bedeploy}
                      </p>
                    </div>
                    <div style={{ margin: "5px" }}>
                      <form id="markform" onSubmit={(e) => handleMark(e, val)}>
                        <label htmlFor="marks">Marks(for 10) : </label>
                        <input id="marks" name="marks" />
                        <br />
                        <br />
                        <label htmlFor="comments">Comments : </label>
                        <br />
                        <textarea
                          rows={10}
                          cols={30}
                          id="comments"
                          name="comments"
                        ></textarea>
                        <br />
                        <br />
                        <Button
                          sx={{
                            backgroundColor: "buttcolor.main",
                            margin: "5px",
                          }}
                          type="submit"
                          variant="contained"
                          id="markbutton"
                        >
                          Submit
                        </Button>
                      </form>
                    </div>
                  </div>
                );
              })}
            <div style={{ marginTop: "20px", border: "2px solid" }}>
              {" "}
              {
                <div style={{ margin: "20px" }} id="add" className="add">
                  <div>
                    <Typography variant="h6">Add Projects</Typography>
                  </div>
                  <div style={{ marginTop: "30px" }}>
                    <form id="addform" onSubmit={handleAdd}>
                      <Box sx={{ width: 300 }}>
                        <FormControl fullWidth>
                          <InputLabel id="demo-simple-select-label">
                            Type
                          </InputLabel>
                          <Select
                            labelId="demo-simple-select-label"
                            id="demo-simple-select"
                            value={type}
                            label="Type"
                            name="type"
                            onChange={handleChange}
                            required
                          >
                            <MenuItem value={"webcode"}>Webcode</MenuItem>
                            <MenuItem value={"capstone"}>Capstone</MenuItem>
                          </Select>
                        </FormControl>
                      </Box>
                      <br />
                      <label htmlFor="besourcecode">Title</label>
                      &nbsp;&nbsp;&nbsp;:&nbsp;
                      <input id="title" name="title" required />
                      <br />
                      <br />
                      <label htmlFor="fedeploy">Batch</label>
                      &nbsp;:&nbsp;
                      <input id="batch" name="batch" required />
                      <br />
                      <br />
                      <label htmlFor="description">Description</label>
                      <br />
                      <textarea
                        rows={10}
                        cols={30}
                        id="description"
                        name="description"
                        required
                      ></textarea>
                      <br />
                      <br />
                      <label htmlFor="requirement">Requirements</label>
                      <br />
                      <textarea
                        rows={10}
                        cols={30}
                        id="requirement"
                        name="requirement"
                        required
                      ></textarea>
                      <br />
                      <br />
                      <Button
                        variant="contained"
                        sx={{ backgroundColor: "buttcolor.main" }}
                        type="submit"
                        id="submitbutt"
                      >
                        Add
                      </Button>
                    </form>
                  </div>
                </div>
              }
            </div>
          </div>
        </>
      )}
      <SnackBarComp
        openSnack={openSnack}
        setOpenSnack={setOpenSnack}
        dataMsg={dataMsg}
      />
    </div>
  );
};

export default WebcodeCapstone;
