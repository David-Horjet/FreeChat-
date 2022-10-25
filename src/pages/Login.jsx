import React, { useState, useEffect, useContext } from "react";
import styled from "styled-components";
import { Link, useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Context } from "../context/Context";
import axios from "axios";
import { loginRoute } from "../utils/APIRoutes";
import { DiSenchatouch } from "react-icons/di";

function Login() {
  const navigate = useNavigate();
  const [values, setValues] = useState({
    username: "",
    password: "",
  });
  const { dispatch, isFetching } = useContext(Context);
  const toastOptions = {
    position: "top-right",
    autoClose: "8000",
    pauseOnHover: true,
    draggable: true,
    theme: "light",
  };

  useEffect(() => {
    document.title = "Login - FreeChat"
  })

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      if (handleValidation()) {
        dispatch({ type: "LOGIN_START" });
        const { password, username } = values;
        const res = await axios.post(loginRoute, {
          username,
          password,
        });
        if (res.data.status === false) {
          toast.error(res.data.msg, toastOptions);
          isFetching(false);
        }
        if (res.data.status === true) {
          dispatch({ type: "LOGIN_SUCCESS", payload: res.data.user });
          localStorage.setItem("token", JSON.stringify(res.data.token));
          navigate("/");
        }
      }
    } catch (error) {
      dispatch({ type: "LOGIN_FAILURE" });
    }
  };

  const handleValidation = () => {
    const { password, username } = values;
    if (username === "") {
      toast.error("Username is required", toastOptions);
      isFetching(false);
      return false;
    } else if (password === "") {
      toast.error("Passord is required", toastOptions);
      isFetching(false);
      return false;
    }
    return true;
  };

  const handleChange = (event) => {
    setValues({ ...values, [event.target.name]: event.target.value });
  };

  return (
    <>
      <FormContainer>
        <form onSubmit={(event) => handleSubmit(event)}>
          <div className="logo">
            <DiSenchatouch />
            <h1>
              Free<span>Chat</span>
            </h1>
          </div>
          <input
            type="text"
            placeholder="Username"
            name="username"
            onChange={(e) => handleChange(e)}
          />
          <input
            type="password"
            placeholder="Password"
            name="password"
            onChange={(e) => handleChange(e)}
          />
          <button type="submit" disabled={isFetching}>Log in</button>
          <span>
            Don't have an account ? <Link to={"/register"}>Register</Link>
          </span>
        </form>
      </FormContainer>
      <ToastContainer />
    </>
  );
}

const FormContainer = styled.div`
  height: 100vh;
  width: 100vw;
  display: flex;
  flex-direction: column;
  gap: 1rem;
  align-items: center;
  background-color: var(--faded-primary-color);
  justify-content: center;
  .logo {
    display: flex;
    align-items: center;
    justify-content: center;
    svg {
      color: var(--color);
      font-size: 25px;
    }
    h1 {
      color: var(--secondary-color);
      font-size: 25px;
      span {
        color: var(--color);
      }
    }
  }
  form {
    display: flex;
    flex-direction: column;
    gap: 1.5rem;
    background: var(--primary-color);
    border-radius: 10px;
    padding: 2rem 3rem;
    input {
      background: var(--faded-primary-color);
      padding: 0.6rem;
      border: 0.1rem solid #d9d8d8;
      border-radius: 0.4rem;
      color: var(--secondary-color);
      width: 100%;
      font-size: 1rem;
    }
    &:focus {
      border: none;
    }
    button {
      background: var(--gradient);
      color: white;
      padding: 1rem 1.5rem;
      border: none;
      font-weight: bold;
      cursor: pointer;
      border-radius: 0.4rem;
      font-size: 1rem;
      text-transform: uppercase;
      transition: 0.5s ease-in-out;
      &:hover {
        background-color: #4e0eff;
      }
      &:disabled {
        cursor: not-allowed;
        background-color: #946dff;
      }
    }
    span {
      color: var(--secondary-color);
      a {
        color: #4e0eff;
        text-transform: none;
        font-weight: bold;
        text-transform: uppercase;
        text-decoration: none;
      }
    }
  }
`;

export default Login;
