import * as React from "react";
import { Input } from "@mui/base/Input";
import { Button } from "@mui/base/Button";

export default function CustomNumberInput({ value, onChange, max }) {
  const handleIncrement = () => {
    onChange(Number(value) + 1);
  };

  const handleDecrement = () => {
    if (Number(value) > 1) {
      onChange(Number(value) - 1);
    }
  };

  return (
    <div style={{ display: "flex", alignItems: "center", gap: "4px" }}>
      <Button onClick={handleDecrement}>−</Button>
      <Input
        type="number"
        value={value}
        onChange={onChange}
        slotProps={{
          input: {
            min: 1,
            max: max,
            readOnly: true,
            style: {
              width: "60px",
              textAlign: "center",
              border: "1px solid gray",
              borderRadius: "4px",
              padding: "4px",
            },
          },
        }}
      />
      <Button onClick={handleIncrement}>+</Button>
    </div>
  );
}
