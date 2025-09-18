import React, { Component,useState, useRef, useCallback, useEffect, Fragment } from 'react'
import { Row, Col, Modal, Button, FormGroup, OverlayTrigger, Tooltip } from 'react-bootstrap';
import Select from 'react-select'
import AxiosMaster from '../shared/AxiosMaster';
import AxiosUser from "../shared/AxiosUser";
import { Formik, Field, Form } from "formik";
import * as Yup from "yup";
import DatePicker from "react-datepicker";
import Loader from '../shared/Loader'
import Swal from 'sweetalert2';


const initialValues = {
  subscriptionId: "",
  isActive: ""
};
const validateForm = Yup.object().shape({
  subscriptionId: Yup.string().required("This field is required"),
  isActive: Yup.string().required("This field is required")
});


const CreateUserSubscription = (props) => {

  const [userList, setUserList] = useState([]);
  const [subscriptionList, setSubscriptionList] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleSubmit = (values) => {
    setLoading(true)
      const postData = {
        "subscriptionId": values.subscriptionId,        
        "userId": props.ID,
        "isActive": values.isActive
      }
      AxiosUser({
        method: "POST",
        url: `user-management/user-subscription/create`,
        data: JSON.stringify(postData),
        headers: {
          "Content-Type": "application/json"
        }
      })
        .then(res => {
          setLoading(false)
          Swal.fire({
            title: 'Thank You',
            text: "Subscription Plan Assigned Successfully.",
            icon: 'success',
          }).then((isConfirm)=> {
            if(isConfirm.value){
              props.userModalSubmit()
            }         
          });
        })
        .catch(err => {
          setLoading(false)
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

  const getSubscriptionList = () => {

    AxiosMaster({
      method: "GET",
      url: `masterdata-management/subscription/list`,    
    })
      .then(res => {
        setSubscriptionList(res.data.subscriptionList)
      })
      .catch(err => {
        setSubscriptionList([])
      });
  }

  useEffect(() => {
    getSubscriptionList()
  },[])


    return (
      <div>
        <div className="row">
          <div className="col-lg-12 grid-margin stretch-card">
            <div className="card">
              <div className="card-body">
                <div className="table-responsive">

                <Formik
                  initialValues={initialValues}
                  validationSchema={validateForm}
                  onSubmit={handleSubmit}
                >
                  {({ values, errors, setFieldValue, setFieldError, touched, isValid, handleSubmit, submitForm }) => {
                    return (
                      <Form >

                        <div className="form-group">
                        <label><b>Select Subscription Plan</b></label>
                          <Field
                            name="subscriptionId"
                            component="select"
                            className={`form-control ${touched.subscriptionId && errors.subscriptionId ? "is-invalid" : ""}`}
                            autoComplete="off"      
                            onChange={event => {
                              setFieldValue("subscriptionId", event.target.value);
                            }}
                          >
                                <option value="" >Please Select</option>
                             {subscriptionList && subscriptionList.length > 0 ? subscriptionList.map((title, qIndex) => ( 
                                <option value={title.id} key = {qIndex}>{title.name}</option>
                                )) : null} 
                            {touched.subscriptionId && errors.subscriptionId && (<p className="error">{errors.subscriptionId}</p>)}
                          </Field>   
                        </div>
                        <div className="form-group">
                        <label><b>Status</b></label>
                          <Field
                            name="isActive"
                            component="select"
                            className={`form-control ${touched.isActive && errors.isActive ? "is-invalid" : ""}`}
                            autoComplete="off"      
                            onChange={event => {
                              setFieldValue("isActive", event.target.value);
                            }}
                          >
                                <option value="" >Please Select</option>
                                <option value="Y" >ACTIVE</option>
                                <option value="N" >IN-ACTIVE</option>
                               
                            {touched.isActive && errors.isActive && (<p className="error">{errors.isActive}</p>)}
                          </Field>   
                        </div>
                       
                        <button type="submit" onClick={(event) => {
                          event.preventDefault();
                          handleSubmit();
                        }} className="btn btn-primary">Create Subscription</button>
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
      </div>
    )

}

export default CreateUserSubscription
