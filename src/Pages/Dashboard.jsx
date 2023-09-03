import React from "react";
import BarComponent from "../Components/BarComponent";
import PieComponent from "../Components/PieComponent";
import DoughnutComponent from "../Components/DoughnutComponent";
import MockGraph from "../Components/MockGraph";

const Dashboard = () => {
  return (
    <>
      {" "}
      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          justifyContent: "space-around",
        }}
      >
        <BarComponent />
        <PieComponent />;
      </div>
      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          justifyContent: "space-around",
        }}
      >
        <DoughnutComponent />
        <MockGraph />
      </div>
    </>
  );
};

export default Dashboard;
