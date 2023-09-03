import React from "react";
import BarComponent from "../Components/BarComponent";
import PieComponent from "../Components/PieComponent";
import DoughnutComponent from "../Components/DoughnutComponent";

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
      <div>
        <DoughnutComponent />
      </div>
    </>
  );
};

export default Dashboard;
