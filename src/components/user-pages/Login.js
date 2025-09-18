import React, { useEffect, useState } from 'react';
import { Link, Redirect, useHistory } from 'react-router-dom';
import { Form } from 'react-bootstrap';
import { Formik, Field } from 'formik';
import * as Yup from "yup";
import AxiosUser from "../shared/AxiosUser";
import Swal from 'sweetalert2';
import axios from 'axios';

const initialValues = {
  email: "",
  password: ""
};
const validateForm = Yup.object().shape({
  email: Yup.string().email().required("Please enter valid email address"),
  password: Yup.string().required("Please enter password")
});

export default function Login() {

  const [ip, setIp] = useState([]);

  const history = useHistory();

  const handleSubmit = (values) => {
    const postData = {
      "email": values.email,
      "password": values.password,
      "ipaddress": "10.252.252.10"
    }
    AxiosUser({
      method: "POST",
      url: `/user-management/adminlogin`,
      data: JSON.stringify(postData),
      headers: {
        "Content-Type": "application/json"
      }
    })
      .then(res => {
        if(res.data.userid){
          sessionStorage.setItem("userToken", res.data.sessionId);
          sessionStorage.setItem("userId", res.data.userid);
          sessionStorage.setItem("user",JSON.stringify(res.data));
           history.push("/dashboard");
         // window.location.reload(true)
        } else {
          Swal.fire({
            title: 'Oops!',
            text: 'Invalid login, please try again.',
            icon: 'error',
          })
        }
      })
      .catch(err => {
        console.log("Err");
        Swal.fire({
          title: 'Oops!',
          text: 'Invalid login, please try again.',
          icon: 'error',
        })
      });
  }

  const getData = () => {
    const res = axios.get("https://api.ipify.org/?format=json").then(res => {
      setIp(res.data.ip);
    });
    
  };

  useEffect(()=>{
   // getData()
    const userToken = sessionStorage.getItem("userToken");
    console.log("userToken", userToken);
    if(userToken){
       history.push("/dashboard");
    }

  },[])

  return (
    <>
    <div className="login-body-admin">
      <div className="d-flex align-items-center auth px-0">
        <div className="row w-100 mx-0">

            <div className="col-lg-4 mx-auto">
              <div className="card text-left py-5 px-5 px-sm-5">
                <div className="brand-logo text-center">
                  <img src={require("../../assets/images/logo.png")} alt="logo" />
                </div>
                  <Formik
                    initialValues={initialValues}
                    validationSchema={validateForm}
                    onSubmit={handleSubmit}
                  >
                    {({ values, errors, setFieldValue, setFieldError, touched, isValid, handleSubmit, submitForm }) => {
                      return (
                        <Form>
                          <h4 className="text-center">Hello! let's get started</h4>
                          <h6 class="font-weight-light text-center">Sign in to continue.</h6>
                          <div className="search-field form-group">
                            <Field
                              name="email"
                              type="text"
                              className={`h-auto form-control form-control-lg ${touched.email && errors.email ? "is-invalid" : ""}`}
                              placeholder="Email Address"
                              onChange={event => {
                                setFieldValue("email", event.target.value);
                              }}
                            />
                            {touched.email && errors.email && (<p className="error">{errors.email}</p>)}
                          </div>
                          <div className="search-field form-group">
                            <Field
                              name="password"
                              type="password"
                              className={`h-auto form-control form-control-lg ${touched.password && errors.password ? "is-invalid" : ""}`}
                              placeholder="Password"
                              onChange={event => {
                                setFieldValue("password", event.target.value);
                              }}
                            />
                            {touched.password && errors.password && (<p className="error">{errors.password}</p>)}
                          </div>
                          
                          <div className="custom-control custom-checkbox">
                            <input
                              type="checkbox"
                              className="custom-control-input"
                              id="form-checkbox"
                            />
                            <label className="custom-control-label" htmlFor="form-checkbox">
                              Remember me
                            </label>
                          </div>
                          <button type="submit" onClick={(event) => {
                            event.preventDefault();
                            handleSubmit();
                          }} className="btn btn-block btn-primary btn-lg font-weight-medium auth-form-btn mt-3">Sign In</button>
                        </Form>
                      )
                    }
                    }
                  </Formik>
                  
              </div>
            </div>

        </div>
      </div>
      </div>
    </>
  );
}
