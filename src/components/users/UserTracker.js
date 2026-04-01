import React, { useState, useEffect } from 'react';
import { Formik, Form } from "formik";
import * as Yup from "yup";
import Select from "react-select";
import AxiosUser from '../shared/AxiosUser';
import { Row, Col, Modal, Button, FormGroup } from 'react-bootstrap';
import './UserTracker.css';
import LoginTrackerModel from './LoginTrackerModel';
import QueryTrackerModel from './QueryTrackerModel';
import DownloadTrackerModel from './DownloadTrackerModel';

const validateForm = Yup.object().shape({
  userId: Yup.string().required("Please select user"),
});

const initialValues = {
  userId: "",
};

const UserTracker = () => {
  const [userList, setUserList] = useState([]);
  const [queryList, setQueryList] = useState([]);
  const [totalCount, setTotalCount] = useState(0);
  const [totalNonDeletedCount,setTotalNonDeletedCount]=useState(0);
  const [totalDeletedCount,setTotalDeletedCount]=useState(0);

  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("active");

  const [currentPage, setCurrentPage] = useState(0);
  const [pageSize] = useState(20);
  const [filterUserId, setFilterUserId] = useState("");

  const [rowData, setRowData] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [selectedModelType,setSelectedModelType]=useState('');

  useEffect(() => {
    getUsers();
  }, []);

  // Effect for filter changes (reset to page 0)
  useEffect(() => {
    if (filterUserId) {
      setCurrentPage(0);
      if (activeTab === "active") {
        getUserCount(filterUserId, "N");
        getUserList(filterUserId, 0, "N");
      } else {
        getUserCount(filterUserId, "Y");
        getUserList(filterUserId, 0, "Y");
      }
    }
  }, [filterUserId, activeTab]);

  // Separate effect for page changes only
  useEffect(() => {
    if (filterUserId) {
      if (activeTab === "active") {
        getUserList(filterUserId, currentPage, "N");
      } else {
        getUserList(filterUserId, currentPage, "Y");
      }
    }
  }, [currentPage]);

  const getUsers = () => {
    AxiosUser({
      method: "GET",
      url: `/user-management/user/listmainuser`,
    })
      .then((res) => {
        setUserList(res?.data?.userList || []);
      })
      .catch((err) => {
        console.log("User dropdown error", err);
      });
  };

  const getUserCount = async (uplineId, isDelete) => {
    try {
      const res = await AxiosUser({
        method: "GET",
        url: `/user-management/user/countbyuplineid`,
        params: {
          uplineId,
          isDelete,
        },
      });

      // console.log("=== COUNT API DEBUG ===");
      // console.log("Full response:", res);
      // console.log("Response data:", res?.data);
      // console.log("Response data type:", typeof res?.data);
      
      // Try different response structures
      let count = 0;
      
      // If response is a direct number
      if (typeof res?.data === 'number') {
        count = res.data;
      }
    
      // console.log("Extracted count:", count);
      // console.log("=======================");
      if(isDelete==='N'){
        setTotalNonDeletedCount(count);
        setTotalDeletedCount(0);
      }else{
         setTotalNonDeletedCount(0);
        setTotalDeletedCount(count);
      }
      
      setTotalCount(count);
    } catch (err) {
     // console.log("Count API error", err);
      setTotalCount(0);
      setTotalNonDeletedCount(0);
        setTotalDeletedCount(0);
    }
  };

  const getUserList = async (uplineId, pageNumber, isDelete) => {
    try {
      setLoading(true);
      
      // console.log("Fetching list with params:", {
      //   uplineId,
      //   pageNumber,
      //   isDelete
      // });

      const res = await AxiosUser({
        method: "GET",
        url: `/user-management/user/listbyuplineid`,
        params: {
          uplineId,
          pageNumber,
          isDelete,
        },
      });

      // console.log("=== LIST API DEBUG ===");
      // console.log("List response data:", res?.data);
      
      // Try different response structures for the list
      let list =res.data.userList || [];
      // if (Array.isArray(res?.data)) {
      //   list = res.data;
      // } else if (res?.data?.userList && Array.isArray(res.data.userList)) {
      //   list = res.data.userList;
      // } else if (res?.data?.data && Array.isArray(res.data.data)) {
      //   list = res.data.data;
      // } else if (res?.data?.rows && Array.isArray(res.data.rows)) {
      //   list = res.data.rows;
      // } else if (res?.data?.items && Array.isArray(res.data.items)) {
      //   list = res.data.items;
      // }

      // console.log("Extracted list length:", list.length);
      // console.log("======================");
      
      setQueryList(list);
    } catch (err) {
     // console.log("List API error", err);
      setQueryList([]);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = (values) => {
    setFilterUserId(values.userId);
  };

  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
  };

    const LoginDownloadQueryTracker = (item,type) => {
   // console.log("item", item);
    setRowData(item)
    setShowModal(true)
    setSelectedModelType(type);
  }
    const handleClose = (e) => {
    setShowModal(false)
  }



  // Calculate total pages
  const totalPages = Math.ceil(totalCount / pageSize);
  
  // console.log("Current State:", {
  //   totalCount,
  //   pageSize,
  //   totalPages,
  //   currentPage,
  //   queryListLength: queryList.length,
  //   hasNextPage: currentPage + 1 < totalPages
  // });

  const renderModelComponent=()=>{
    switch(selectedModelType){
      case "login":
        return <LoginTrackerModel rowData={rowData} />
      case "query":
        return  <QueryTrackerModel rowData={rowData} />
      case "download":
        return <DownloadTrackerModel rowData={rowData}/>
        default:
        return <div>No component found</div>;
    }
  }

  const getModelTitle=()=>{
     switch(selectedModelType){
      case "login":
        return "Login Tracker";
      case "query":
        return "Query Tracker" ;
      case "download":
        return "Download Tracker";
      default:
        return "Tracker";  
     }

  }

//   const formatDateTime = (date) => {
//   const d = new Date(date);

//   const day = String(d.getDate()).padStart(2, "0");
//   const month = String(d.getMonth() + 1).padStart(2, "0");
//   const year = d.getFullYear();

//   return `${day}-${month}-${year}`;
// };


const formatDateTime = (date) => {
  const d = new Date(date);

  if (isNaN(d)) return "-";

  const day = String(d.getDate()).padStart(2, "0");
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const year = d.getFullYear();

  const hours = String(d.getHours()).padStart(2, "0");
  const minutes = String(d.getMinutes()).padStart(2, "0");
  const seconds = String(d.getSeconds()).padStart(2, "0");

  return `${day}-${month}-${year}  :  ${hours}:${minutes}:${seconds}`;
};
  return (
    <div>
        <div className="page-header mb-4">
        <nav aria-label="breadcrumb">
          <ol className="breadcrumb mb-2">
            <li className="breadcrumb-item">
              <a href="!#" onClick={(event) => event.preventDefault()}>
              User
              </a>
            </li>
            <li className="breadcrumb-item active" aria-current="page">
              <h3 className="page-title mb-0">User Tracker</h3>
            </li>
          </ol>
        </nav>
      </div>

      <div className="filter-section bg-light p-3 rounded shadow-sm">
        <Formik
          initialValues={initialValues}
          validationSchema={validateForm}
          onSubmit={handleSubmit}
        >
          {({ values, setFieldValue, resetForm, errors, touched }) => (
            <Form>
              <div
                style={{
                  display: "flex",
                  justifyContent: "flex-end",
                  width: "100%",
                  marginTop: "10px"
                }}
              >
                <div
                  className="d-flex flex-wrap align-items-end gap-3 bg-white p-3 rounded shadow-sm"
                  style={{ width: "50%" }}
                >
                  <div className="flex-grow-1" style={{ minWidth: "160px", paddingRight: "10px" }}>
                    <label className="form-label fw-semibold mb-2">User</label>
                    <Select
                      name="userId"
                      options={userList.map((user) => ({
                        value: user.id,
                        label: `${user.firstname} ${user.lastname} (${user.email})`,
                      }))}
                      value={
                        userList
                          .map((user) => ({
                            value: user.id,
                            label: `${user.firstname} ${user.lastname} (${user.email})`,
                          }))
                          .find((option) => option.value === values.userId) || null
                      }
                      onChange={(selectedOption) =>
                        setFieldValue("userId", selectedOption ? selectedOption.value : "")
                      }
                      placeholder="Select User..."
                      isSearchable
                      isClearable
                    />
                    {errors.userId && touched.userId && (
                      <div className="text-danger mt-1">{errors.userId}</div>
                    )}
                  </div>

                      <div style={{ minWidth: "130px", paddingRight: "10px" }}>
                        <button
                          type="submit"
                          className="btn btn-primary w-100"
                          style={{ height: "42px" }}
                          disabled={loading}
                        >
                          {loading ? "LOADING..." : "FILTER"}
                        </button>
                      </div>

                      <div style={{ minWidth: "130px" }}>
                        <button
                          type="button"
                          className="btn btn-secondary w-100"
                          style={{ height: "42px" }}
                          onClick={() => {
                            resetForm();
                            setFilterUserId("");
                            setCurrentPage(0);
                            setTotalCount(0);
                            setQueryList([]);
                            setTotalDeletedCount(0);
                            setTotalNonDeletedCount(0);
                          }}
                        >
                          RESET
                        </button>
                      </div>
                    </div>
                  </div>
                </Form>
              )}
            </Formik>
          </div>

          <div className="card mt-4">
            <div className="card-body">
              <ul className="nav custom-tabs mb-4">
                <li className="nav-item">
                  <button
                    className={`tab-btn ${
                      activeTab === "active" ? "tab-active" : ""
                    }`}
                    onClick={() => setActiveTab("active")}
                  >
                    ✅ Current Users
                    {filterUserId && totalNonDeletedCount > 0 && (
                      <span className="count-badge">{totalNonDeletedCount}</span>
                    )}
                  </button>
                </li>

                <li className="nav-item">
                  <button
                    className={`tab-btn ${
                      activeTab === "deleted" ? "tab-deleted" : ""
                    }`}
                    onClick={() => setActiveTab("deleted")}
                  >
                    🗑 Deleted Users
                    {filterUserId && totalDeletedCount > 0 && (
                      <span className="count-badge danger">
                        {totalDeletedCount}
                      </span>
                    )}
                  </button>
                </li>
              </ul>

              <div className="table-responsive">
                <table className="table table-bordered table-striped table-hover">
                  <thead className="table-dark">
                    <tr>
                      <th>#</th>
                      <th>Name</th>
                      <th>Email</th>
                      <th>Mobile</th>
                      <th>Company</th>
                     
                     
                      <th>Status</th>
                      <th>{activeTab === "active" ? "Created Date" : "Deleted Date"}</th>
                      <th>Activity</th>
                    </tr>
                  </thead>
                  <tbody>
                    {loading ? (
                      <tr>
                        <td  className="text-center">
                          <div className="" role="status">
                            <span className="visually-hidden">Loading...</span>
                          </div>
                        </td>
                      </tr>
                    ) : queryList.length > 0 ? (
                      queryList.map((item, index) => (
                        <tr key={item.id || index}>
                          <td>{currentPage * pageSize + index + 1}</td>
                          <td>{item.firstname} {item.lastname}</td>
                          <td>{item.email}</td>
                          <td>{item.mobile ||  "-"}</td>
                          <td>{item.companyName}</td>
                        
                          <td>
                            
                            {item.isActive=="Y" ? (
                              <span className="badge bg-success">Active</span>
                            ) : (
                              <span className="badge bg-danger">InActive</span>
                            )}
                          </td>

                                               <td>
  {item.isDelete === "Y"
    ? item.modifiedDate
      ? formatDateTime(item.modifiedDate)
      : "-"
    : item.createdDate
      ? formatDateTime(item.createdDate)
      : "-"}
</td>
                          <td>
                              {/* <a className='btn btn-xs btn-primary' onClick={()=>LoginTracker(item)}>Login Tracker</a> &nbsp;
                              <a className='btn btn-xs btn-info'>Query Tracker</a>&nbsp;
                              <a className='btn btn-xs btn-success'>Download Tracker</a>&nbsp; */}

                              <div className="d-flex gap-2">
    <button className="btn btn-sm btn-primary" title="Login Tracker" onClick={()=>LoginDownloadQueryTracker(item,"login")} style={{'fontSize':'30px'}}>
      🔐
    </button>&nbsp;&nbsp;

    <button className="btn btn-sm btn-info" title="Query Tracker" onClick={()=>LoginDownloadQueryTracker(item,"query")}  style={{'fontSize':'30px'}}>
      📄
    </button>&nbsp;&nbsp;

    <button className="btn btn-sm btn-success" title="Download" onClick={()=>LoginDownloadQueryTracker(item,"download")}  style={{'fontSize':'30px'}}>
      ⬇
    </button>&nbsp;
  </div>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td className="text-center">
                          No data found
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>

              {/* Pagination */}
              {filterUserId && totalCount > 0 && (
                <div className="d-flex justify-content-between align-items-center mt-3">
                  <div className="text-muted">
                    Showing {currentPage * pageSize + 1} to {Math.min((currentPage + 1) * pageSize, totalCount)} of {totalCount} entries
                  </div>

                  <nav>
                    <ul className="pagination mb-0">
                      <li className={`page-item ${currentPage === 0 ? 'disabled' : ''}`}>
                        <button
                          className="page-link"
                          onClick={() => handlePageChange(currentPage - 1)}
                          disabled={currentPage === 0}
                        >
                          Previous
                        </button>
                      </li>
                      
                      {[...Array(totalPages)].map((_, index) => (
                        <li key={index} className={`page-item ${currentPage === index ? 'active' : ''}`}>
                          <button
                            className="page-link"
                            onClick={() => handlePageChange(index)}
                          >
                            {index + 1}
                          </button>
                        </li>
                      ))}
                      
                      <li className={`page-item ${currentPage + 1 >= totalPages ? 'disabled' : ''}`}>
                        <button
                          className="page-link"
                          onClick={() => handlePageChange(currentPage + 1)}
                          disabled={currentPage + 1 >= totalPages}
                        >
                          Next
                        </button>
                      </li>
                    </ul>
                  </nav>
                </div>
              )}


                               <Modal className="customModal brandModal" size="lg"
                                  show={showModal}
                                  onHide={handleClose}>
                                  <Modal.Header closeButton className="custmModlHead">
                                      <div ><h3>{getModelTitle()}   </h3> </div>
                                  </Modal.Header>
                                  <Modal.Body>                                           
                                  
                                    {/* <LoginTrackerModel rowData = {rowData} /> */}
                                    {renderModelComponent()}
                                  </Modal.Body>
                              </Modal>

              {/* Temporary Debug Info */}
         {/*     {filterUserId && (
                <div className="mt-3 p-3 bg-light border rounded">
                  <h6>Debug Info:</h6>
                  <pre>
                    Total Count from API: {totalCount}<br/>
                    Page Size: {pageSize}<br/>
                    Calculated Total Pages: {totalPages}<br/>
                    Current Page: {currentPage}<br/>
                    Records on Current Page: {queryList.length}<br/>
                    Should have next page: {currentPage + 1 < totalPages ? 'Yes' : 'No'}
                  </pre>
                </div>
              )}*/}
            </div>
          </div>
        </div>
      );
    };

export default UserTracker;