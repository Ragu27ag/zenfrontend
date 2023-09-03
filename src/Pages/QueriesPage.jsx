import { Button, Typography } from "@mui/material";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import { useNavigate } from "react-router-dom";
import backendInstance from "../Axios/axios";
import SnackBarComp from "../Components/SnackBarComp";

const QueriesPage = () => {
  const User = useMemo(
    () => JSON.parse(sessionStorage.getItem("user")) || {},
    []
  );

  const navigate = useNavigate();
  const [queries, setQuery] = useState([]);
  const [adminQueries, setAdminQuery] = useState([]);
  // const [open, setOpen] = useState(false);
  // const [openQuery, setOpenQuery] = useState({});

  const [openSnack, setOpenSnack] = React.useState(false);

  const [dataMsg, setDataMsg] = React.useState("");

  const queryData = useCallback(async () => {
    const { data } = await backendInstance.get(`/queries/${User.email}`);
    setQuery(data);
  }, [User.email, setQuery]);

  const adminQueryData = useCallback(async () => {
    const { data } = await backendInstance.get(`/queries`);
    setAdminQuery(data);
  }, [setAdminQuery]);

  console.log(queries);

  useEffect(() => {
    if (Object.keys(User).length === 0) {
      navigate("/login");
    } else {
      if (User.role === "student") {
        queryData();
      } else {
        adminQueryData();
      }
    }
  }, [User, navigate, queryData, adminQueryData]);

  const handleRedirect = () => {
    navigate("/queries/add");
  };

  const handleClick = () => {
    console.log("opened");
    setDataMsg("Added Successfully");
    setOpenSnack(true);
    adminQueryData();
  };

  // const handleOpen = (query) => {
  //   setOpen(!open);
  //   setOpenQuery({ ...query });
  // };

  const handleAssign = async (e, query) => {
    document.getElementById("assignbutt").disabled = true;
    e.preventDefault();
    let obj = {};
    Array.from(e.target.elements).forEach((ele) => {
      if (ele.nodeName === "INPUT") {
        obj[ele.name] = ele.value;
      }
    });

    obj = {
      ...obj,
      id: query.quesId,
      name: query.name,
      email: query.email,
    };

    const res = await backendInstance.put("/queries", obj);

    console.log(obj);

    if (res.data) {
      document.getElementById("assignform").reset();
      handleClick();
    } else {
      document.getElementById("assignbutt").disabled = false;
    }
    document.getElementById("assignbutt").disabled = false;
  };

  return (
    <div>
      <div>
        {User.role === "student" && (
          <Button
            sx={{ backgroundColor: "buttcolor.main", marginBottom: "5px" }}
            variant="contained"
            endIcon={<AddCircleOutlineIcon />}
            onClick={handleRedirect}
          >
            Create Query
          </Button>
        )}
      </div>
      <div
        style={{
          margin: "5px",
        }}
        className="query-main"
      >
        {queries.map((query) => (
          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              justifyContent: "space-around",
            }}
          >
            <div
              style={{
                margin: "5px",
                border: "1px solid grey",
                boxShadow: "rgba(0, 0, 0, 0.1) 0px 4px 12px",
                borderRadius: "8px",
                width: "400px",
              }}
            >
              <Typography sx={{ color: "head.main" }} m={1} variant="h5">
                {query.querytitle}
              </Typography>
              <p
                style={{
                  overflowWrap: "break-word",
                  margin: "5px",
                  color: "#7E8E9F",
                }}
              >
                Category : {query.category}
              </p>
              <p
                style={{
                  overflowWrap: "break-word",
                  margin: "5px",
                  color: "#7E8E9F",
                }}
              >
                Description : {query.description}
              </p>
              <p
                style={{
                  overflowWrap: "break-word",
                  margin: "5px",
                  color: "#7E8E9F",
                }}
              >
                Assigned to :{" "}
                <span style={{ backgroundColor: "#FF9A28" }}>
                  {query.assignedTo}
                </span>
              </p>

              {/* <Button
                variant="contained"
                sx={{ backgroundColor: "buttcolor.main", margin: "5px" }}
                onClick={() => handleOpen(query)}
              >
                {open ? "Close" : "chat"}
              </Button> */}
            </div>
            {/* {open && query.quesId === openQuery.quesId && (
              <div
                style={{
                  margin: "5px",
                  border: "2px solid",
                  minWidth: "400px",
                }}
              >
                <div style={{ border: "2px solid", height: "300px" }}></div>
                <div>
                  <form>
                    <textarea
                      name="chat"
                      id="chat"
                      rows={5}
                      style={{ marginTop: "5px", width: "100%" }}
                    ></textarea>
                    <Button
                      variant="contained"
                      sx={{
                        backgroundColor: "buttcolor.main",
                        margin: "5px",
                      }}
                      type="submit"
                    >
                      SEND
                    </Button>
                  </form>
                </div>
              </div>
            )} */}
          </div>
        ))}
      </div>
      {User.role === "admin" && (
        <div>
          {adminQueries
            .filter((quer) => quer.assignedTo === "")
            .map((query) => (
              <div
                style={{
                  display: "flex",
                  flexWrap: "wrap",
                  justifyContent: "space-around",
                }}
              >
                <div
                  style={{
                    margin: "5px",
                    border: "1px solid grey",
                    boxShadow: "rgba(0, 0, 0, 0.1) 0px 4px 12px",
                    borderRadius: "8px",
                    width: "400px",
                  }}
                >
                  <Typography sx={{ color: "head.main" }} m={1} variant="h5">
                    {query.querytitle}
                  </Typography>
                  <p
                    style={{
                      overflowWrap: "break-word",
                      margin: "5px",
                      color: "#7E8E9F",
                    }}
                  >
                    Name : {query.name}
                  </p>
                  <p
                    style={{
                      overflowWrap: "break-word",
                      margin: "5px",
                      color: "#7E8E9F",
                    }}
                  >
                    Available : {query.from} - {query.till}
                  </p>
                  <p
                    style={{
                      overflowWrap: "break-word",
                      margin: "5px",
                      color: "#7E8E9F",
                    }}
                  >
                    Language : {query.language}
                  </p>
                  <p
                    style={{
                      overflowWrap: "break-word",
                      margin: "5px",
                      color: "#7E8E9F",
                    }}
                  >
                    Email : {query.email}
                  </p>
                  <p
                    style={{
                      overflowWrap: "break-word",
                      margin: "5px",
                      color: "#7E8E9F",
                    }}
                  >
                    Category : {query.category}
                  </p>
                  <p
                    style={{
                      overflowWrap: "break-word",
                      margin: "5px",
                      color: "#7E8E9F",
                    }}
                  >
                    Description : {query.description}
                  </p>

                  <form
                    id="assignform"
                    onSubmit={(e) => handleAssign(e, query)}
                  >
                    <label
                      style={{
                        overflowWrap: "break-word",
                        margin: "5px",
                        color: "#7E8E9F",
                      }}
                      htmlFor="assigned"
                    >
                      Assign to :
                    </label>
                    <br />
                    <input
                      style={{ overflowWrap: "break-word", margin: "5px" }}
                      name="assignedTo"
                      id="assignedTo"
                      required
                    />
                    &nbsp;
                    <Button
                      variant="contianed"
                      type="submit"
                      size="small"
                      sx={{
                        backgroundColor: "buttcolor.main",
                        "&.MuiButtonBase-root:hover": {
                          bgcolor: "buttcolor.main",
                        },
                        marginBottom: "5px",
                      }}
                      id="assignbutt"
                    >
                      assign
                    </Button>
                  </form>
                </div>
              </div>
            ))}{" "}
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

export default QueriesPage;
