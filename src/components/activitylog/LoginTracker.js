import React, { Component,useState, useRef, useCallback, useEffect } from 'react'
import AxiosUser from '../shared/AxiosUser';
import Swal from 'sweetalert2';
import { Row, Col, Modal, Button, FormGroup } from 'react-bootstrap';
import {BootstrapTable, TableHeaderColumn} from 'react-bootstrap-table';
import { Formik, Field, Form } from "formik";
import * as Yup from "yup";
import spinner from "../shared/Spinner"
import moment from 'moment';



const validateForm = Yup.object().shape({

  userId: Yup.string().required("This field is required"),
});

const initialValues = {
  userId : "",
}

const LoginTracker = () => {

  const [loginList, setLoginList] = useState([]);
  const [userList, setUserList] = useState([]);

  const [sortName, setSortName] = useState(undefined);
  const [sortOrder, setSortOrder] = useState(undefined);

  
  function onSortChange(sortName, sortOrder) {
    console.info('onSortChange', arguments);
    setSortName(sortName);
    setSortOrder(sortOrder);
  }

  useEffect(() => {
    getUsers();
    handleSubmit("");
  },[])



  const getUsers = () => {
    AxiosUser({
      method: "GET",
      url: `/user-management/user/list`
    })
      .then(res => {
        setUserList(res.data.userList);
      })
      .catch(err => {
        console.log("Err", err);
      });
  }

  const handleSubmit = (values) => {
    let url = ""
    if(values.userId){
      url = `user-management/user/loginlist?userId=${values.userId}`
    }
    else { 
      url = `user-management/user/loginlist`
    }

    AxiosUser({
      method: "GET",
      url: url,
      headers: {
        "Content-Type": "application/json"
      }
    })
      .then(res => {
        setLoginList(res.data.loginList);
      })
      .catch(err => {
        console.log("Err", err);
      });
  }

  const indexN = (cell,row,enumObject, index) => {
    return  (<div>{index+1}</div>);
  }

  const dateFormatter = (cell,row) => {
    return cell ? moment(cell).format("MMM. DD,  YYYY HH:mm") : null
  }
  
  const options = {
    sortName: sortName,
    sortOrder: sortOrder,
    onSortChange: onSortChange
  };
  


    return (
      <div>
        <div className="page-header">
          <nav aria-label="breadcrumb">
            <ol className="breadcrumb">
              <li className="breadcrumb-item"><a href="!#" onClick={event => event.preventDefault()}>Activity Log</a></li>
              <li className="breadcrumb-item active" aria-current="page"> <h3 className="page-title"> Login Tracker </h3></li>
            </ol>
          </nav>
          <Formik
                  initialValues={initialValues}
                  // validationSchema={validateForm}
                  onSubmit={handleSubmit}
                >
                  {({ values, errors, setFieldValue, setFieldError, touched, isValid, handleSubmit, submitForm }) => {
  
                    return (

                      <Form >
                  <div class="row justify-content-end">

                      <div class="col-xs-12 col-sm-12 col-md-5 col-lg-5">
                      <div className="form-group">                        
                          <Field
                            name="userId"
                            component="select"
                            className={`form-control ${touched.company_name && errors.company_name ? "is-invalid" : ""}`}
                            autoComplete="off"      
                            onChange={event => {
                              setFieldValue("userId", event.target.value);
                            }}
                          >    
                            <option value= "" >Please Select User ID</option>
                            {userList && userList.length > 0 ? userList.map((title, qIndex) => ( 
                              <option key = {qIndex} value= {title.id} >{title.firstname + "  "+ title.lastname + " ( "+ title.email + " )"}</option>
                              )) : null}


                            {touched.userId && errors.userId && (<p className="error">{errors.userId}</p>)}
                          </Field>   
                        </div>

                      </div>
                      
                      <div class="col-xs-12 col-sm-12 col-md-2 col-lg-2"><button type="submit"  className="btn btn-primary">FILTER</button></div>

</div>        
                        
                      </Form>
                      
                    )
                  }
                  }
                </Formik>
        </div>
        <div className="row">
          <div className="col-lg-12 grid-margin stretch-card">
            <div className="card">            
              <div className="card-body">                
                <div>
                <BootstrapTable  data={loginList} striped hover 
                    pagination={ true } search
                    options={ options }
                >
                    <TableHeaderColumn width='50' isKey dataField='id' dataFormat={ indexN }>Sl No</TableHeaderColumn>
                    <TableHeaderColumn width='150' dataField='name'  dataSort={ true }>Name</TableHeaderColumn>
                    <TableHeaderColumn width='175' dataField='email' dataSort={ true }>Email</TableHeaderColumn>
                    <TableHeaderColumn width='150' dataField='ipAddress' dataSort={ true }>IP Address</TableHeaderColumn>
                    <TableHeaderColumn width='200' dataField='sessionId' dataSort={ true }>Session ID</TableHeaderColumn>
                    <TableHeaderColumn width='150' dataField='loginTime'  dataFormat={ dateFormatter } dataSort={ true }>Login Time</TableHeaderColumn>
                    <TableHeaderColumn width='150' dataField='logoutTime'  dataFormat={ dateFormatter } dataSort={ true }>Logout Time</TableHeaderColumn>
                </BootstrapTable>
                 
                </div>
              </div>
            </div>
          </div>              
        </div>
      </div>
    )

}

export default LoginTracker
