import React, { Component,useState, useRef, useCallback, useEffect, Fragment } from 'react'
import { Row, Col, Modal, Button, FormGroup, OverlayTrigger, Tooltip } from 'react-bootstrap';
import Select from 'react-select'
import AxiosACT from '../shared/AxiosACT';
import { Formik, Field, Form } from "formik";
import * as Yup from "yup";
import DatePicker from "react-datepicker";
import Swal from 'sweetalert2';
import moment from 'moment';


const validateForm = Yup.object().shape({
  companyName: Yup.string().required("Please enter company name"),
  address: Yup.string().required("Please enter address"),
  email: Yup.string().required("Please enter email"), 
  mobile: Yup.string().required("Please enter mobile"),
  website: Yup.string().required("Please enter website"),
});


const EditContact = (props) => {


  const initialValues = {
    companyName: props.rowData.companyName,
    address: props.rowData.address,
    email: props.rowData.email,
    mobile: props.rowData.mobile,
    website: props.rowData.website 
  };
  

  
  const [contactList, setContactList] = useState([]);

  const handleSubmit = (values) => {
      const postData = {
        "companyName": values.companyName,
        "address": values.address,
        "email": values.email,
        "mobile": values.mobile,
        "website": values.website
      }
      AxiosACT({
        method: "PUT",
        url: `/activity-management/updatecontact/${props.rowData.id}`,
        data: JSON.stringify(postData),
        headers: {
          "Content-Type": "application/json"
        }
      })
        .then(res => {
          
          Swal.fire({
            title: 'Thank You',
            text: "Contact update is successful",
            icon: 'success',
          }).then(() => {props.modalSubmit()});
        })
        .catch(err => {
          console.log("Err", err);
          let errorMsg = "Somethhing went wrong, please try again."
          if (err.data.errorMsg) {
            errorMsg = err.data.errorMsg;
          }
          Swal.fire({
            title: 'Oops!',
            text: errorMsg,
            icon: 'error',
          })
        });

  }

  useEffect(() => {
    
  },[])


    return (
      <div>
        
          <Formik
            initialValues={initialValues}
            validationSchema={validateForm}
            onSubmit={handleSubmit}
          >
            {({ values, errors, setFieldValue, setFieldError, touched, isValid, handleSubmit, submitForm }) => {
             console.log("values ==== ", values)
             return (
                <Form >                  
                  <div className="form-group">
                    <label><b>Company Name</b></label>
                    <Field
                      name="companyName"
                      type="text"
                      className={`form-control ${touched.companyName && errors.companyName ? "is-invalid" : ""}`}
                      placeholder="Company Name"
                      onChange={event => {
                        setFieldValue("companyName", event.target.value);
                      }}
                    />
                    {touched.companyName && errors.companyName && (<p className="error">{errors.companyName}</p>)}
                  </div>
                  <div className="form-group">
                  <label><b>Address</b></label>
                    <Field
                      name="address"
                      type="text"
                      className={`form-control ${touched.address && errors.address ? "is-invalid" : ""}`}
                      placeholder="Address"
                      onChange={event => {
                        setFieldValue("address", event.target.value);
                      }}
                    />
                    {touched.address && errors.address && (<p className="error">{errors.address}</p>)}
                  </div>
                  <div className="form-group">
                  <label><b>Email</b></label>
                    <Field
                      name="email"
                      type="text"
                      className={`form-control ${touched.email && errors.email ? "is-invalid" : ""}`}
                      placeholder="Email"
                      onChange={event => {
                        setFieldValue("email", event.target.value);
                      }}
                    />
                    {touched.email && errors.email && (<p className="error">{errors.email}</p>)}
                  </div>
                  <div className="form-group">
                  <label><b>Mobile</b></label>
                    <Field
                      name="mobile"
                      type="text"
                      className={`form-control ${touched.mobile && errors.mobile ? "is-invalid" : ""}`}
                      placeholder="Mobile"
                      onChange={event => {
                        setFieldValue("mobile", event.target.value);
                      }}
                    />
                    {touched.mobile && errors.mobile && (<p className="error">{errors.mobile}</p>)}
                  </div>
                  <div className="form-group">
                  <label><b>Website</b></label>
                    <Field
                      name="website"
                      type="text"
                      className={`form-control ${touched.website && errors.website ? "is-invalid" : ""}`}
                      placeholder="Website"
                      onChange={event => {
                        setFieldValue("website", event.target.value);
                      }}
                    />
                    {touched.website && errors.website && (<p className="error">{errors.website}</p>)}
                  </div>
                  
                  <button type="submit"  className="btn btn-primary">Update Contact</button>
                </Form>
              )
            }
            }
          </Formik>

               
      </div>
    )

}

export default EditContact
