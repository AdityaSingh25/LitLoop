import { Link } from "react-router-dom";
import { LabelledInput } from "./LabelledInput";

export const Auth = () => {
  return (
    <div className="flex flex-col justify-center h-screen">
      <div className="flex justify-center border">
        <div className="flex flex-col">
          <div className="text-4xl font-bold">Create an account</div>
          <div className="text-slate-400">
            Already have an account?
            <Link className="pl-2 underline" to={"/signin"}>
              Login
            </Link>
          </div>
          <div className="mt-3">
            <LabelledInput label="Username" placeholder="Enter your username" />
          </div>
          <div className="mt-3">
            <LabelledInput label="Email" placeholder="cosmo@example.com" />
          </div>
          <div className="mt-3">
            <LabelledInput label="Password" placeholder="Enter password" />
          </div>
        </div>
      </div>
    </div>
  );
};
