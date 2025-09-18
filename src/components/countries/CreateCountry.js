import React, { Component,useState, useRef, useCallback, useEffect, Fragment } from 'react'
import { Row, Col, Modal, Button, FormGroup, OverlayTrigger, Tooltip } from 'react-bootstrap';
import Select from 'react-select'
import AxiosMaster from '../shared/AxiosMaster';
import { Formik, Field, Form } from "formik";
import * as Yup from "yup";
import DatePicker from "react-datepicker";
import Swal from 'sweetalert2';


const initialValues = {
  continentId: "",
  name: "",
  shortcode: "",
  description: "",
  isExport: "",
  isImport: "",
  exportFrom: "",
  exportUpto: "",
  exportRecords: "",
  importFrom: "",
  importUpto: "",
  importRecords: "",
  importPointWeightage: "",
  exportPointWeightage: "",
  exporterForImport: "",
  importerForExport: "",
  isActive: "" 
};

const validateForm = Yup.object().shape({
  name: Yup.string().required("Please enter country name"),
  shortcode: Yup.string().required("Please enter country shortcode"),
  description: Yup.string().required("Please enter country description"),  
});


const CreateCountry = () => {

  const [continentList, setContinentList] = useState([]);

  const handleSubmit = (values) => {
      const postData = {
        "continentId": values.continentId,
        "name": values.name,
        "shortcode": values.shortcode,
        "description": values.description,
        "isExport": values.isExport,
        "isImport": values.isImport,
        "exportFrom": values.exportFrom,
        "exportUpto": values.exportUpto,
        "exportRecords": values.exportRecords,
        "importFrom": values.importFrom,
        "importUpto": values.importUpto,
        "importRecords": values.importRecords,
        "importPointWeightage": values.importPointWeightage,
        "exportPointWeightage": values.exportPointWeightage,
        "exporterForImport": values.exporterForImport,
        "importerForExport": values.importerForExport,
        "isActive": values.isActive
      }
      AxiosMaster({
        method: "POST",
        url: `masterdata-management/country`,
        data: JSON.stringify(postData),
        headers: {
          "Content-Type": "application/json"
        }
      })
        .then(res => {
          Swal.fire({
            title: 'Thank You',
            text: "Country added is successfully.",
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

  const getContinentList = () => {

    AxiosMaster({
      method: "GET",
      url: `masterdata-management/continent/list`,    
    })
      .then(res => {
        setContinentList(res.data.continentList)
      })
      .catch(err => {
        setContinentList([])
      });
  }


  useEffect(() => {
    getContinentList()
  },[])


    return (
      <div>
        <div className="page-header">
          <nav aria-label="breadcrumb">
            <ol className="breadcrumb">
              <li className="breadcrumb-item"><a href="!#" onClick={event => event.preventDefault()}>Countries</a></li>
              <li className="breadcrumb-item active" aria-current="page"><h3 className="page-title">Create Country</h3></li>
            </ol>
          </nav>          
        </div>
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
                          <label><b>Continent</b></label>
                          <Field
                              name="continentId"
                              component="select"
                              className={`form-control ${touched.continentId && errors.continentId ? "is-invalid" : ""}`}
                              autoComplete="off"      
                              onChange={event => {
                                setFieldValue("continentId", event.target.value);
                              }}
                            >    
                              <option value= "" >Please Select Continent</option>
                              {continentList && continentList.length > 0 ? continentList.map((title, qIndex) => ( 
                                <option value= {title.id} >{title.name}</option>
                                )) : null}


                              {touched.continentId && errors.continentId && (<p className="error">{errors.continentId}</p>)}
                            </Field>
                        </div>
                        <div className="form-group">
                          <label><b>Name</b></label>
                          <Field
                            name="name"
                            type="text"
                            className={`form-control ${touched.name && errors.name ? "is-invalid" : ""}`}
                            placeholder="Country Name"
                            onChange={event => {
                              setFieldValue("name", event.target.value);
                            }}
                          />
                          {touched.name && errors.name && (<p className="error">{errors.name}</p>)}
                        </div>
                        <div className="form-group">
                        <label><b>Short Code</b></label>
                          <Field
                            name="shortcode"
                            type="text"
                            className={`form-control ${touched.shortcode && errors.shortcode ? "is-invalid" : ""}`}
                            placeholder="Short Code"
                            onChange={event => {
                              setFieldValue("shortcode", event.target.value);
                            }}
                          />
                          {touched.shortcode && errors.shortcode && (<p className="error">{errors.shortcode}</p>)}
                        </div>
                        <div className="form-group">
                        <label><b>Description</b></label>
                          <Field
                            name="description"
                            type="text"
                            className={`form-control ${touched.description && errors.description ? "is-invalid" : ""}`}
                            placeholder="Description"
                            onChange={event => {
                              setFieldValue("description", event.target.value);
                            }}
                          />
                          {touched.description && errors.description && (<p className="error">{errors.description}</p>)}
                        </div>
                        <div className="form-group">
                        <label><b>Is Export Data Available?</b></label>
                          <Field
                            name="isExport"
                            component="select"
                            className={`form-control ${touched.isExport && errors.isExport ? "is-invalid" : ""}`}
                            autoComplete="off"      
                            onChange={event => {
                              setFieldValue("isExport", event.target.value);
                            }}
                          >    
                            <option value= "" >Please Select</option>
                            <option value= "Y" >Yes</option>
                            <option value= "N" >No</option>
                            {touched.isExport && errors.isExport && (<p className="error">{errors.isExport}</p>)}
                          </Field>   
                        </div>
                        <div className="form-group">
                        <label><b>Export Data Available From</b></label>
                          <Field
                            name="exportFrom"
                            type="date"
                            className={`form-control ${touched.exportFrom && errors.exportFrom ? "is-invalid" : ""}`}
                            placeholder="Data Available From"
                            onChange={event => {
                              setFieldValue("exportFrom", event.target.value);
                            }}
                          />
                          {touched.exportFrom && errors.exportFrom && (<p className="error">{errors.exportFrom}</p>)}
                        </div>
                        <div className="form-group">
                        <label><b>Export Data Available Upto</b></label>
                          <Field
                            name="exportUpto"
                            type="date"
                            className={`form-control ${touched.exportUpto && errors.exportUpto ? "is-invalid" : ""}`}
                            placeholder="Data Available Upto"
                            onChange={event => {
                              setFieldValue("exportUpto", event.target.value);
                            }}
                          />
                          {touched.exportUpto && errors.exportUpto && (<p className="error">{errors.exportUpto}</p>)}
                        </div>
                        <div className="form-group">
                        <label><b>Number of Export Records</b></label>
                          <Field
                            name="exportRecords"
                            type="number"
                            className={`form-control ${touched.exportRecords && errors.exportRecords ? "is-invalid" : ""}`}
                            placeholder="Total number of export records"
                            onChange={event => {
                              setFieldValue("exportRecords", event.target.value);
                            }}
                          />
                          {touched.exportRecords && errors.exportRecords && (<p className="error">{errors.exportRecords}</p>)}
                        </div>
                        <div className="form-group">
                        <label><b>Is Import Data Available?</b></label>
                          <Field
                            name="isImport"
                            component="select"
                            className={`form-control ${touched.isImport && errors.isImport ? "is-invalid" : ""}`}
                            autoComplete="off"      
                            onChange={event => {
                              setFieldValue("isImport", event.target.value);
                            }}
                          >    
                            <option value= "" >Please Select</option>
                            <option value= "Y" >Yes</option>
                            <option value= "N" >No</option>
                            {touched.isImport && errors.isImport && (<p className="error">{errors.isImport}</p>)}
                          </Field>   
                        </div>
                        <div className="form-group">
                        <label><b>Import Data Available From</b></label>
                          <Field
                            name="importFrom"
                            type="date"
                            className={`form-control ${touched.importFrom && errors.importFrom ? "is-invalid" : ""}`}
                            placeholder="Data Available From"
                            onChange={event => {
                              setFieldValue("importFrom", event.target.value);
                            }}
                          />
                          {touched.importFrom && errors.importFrom && (<p className="error">{errors.importFrom}</p>)}
                        </div>
                        <div className="form-group">
                        <label><b>Import Data Available Upto</b></label>
                          <Field
                            name="importUpto"
                            type="date"
                            className={`form-control ${touched.importUpto && errors.importUpto ? "is-invalid" : ""}`}
                            placeholder="Data Available Upto"
                            onChange={event => {
                              setFieldValue("importUpto", event.target.value);
                            }}
                          />
                          {touched.importUpto && errors.importUpto && (<p className="error">{errors.importUpto}</p>)}
                        </div>
                        <div className="form-group">
                        <label><b>Number of Import Records</b></label>
                          <Field
                            name="importRecords"
                            type="number"
                            className={`form-control ${touched.importRecords && errors.importRecords ? "is-invalid" : ""}`}
                            placeholder="Total number of import records"
                            onChange={event => {
                              setFieldValue("importRecords", event.target.value);
                            }}
                          />
                          {touched.importRecords && errors.importRecords && (<p className="error">{errors.importRecords}</p>)}
                        </div>
                        <div className="form-group">
                        <label><b>Point Weightage For Import</b></label>
                          <Field
                            name="importPointWeightage"
                            type="number"
                            className={`form-control ${touched.importPointWeightage && errors.importPointWeightage ? "is-invalid" : ""}`}
                            placeholder="Point Weightage For Each Import Record Download"
                            onChange={event => {
                              setFieldValue("importPointWeightage", event.target.value);
                            }}
                          />
                          {touched.importPointWeightage && errors.importPointWeightage && (<p className="error">{errors.importPointWeightage}</p>)}
                        </div>
                        <div className="form-group">
                        <label><b>Point Weightage For Export</b></label>
                          <Field
                            name="exportPointWeightage"
                            type="number"
                            className={`form-control ${touched.exportPointWeightage && errors.exportPointWeightage ? "is-invalid" : ""}`}
                            placeholder="Point Weightage For Each Export Record Download"
                            onChange={event => {
                              setFieldValue("exportPointWeightage", event.target.value);
                            }}
                          />
                          {touched.exportPointWeightage && errors.exportPointWeightage && (<p className="error">{errors.exportPointWeightage}</p>)}
                        </div>

                        <div className="form-group">
                        <label><b>Show Exporter Name in Search for Import Data</b></label>
                          <Field
                            name="exporterForImport"
                            component="select"
                            className={`form-control ${touched.exporterForImport && errors.exporterForImport ? "is-invalid" : ""}`}
                            autoComplete="off"      
                            onChange={event => {
                              setFieldValue("exporterForImport", event.target.value);
                            }}
                          >    
                            <option value= "" >Please Select</option>
                            <option value= "Y" >Yes</option>
                            <option value= "N" >No</option>
                            {touched.exporterForImport && errors.exporterForImport && (<p className="error">{errors.exporterForImport}</p>)}
                          </Field>   
                        </div>
                        <div className="form-group">
                        <label><b>Show Importer Name in Search for Export Data</b></label>
                          <Field
                            name="importerForExport"
                            component="select"
                            className={`form-control ${touched.importerForExport && errors.importerForExport ? "is-invalid" : ""}`}
                            autoComplete="off"      
                            onChange={event => {
                              setFieldValue("importerForExport", event.target.value);
                            }}
                          >    
                            <option value= "" >Please Select</option>
                            <option value= "Y" >Yes</option>
                            <option value= "N" >No</option>
                            {touched.importerForExport && errors.importerForExport && (<p className="error">{errors.importerForExport}</p>)}
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
                            <option value= "" >Please Select</option>
                            <option value= "Y" >Active</option>
                            <option value= "N" >Inactive</option>
                            {touched.isActive && errors.isActive && (<p className="error">{errors.isActive}</p>)}
                          </Field>   
                        </div>
                        <button type="submit" onClick={(event) => {
                          event.preventDefault();
                          handleSubmit();
                        }} className="btn btn-primary">Create Country</button>
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

export default CreateCountry
