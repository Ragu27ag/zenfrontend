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
  const [open, setOpen] = useState(false);
  const [openQuery, setOpenQuery] = useState({});

  const queryData = useCallback(async () => {
    const { data } = await backendInstance.get(`/queries/${User.email}`);
    setQuery(data);
  }, [User.email, setQuery]);

  console.log(queries);

  useEffect(() => {
    if (Object.keys(User).length === 0) {
      navigate("/login");
    } else {
      queryData();
    }
  }, [User, navigate, queryData]);

  const handleRedirect = () => {
    navigate("/queries/add");
  };

  const handleOpen = (query) => {
    setOpen(!open);
    setOpenQuery({ ...query });
  };

  const handleChat = async (e, query) => {
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
          sx={{ backgroundColor: "buttcolor.main" }}
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
          border: "2px solid",
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
              style={{ margin: "5px", border: "2px solid", minWidth: "400px" }}
            >
              <Typography variant="h5">{query.querytitle}</Typography>
              <p>{query.category}</p>
              <p>{query.description}</p>
              <Button
                variant="contained"
                sx={{ backgroundColor: "buttcolor.main", margin: "5px" }}
                onClick={() => handleOpen(query)}
              >
                {open ? "Close" : "chat"}
              </Button>
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
                  <form onSubmit={(e) => handleChat(e, query)}>
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
    </div>
  );
};

export default QueriesPage;
