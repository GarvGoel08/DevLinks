import Image from "next/image";
import NavBar from "../components/NavBar";
import Form from "../components/LoginForm";

export default function Login() {
  return (
    <div className="flex bg-[#FAFAFA] flex-col items-center min-h-screen">
      <NavBar />
      <div className="flex flex-col justify-center grow items-center">
        <Form/>
      </div>
    </div>
  );
}
