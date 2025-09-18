import React, { Component,useState, useRef, useCallback, useEffect } from 'react'
import AxiosSubscription from '../shared/AxiosSubscription';
import imagePencil from '../../assets/images/pencil-square.svg';
import deleteIcon from '../../assets/images/delete.svg';
import Swal from 'sweetalert2';
import { Row, Col, Modal, Button, FormGroup } from 'react-bootstrap';
import {BootstrapTable, TableHeaderColumn} from 'react-bootstrap-table';
import { Formik, Field, Form } from "formik";
import * as Yup from "yup";
import { Link } from 'react-router-dom';
import { useHistory } from 'react-router-dom';
import moment from 'moment';


const validateForm = Yup.object().shape({

  isActive: Yup.string().required("This field is required"),
  isCustom: Yup.string().required("This field is required")
});

const initialValues = {
  isActive : "",
  isCustom : ""
}

const SubscriptionList = () => {

  const [subscriptionList, setSubscriptionList] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [rowData, setRowData] = useState([]);

  const [sortName, setSortName] = useState(undefined);
  const [sortOrder, setSortOrder] = useState(undefined);

  const history = useHistory();

  
  function onSortChange(sortName, sortOrder) {
    console.info('onSortChange', arguments);
    setSortName(sortName);
    setSortOrder(sortOrder);
  }

  useEffect(() => {
    handleSubmit("")
  },[])



  const handleSubmit = (values) => {
    let url = ""
    if(values){
      if(values.isCustom != "" && values.isActive != ""){
        url = `masterdata-management/subscription/list?isCustom=${values.isCustom}&isActive=${values.isActive}`
      }
      else if(values.isActive != ""){
        url = `masterdata-management/subscription/list?isActive=${values.isActive}`
      }
      else url = `masterdata-management/subscription/list?isCustom=${values.isCustom}`
    }
    else url = `masterdata-management/subscription/list`

    AxiosSubscription({
      method: "GET",
      url: url,
      headers: {
        "Content-Type": "application/json"
      }
    })
      .then(res => {
        setSubscriptionList(res.data.subscriptionList);
      })
      .catch(err => {
        console.log("Err", err);
      });
  }

  

  const editSubscription = (item) => {
    setRowData(item)
    setShowModal(true)
  }

    

  const handleClose = (e) => {
    setShowModal(false)
    }

  

    const actionFormatter = (cell, row) => {
      return (
        <div>          
          <i className="bi bi-pencil-square">
            <img src={imagePencil} onClick={(e) => { history.push(`editsubscription/${row.id}`) }} />
          </i>
        </div>
      );
    };

  const statusFormatter = (cell,row) => {
    return (<label className= {row.isActive == "Y" ? "badge badge-success" : "badge badge-danger"}>{row.isActive == "Y" ? "Active" : "Inactive"}</label>)
  }

  const indexN = (cell,row,enumObject, index) => {
    return  (<div>{index+1}</div>);
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
              <li className="breadcrumb-item"><a href="!#" onClick={event => event.preventDefault()}>Subscriptions</a></li>
              <li className="breadcrumb-item active" aria-current="page"><h3 className="page-title"> Subscription List </h3></li>
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
                      <div class="col-xs-12 col-sm-12 col-md-4 col-lg-4">
                      <div className="form-group">                        
                          <Field
                            name="isCustom"
                            component="select"
                            className={`form-control ${touched.company_name && errors.company_name ? "is-invalid" : ""}`}
                            autoComplete="off"      
                            onChange={event => {
                              setFieldValue("isCustom", event.target.value);
                            }}
                          >    
                            <option value= "" >Is Custom</option>
                            <option value= "Y" >Yes</option>
                            <option value= "N" >No</option>
                            {touched.isCustom && errors.isCustom && (<p className="error">{errors.isCustom}</p>)}
                          </Field>   
                        </div>

                      </div>
                      <div class="col-xs-12 col-sm-12 col-md-4 col-lg-4">
                      <div className="form-group">                        
                          <Field
                            name="isActive"
                            component="select"
                            className={`form-control ${touched.company_name && errors.company_name ? "is-invalid" : ""}`}
                            autoComplete="off"      
                            onChange={event => {
                              setFieldValue("isActive", event.target.value);
                            }}
                          >    
                            <option value= "" >Status</option>
                            <option value= "Y" >Active</option>
                            <option value= "N" >Inactive</option>
                            {touched.isActive && errors.isActive && (<p className="error">{errors.isActive}</p>)}
                          </Field>   
                        </div>

                      </div>
                      <div class="col-xs-12 col-sm-12 col-md-3 col-lg-3"><button type="submit"  className="btn btn-primary">Search</button></div>

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
               
                
                <div >
                <BootstrapTable  data={subscriptionList} striped hover 
                    pagination={ true } search
                    options={ options }
                >
                    <TableHeaderColumn width='70' isKey dataField='id' dataFormat={ indexN }>Sl No</TableHeaderColumn>
                    <TableHeaderColumn width='150' dataField='name' dataSort={ true }>Name</TableHeaderColumn>
                    <TableHeaderColumn width='150' dataField='description' dataSort={ true }>Description</TableHeaderColumn>
                    <TableHeaderColumn width='300' dataField='price' dataSort={ true }>Price</TableHeaderColumn>
                    <TableHeaderColumn width='150' dataField='validityInDay' dataSort={ true }>Validity</TableHeaderColumn>
                    <TableHeaderColumn width='150' dataField='isActive' dataFormat={ statusFormatter } dataSort={ true }>Status</TableHeaderColumn>
                    <TableHeaderColumn width='150' dataField=''  dataFormat={ actionFormatter }>Action</TableHeaderColumn>
                </BootstrapTable>

                 
                </div>
              </div>
            </div>
          </div>     
        </div>
      </div>
    )

}

export default SubscriptionList
