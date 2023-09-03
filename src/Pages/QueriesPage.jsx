import { Button, Typography } from "@mui/material";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import { useNavigate } from "react-router-dom";
import backendInstance from "../Axios/axios";

const QueriesPage = () => {
  const User = useMemo(
    () => JSON.parse(sessionStorage.getItem("user")) || {},
    []
  );

  const navigate = useNavigate();
  const [queries, setQuery] = useState([]);
  const [adminQueries, setAdminQuery] = useState([]);
  const [open, setOpen] = useState(false);
  const [openQuery, setOpenQuery] = useState({});

  const queryData = useCallback(async () => {
    const { data } = await backendInstance.get(`/queries/${User.email}`);
    setQuery(data);
  }, [User.email, setQuery]);

  const adminQueryData = useCallback(async () => {
    const { data } = await backendInstance.get(`/queries`);
    setAdminQuery(data);
  }, [User.email, setAdminQuery]);

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
  }, [User, navigate, queryData]);

  const handleRedirect = () => {
    navigate("/queries/add");
  };

  const handleOpen = (query) => {
    setOpen(!open);
    setOpenQuery({ ...query });
  };

  const handleAssign = async (e, query) => {
    e.preventDefault();
    let obj = {};
    Array.from(e.target.elements).forEach((ele) => {
      if (ele.nodeName === "TEXTAREA") {
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
  };

  return (
    <div>
      <div>
        <Button
          sx={{ backgroundColor: "buttcolor.main", marginBottom: "5px" }}
          variant="contained"
          endIcon={<AddCircleOutlineIcon />}
          onClick={handleRedirect}
        >
          Create Query
        </Button>
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
              <Typography m={1} variant="h5">
                {query.querytitle}
              </Typography>
              <p style={{ overflowWrap: "break-word", margin: "5px" }}>
                Category : {query.category}
              </p>
              <p style={{ overflowWrap: "break-word", margin: "5px" }}>
                Description : {query.description}
              </p>
              <p style={{ overflowWrap: "break-word", margin: "5px" }}>
                Assigned to : {query.assignedTo}
              </p>

              {/* <Button
                variant="contained"
                sx={{ backgroundColor: "buttcolor.main", margin: "5px" }}
                onClick={() => handleOpen(query)}
              >
                {open ? "Close" : "chat"}
              </Button> */}
            </div>
            {open && query.quesId === openQuery.quesId && (
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
            )}
          </div>
        ))}
      </div>
      {User.role === "admin" && (
        <div>
          {adminQueries.map((query) => (
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
                <Typography m={1} variant="h5">
                  {query.querytitle}
                </Typography>
                <p style={{ overflowWrap: "break-word", margin: "5px" }}>
                  Name : {query.name}
                </p>
                <p style={{ overflowWrap: "break-word", margin: "5px" }}>
                  Available : {query.from} {query.till}
                </p>
                <p style={{ overflowWrap: "break-word", margin: "5px" }}>
                  Language : {query.language}
                </p>
                <p style={{ overflowWrap: "break-word", margin: "5px" }}>
                  Email : {query.email}
                </p>
                <p style={{ overflowWrap: "break-word", margin: "5px" }}>
                  Category : {query.category}
                </p>
                <p style={{ overflowWrap: "break-word", margin: "5px" }}>
                  Description : {query.description}
                </p>
                <p style={{ overflowWrap: "break-word", margin: "5px" }}>
                  Assigned to : {query.assignedTo}
                </p>
              </div>
              <form>
                <label htmlFor="assigned">Assign to</label>
                <br />
                <input name="assigned" id="assigned" required />
                &nbsp;
                <Button
                  variant="contianed"
                  sx={{ backgroundColor: "buttcolor.main" }}
                >
                  assign
                </Button>
              </form>
            </div>
          ))}{" "}
        </div>
      )}
    </div>
  );
};

export default QueriesPage;
