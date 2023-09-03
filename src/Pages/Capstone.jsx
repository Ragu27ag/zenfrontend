import React, { useCallback, useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";

import WebcodeCapstone from "../Components/WebcodeCapstone";
import backendInstance from "../Axios/axios";

const Capstone = () => {
  const User = useMemo(
    () => JSON.parse(sessionStorage.getItem("user")) || {},
    []
  );
  const [data, setdata] = useState([]);
  const [result, setResult] = useState([]);

  const getData = useCallback(async () => {
    const types = {
      type: "capstone",
    };
    const res = await backendInstance.get("/webcodecapstone/capstone");
    const resultData = await backendInstance.post(
      `/webcapsubmit/${User.email}`,
      types
    );
    setdata(res.data);
    setResult(resultData.data);
  }, [setdata, User.email]);

  console.log(result);

  const navigate = useNavigate();

  useEffect(() => {
    if (Object.keys(User).length === 0) {
      navigate("/login");
    } else {
      getData();
    }
  }, [User, navigate, getData]);

  const handleClose = () => {
    getData();
  };
  return (
    <WebcodeCapstone
      data={data || []}
      User={User}
      result={result || []}
      handleClose={handleClose}
    />
  );
};
export default Capstone;
