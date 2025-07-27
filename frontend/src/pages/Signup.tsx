import React from "react";
import { Quote } from "../components/Quote";

export const Signup: React.FC = () => {
  return (
    <div className="grid grid-cols-2">
      <div>Signup form</div>
      <Quote />
    </div>
  );
};
