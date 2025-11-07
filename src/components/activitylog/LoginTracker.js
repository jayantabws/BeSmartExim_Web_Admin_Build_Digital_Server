import React, { useState, useEffect } from "react";
import AxiosUser from "../shared/AxiosUser";
import Swal from "sweetalert2";
import { BootstrapTable, TableHeaderColumn } from "react-bootstrap-table";
import { Formik, Field, Form } from "formik";
import * as Yup from "yup";
import moment from "moment";
import Select from "react-select";

const validateForm = Yup.object().shape({
  userId: Yup.string(),
  fromDate: Yup.date(),
  toDate: Yup.date(),
});

const initialValues = {
  userId: "",
  fromDate: "",
  toDate: "",
};

const LoginTracker = () => {
  const userId = localStorage.getItem("userToken");
  let userData = localStorage.getItem("user");
  userData = userData ? JSON.parse(userData) : {};

  const [totalCount, setTotalCount] = useState(0);
  const [loginList, setLoginList] = useState([]);
  const [userList, setUserList] = useState([]);
  const [sortName, setSortName] = useState(undefined);
  const [sortOrder, setSortOrder] = useState(undefined);
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize] = useState(20); // 20 records per page
  const [filterUserId, setFilterUserId] = useState("");
  const [filterFromDate, setFilterFromDate] = useState("");
  const [filterToDate, setFilterToDate] = useState("");

  function onSortChange(sortName, sortOrder) {
    console.info('onSortChange', arguments);
    setSortName(sortName);
    setSortOrder(sortOrder);
  }

  const getTotalCount = (filterUserId = null, fromDate = null, toDate = null) => {
    let url = `/user-management/user/loginlistcount`;
    const params = new URLSearchParams();
    
    if (filterUserId) {
      params.append('userId', filterUserId);
    }
    if (fromDate) {
      params.append('fromDate', fromDate);
    }
    if (toDate) {
      params.append('toDate', toDate);
    }
    
    if (params.toString()) {
      url += `?${params.toString()}`;
    }

    console.log("Login Count URL:", url);

    AxiosUser({
      method: "GET",
      url: url,
    }).then((res) => {
        console.log("Login Count Res > >>", res);
        if (res.status === 200) {
          // Handle different response structures for login count
          let count = 0;
          if (typeof res.data === 'number') {
            count = res.data;
          } else if (res.data && typeof res.data.loginListCount === 'number') {
            count = res.data.loginListCount;
          } else if (res.data && typeof res.data.totalCount === 'number') {
            count = res.data.totalCount;
          } else if (res.data && typeof res.data.count === 'number') {
            count = res.data.count;
          } else if (res.data && typeof res.data === 'object') {
            count = res.data.total || res.data.result || 0;
          } else {
            count = res.data || 0;
          }
          
          console.log("Setting login total count to:", count);
          setTotalCount(count);
        } else {
          console.log("Non-200 response, setting count to 0");
          setTotalCount(0);
        }
      })
      .catch((err) => {
        console.error("Error fetching login count:", err);
        // Reset count to 0 when there's an error
        setTotalCount(0);
      });
  };

  useEffect(() => {
    getUsers();
    handleSubmitWithPage("", "", "", 1);
    getTotalCount();
  }, []);

  const getUsers = () => {
    AxiosUser({
      method: "GET",
      url: `/user-management/user/list`,
    })
      .then((res) => {
        setUserList(res.data.userList);
      })
      .catch((err) => {
        console.log("Err", err);
      });
  };

  const handleSubmit = (values) => {
    setCurrentPage(1); // Reset to first page when filtering
    setFilterUserId(values.userId);
    setFilterFromDate(values.fromDate);
    setFilterToDate(values.toDate);
    
    // Reset count before making new requests
    setTotalCount(0);
    
    handleSubmitWithPage(values.userId, values.fromDate, values.toDate, 1);
    getTotalCount(values.userId, values.fromDate, values.toDate);
  };

  const formatDateTime = (dateString, timeString) => {
    // If timeString contains a full ISO datetime, parse it
    if (timeString && (timeString.includes('T') || timeString.includes('Z'))) {
      const dateObj = moment(timeString);
      if (dateObj.isValid()) {
        return { 
          date: dateObj.format("DD/MM/YYYY"), 
          time: dateObj.format("hh:mm:ss A") 
        };
      }
    }
    
    // If dateString contains a full ISO datetime, parse it
    if (dateString && (dateString.includes('T') || dateString.includes('Z'))) {
      const dateObj = moment(dateString);
      if (dateObj.isValid()) {
        return { 
          date: dateObj.format("DD/MM/YYYY"), 
          time: dateObj.format("hh:mm:ss A") 
        };
      }
    }
    
    // Handle cases where date and time are separate fields
    if (dateString && timeString && !timeString.includes('T')) {
      return { date: dateString, time: timeString };
    }
    
    // Handle single date string
    if (dateString && !timeString) {
      if (dateString.includes('T') || dateString.includes(' ')) {
        const dateObj = moment(dateString);
        if (dateObj.isValid()) {
          return { 
            date: dateObj.format("DD/MM/YYYY"), 
            time: dateObj.format("hh:mm:ss A") 
          };
        }
      }
      return { date: dateString, time: "-" };
    }
    
    return { date: "-", time: "-" };
  };

  const handleSubmitWithPage = (userIdValue, fromDate, toDate, page) => {
    setLoading(true);
    let url = `/user-management/user/loginlist?pageNumber=${page}&pageSize=${pageSize}`;
    
    const params = new URLSearchParams(`pageNumber=${page}&pageSize=${pageSize}`);
    if (userIdValue) {
      params.append('userId', userIdValue);
    }
    if (fromDate) {
      params.append('fromDate', fromDate);
    }
    if (toDate) {
      params.append('toDate', toDate);
    }
    
    url = `/user-management/user/loginlist?${params.toString()}`;

    console.log("Login List URL:", url);

    AxiosUser({
      method: "GET",
      url: url,
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((res) => {
        console.log("URL", url);
        console.log("Login List", res.data);
        
        let loginData = [];
        if (res.data.loginList) {
          loginData = res.data.loginList;
        } else if (Array.isArray(res.data)) {
          loginData = res.data;
        } else if (res.data.data) {
          loginData = res.data.data;
        }

        console.log("Data Length ", loginData?.length || 0);

        // Format the data with date/time separation
        const formattedList = loginData.map((item, index) => {
          const login = formatDateTime(item.loginDate, item.loginTime);
          const logout = formatDateTime(item.logoutDate, item.logoutTime);

          return {
            ...item,
            // Ensure we have a unique key field
            id: item.id || `login-${page}-${index}`,
            loginDateOnly: login.date,
            loginTimeOnly: login.time,
            logoutDateOnly: logout.date,
            logoutTimeOnly: logout.time
          };
        });

        setLoginList(formattedList);
        setCurrentPage(page);

        // If no data is returned, make sure count is also 0
        if (loginData.length === 0 && page === 1) {
          console.log("No data found, ensuring count is 0");
          setTotalCount(0);
        }
      })
      .catch((err) => {
        console.log("Err", err);
        setLoginList([]);
        // Reset count to 0 when there's an error
        setTotalCount(0);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const handlePageChange = (page) => {
    if (page > 0 && page <= Math.ceil(totalCount / pageSize)) {
      handleSubmitWithPage(filterUserId, filterFromDate, filterToDate, page);
    }
  };

  // Generate page numbers for pagination
  const generatePageNumbers = () => {
    const totalPages = Math.ceil(totalCount / pageSize);
    const pageNumbers = [];
    const maxVisiblePages = 5;
    
    let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
    let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);
    
    if (endPage - startPage < maxVisiblePages - 1) {
      startPage = Math.max(1, endPage - maxVisiblePages + 1);
    }
    
    for (let i = startPage; i <= endPage; i++) {
      pageNumbers.push(i);
    }
    
    return pageNumbers;
  };

  const indexN = (cell, row, enumObject, index) => {
    return <div>{(currentPage - 1) * pageSize + index + 1}</div>;
  };

  const options = {
    sortName: sortName,
    sortOrder: sortOrder,
    onSortChange: onSortChange,
  };

  const totalPages = Math.ceil(totalCount / pageSize);

  return (
    <div>
      <div className="page-header mb-4">
        <nav aria-label="breadcrumb">
          <ol className="breadcrumb mb-2">
            <li className="breadcrumb-item">
              <a href="!#" onClick={(event) => event.preventDefault()}>
                Activity Log
              </a>
            </li>
            <li className="breadcrumb-item active" aria-current="page">
              <h3 className="page-title mb-0">Login Tracker</h3>
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
          {({ values, setFieldValue, resetForm }) => (
            <Form>
              <div
                className="d-flex flex-wrap align-items-end justify-content-between bg-white p-4 rounded shadow-sm"
                style={{ width: "100%", marginTop: "10px", gap: "15px" }}
              >
                {/* From Date */}
                <div className="flex-fill" style={{ minWidth: "200px", maxWidth: "250px" }}>
                  <label className="form-label fw-semibold mb-2 text-dark">
                    From Date
                  </label>
                  <input
                    type="date"
                    name="fromDate"
                    value={values.fromDate || ""}
                    onChange={(e) => setFieldValue("fromDate", e.target.value)}
                    className="form-control"
                    style={{
                      height: "42px",
                      borderRadius: "6px",
                      border: "1px solid #ced4da",
                      fontSize: "14px"
                    }}
                  />
                </div>

                {/* To Date */}
                <div className="flex-fill" style={{ minWidth: "200px", maxWidth: "250px" }}>
                  <label className="form-label fw-semibold mb-2 text-dark">
                    To Date
                  </label>
                  <input
                    type="date"
                    name="toDate"
                    value={values.toDate || ""}
                    onChange={(e) => setFieldValue("toDate", e.target.value)}
                    className="form-control"
                    style={{
                      height: "42px",
                      borderRadius: "6px",
                      border: "1px solid #ced4da",
                      fontSize: "14px"
                    }}
                  />
                </div>

                {/* User Dropdown */}
                <div className="flex-fill" style={{ minWidth: "280px", maxWidth: "350px" }}>
                  <label className="form-label fw-semibold mb-2 text-dark">
                    User
                  </label>
                  <Select
                    name="userId"
                    options={userList.map((user) => ({
                      value: user.id,
                      label: `${user.firstname} ${user.lastname} (${user.email})`,
                    }))}
                    value={userList
                      .map((user) => ({
                        value: user.id,
                        label: `${user.firstname} ${user.lastname} (${user.email})`,
                      }))
                      .find((option) => option.value === values.userId) || null}
                    onChange={(selectedOption) =>
                      setFieldValue("userId", selectedOption ? selectedOption.value : "")
                    }
                    placeholder="Select User..."
                    classNamePrefix="select"
                    isSearchable
                    isClearable
                    styles={{
                      control: (base, state) => ({
                        ...base,
                        height: "42px",
                        minHeight: "42px",
                        borderRadius: "6px",
                        borderColor: state.isFocused ? "#007bff" : "#ced4da",
                        boxShadow: state.isFocused
                          ? "0 0 0 0.2rem rgba(0,123,255,.25)"
                          : "none",
                        "&:hover": { borderColor: "#007bff" },
                        fontSize: "14px"
                      }),
                      valueContainer: (base) => ({
                        ...base,
                        padding: "0 8px",
                        height: "40px",
                        display: "flex",
                        alignItems: "center"
                      }),
                      input: (base) => ({
                        ...base,
                        margin: 0,
                        padding: 0
                      }),
                      menu: (base) => ({
                        ...base,
                        zIndex: 9999,
                        fontSize: "14px"
                      }),
                      option: (base, state) => ({
                        ...base,
                        fontSize: "14px",
                        padding: "8px 12px"
                      })
                    }}
                  />
                </div>

                {/* Action Buttons Container */}
                <div className="d-flex align-items-end" style={{ minWidth: "280px", gap: "10px" }}>
                  {/* Filter Button */}
                  <div className="flex-fill">
                    <label className="form-label fw-semibold mb-2 text-dark">
                      Action
                    </label>
                    <button
                      type="submit"
                      className="btn btn-primary fw-semibold shadow-sm w-100 d-flex align-items-center justify-content-center"
                      style={{
                        height: "42px",
                        borderRadius: "6px",
                        fontSize: "14px",
                        fontWeight: "600",
                        letterSpacing: "0.5px"
                      }}
                      disabled={loading}
                    >
                      {loading ? (
                        <>
                          <span className="spinner-border spinner-border-sm me-2" role="status"></span>
                          LOADING...
                        </>
                      ) : (
                        <>
                          <i className="fas fa-search me-2"></i>
                          FILTER
                        </>
                      )}
                    </button>
                  </div>

                  {/* Reset Button */}
                  <div className="flex-fill">
                    <label className="form-label fw-semibold mb-2 text-secondary">
                      &nbsp;
                    </label>
                    <button
                      type="button"
                      onClick={() => {
                        const defaultFromDate = "";
                        const defaultToDate = "";
                        
                        resetForm({
                          values: {
                            userId: "",
                            fromDate: defaultFromDate,
                            toDate: defaultToDate,
                          }
                        });
                        
                        setCurrentPage(1);
                        setFilterUserId("");
                        setFilterFromDate(defaultFromDate);
                        setFilterToDate(defaultToDate);
                        
                        // Reset count before making new requests
                        setTotalCount(0);
                        
                        handleSubmitWithPage("", defaultFromDate, defaultToDate, 1);
                        getTotalCount("", defaultFromDate, defaultToDate);
                      }}
                      className="btn btn-outline-secondary fw-semibold shadow-sm w-100 d-flex align-items-center justify-content-center"
                      style={{
                        height: "42px",
                        borderRadius: "6px",
                        fontSize: "14px",
                        fontWeight: "600",
                        letterSpacing: "0.5px",
                        borderColor: "#6c757d",
                        color: "#6c757d"
                      }}
                      disabled={loading}
                    >
                      <i className="fas fa-undo me-2"></i>
                      RESET
                    </button>
                  </div>
                </div>
              </div>
            </Form>
          )}
        </Formik>
      </div>

      <div className="row">
        <div className="col-lg-12 grid-margin stretch-card">
          <div className="card">
            <div className="card-body">
              {loading ? (
                <div className="text-center my-3">
                  <div className="spinner-border text-primary" role="status">
                    <span className="sr-only">Loading...</span>
                  </div>
                  <p className="mt-2">Loading login data...</p>
                </div>
              ) : (
                <div>
                  <BootstrapTable data={loginList} striped hover options={options}>
                    <TableHeaderColumn width='50' isKey dataField='id' dataFormat={indexN}>Sl No</TableHeaderColumn>
                    <TableHeaderColumn width='150' dataField='name' dataSort={true}>Name</TableHeaderColumn>
                    <TableHeaderColumn width='175' dataField='email' dataSort={true}>Email</TableHeaderColumn>
                    <TableHeaderColumn width='150' dataField='ipAddress' dataSort={true}>IP Address</TableHeaderColumn>
                    <TableHeaderColumn width='200' dataField='sessionId' dataSort={true}>Session ID</TableHeaderColumn>
                    <TableHeaderColumn width='120' dataField='loginDateOnly' dataSort={true}>Login Date</TableHeaderColumn>
                    <TableHeaderColumn width='120' dataField='loginTimeOnly' dataSort={true}>Login Time</TableHeaderColumn>
                    <TableHeaderColumn width='120' dataField='logoutDateOnly' dataSort={true}>Logout Date</TableHeaderColumn>
                    <TableHeaderColumn width='120' dataField='logoutTimeOnly' dataSort={true}>Logout Time</TableHeaderColumn>
                  </BootstrapTable>

                  {/* Custom Pagination */}
                  {totalCount > 0 && (
                    <div className="d-flex justify-content-between align-items-center mt-4 p-3" style={{ backgroundColor: '#f8f9fa', borderRadius: '8px' }}>
                      <div>
                        <span className="text-muted">
                          Showing <strong>{(currentPage - 1) * pageSize + 1}</strong> to{" "}
                          <strong>{Math.min(currentPage * pageSize, totalCount)}</strong> of{" "}
                          <strong>{totalCount}</strong> login records
                        </span>
                      </div>
                      
                      <div className="d-flex align-items-center">
                        <button
                          className="btn btn-sm btn-outline-primary me-1"
                          disabled={currentPage === 1}
                          onClick={() => handlePageChange(1)}
                          style={{ marginRight: '5px' }}
                          title="First Page"
                        >
                          <i className="fas fa-angle-double-left"></i> First
                        </button>

                        <button
                          className="btn btn-sm btn-outline-primary"
                          disabled={currentPage === 1}
                          onClick={() => handlePageChange(currentPage - 1)}
                          style={{ marginRight: '5px' }}
                          title="Previous Page"
                        >
                          <i className="fas fa-angle-left"></i> Prev
                        </button>

                        <div className="mx-2">
                          {generatePageNumbers().map((pageNum) => (
                            <button
                              key={pageNum}
                              className={`btn btn-sm ${
                                currentPage === pageNum 
                                  ? 'btn-primary' 
                                  : 'btn-outline-primary'
                              }`}
                              onClick={() => handlePageChange(pageNum)}
                              style={{ 
                                marginRight: '3px', 
                                minWidth: '35px',
                                fontWeight: currentPage === pageNum ? 'bold' : 'normal'
                              }}
                            >
                              {pageNum}
                            </button>
                          ))}
                        </div>

                        <button
                          className="btn btn-sm btn-outline-primary"
                          disabled={currentPage === totalPages}
                          onClick={() => handlePageChange(currentPage + 1)}
                          style={{ marginRight: '5px' }}
                          title="Next Page"
                        >
                          Next <i className="fas fa-angle-right"></i>
                        </button>

                        <button
                          className="btn btn-sm btn-outline-primary"
                          disabled={currentPage === totalPages}
                          onClick={() => handlePageChange(totalPages)}
                          title="Last Page"
                        >
                          Last <i className="fas fa-angle-double-right"></i>
                        </button>
                      </div>
                    </div>
                  )}

                  {/* No Data Message */}
                  {!loading && loginList.length === 0 && (
                    <div className="text-center py-4">
                      <div className="alert alert-info">
                        <i className="fas fa-info-circle me-2"></i>
                        No login records found matching your search criteria.
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginTracker;