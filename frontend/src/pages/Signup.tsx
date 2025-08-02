import React from "react";
import { Quote } from "../components/Quote";
import { Auth } from "../components/Auth";

export const Signup: React.FC = () => {
  return (
    <div className="grid grid-cols-2">
      <div>
        <Auth />
      </div>
      <div className="invisible md:visible">
        <Quote />
      </div>
    </div>
  );
};
