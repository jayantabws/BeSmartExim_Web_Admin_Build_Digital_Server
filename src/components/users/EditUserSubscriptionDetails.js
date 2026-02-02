import React, { Component,useState, useRef, useCallback, useEffect, Fragment } from 'react'
import { Row, Col, Modal, Button, FormGroup, OverlayTrigger, Tooltip } from 'react-bootstrap';
import Select from 'react-select'
import AxiosMaster from '../shared/AxiosMaster';
import AxiosUser from "../shared/AxiosUser";
import { Formik, Field, Form } from "formik";
import * as Yup from "yup";
import Swal from 'sweetalert2';
import moment from 'moment'


const validateForm = Yup.object().shape({
  dataAccessInMonth: Yup.string().required("Please enter valid date"),
  downloadLimit: Yup.string().required("Please enter download limit"),
  totalWorkspace: Yup.string().required("Please enter valid totalWorkspace address"),
  downloadPerDay: Yup.string().required("Please enter valid downloadPerDay no"),
  recordsPerWorkspace: Yup.string().required("This field is required"),
  subUserCount: Yup.string().required("This field is required"),
  queryPerDay: Yup.string().required("This field is required"),
  accountExpireDate: Yup.string().required("This field is required"), 
  support: Yup.string().required("This field is required"),  
  ticketManager: Yup.string().required("This field is required"),  
  displayFields: Yup.string().required("This field is required"),
});


