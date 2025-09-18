import React, { Component,useState, useRef, useCallback, useEffect, Fragment } from 'react'
import { Row, Col, Modal, Button, FormGroup, OverlayTrigger, Tooltip } from 'react-bootstrap';
import Select from 'react-select'
import AxiosMaster from '../shared/AxiosMaster';
import { Formik, Field, Form } from "formik";
import * as Yup from "yup";
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import Swal from 'sweetalert2';

const SubscriptionValidation = Yup.object().shape({
})

const newInitialValues = {
  name : "",
  description: "",
  price: 0,
  validityDay : 0,
  isCustom: "0",
  isActive: "",
  countryId : "",
  continentId: "",
  DATA_ACCCESS: "",
  ALLOWED_CHAPTER: "",
  DOWNLOAD_LIMIT : "",
  MAX_DOWNLOAD_DAY: "",
  WORKSPACE: "",
  SUPPORT: "",
  TICKET_MANAGER : "",
  RECORD_PER_WORKSPACE: "",
  SUB_USER: "",
  DISPLAY_FIELDS: "",
  QUERY_PER_DAY : "",

}


const Users = () => {

  const [userList, setUserList] = useState([]);
  const [selectedOptionCountry, setSelectedOptionCountry] = useState([]);
  const [selectedOptionContinent, setSelectedOptionContinent] = useState([]);
  const [tradeCountryList, setTradeCountryList] = useState([]);

  const changePlaceHoldClassAdd = (e) =>{
      let element = e.target.parentElement;
      element.classList.add('active');
  }

  const changePlaceHoldClassRemove = (e) => {
      let element = e.target.parentElement;
      e.target.value.length === 0 && element.classList.remove('active');
  }

  const setCountryArray = (value,setFieldValue) => {
    if(!selectedOptionCountry.includes(value)){
      selectedOptionCountry.push(value)
      setFieldValue('countryId',selectedOptionCountry)
    }
    else alert("Country already added")
  }

  const setContinentArray = (value,setFieldValue) => {
    if(!selectedOptionContinent.includes(value)){
      selectedOptionContinent.push(value)
      setFieldValue('continentId',selectedOptionContinent)
    }
    else alert("Continent already added")
  }
  
  const createSubscription = (values, actions) => {

    const postData = {
      "name": values.name,
      "description": values.description,
      "price": values.price,
      "validityDay": values.validityDay,
      "isCustom": values.isCustom,
      "isActive": values.isActive,
      "countryId": values.countryId,
      "continentId": [],
      "otherAttributes": {
        "DATA_ACCCESS": {
          "keyFullName": values.DATA_ACCCESS_keyFullName,
          "keyDesc": values.DATA_ACCCESS_keyDesc,
          "keyValue": values.DATA_ACCCESS,
          "valueDesc": values.DATA_ACCCESS_valueDesc
        },
        "ALLOWED_CHAPTER": {
          "keyFullName": values.ALLOWED_CHAPTER_keyFullName,
          "keyDesc": values.ALLOWED_CHAPTER_keyDesc,
          "keyValue": values.ALLOWED_CHAPTER,
          "valueDesc": values.ALLOWED_CHAPTER_valueDesc
        },
        "DOWNLOAD_LIMIT": {
          "keyFullName": values.DOWNLOAD_LIMIT_keyFullName,
          "keyDesc": values.DOWNLOAD_LIMIT_keyDesc,
          "keyValue": values.DOWNLOAD_LIMIT,
          "valueDesc": values.DOWNLOAD_LIMIT_valueDesc
        },
        "MAX_DOWNLOAD_DAY": {
          "keyFullName": values.MAX_DOWNLOAD_DAY_keyFullName,
          "keyDesc": values.MAX_DOWNLOAD_DAY_keyDesc,
          "keyValue": values.MAX_DOWNLOAD_DAY,
          "valueDesc": values.MAX_DOWNLOAD_DAY_valueDesc
        },
        "WORKSPACE": {
          "keyFullName": values.WORKSPACE_keyFullName,
          "keyDesc": values.WORKSPACE_keyDesc,
          "keyValue": values.WORKSPACE,
          "valueDesc": values.WORKSPACE_valueDesc
        },
        "SUPPORT": {
          "keyFullName":values.SUPPORT_keyFullName,
          "keyDesc": values.SUPPORT_keyDesc,
          "keyValue": values.SUPPORT,
          "valueDesc": values.SUPPORT_valueDesc
        },
        "TICKET_MANAGER": {
          "keyFullName": values.TICKET_MANAGER_keyFullName,
          "keyDesc": values.TICKET_MANAGER_keyDesc,
          "keyValue": values.TICKET_MANAGER,
          "valueDesc": values.TICKET_MANAGER_valueDesc
        },
        "RECORD_PER_WORKSPACE": {
          "keyFullName": values.RECORD_PER_WORKSPACE_keyFullName,
          "keyDesc": values.RECORD_PER_WORKSPACE_keyDesc,
          "keyValue": values.RECORD_PER_WORKSPACE,
          "valueDesc": values.RECORD_PER_WORKSPACE_valueDesc
        },
        "SUB_USER": {
          "keyFullName": values.SUB_USER_keyFullName,
          "keyDesc": values.SUB_USER_keyDesc,
          "keyValue": values.SUB_USER,
          "valueDesc": values.SUB_USER_valueDesc
        },
        "DISPLAY_FIELDS": {
          "keyFullName": values.DISPLAY_FIELDS_keyFullName,
          "keyDesc": values.DISPLAY_FIELDS_keyDesc,
          "keyValue": values.DISPLAY_FIELDS,
          "valueDesc": values.DISPLAY_FIELDS_valueDesc
        },
        "QUERY_PER_DAY": {
          "keyFullName": values.QUERY_PER_DAY_keyFullName,
          "keyDesc": values.QUERY_PER_DAY_keyDesc,
          "keyValue": values.QUERY_PER_DAY,
          "valueDesc": values.QUERY_PER_DAY_valueDesc
        },
      }
    }

    AxiosMaster({
      method: "POST",
      url: `/masterdata-management/subscription`,
      data: JSON.stringify(postData),
      headers: {
        "Content-Type": "application/json"
      }
    })
      .then(res => {
        setUserList(res.data.userList);
        Swal.fire({
          title: 'Thank You',
          text: "Your registration is successful",
          icon: 'success',
        });
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

  const getTradingCountryList = (param) => {

    AxiosMaster({
      method: "GET",
      url: `masterdata-management/countrylistbytrade/${param}`,    
    })
      .then(res => {
        let countryList = [];
        if (res.data.countryList) {
          res.data.countryList.forEach((item) => {
            let specificItem = { "value": item.shortcode, "label": item.name };
            countryList.push(specificItem);
          })
        }
        setTradeCountryList(countryList);
      })
      .catch(err => {
        setTradeCountryList([])
      });
  }

  useEffect(() => {
    getTradingCountryList("I");
  },[])

  return (
    <div>
      <div className="page-header">
          <nav aria-label="breadcrumb">
            <ol className="breadcrumb">
              <li className="breadcrumb-item"><a href="!#" onClick={event => event.preventDefault()}>Subscription</a></li>
              <li className="breadcrumb-item active" aria-current="page"> <h3 className="page-title"> Create subscription </h3></li>
            </ol>
          </nav>        
      </div>
      <div className="row">
        <div className="col-lg-12 grid-margin stretch-card">

          <Formik 
                initialValues={newInitialValues} 
                onSubmit={createSubscription}
                // validationSchema={SubscriptionValidation}
                >
                {({ values, errors, setFieldValue, setFieldTouched, isValid, isSubmitting, touched }) => {

                return (
                <Form>
                  <div className="row">
                      <div className="col-lg-12 ">
                        <div className="card">
                          <div className="card-body">

                              <div className="form-group">
                                  <label >Name</label>       
                                    <Field
                                        name='name'
                                        type="text"
                                        placeholder='Name'
                                        autoComplete="off"
                                        onFocus={e => changePlaceHoldClassAdd(e)}
                                        onBlur={e => changePlaceHoldClassRemove(e)}
                                        value = {values.name}
                                        maxLength="10" 
                                        className={`form-control ${touched.firstname && errors.firstname ? "is-invalid" : ""}`}                                                                        
                                    />                  
                                </div>

                                <div className="form-group">
                                    <label>Description</label>        
                                      <Field
                                          name='description'
                                          type="text"
                                          placeholder='Description'
                                          autoComplete="off"
                                          onFocus={e => changePlaceHoldClassAdd(e)}
                                          onBlur={e => changePlaceHoldClassRemove(e)}
                                          value = {values.description}
                                          maxLength="10" 
                                          className={`form-control ${touched.firstname && errors.firstname ? "is-invalid" : ""}`}                                                                        
                                      />
                                </div>
                                    
                                <div className="form-group">
                                    <label>Price</label>      
                                      <Field
                                          name='price'
                                          type="number"
                                          placeholder='Price'
                                          autoComplete="off"
                                          onFocus={e => changePlaceHoldClassAdd(e)}
                                          onBlur={e => changePlaceHoldClassRemove(e)}
                                          value = {values.price}
                                          maxLength="10" 
                                          className={`form-control ${touched.firstname && errors.firstname ? "is-invalid" : ""}`}                                                                          
                                      />
                                </div>
                                  
                                <div className="form-group">
                                    <label>Validity Day</label>        
                                      <Field
                                          name='validityDay'
                                          type="number"
                                          placeholder='Validity Day'
                                          autoComplete="off"
                                          onFocus={e => changePlaceHoldClassAdd(e)}
                                          onBlur={e => changePlaceHoldClassRemove(e)}
                                          value = {values.validityDay}
                                          maxLength="10" 
                                          className={`form-control ${touched.firstname && errors.firstname ? "is-invalid" : ""}`}                                                                          
                                      />
                                  </div>

                                  <div className="form-group">
                                      <label>Country: &nbsp;</label>        
                                      <div >                   
                                          <FormGroup>
                                            <div className="formSection">      
                                                <Select
                                                    defaultValue={[]}
                                                    isMulti
                                                    name="countryId"
                                                    options={tradeCountryList}
                                                    className="dropdown bootstrap-select hero__form-input"
                                                    onChange={(selectedOption) => {
                                                      let itemList = [];
                                                      selectedOption.forEach((item)=>{
                                                        itemList.push(item.value);
                                                      });
                                                      setFieldValue("countryId", itemList);
                                                    }}
                                                    classNamePrefix="select"
                                                />  
                                              </div>
                                          </FormGroup>
                                      </div>
                                  </div>
                                  </div>
                                  </div>

                                  {/* <div className="form-group">
                                      <label>Continent: &nbsp;</label>        
                                      <div >
                                        {values.continentId && values.continentId.length > 0 ? values.continentId.map((item,index) => (
                                          <label>{ item} &nbsp;</label> 
                                        )) : null}
                                          <FormGroup>
                                            <div className="formSection">
                                        
                                                <Field
                                                  name='continentId'
                                                  component="select"
                                                  autoComplete="off"                                                                        
                                                  className={`form-control ${touched.firstname && errors.firstname ? "is-invalid" : ""}`}
                                                  onChange= {(e)=> {setContinentArray(e.target.value,setFieldValue)                                               
                                                  }}
                                                  
                                              >
                                                  {tradeCountryList && tradeCountryList.length > 0 ? tradeCountryList.map((title, qIndex) => ( 
                                                <option value={title.name} key = {qIndex}>{title.name}</option>
                                                )) : null} 
                                              </Field>                
                                              </div>
                                          </FormGroup>                                    
                                      </div>
                                  </div>                    */}
                      </div>
                  </div>

                  <div className="row">
                      <div className="col-lg-4 ">                     
                          <div className="card">
                              <div className="card-body">
                                  <div className="form-group">
                                      <label>DOWNLOAD LIMIT</label>        
                                      <div >
                                        <Field
                                            name='DOWNLOAD_LIMIT'
                                            type="text"
                                            placeholder='Download Limit'
                                            autoComplete="off"
                                            onFocus={e => changePlaceHoldClassAdd(e)}
                                            onBlur={e => changePlaceHoldClassRemove(e)}
                                            value = {values.DOWNLOAD_LIMIT}
                                            maxLength="10" 
                                            className={`form-control ${touched.firstname && errors.firstname ? "is-invalid" : ""}`}                                                                          
                                        />
                                      </div>
                                  </div>
                                  <div className="form-group">
                                    <label>Key Full Name</label>       
                                    <div >
                                      <Field
                                          name='DOWNLOAD_LIMIT_keyFullName'
                                          type="text"
                                          placeholder='Key Full Name'
                                          autoComplete="off"
                                          onFocus={e => changePlaceHoldClassAdd(e)}
                                          onBlur={e => changePlaceHoldClassRemove(e)}
                                          value = {values.DOWNLOAD_LIMIT_keyFullName}
                                          maxLength="10" 
                                          className={`form-control ${touched.DOWNLOAD_LIMIT_keyFullName && errors.DOWNLOAD_LIMIT_keyFullName ? "is-invalid" : ""}`}                                                                          
                                      />
                                    </div>
                                </div>
                                <div className="form-group">
                                    <label>Key Description</label>       
                                    <div >
                                      <Field
                                          name='DOWNLOAD_LIMIT_keyDesc'
                                          type="text"
                                          placeholder='Key Description'
                                          autoComplete="off"
                                          onFocus={e => changePlaceHoldClassAdd(e)}
                                          onBlur={e => changePlaceHoldClassRemove(e)}
                                          value = {values.DOWNLOAD_LIMIT_keyDesc}
                                          maxLength="10" 
                                          className={`form-control ${touched.DOWNLOAD_LIMIT_keyDesc && errors.DOWNLOAD_LIMIT_keyDesc ? "is-invalid" : ""}`}                                                                          
                                      />
                                    </div>
                                </div>
                                <div className="form-group">
                                    <label>Value Description</label>       
                                    <div >
                                      <Field
                                          name='DOWNLOAD_LIMIT_valueDesc'
                                          type="text"
                                          placeholder='Value Description'
                                          autoComplete="off"
                                          onFocus={e => changePlaceHoldClassAdd(e)}
                                          onBlur={e => changePlaceHoldClassRemove(e)}
                                          value = {values.DOWNLOAD_LIMIT_valueDesc}
                                          maxLength="10" 
                                          className={`form-control ${touched.DOWNLOAD_LIMIT_valueDesc && errors.DOWNLOAD_LIMIT_valueDesc ? "is-invalid" : ""}`}                                                                          
                                      />
                                    </div>
                                </div>
                              </div>
                          </div>
                      </div>

                    <div className="col-lg-4 ">
                        <div className="card">
                            <div className="card-body">
                                <div className="form-group">
                                    <label>MAX DOWNLOAD LIMIT PER DAY</label>       
                                    <div >
                                      <Field
                                          name='MAX_DOWNLOAD_DAY'
                                          type="text"
                                          placeholder='Download Limit Per Day'
                                          autoComplete="off"
                                          onFocus={e => changePlaceHoldClassAdd(e)}
                                          onBlur={e => changePlaceHoldClassRemove(e)}
                                          value = {values.MAX_DOWNLOAD_DAY}
                                          maxLength="10" 
                                          className={`form-control ${touched.MAX_DOWNLOAD_DAY && errors.MAX_DOWNLOAD_DAY ? "is-invalid" : ""}`}                                                                          
                                      />
                                    </div>
                                </div>
                                <div className="form-group">
                                    <label>Key Full Name</label>       
                                    <div >
                                      <Field
                                          name='MAX_DOWNLOAD_DAY_keyFullName'
                                          type="text"
                                          placeholder='Key Full Name'
                                          autoComplete="off"
                                          onFocus={e => changePlaceHoldClassAdd(e)}
                                          onBlur={e => changePlaceHoldClassRemove(e)}
                                          value = {values.MAX_DOWNLOAD_DAY_keyFullName}
                                          maxLength="10" 
                                          className={`form-control ${touched.MAX_DOWNLOAD_DAY_keyFullName && errors.MAX_DOWNLOAD_DAY_keyFullName ? "is-invalid" : ""}`}                                                                          
                                      />
                                    </div>
                                </div>
                                <div className="form-group">
                                    <label>Key Description</label>       
                                    <div >
                                      <Field
                                          name='MAX_DOWNLOAD_DAY_keyDesc'
                                          type="text"
                                          placeholder='Key Description'
                                          autoComplete="off"
                                          onFocus={e => changePlaceHoldClassAdd(e)}
                                          onBlur={e => changePlaceHoldClassRemove(e)}
                                          value = {values.MAX_DOWNLOAD_DAY_keyDesc}
                                          maxLength="10" 
                                          className={`form-control ${touched.MAX_DOWNLOAD_DAY_keyDesc && errors.MAX_DOWNLOAD_DAY_keyDesc ? "is-invalid" : ""}`}                                                                          
                                      />
                                    </div>
                                </div>
                                <div className="form-group">
                                    <label>Value Description</label>       
                                    <div >
                                      <Field
                                          name='MAX_DOWNLOAD_DAY_valueDesc'
                                          type="text"
                                          placeholder='Value Description'
                                          autoComplete="off"
                                          onFocus={e => changePlaceHoldClassAdd(e)}
                                          onBlur={e => changePlaceHoldClassRemove(e)}
                                          value = {values.MAX_DOWNLOAD_DAY_valueDesc}
                                          maxLength="10" 
                                          className={`form-control ${touched.MAX_DOWNLOAD_DAY_valueDesc && errors.MAX_DOWNLOAD_DAY_valueDesc ? "is-invalid" : ""}`}                                                                          
                                      />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="col-lg-4 ">
                        <div className="card">
                            <div className="card-body">
                                <div className="form-group">
                                    <label>TOTAL WORKSPACE</label>       
                                    <div >
                                      <Field
                                          name='WORKSPACE'
                                          type="text"
                                          placeholder='Workspace'
                                          autoComplete="off"
                                          onFocus={e => changePlaceHoldClassAdd(e)}
                                          onBlur={e => changePlaceHoldClassRemove(e)}
                                          value = {values.WORKSPACE}
                                          maxLength="10" 
                                          className={`form-control ${touched.WORKSPACE && errors.WORKSPACE ? "is-invalid" : ""}`}                                                                          
                                      />
                                    </div>
                                </div>
                                <div className="form-group">
                                    <label>Key Full Name</label>       
                                    <div >
                                      <Field
                                          name='WORKSPACE_keyFullName'
                                          type="text"
                                          placeholder='Key Full Name'
                                          autoComplete="off"
                                          onFocus={e => changePlaceHoldClassAdd(e)}
                                          onBlur={e => changePlaceHoldClassRemove(e)}
                                          value = {values.WORKSPACE_keyFullName}
                                          maxLength="10" 
                                          className={`form-control ${touched.WORKSPACE_keyFullName && errors.WORKSPACE_keyFullName ? "is-invalid" : ""}`}                                                                          
                                      />
                                    </div>
                                </div>
                                <div className="form-group">
                                    <label>Key Description</label>       
                                    <div >
                                      <Field
                                          name='WORKSPACE_keyDesc'
                                          type="text"
                                          placeholder='Key Description'
                                          autoComplete="off"
                                          onFocus={e => changePlaceHoldClassAdd(e)}
                                          onBlur={e => changePlaceHoldClassRemove(e)}
                                          value = {values.WORKSPACE_keyDesc}
                                          maxLength="10" 
                                          className={`form-control ${touched.WORKSPACE_keyDesc && errors.WORKSPACE_keyDesc ? "is-invalid" : ""}`}                                                                          
                                      />
                                    </div>
                                </div>
                                <div className="form-group">
                                    <label>Value Description</label>       
                                    <div >
                                      <Field
                                          name='WORKSPACE_valueDesc'
                                          type="text"
                                          placeholder='Value Description'
                                          autoComplete="off"
                                          onFocus={e => changePlaceHoldClassAdd(e)}
                                          onBlur={e => changePlaceHoldClassRemove(e)}
                                          value = {values.WORKSPACE_valueDesc}
                                          maxLength="10" 
                                          className={`form-control ${touched.WORKSPACE_valueDesc && errors.WORKSPACE_valueDesc ? "is-invalid" : ""}`}                                                                          
                                      />
                                    </div>
                                </div>
                                
                                                
                            </div>
                        </div>
                    </div>

                    <div className="col-lg-4 ">
                        <div className="card">
                            <div className="card-body">
                                <div className="form-group">
                                    <label>SUPPORT</label>        
                                    <div>
                                        <FormGroup>
                                          <div className="formSection">
                                            <Field
                                                name='SUPPORT'
                                                component="select"
                                                autoComplete="off"                                                                        
                                                className={`form-control ${touched.SUPPORT && errors.SUPPORT ? "is-invalid" : ""}`}
                                            >
                                                <option value= "" >Please Select</option>
                                                <option value= "Y" >YES</option>
                                                <option value= "N" >NO</option>
                                                <option value= "L" >LIMITED</option>
                                                {/* {titleList.map((title, qIndex) => ( 
                                                <option value={title.id}>{title.displayvalue}</option>
                                                ))} */}
                                            </Field>                 
                                            </div>
                                        </FormGroup>
                                    </div>
                                </div>
                                <div className="form-group">
                                    <label>Key Full Name</label>       
                                    <div >
                                      <Field
                                          name='SUPPORT_keyFullName'
                                          type="text"
                                          placeholder='Key Full Name'
                                          autoComplete="off"
                                          onFocus={e => changePlaceHoldClassAdd(e)}
                                          onBlur={e => changePlaceHoldClassRemove(e)}
                                          value = {values.SUPPORT_keyFullName}
                                          maxLength="10" 
                                          className={`form-control ${touched.SUPPORT_keyFullName && errors.SUPPORT_keyFullName ? "is-invalid" : ""}`}                                                                          
                                      />
                                    </div>
                                </div>
                                <div className="form-group">
                                    <label>Key Description</label>       
                                    <div >
                                      <Field
                                          name='SUPPORT_keyDesc'
                                          type="text"
                                          placeholder='Key Description'
                                          autoComplete="off"
                                          onFocus={e => changePlaceHoldClassAdd(e)}
                                          onBlur={e => changePlaceHoldClassRemove(e)}
                                          value = {values.SUPPORT_keyDesc}
                                          maxLength="10" 
                                          className={`form-control ${touched.SUPPORT_keyDesc && errors.SUPPORT_keyDesc ? "is-invalid" : ""}`}                                                                          
                                      />
                                    </div>
                                </div>
                                <div className="form-group">
                                    <label>Value Description</label>       
                                    <div >
                                      <Field
                                          name='SUPPORT_valueDesc'
                                          type="text"
                                          placeholder='Value Description'
                                          autoComplete="off"
                                          onFocus={e => changePlaceHoldClassAdd(e)}
                                          onBlur={e => changePlaceHoldClassRemove(e)}
                                          value = {values.SUPPORT_valueDesc}
                                          maxLength="10" 
                                          className={`form-control ${touched.SUPPORT_valueDesc && errors.SUPPORT_valueDesc ? "is-invalid" : ""}`}                                                                          
                                      />
                                    </div>
                                </div>
                                                
                            </div>
                        </div>
                    </div>

                    <div className="col-lg-4 ">
                        <div className="card">
                            <div className="card-body">
                                <div className="form-group">
                                    <label>TICKET MANAGER</label>        
                                    <div >
                                        <FormGroup>
                                          <div className="formSection">
                                            <Field
                                                name='TICKET_MANAGER'
                                                component="select"
                                                autoComplete="off"                                                                        
                                                className={`form-control ${touched.TICKET_MANAGER && errors.TICKET_MANAGER ? "is-invalid" : ""}`}
                                            >
                                                <option value= "" >Please Select</option>
                                                <option value= "Y" >AVAILABLE</option>
                                                <option value= "N" >NOT AVAILABLE</option>
                                                {/* {titleList.map((title, qIndex) => ( 
                                                <option value={title.id}>{title.displayvalue}</option>
                                                ))} */}
                                            </Field>                 
                                            </div>
                                        </FormGroup>
                                    </div>
                                </div>
                                <div className="form-group">
                                    <label>Key Full Name</label>       
                                    <div >
                                      <Field
                                          name='TICKET_MANAGER_keyFullName'
                                          type="text"
                                          placeholder='Key Full Name'
                                          autoComplete="off"
                                          onFocus={e => changePlaceHoldClassAdd(e)}
                                          onBlur={e => changePlaceHoldClassRemove(e)}
                                          value = {values.TICKET_MANAGER_keyFullName}
                                          maxLength="10" 
                                          className={`form-control ${touched.TICKET_MANAGER_keyFullName && errors.TICKET_MANAGER_keyFullName ? "is-invalid" : ""}`}                                                                          
                                      />
                                    </div>
                                </div>
                                <div className="form-group">
                                    <label>Key Description</label>       
                                    <div >
                                      <Field
                                          name='TICKET_MANAGER_keyDesc'
                                          type="text"
                                          placeholder='Key Description'
                                          autoComplete="off"
                                          onFocus={e => changePlaceHoldClassAdd(e)}
                                          onBlur={e => changePlaceHoldClassRemove(e)}
                                          value = {values.TICKET_MANAGER_keyDesc}
                                          maxLength="10" 
                                          className={`form-control ${touched.TICKET_MANAGER_keyDesc && errors.TICKET_MANAGER_keyDesc ? "is-invalid" : ""}`}                                                                          
                                      />
                                    </div>
                                </div>
                                <div className="form-group">
                                    <label>Value Description</label>       
                                    <div >
                                      <Field
                                          name='TICKET_MANAGER_valueDesc'
                                          type="text"
                                          placeholder='Value Description'
                                          autoComplete="off"
                                          onFocus={e => changePlaceHoldClassAdd(e)}
                                          onBlur={e => changePlaceHoldClassRemove(e)}
                                          value = {values.TICKET_MANAGER_valueDesc}
                                          maxLength="10" 
                                          className={`form-control ${touched.TICKET_MANAGER_valueDesc && errors.TICKET_MANAGER_valueDesc ? "is-invalid" : ""}`}                                                                          
                                      />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="col-lg-4 ">
                      <div className="card">
                          <div className="card-body">
                              <div className="form-group">
                                  <label>RECORD PER WORKSPACE</label>        
                                  <div >
                                    <Field
                                        name='RECORD_PER_WORKSPACE'
                                        type="text"
                                        placeholder='Recored Per Workspace'
                                        autoComplete="off"
                                        onFocus={e => changePlaceHoldClassAdd(e)}
                                        onBlur={e => changePlaceHoldClassRemove(e)}
                                        value = {values.RECORD_PER_WORKSPACE}
                                        maxLength="10" 
                                        className={`form-control ${touched.RECORD_PER_WORKSPACE && errors.RECORD_PER_WORKSPACE ? "is-invalid" : ""}`}                                                                          
                                    />
                                  </div>
                              </div>   
                              <div className="form-group">
                                    <label>Key Full Name</label>       
                                    <div >
                                      <Field
                                          name='RECORD_PER_WORKSPACE_keyFullName'
                                          type="text"
                                          placeholder='Key Full Name'
                                          autoComplete="off"
                                          onFocus={e => changePlaceHoldClassAdd(e)}
                                          onBlur={e => changePlaceHoldClassRemove(e)}
                                          value = {values.RECORD_PER_WORKSPACE_keyFullName}
                                          maxLength="10" 
                                          className={`form-control ${touched.RECORD_PER_WORKSPACE_keyFullName && errors.RECORD_PER_WORKSPACE_keyFullName ? "is-invalid" : ""}`}                                                                          
                                      />
                                    </div>
                              </div>
                              <div className="form-group">
                                  <label>Key Description</label>       
                                  <div >
                                    <Field
                                        name='RECORD_PER_WORKSPACE_keyDesc'
                                        type="text"
                                        placeholder='Key Description'
                                        autoComplete="off"
                                        onFocus={e => changePlaceHoldClassAdd(e)}
                                        onBlur={e => changePlaceHoldClassRemove(e)}
                                        value = {values.RECORD_PER_WORKSPACE_keyDesc}
                                        maxLength="10" 
                                        className={`form-control ${touched.RECORD_PER_WORKSPACE_keyDesc && errors.RECORD_PER_WORKSPACE_keyDesc ? "is-invalid" : ""}`}                                                                          
                                    />
                                  </div>
                              </div>
                              <div className="form-group">
                                  <label>Value Description</label>       
                                  <div >
                                    <Field
                                        name='RECORD_PER_WORKSPACE_valueDesc'
                                        type="text"
                                        placeholder='Value Description'
                                        autoComplete="off"
                                        onFocus={e => changePlaceHoldClassAdd(e)}
                                        onBlur={e => changePlaceHoldClassRemove(e)}
                                        value = {values.RECORD_PER_WORKSPACE_valueDesc}
                                        maxLength="10" 
                                        className={`form-control ${touched.RECORD_PER_WORKSPACE_valueDesc && errors.RECORD_PER_WORKSPACE_valueDesc ? "is-invalid" : ""}`}                                                                          
                                    />
                                  </div>
                              </div>
                          </div>  
                      </div>
                    </div>

                    <div className="col-lg-4 ">
                        <div className="card">      
                            <div className="card-body">               
                                <div className="form-group">
                                    <label>USER</label>       
                                    <div >
                                      <Field
                                          name='SUB_USER'
                                          type="text"
                                          placeholder='No of User'
                                          autoComplete="off"
                                          onFocus={e => changePlaceHoldClassAdd(e)}
                                          onBlur={e => changePlaceHoldClassRemove(e)}
                                          value = {values.SUB_USER}
                                          maxLength="10" 
                                          className={`form-control ${touched.SUB_USER && errors.SUB_USER ? "is-invalid" : ""}`}                                                                          
                                      />
                                    </div>
                              </div>
                                <div className="form-group">
                                    <label>Key Full Name</label>       
                                    <div >
                                      <Field
                                          name='SUB_USER_keyFullName'
                                          type="text"
                                          placeholder='Key Full Name'
                                          autoComplete="off"
                                          onFocus={e => changePlaceHoldClassAdd(e)}
                                          onBlur={e => changePlaceHoldClassRemove(e)}
                                          value = {values.SUB_USER_keyFullName}
                                          maxLength="10" 
                                          className={`form-control ${touched.SUB_USER_keyFullName && errors.SUB_USER_keyFullName ? "is-invalid" : ""}`}                                                                          
                                      />
                                    </div>
                              </div>
                              <div className="form-group">
                                  <label>Key Description</label>       
                                  <div >
                                    <Field
                                        name='SUB_USER_keyDesc'
                                        type="text"
                                        placeholder='Key Description'
                                        autoComplete="off"
                                        onFocus={e => changePlaceHoldClassAdd(e)}
                                        onBlur={e => changePlaceHoldClassRemove(e)}
                                        value = {values.SUB_USER_keyDesc}
                                        maxLength="10" 
                                        className={`form-control ${touched.SUB_USER_keyDesc && errors.SUB_USER_keyDesc ? "is-invalid" : ""}`}                                                                          
                                    />
                                  </div>
                              </div>
                              <div className="form-group">
                                  <label>Value Description</label>       
                                  <div >
                                    <Field
                                        name='SUB_USER_valueDesc'
                                        type="text"
                                        placeholder='Value Description'
                                        autoComplete="off"
                                        onFocus={e => changePlaceHoldClassAdd(e)}
                                        onBlur={e => changePlaceHoldClassRemove(e)}
                                        value = {values.SUB_USER_valueDesc}
                                        maxLength="10" 
                                        className={`form-control ${touched.SUB_USER_valueDesc && errors.SUB_USER_valueDesc ? "is-invalid" : ""}`}                                                                          
                                    />
                                  </div>
                              </div>
                            </div>   
                        </div>
                    </div>

                    <div className="col-lg-4 ">
                        <div className="card">   
                            <div className="card-body">   
                                <div className="form-group">
                                    <label>DISPLAY FIELDS</label>        
                                    <div >
                                        <FormGroup>
                                          <div className="formSection">
                                            <Field
                                                name='DISPLAY_FIELDS'
                                                component="select"
                                                autoComplete="off"                                                                        
                                                className={`form-control ${touched.DISPLAY_FIELDS && errors.DISPLAY_FIELDS ? "is-invalid" : ""}`}
                                            >
                                                <option value= "" >Please Select</option>
                                                <option value= "F" >FULL</option>
                                                <option value= "L" >LIMITED FIELDS DISPLAY</option>
                                                {/* {titleList.map((title, qIndex) => ( 
                                                <option value={title.id}>{title.displayvalue}</option>
                                                ))} */}
                                            </Field>                 
                                            </div>
                                        </FormGroup>
                                    </div>
                                </div>
                                <div className="form-group">
                                    <label>Key Full Name</label>       
                                    <div >
                                      <Field
                                          name='DISPLAY_FIELDS_keyFullName'
                                          type="text"
                                          placeholder='Key Full Name'
                                          autoComplete="off"
                                          onFocus={e => changePlaceHoldClassAdd(e)}
                                          onBlur={e => changePlaceHoldClassRemove(e)}
                                          value = {values.DISPLAY_FIELDS_keyFullName}
                                          maxLength="10" 
                                          className={`form-control ${touched.DISPLAY_FIELDS_keyFullName && errors.DISPLAY_FIELDS_keyFullName ? "is-invalid" : ""}`}                                                                          
                                      />
                                    </div>
                                </div>
                                <div className="form-group">
                                    <label>Key Description</label>       
                                    <div >
                                      <Field
                                          name='DISPLAY_FIELDS_keyDesc'
                                          type="text"
                                          placeholder='Key Description'
                                          autoComplete="off"
                                          onFocus={e => changePlaceHoldClassAdd(e)}
                                          onBlur={e => changePlaceHoldClassRemove(e)}
                                          value = {values.DISPLAY_FIELDS_keyDesc}
                                          maxLength="10" 
                                          className={`form-control ${touched.DISPLAY_FIELDS_keyDesc && errors.DISPLAY_FIELDS_keyDesc ? "is-invalid" : ""}`}                                                                          
                                      />
                                    </div>
                                </div>
                                <div className="form-group">
                                    <label>Value Description</label>       
                                    <div >
                                      <Field
                                          name='DISPLAY_FIELDS_valueDesc'
                                          type="text"
                                          placeholder='Value Description'
                                          autoComplete="off"
                                          onFocus={e => changePlaceHoldClassAdd(e)}
                                          onBlur={e => changePlaceHoldClassRemove(e)}
                                          value = {values.DISPLAY_FIELDS_valueDesc}
                                          maxLength="10" 
                                          className={`form-control ${touched.DISPLAY_FIELDS_valueDesc && errors.DISPLAY_FIELDS_valueDesc ? "is-invalid" : ""}`}                                                                          
                                      />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="col-lg-4 ">
                        <div className="card">   
                            <div className="card-body"> 
                                <div className="form-group">
                                    <label>SEARCH QUERY PER DAY </label>        
                                    <div >
                                      <Field
                                          name='QUERY_PER_DAY'
                                          type="text"
                                          placeholder='Search Query'
                                          autoComplete="off"
                                          onFocus={e => changePlaceHoldClassAdd(e)}
                                          onBlur={e => changePlaceHoldClassRemove(e)}
                                          value = {values.QUERY_PER_DAY}
                                          maxLength="10" 
                                          className={`form-control ${touched.QUERY_PER_DAY && errors.QUERY_PER_DAY ? "is-invalid" : ""}`}                                                                          
                                      />
                                    </div>
                                </div>
                                <div className="form-group">
                                    <label>Key Full Name</label>       
                                    <div >
                                      <Field
                                          name='QUERY_PER_DAY_keyFullName'
                                          type="text"
                                          placeholder='Key Full Name'
                                          autoComplete="off"
                                          onFocus={e => changePlaceHoldClassAdd(e)}
                                          onBlur={e => changePlaceHoldClassRemove(e)}
                                          value = {values.QUERY_PER_DAY_keyFullName}
                                          maxLength="10" 
                                          className={`form-control ${touched.QUERY_PER_DAY_keyFullName && errors.QUERY_PER_DAY_keyFullName ? "is-invalid" : ""}`}                                                                          
                                      />
                                    </div>
                                </div>
                                <div className="form-group">
                                    <label>Key Description</label>       
                                    <div >
                                      <Field
                                          name='QUERY_PER_DAY_keyDesc'
                                          type="text"
                                          placeholder='Key Description'
                                          autoComplete="off"
                                          onFocus={e => changePlaceHoldClassAdd(e)}
                                          onBlur={e => changePlaceHoldClassRemove(e)}
                                          value = {values.QUERY_PER_DAY_keyDesc}
                                          maxLength="10" 
                                          className={`form-control ${touched.QUERY_PER_DAY_keyDesc && errors.QUERY_PER_DAY_keyDesc ? "is-invalid" : ""}`}                                                                          
                                      />
                                    </div>
                                </div>
                                <div className="form-group">
                                    <label>Value Description</label>       
                                    <div >
                                      <Field
                                          name='QUERY_PER_DAY_valueDesc'
                                          type="text"
                                          placeholder='Value Description'
                                          autoComplete="off"
                                          onFocus={e => changePlaceHoldClassAdd(e)}
                                          onBlur={e => changePlaceHoldClassRemove(e)}
                                          value = {values.QUERY_PER_DAY_valueDesc}
                                          maxLength="10" 
                                          className={`form-control ${touched.QUERY_PER_DAY_valueDesc && errors.QUERY_PER_DAY_valueDesc ? "is-invalid" : ""}`}                                                                          
                                      />
                                    </div>
                                </div>
                            </div>      
                        </div>    
                    </div>

                    <div className="col-lg-4 ">
                        <div className="card">   
                            <div className="card-body">              
                                <div className="form-group">
                                    <label>DATA ACCESS &#40;in days&#41;</label>        
                                    <div >
                                      <Field
                                          name='DATA_ACCCESS'
                                          type="date"
                                          placeholder='Data Access'
                                          autoComplete="off"
                                          onFocus={e => changePlaceHoldClassAdd(e)}
                                          onBlur={e => changePlaceHoldClassRemove(e)}
                                          value = {values.DATA_ACCCESS}
                                          maxLength="10" 
                                          className={`form-control ${touched.DATA_ACCCESS && errors.DATA_ACCCESS ? "is-invalid" : ""}`}                                                                          
                                      />
                                    </div>
                                </div>
                                <div className="form-group">
                                    <label>Key Full Name</label>       
                                    <div >
                                      <Field
                                          name='DATA_ACCCESS_keyFullName'
                                          type="text"
                                          placeholder='Key Full Name'
                                          autoComplete="off"
                                          onFocus={e => changePlaceHoldClassAdd(e)}
                                          onBlur={e => changePlaceHoldClassRemove(e)}
                                          value = {values.DATA_ACCCESS_keyFullName}
                                          maxLength="10" 
                                          className={`form-control ${touched.DATA_ACCCESS_keyFullName && errors.DATA_ACCCESS_keyFullName ? "is-invalid" : ""}`}                                                                          
                                      />
                                    </div>
                                </div>
                                <div className="form-group">
                                    <label>Key Description</label>       
                                    <div >
                                      <Field
                                          name='DATA_ACCCESS_keyDesc'
                                          type="text"
                                          placeholder='Key Description'
                                          autoComplete="off"
                                          onFocus={e => changePlaceHoldClassAdd(e)}
                                          onBlur={e => changePlaceHoldClassRemove(e)}
                                          value = {values.DATA_ACCCESS_keyDesc}
                                          maxLength="10" 
                                          className={`form-control ${touched.DATA_ACCCESS_keyDesc && errors.DATA_ACCCESS_keyDesc ? "is-invalid" : ""}`}                                                                          
                                      />
                                    </div>
                                </div>
                                <div className="form-group">
                                    <label>Value Description</label>       
                                    <div >
                                      <Field
                                          name='DATA_ACCCESS_valueDesc'
                                          type="text"
                                          placeholder='Value Description'
                                          autoComplete="off"
                                          onFocus={e => changePlaceHoldClassAdd(e)}
                                          onBlur={e => changePlaceHoldClassRemove(e)}
                                          value = {values.DATA_ACCCESS_valueDesc}
                                          maxLength="10" 
                                          className={`form-control ${touched.DATA_ACCCESS_valueDesc && errors.DATA_ACCCESS_valueDesc ? "is-invalid" : ""}`}                                                                          
                                      />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="col-lg-4 ">
                        <div className="card">   
                            <div className="card-body">              
                                <div className="form-group">
                                    <label>ALLOWED CHAPTER &#40;2 digits&#41;</label>        
                                    <div >
                                      <Field
                                          name='ALLOWED_CHAPTER'
                                          type="text"
                                          placeholder='Allowed Chapter Code With Comma Separated'
                                          autoComplete="off"
                                          onFocus={e => changePlaceHoldClassAdd(e)}
                                          onBlur={e => changePlaceHoldClassRemove(e)}
                                          value = {values.ALLOWED_CHAPTER}
                                          maxLength="10" 
                                          className={`form-control ${touched.ALLOWED_CHAPTER && errors.ALLOWED_CHAPTER ? "is-invalid" : ""}`}                                                                          
                                      />
                                    </div>
                                </div>
                                <div className="form-group">
                                    <label>Key Full Name</label>       
                                    <div >
                                      <Field
                                          name='ALLOWED_CHAPTER_keyFullName'
                                          type="text"
                                          placeholder='Key Full Name'
                                          autoComplete="off"
                                          onFocus={e => changePlaceHoldClassAdd(e)}
                                          onBlur={e => changePlaceHoldClassRemove(e)}
                                          value = {values.ALLOWED_CHAPTER_keyFullName}
                                          maxLength="10" 
                                          className={`form-control ${touched.ALLOWED_CHAPTER_keyFullName && errors.ALLOWED_CHAPTER_keyFullName ? "is-invalid" : ""}`}                                                                          
                                      />
                                    </div>
                                </div>
                                <div className="form-group">
                                    <label>Key Description</label>       
                                    <div >
                                      <Field
                                          name='ALLOWED_CHAPTER_keyDesc'
                                          type="text"
                                          placeholder='Key Description'
                                          autoComplete="off"
                                          onFocus={e => changePlaceHoldClassAdd(e)}
                                          onBlur={e => changePlaceHoldClassRemove(e)}
                                          value = {values.ALLOWED_CHAPTER_keyDesc}
                                          maxLength="10" 
                                          className={`form-control ${touched.ALLOWED_CHAPTER_keyDesc && errors.ALLOWED_CHAPTER_keyDesc ? "is-invalid" : ""}`}                                                                          
                                      />
                                    </div>
                                </div>
                                <div className="form-group">
                                    <label>Value Description</label>       
                                    <div >
                                      <Field
                                          name='ALLOWED_CHAPTER_valueDesc'
                                          type="text"
                                          placeholder='Value Description'
                                          autoComplete="off"
                                          onFocus={e => changePlaceHoldClassAdd(e)}
                                          onBlur={e => changePlaceHoldClassRemove(e)}
                                          value = {values.ALLOWED_CHAPTER_valueDesc}
                                          maxLength="10" 
                                          className={`form-control ${touched.ALLOWED_CHAPTER_valueDesc && errors.ALLOWED_CHAPTER_valueDesc ? "is-invalid" : ""}`}                                                                          
                                      />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="col-lg-4 ">
                        <div className="card">   
                            <div className="card-body">    
                                <div className="form-group">
                                    <label>Customize</label>        
                                    <div >
                                        <FormGroup>
                                          <div className="formSection">
                                            <Field
                                                name='isCustom'
                                                component="select"
                                                autoComplete="off"                                                                        
                                                className={`form-control ${touched.isCustom && errors.isCustom ? "is-invalid" : ""}`}
                                            >
                                                <option value="">Select</option>
                                                <option value="Y">Yes</option>
                                                <option value="N">No</option>                                                 
                                                {/* {titleList.map((title, qIndex) => ( 
                                                <option value={title.id}>{title.displayvalue}</option>
                                                ))} */}
                                            </Field>                 
                                            </div>
                                        </FormGroup>
                                    </div>
                                </div>   
                                <div className="form-group">
                                    <label>Is Active</label>        
                                    <div >
                                        <FormGroup>
                                          <div className="formSection">
                                            <Field
                                                name='isActive'
                                                component="select"
                                                autoComplete="off"                                                                        
                                                className={`form-control ${touched.isActive && errors.isActive ? "is-invalid" : ""}`}
                                            >
                                                <option value="">Select</option>
                                                <option value="Y">Yes</option>
                                                <option value="N">No</option>                                                 
                                                {/* {titleList.map((title, qIndex) => ( 
                                                <option value={title.id}>{title.displayvalue}</option>
                                                ))} */}
                                            </Field>                 
                                            </div>
                                        </FormGroup>
                                    </div>
                                </div>              
                            </div>    
                        </div>                  
                    </div>
                  </div>
                  <div className="row">
                    <div className="col-lg-12 ">
                        <div className="card">   
                          <div className="card-body"> 

                              <Row>
                                  <Col>&nbsp;</Col>
                              </Row>
                              <Row>
                                <Button type="submit" >Submit</Button>
                              </Row>
                              <Row>
                                  <Col>&nbsp;</Col>
                              </Row>
                          </div>                  
                      </div>
                    </div>                  
                  </div> 
                </Form>
                );
                }}  
            </Formik>    
        </div>
      </div>
    </div>
  )

}

export default Users
