import React,{useState,useEffect} from 'react';
import AxiosMaster from '../shared/AxiosMaster';
import { Formik, Field, Form } from "formik";
import Loader from '../shared/Loader';
import { Link, Redirect, useHistory } from 'react-router-dom';
import Swal from 'sweetalert2';
import * as Yup from "yup";
import Select from 'react-select'


const initialValues={
    isMaintanance:'',
    siteMessage:'',
    loginMsg:''
}


const validateForm = Yup.object().shape({
  isMaintanance: Yup.string().required("Please select Status"),
  siteMessage: Yup.string().required("Please enter site message"),
  loginMsg: Yup.string().required("Please enter login page message"),
});


function SiteSetting() {

    const [loading,setLoading]=useState(false);
    const [siteSettingData,setSiteSettingData]=useState();

    const history = useHistory();


        const fetchSiteSettingData=()=>{
           AxiosMaster({
                method: "POST",
                url: `/masterdata-management/sitesettings`,    
                })
                .then(res => {
                    console.log("res",res);
                    console.log("res.data.settingsList",res.data.settingsList);
                    setSiteSettingData(res.data.settingsList)
                })
                .catch(err => {
                    setSiteSettingData([])
                });
        }

     useEffect(()=>{
       // fetchSiteSettingData();
       fetchSiteSettingData();
    },[]);


const handleSubmit =  (values) => {
 
    setLoading(true);

    const postData = {
      id: siteSettingData?.[0]?.id ?? null,
      isMaintanance: values.isMaintanance,
      siteMessage: values.siteMessage,
      loginMsg: values.loginMsg,
    };

     AxiosMaster({
      method: "PUT",
      url: "/masterdata-management/updatesitesetting",
      data: postData,
      headers: {
        "Content-Type": "application/json",
      },
    }).then(res => {
              setLoading(false)
              Swal.fire({
                title: 'Thank You',
                text: "Site settings updated successfully",
                icon: 'success',
              }).then(res =>{
                history.push("/sitesetting/siteSetting")
              });
            })
            .catch(err => {
              setLoading(false)
              console.log("Err", err);
              let errorMsg = "Somethhing went wrong, please try again."
            //   if (err.data.errorMsg) {
            //     errorMsg = err.data.errorMsg;
            //   }
              Swal.fire({
                title: 'Oops!',
                text: "Somethhing went wrong, please try again",
                icon: 'error',
              })
            });

};


//   return (
//     <div>SiteSetting - {siteSettingData ? JSON.stringify(siteSettingData) : "No data"}</div>
//   )

  return (
      <div>
        <div className="page-header">
            <nav aria-label="breadcrumb">
              <ol className="breadcrumb">
                <li className="breadcrumb-item"><a href="!#" onClick={event => event.preventDefault()}>Website Setting</a></li>
                <li className="breadcrumb-item active" aria-current="page"> <h3 className="page-title"> Update Settings </h3></li>
              </ol>
            </nav>
        </div>
      <div className="row">
  <div className="col-lg-8 mx-auto grid-margin stretch-card">
    <div className="card shadow-sm">
      
      {/* Card Header */}
      <div className="card-header bg-light">
        <h4 className="mb-0">Site Maintenance Settings</h4>
      </div>

      {/* Card Body */}
      <div className="card-body">

        <Formik
          initialValues={ siteSettingData && siteSettingData.length ? {
             isMaintanance: siteSettingData[0].isMaintanance || '',
             siteMessage: siteSettingData[0].siteMessage || '',
             loginMsg: siteSettingData[0].loginMsg || ''
          } : initialValues}
          enableReinitialize
          validationSchema={validateForm}
          onSubmit={handleSubmit}
        >
         {({ values, errors, setFieldValue, touched, handleSubmit }) => (
            <Form>

              <div className="form-group mb-3">
                <label className="form-label fw-bold">Site Message</label>
                <Field
                  name="siteMessage"
                  type="text"
                  className={`form-control ${touched.siteMessage && errors.siteMessage ? "is-invalid" : ""}`}
                  placeholder="Enter site maintenance message"
                />
                {touched.siteMessage && errors.siteMessage && (<div className="invalid-feedback">{errors.siteMessage}</div>)}
              </div>

              <div className="form-group mb-3">
                <label className="form-label fw-bold">Login Page Message</label>
                <Field as="textarea" name="loginMsg" rows="4" className={`form-control ${touched.loginMsg && errors.loginMsg ? "is-invalid" : ""}`} placeholder="Message to display on login page" />
                {touched.loginMsg && errors.loginMsg && (<div className="invalid-feedback">{errors.loginMsg}</div>)}
              </div>

              <div className="form-group mb-4">
                <label className="form-label fw-bold">Maintenance Status</label>
                <Field as="select" name="isMaintanance" className={`form-control ${touched.isMaintanance && errors.isMaintanance ? "is-invalid" : ""}`}>
                  <option value="">--  Maintenance Status --</option>
                  <option value="Y">YES</option>
                  <option value="N">NO</option>
                </Field>
                {touched.isMaintanance && errors.isMaintanance && (<div className="invalid-feedback">{errors.isMaintanance}</div>)}
              </div>

              <div className="text-end">
                <button type="submit" className="btn btn-primary">Save Settings</button>
              </div>

            </Form>
         )}
        </Formik>

      </div>
    </div>
  </div>
</div>

        {loading ? <Loader/> : null }
      </div>
    )
}

export default SiteSetting