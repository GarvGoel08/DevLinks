import Image from "next/image";
import NavBar from "./components/NavBar";
import Form from "./components/SignupForm";

export default function Home() {
  return (
    <div className="flex bg-[#FAFAFA] flex-col items-center min-h-screen">
      <NavBar />
      <div className="flex flex-col justify-center grow items-center">
        <Form/>
      </div>
    </div>
  );
}