const EditUserSubscriptionDetails = (props) => {


  const initialValues = {
    dataAccessInMonth: props.rowData.dataAccessInMonth,
    dataAccessUpto: props.rowData.dataAccessUpto,
    downloadLimit: props.rowData.downloadLimit,
    downloadPerDay: props.rowData.downloadPerDay,
    totalWorkspace: props.rowData.totalWorkspace,
    recordsPerWorkspace: props.rowData.recordsPerWorkspace,
    subUserCount: props.rowData.subUserCount,
    queryPerDay: props.rowData.queryPerDay,
    accountExpireDate: moment(props.rowData.accountExpireDate).format("YYYY-MM-DD"),
    support: props.rowData.support,
    ticketManager: props.rowData.ticketManager,
    displayFields: props.rowData.displayFields,
    countryId : props.rowData.countries,
    allowedChapter : props.rowData.allowedChapter,
    indepthAccess:props.rowData.indepthAccess
    
  };
  

  const [userList, setUserList] = useState([]);
  const [subscriptionList, setSubscriptionList] = useState([]);
  const [tradeCountryList, setTradeCountryList] = useState([]);

  const handleSubmit = (values) => {
      const postData = {
        "dataAccessInMonth": values.dataAccessInMonth,
        "dataAccessUpto": values.dataAccessUpto,
        "downloadLimit": values.downloadLimit,
        "totalWorkspace": values.totalWorkspace,
        "downloadPerDay": values.downloadPerDay,
        "recordsPerWorkspace": values.recordsPerWorkspace,
        "subUserCount": values.subUserCount,
        "queryPerDay": values.queryPerDay,
        "accountExpireDate": values.accountExpireDate,
        "support": values.support,
        "ticketManager": values.ticketManager,
        "displayFields": values.displayFields,
        "countryId" : values.countryId,
        "allowedChapter" : values.allowedChapter,
        "indepthAccess":values.indepthAccess
      }
      AxiosUser({
        method: "PUT",
        url: `user-management/user-subscription/update/${props.rowData.id}`,
        data: JSON.stringify(postData),
        headers: {
          "Content-Type": "application/json"
        }
      })
        .then(res => {
          console.log("user", res.data);
          Swal.fire({
            title: 'Thank You',
            text: "User update is successful",
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

  // const getSubscriptionList = () => {

  //   AxiosMaster({
  //     method: "GET",
  //     url: `masterdata-management/subscription/list`,    
  //   })
  //     .then(res => {
  //       setSubscriptionList(res.data.subscriptionList)
  //     })
  //     .catch(err => {
  //       setSubscriptionList([])
  //     });
  // }

  const getTradingCountryList = (param) => {

    AxiosMaster({
      method: "GET",
      url: `masterdata-management/countrylistbytrade/${param}`,    
    })
      .then(res => {
        let countryList = [];
        if (res.data.countryList) {
          res.data.countryList.forEach((item) => {
            let specificItem = { "value": item.shortcode, "label": item.shortcode };
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
    // getSubscriptionList()
  },[])


    return (
      <div>
        
          <Formik
            initialValues={initialValues}
            // validationSchema={validateForm}
            onSubmit={handleSubmit}
          >
            {({ values, errors, setFieldValue, setFieldError, touched, isValid, handleSubmit, submitForm }) => {
              return (
                <Form >
                  <div className="form-group">
                    <label><b>DATA ACCESS</b></label>
                    <Field
                      name="dataAccessInMonth"
                      type="date"
                      className={`form-control ${touched.dataAccessInMonth && errors.dataAccessInMonth ? "is-invalid" : ""}`}
                      placeholder="DATA ACCESS"
                      onChange={event => {
                        setFieldValue("dataAccessInMonth", event.target.value);
                      }}
                    />
                    {touched.dataAccessInMonth && errors.dataAccessInMonth && (<p className="error">{errors.dataAccessInMonth}</p>)}
                  </div>
                  <div className="form-group">
                    <label><b>DATA ACCESS UPTO DATE</b></label>
                    <Field
                      name="dataAccessUpto"
                      type="date"
                      className={`form-control`}
                      placeholder="DATA ACCESS UPTO DATE"
                      onChange={event => {
                        setFieldValue("dataAccessUpto", event.target.value);
                      }}
                    />                   
                  </div>
                  <div className="form-group">
                  <label><b>DOWNLOAD LIMIT</b></label>
                    <Field
                      name="downloadLimit"
                      type="text"
                      className={`form-control ${touched.downloadLimit && errors.downloadLimit ? "is-invalid" : ""}`}
                      placeholder="DOWNLOAD LIMIT"
                      onChange={event => {
                        setFieldValue("downloadLimit", event.target.value);
                      }}
                    />
                    {touched.downloadLimit && errors.downloadLimit && (<p className="error">{errors.downloadLimit}</p>)}
                  </div>
                  <div className="form-group">
                  <label><b>MAX DOWNLOAD LIMIT PER DAY</b></label>
                    <Field
                      name="downloadPerDay"
                      type="text"
                      className={`form-control ${touched.downloadPerDay && errors.downloadPerDay ? "is-invalid" : ""}`}
                      placeholder="MAX DOWNLOAD LIMIT PER DAY"
                      onChange={event => {
                        setFieldValue("downloadPerDay", event.target.value);
                      }}
                    />
                    {touched.downloadPerDay && errors.downloadPerDay && (<p className="error">{errors.downloadPerDay}</p>)}
                  </div>
                  <div className="form-group">
                  <label><b>TOTAL WORKSPACE</b></label>
                    <Field
                      name="totalWorkspace"
                      type="text"
                      className={`form-control ${touched.totalWorkspace && errors.totalWorkspace ? "is-invalid" : ""}`}
                      placeholder="TOTAL WORKSPACE"
                      onChange={event => {
                        setFieldValue("totalWorkspace", event.target.value);
                      }}
                    />
                    {touched.totalWorkspace && errors.totalWorkspace && (<p className="error">{errors.totalWorkspace}</p>)}
                  </div>
                  <div className="form-group">
                      <label><b>MAX LIMIT TO DOWNLOAD RECORDS PER SEARCH</b></label>
                        <Field
                          name="recordsPerWorkspace"
                          type="text"
                          className={`form-control ${touched.recordsPerWorkspace && errors.recordsPerWorkspace ? "is-invalid" : ""}`}
                          placeholder="RECORD PER WORKSPACE"
                          onChange={event => {
                            setFieldValue("recordsPerWorkspace", event.target.value);
                          }}
                        />
                        {touched.recordsPerWorkspace && errors.recordsPerWorkspace && (<p className="error">{errors.recordsPerWorkspace}</p>)}
                  </div>                  
                  <div className="form-group">
                  <label><b>TOTAL USER</b></label>
                    <Field
                      name="subUserCount"
                      type="text"
                      className={`form-control ${touched.subUserCount && errors.subUserCount ? "is-invalid" : ""}`}
                      placeholder="TOTAL USER"
                      onChange={event => {
                        setFieldValue("subUserCount", event.target.value);
                      }}
                    />
                    {touched.subUserCount && errors.subUserCount && (<p className="error">{errors.subUserCount}</p>)}
                  </div>
                  <div className="form-group">
                  <label><b>SEARCH QUERY PER DAY</b></label>
                    <Field
                      name="queryPerDay"
                      type="text"
                      className={`form-control ${touched.queryPerDay && errors.queryPerDay ? "is-invalid" : ""}`}
                      placeholder="SEARCH QUERY PER DAY"
                      onChange={event => {
                        setFieldValue("queryPerDay", event.target.value);
                      }}
                    />
                    {touched.queryPerDay && errors.queryPerDay && (<p className="error">{errors.queryPerDay}</p>)}
                  </div>  
                  <div className="form-group">
                  <label><b>ACCOUNT EXPIRE DATE</b></label>
                    <Field
                      name="accountExpireDate"
                      type="date"
                      className={`form-control ${touched.accountExpireDate && errors.accountExpireDate ? "is-invalid" : ""}`}
                      placeholder="ACCOUNT EXPIRE DATE"
                      onChange={event => {
                        setFieldValue("accountExpireDate", event.target.value);
                      }}
                    />
                    {touched.accountExpireDate && errors.accountExpireDate && (<p className="error">{errors.accountExpireDate}</p>)}
                  </div>          
                  <div className="form-group">
                  <label><b>SUPPORT</b></label>
                    <Field
                      name="support"
                      component="select"
                      className={`form-control ${touched.support && errors.support ? "is-invalid" : ""}`}
                      autoComplete="off"      
                      onChange={event => {
                        setFieldValue("support", event.target.value);
                      }}
                    >    
                      <option value= "" >Please Select</option>
                      <option value= "Y" >YES</option>
                      <option value= "N" >NO</option>
                      <option value= "L" >LIMITED</option>
                      {touched.support && errors.support && (<p className="error">{errors.support}</p>)}
                    </Field>   
                  </div>
                     


                  

                  {tradeCountryList && tradeCountryList.length > 0 ?
                                <div className="form-group">
                                  <label><b>Country Name</b></label>
                                         
                                            <div className="formSection">      
                                                <Select
                                                    defaultValue={props.defaultCountryList}
                                                    isMulti
                                                    name="countryId"
                                                    options={tradeCountryList}
                                                    className="dropdown bootstrap-select hero__form-input"
                                                    onChange={(selectedOption) => {
                                                      let itemList = [];
                                                      selectedOption && selectedOption.forEach((item)=>{
                                                        itemList.push(item.value);
                                                      });
                                                      setFieldValue("countryId", itemList);
                                                    }}
                                                    classNamePrefix="select"
                                                />  
                                              </div>
                                          {/* </FormGroup> */}
  
                                  {touched.countryId && errors.countryId && (<p className="error">{errors.countryId}</p>)}
                            </div> : null}

                  <div className="form-group">
                  <label><b>TICKET MANAGER</b></label>
                    <Field
                      name="ticketManager"
                      component="select"
                      className={`form-control ${touched.ticketManager && errors.ticketManager ? "is-invalid" : ""}`}
                      autoComplete="off"      
                      onChange={event => {
                        setFieldValue("ticketManager", event.target.value);
                      }}
                    >    
                      <option value= "" >Please Select</option>
                      <option value= "Y" >AVAILABLE</option>
                      <option value= "N" >NOT AVAILABLE</option>
                      {touched.ticketManager && errors.ticketManager && (<p className="error">{errors.ticketManager}</p>)}
                    </Field>   
                  </div>

                  
                  <div className="form-group">
                  <label><b>DISPLAY FIELDS</b></label>
                    <Field
                      name="displayFields"
                      component="select"
                      className={`form-control ${touched.displayFields && errors.displayFields ? "is-invalid" : ""}`}
                      autoComplete="off"      
                      onChange={event => {
                        setFieldValue("displayFields", event.target.value);
                      }}
                    >    
                      <option value= "" >Please Select</option>
                      <option value= "F" >FULL</option>
                      <option value= "L" >LIMITED FIELDS DISPLAY</option>
                      {touched.displayFields && errors.displayFields && (<p className="error">{errors.displayFields}</p>)}
                    </Field>   
                  </div>

                  <div className="form-group">
                  <label><b>ALLOWED CHAPTER</b></label>
                    <Field
                      name="allowedChapter"
                      type="text"
                      className={`form-control ${touched.allowedChapter && errors.allowedChapter ? "is-invalid" : ""}`}
                      placeholder="ALLOWED CHAPTER"
                      onChange={event => {
                        setFieldValue("allowedChapter", event.target.value);
                      }}
                    />
                    {touched.allowedChapter && errors.allowedChapter && (<p className="error">{errors.allowedChapter}</p>)}
                  </div>


                    <div className="form-group">
                  <label><b>Indepth Access</b></label>
                    <Field
                      name="indepthAccess"
                      component="select"
                      className={`form-control ${touched.indepthAccess && errors.indepthAccess ? "is-invalid" : ""}`}
                      autoComplete="off"      
                      onChange={event => {
                        setFieldValue("indepthAccess", event.target.value);
                      }}
                    >    
                      <option value= "" >Please Select</option>
                      <option value= "Y" >YES</option>
                      <option value= "N" >NO</option>
                      
                      {touched.indepthAccess && errors.indepthAccess && (<p className="error">{errors.indepthAccess}</p>)}
                    </Field>   
                  </div>
                  
                  <button type="submit"  className="btn btn-primary">Update</button>
                </Form>
              )
            }
            }
          </Formik>

               
      </div>
    )

}

export default EditUserSubscriptionDetails
