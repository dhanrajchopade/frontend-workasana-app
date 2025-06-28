import { useState } from "react";
import { useNavigate } from "react-router-dom";

const LoginPage = ()=>{
const navigate = useNavigate();
const [email, setEmail] = useState("")
const [secret, setSecret] = useState("")

const handleLogin = async()=>{

  const response = await fetch("https://carbon-taskmanager-backend.vercel.app/auth/login",{
        method:"POST",
        headers:{
            "Content-Type":"application/json",
        },
        body: JSON.stringify({email, password: secret})
    });
    const data = await response.json()
 
    localStorage.setItem("adminToken", data.token)
 navigate("/dashboard");
}
return(
    <>
    <div className="container py-3">
<div className="text-center">
<h2>Workasana</h2>

<h1>Log in to your account</h1>
<p>Please enter your details.</p>

<div className="d-flex align-items-center mb-3">
  <label className="me-2 mb-0">Email</label>
<input className="form-control" type="email" id="emailInput" value={email} placeholder="Enter your email" onChange={(e)=>setEmail(e.target.value)} /></div> <br />

<div className="d-flex align-items-center mb-3">
  <label className="me-2 mb-0">Password</label>
<input className="form-control" type="password" id="passwordInput" value={secret} placeholder="Password" onChange={(e)=>setSecret(e.target.value)} /> 
</div>

 <br />
<div className=" py-2">
    <button onClick={handleLogin} className="btn btn-primary">Login</button></div>
</div>
    </div>              
    </>
)
}
export default LoginPage