import React, { useCallback, useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";

import WebcodeCapstone from "../Components/WebcodeCapstone";
import backendInstance from "../Axios/axios";

const Webcode = () => {
  const User = useMemo(
    () => JSON.parse(sessionStorage.getItem("user")) || {},
    []
  );
  const [data, setdata] = useState([]);
  const [result, setResult] = useState([]);

  const getData = useCallback(async () => {
    const types = {
      type: "webcode",
    };
    const res = await backendInstance.get("/webcodecapstone/webcode");
    const resultData = await backendInstance.post(
      `/webcapsubmit/${User.email}`,
      types
    );
    setdata(res.data);
    setResult(resultData.data);
  }, [setdata, setResult]);

  const getAdminData = useCallback(async () => {
    const res = await backendInstance.get("/webcapsubmit");
    setdata(res.data);
  }, [setdata]);

  console.log(result);

  const navigate = useNavigate();

  useEffect(() => {
    if (Object.keys(User).length === 0) {
      navigate("/login");
    } else {
      if (User.role === "student") {
        getData();
      } else {
        getAdminData();
      }
    }
  }, [User, navigate, getData, getAdminData]);
  return (
    <WebcodeCapstone data={data || []} User={User} result={result || []} />
  );
};

export default Webcode;

/*  const data = [
    {
      name: "ragu",
      batch: "20",
      title: "Ice and fire",
      marks: "",
    },
    { name: "agr", batch: "24", title: "stack overflow", marks: "" },
  ];*/
