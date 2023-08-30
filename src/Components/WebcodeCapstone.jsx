import { Button, Typography } from "@mui/material";
import React, { useEffect, useState } from "react";
import Box from "@mui/material/Box";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import backendInstance from "../Axios/axios";

const WebcodeCapstone = ({ data, User, result }) => {
  const [openBox, setOpenBox] = useState(false);
  const [type, setType] = React.useState("");
  const [reqArr, setReqArr] = React.useState("");
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

  console.log(result);

  const handleOpen = (val) => {
    setSub(true);
    console.log(val);
    setOpenBox(!openBox);
    setDescObj({ ...val });
    setReqArr(descObj?.requirement?.split(/\n/));
    result.forEach((res) => {
      if (val.title === res.title) {
        setSub(false);
      }
    });
    if (result.length === 0) {
      setSub(true);
    }
    console.log(descObj);
  };

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

    console.log(obj);
  };

  const handleAdd = async (e) => {
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
  };

  const handleMark = async (e, val) => {
    console.log(val);
    e.preventDefault();
    let marks = {};
    Array.from(e.target.elements).forEach((ele) => {
      if (ele.nodeName === "INPUT" || ele.nodeName === "TEXTAREA") {
        marks[ele.name] = ele.value;
      }
    });

    marks = {
      ...marks,
      email: val.email,
      type: val.type,
      title: val.title,
      evaluated: true,
    };

    const res = await backendInstance.put("/webcapsubmit", marks);
  };

  console.log(descObj, result, sub);
  console.log(User.role, data);

  // useEffect(() => {});

  return (
    <div
      style={{
        display: "flex",
        flexWrap: "wrap",
        justifyContent: "center",
        // alignItems: "center",
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
                    border: "2px solid",
                    display: "flex",
                    justifyContent: "space-around",
                    width: "400px",
                    marginTop: "10px",
                  }}
                >
                  <p>
                    <Typography>{User.name}</Typography>({val.batch} -{" "}
                    {val?.type?.toUpperCase()})<br />
                    <span>{val.title}</span>
                  </p>

                  <div>
                    {result.map((res) => {
                      if (res.title === val.title) {
                        return <p>Marks : {res.marks}</p>;
                      }
                    })}
                    <p>{val.type}</p>
                  </div>
                </div>
              );
            })}
          </div>
          <div>
            {" "}
            {openBox && (
              <div style={{}}>
                <div
                  style={{
                    marginTop: "15px",
                    display: "flex",
                    justifyContent: "space-between",
                  }}
                >
                  {" "}
                  <p>
                    <Typography>{User.name}</Typography>({descObj.batch} -{" "}
                    {descObj.type.toUpperCase()})<br />
                    {descObj.title.toUpperCase()}
                  </p>
                  <div>
                    <p>
                      {
                        (descObj.marks = ""
                          ? "Yet to be graded"
                          : descObj.marks)
                      }
                    </p>
                    <p>{descObj.type}</p>
                  </div>
                </div>
                <div></div>
                <div>
                  <Typography variant="h6">Requirements</Typography>
                  {reqArr?.map((req) => (
                    <li>{req}</li>
                  ))}
                </div>
                <br />
                <div>
                  <Typography variant="h6" gutterBottom>
                    Terms and Conditons
                  </Typography>
                  {terms?.map((req) => (
                    <li>{req}</li>
                  ))}
                </div>
                <div style={{ marginTop: "15px" }}>
                  <Typography variant="h6" gutterBottom>
                    Submit your code
                  </Typography>
                  <form onSubmit={handleSubmit}>
                    <label htmlFor="fesourcecode">Front-end Source code</label>
                    &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                    <input id="fesourcecode" name="fesourcecode" type="url" />
                    <br />
                    <br />
                    <label htmlFor="besourcecode">Back-end Source code</label>
                    &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                    <input id="besourcecode" name="besourcecode" type="url" />
                    <br />
                    <br />
                    <label htmlFor="fedeploy">Front-end Deployed URL</label>
                    &nbsp;&nbsp;&nbsp;
                    <input id="fedeploy" name="fedeploy" type="url" />
                    <br />
                    <br />
                    <label htmlFor="bedeploy">Back-end Deployed URL</label>
                    &nbsp;&nbsp;&nbsp;
                    <input id="bedeploy" name="bedeploy" type="url" />
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
        <div style={{ border: "2px solid", maxWidth: "650px" }}>
          {data
            .filter((res) => res.evaluated === false)
            .map((val) => {
              return (
                <div style={{ border: "2px solid", margin: "5px" }}>
                  <div>
                    <Typography>
                      {val.name} - ({val.email})
                    </Typography>
                    <p>
                      {val.batch} - {val.type}
                    </p>
                  </div>
                  <div>
                    <p>{val.title}</p>
                  </div>
                  <div>
                    <p>
                      <span>Front end source code : </span>
                      {val.fesourcecode}
                    </p>
                    <p>
                      <span>Back end source code : </span>
                      {val.besourcecode}
                    </p>
                    <p>
                      <span>Front end deployed Url : </span>
                      {val.fedeploy}
                    </p>
                    <p>
                      <span>Back end deployed Url : </span>
                      {val.bedeploy}
                    </p>
                  </div>
                  <div>
                    <form onSubmit={(e) => handleMark(e, val)}>
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
                        sx={{ backgroundColor: "buttcolor.main" }}
                        type="submit"
                        variant="contained"
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
              <div style={{ margin: "20px" }}>
                <div>
                  <Typography variant="h6">Add Projects</Typography>
                </div>
                <div style={{ marginTop: "30px" }}>
                  <form onSubmit={handleAdd}>
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
                        >
                          <MenuItem value={"webcode"}>Webcode</MenuItem>
                          <MenuItem value={"capstone"}>Capstone</MenuItem>
                        </Select>
                      </FormControl>
                    </Box>
                    <br />
                    <label htmlFor="besourcecode">Title</label>
                    &nbsp;&nbsp;&nbsp;:&nbsp;
                    <input id="title" name="title" />
                    <br />
                    <br />
                    <label htmlFor="fedeploy">Batch</label>
                    &nbsp;:&nbsp;
                    <input id="batch" name="batch" />
                    <br />
                    <br />
                    <label htmlFor="requirement">Requirements</label>
                    <br />
                    <textarea
                      rows={10}
                      cols={30}
                      id="requirement"
                      name="requirement"
                    ></textarea>
                    <br />
                    <br />
                    <Button
                      variant="contained"
                      sx={{ backgroundColor: "buttcolor.main" }}
                      type="submit"
                    >
                      Add
                    </Button>
                  </form>
                </div>
              </div>
            }
          </div>
        </div>
      )}
    </div>
  );
};

export default WebcodeCapstone;
