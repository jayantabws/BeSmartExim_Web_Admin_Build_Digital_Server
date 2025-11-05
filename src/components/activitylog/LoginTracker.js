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
});

const initialValues = {
  userId: "",
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

  function onSortChange(sortName, sortOrder) {
    console.info('onSortChange', arguments);
    setSortName(sortName);
    setSortOrder(sortOrder);
  }

  const getTotalCount = (filterUserId = null) => {
    let url = `/user-management/user/loginlistcount`;
    if (filterUserId) {
      url += `?userId=${filterUserId}`;
    }

    AxiosUser({
      method: "GET",
      url: url,
    }).then((res) => {
        console.log("Login Count Res > >>", res);
        if (res.data && res.status === 200) {
          // Handle different response structures for login count
          let count = 0;
          if (typeof res.data === 'number') {
            count = res.data;
          } else if (res.data.loginListCount) {
            count = res.data.loginListCount;
          } else if (res.data.totalCount) {
            count = res.data.totalCount;
          } else if (res.data.count) {
            count = res.data.count;
          } else {
            count = res.data || 0;
          }
          setTotalCount(count);
        }
      })
      .catch((err) => {
        console.error("Error fetching login count:", err);
        setTotalCount(0);
      });
  };

  useEffect(() => {
    getUsers();
    handleSubmitWithPage("", 1);
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

      // Reset count before making new requests
    setTotalCount(0);
    handleSubmitWithPage(values.userId, 1);
    getTotalCount(values.userId);
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

  const handleSubmitWithPage = (userIdValue, page) => {
    setLoading(true);
    let url = `/user-management/user/loginlist?pageNumber=${page}&pageSize=${pageSize}`;
    if (userIdValue) {
      url += `&userId=${userIdValue}`;
    }

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
      if (res.data.loginList?.length === 0 && page === 1) {
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
      handleSubmitWithPage(filterUserId, page);
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
      <div className="page-header">
        <nav aria-label="breadcrumb">
          <ol className="breadcrumb">
            <li className="breadcrumb-item">
              <a href="!#" onClick={(e) => e.preventDefault()}>
                Activity Log
              </a>
            </li>
            <li className="breadcrumb-item active" aria-current="page">
              <h3 className="page-title">Login Tracker</h3>
            </li>
          </ol>
        </nav>

        <Formik
          initialValues={initialValues}
          onSubmit={handleSubmit}
        >
          {({ values, errors, setFieldValue, setFieldError, touched, isValid, handleSubmit, submitForm }) => {
            return (
              <Form>
                <div className="d-flex justify-content-end align-items-center gap-2 mb-3 flex-wrap">
                  <div style={{ minWidth: "400px", flex: "1 1 auto" }}>
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
                      onChange={(selectedOption) => {
                        setFieldValue("userId", selectedOption ? selectedOption.value : "");
                      }}
                      placeholder="Select User..."
                      classNamePrefix="select"
                      isSearchable
                      styles={{
                        control: (base, state) => ({
                          ...base,
                          height: "42px",
                          minHeight: "42px",
                          margin: "15px",
                          borderColor: state.isFocused ? "#007bff" : "#ced4da",
                          boxShadow: state.isFocused
                            ? "0 0 0 0.2rem rgba(0,123,255,.25)"
                            : "none",
                          "&:hover": { borderColor: "#007bff" },
                        }),
                        indicatorsContainer: (base) => ({
                          ...base,
                          height: "40px",
                        }),
                        valueContainer: (base) => ({
                          ...base,
                          height: "40px",
                          padding: "0 8px",
                        }),
                        menu: (base) => ({
                          ...base,
                          zIndex: 9999,
                          minWidth: "400px",
                        }),
                      }}
                    />
                  </div>

                  <button
                    type="submit"
                    className="btn btn-primary px-4 fw-semibold"
                    style={{
                      height: "42px",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      flex: "0 0 auto",
                      marginBottom: "18px",
                    }}
                    disabled={loading}
                  >
                    {loading ? "LOADING..." : "FILTER"}
                  </button>
                </div>
              </Form>
            )
          }}
        </Formik>
      </div>

      <div className="row">
        <div className="col-lg-12 grid-margin stretch-card">
          <div className="card">
            <div className="card-body">
              {loading ? (
                <div className="text-center my-3">
                  <div className="spinner-border text-primary" role="status"></div>
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

                  {/* Custom Pagination - Same as QueryTracker */}
                  {totalCount > 0 && (
                    <div className="d-flex justify-content-between align-items-center mt-3">
                      <span>
                        Showing {(currentPage - 1) * pageSize + 1} to{" "}
                        {Math.min(currentPage * pageSize, totalCount)} of{" "}
                        {totalCount} results
                      </span>
                      
                      <div className="d-flex align-items-center">
                        {/* First Page */}
                        <button
                          className="btn btn-sm btn-outline-primary me-1"
                          disabled={currentPage === 1}
                          onClick={() => handlePageChange(1)}
                          style={{ marginRight: '5px' }}
                        >
                          First
                        </button>

                        {/* Previous Page */}
                        <button
                          className="btn btn-sm btn-outline-primary"
                          disabled={currentPage === 1}
                          onClick={() => handlePageChange(currentPage - 1)}
                          style={{ marginRight: '5px' }}
                        >
                          Prev
                        </button>

                        {/* Page Numbers */}
                        {generatePageNumbers().map((pageNum) => (
                          <button
                            key={pageNum}
                            className={`btn btn-sm ${
                              currentPage === pageNum 
                                ? 'btn-primary' 
                                : 'btn-outline-primary'
                            }`}
                            onClick={() => handlePageChange(pageNum)}
                            style={{ marginRight: '5px' }}
                          >
                            {pageNum}
                          </button>
                        ))}

                        {/* Next Page */}
                        <button
                          className="btn btn-sm btn-outline-primary"
                          disabled={currentPage === totalPages}
                          onClick={() => handlePageChange(currentPage + 1)}
                          style={{ marginRight: '5px' }}
                        >
                          Next
                        </button>

                        {/* Last Page */}
                        <button
                          className="btn btn-sm btn-outline-primary"
                          disabled={currentPage === totalPages}
                          onClick={() => handlePageChange(totalPages)}
                        >
                          Last
                        </button>
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