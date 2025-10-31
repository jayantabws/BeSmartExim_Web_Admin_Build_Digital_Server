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

  const [loginList, setLoginList] = useState([]);
  const [userList, setUserList] = useState([]);
  const [sortName, setSortName] = useState(undefined);
  const [sortOrder, setSortOrder] = useState(undefined);
  const [loading, setLoading] = useState(false);
  const [totalCount, setTotalCount] = useState(0);
  const [searchUserId, setSearchUserId] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize] = useState(20); // Fixed 20 per page
  const [mainTotalCount, setMainTotalCount] = useState(0); // To store the main total count 

  function onSortChange(sortName, sortOrder) {
    setSortName(sortName);
    setSortOrder(sortOrder);
  }

  function onPageChange(page, sizePerPage) {
    console.log("Page changed to:", page);
    setCurrentPage(page);
    handleSubmitWithPage({ userId: searchUserId }, page);
  }

  useEffect(() => {
     initializeData();
     getTotalCount();
  }, []);
  
useEffect(() => {
  console.log("Total Count Updated:", totalCount);
}, [totalCount]);

const getTotalCount = async (filterUserId = "") => {
  try {
    if (!userId || !userData) {
    //  console.log("No userId or userData found - skipping count API");
      return 0;
    }

    let userID = userData && userData.uplineId == 0 ? "uplineId" : "userId";
    let url = `/user-management/user/loginlistcount`;
    if (userID) {
      url += `?userID=${userID}`;
    }
    if (filterUserId) {
      url += `&userId=${filterUserId}`;
    }

    console.log("Total Count API URL:", url);
    const res = await AxiosUser({
      method: "GET",
      url,
      headers: { "Content-Type": "application/json" },
    });

    console.log("Total Count Response:", res);
    setMainTotalCount(res.data.totalCount || 0);
    if (res?.status === 200 && res.data != null) {
      const count =
        res.data.loginListCount ??
        res.data.totalCount ??
        res.data.count ??
        res.data.total ??
        (typeof res.data === "number" ? res.data : 0);

      console.log("Extracted Count:", count);
      if (count > 0) {
        setTotalCount(count); // Ensure this is being called
        console.log("Updated totalCount:", count); // Debug log
        return count;
      }
    }

  //  console.log("No valid count from API");
    return 0;
  } catch (err) {
    //console.log("Error fetching count:", err);
    return 0;
  }
};
  const initializeData = async () => {
    await getUsers();
    // Load data first
    await handleSubmitWithPage({}, 1);
    // Only try to get count if we have valid credentials
    if (userId && userData) {
      await getTotalCount();
    }
  };

  const getUsers = async () => {
    setLoading(true);
    try {
      const res = await AxiosUser({
        method: "GET",
        url: `/user-management/user/list`,
      });
      console.log("Users loaded:", res.data.userList?.length || 0);
      setUserList(res.data.userList || []);

    } catch (err) {
     // console.log("Error fetching users:", err);
      setUserList([]);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (values) => {
   // console.log("Form submitted with values:", values);
    setCurrentPage(1);
    await handleSubmitWithPage(values, 1);
    
    // Only get count if we have valid credentials, otherwise keep estimated count
    if (userId && userData) {
      await getTotalCount(values.userId);
    }
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

  
  const handleSubmitWithPage = async (values, page = 1) => {
  //  console.log("Loading page:", page, "with values:", values);
    setLoading(true);
    try {
      let url = `/user-management/user/loginlist?pageNumber=${page}`;
      if (values?.userId) {
        url += `&userId=${values.userId}`;
      }

    //  console.log("Login List API URL:", url);
      const res = await AxiosUser({
        method: "GET",
        url,
        headers: { "Content-Type": "application/json" },
      });

    //  console.log("Login List Response:", res.data);

      let loginData = [];
      if (res.data.loginList) {
        loginData = res.data.loginList;
      } else if (Array.isArray(res.data)) {
        loginData = res.data;
      } else if (res.data.data) {
        loginData = res.data.data;
      }

     // console.log("Login data loaded:", loginData.length, "records");

         /*DATA FORMATE  START*/
          const formattedList = loginData.map(item => {
        // API now returns ISO datetime in loginTime/logoutTime fields
        // Pass the ISO datetime as the timeString parameter
        const login = formatDateTime(item.loginDate, item.loginTime);
        const logout = formatDateTime(item.logoutDate, item.logoutTime);

        return {
          ...item,
          loginDateOnly: login.date,
          loginTimeOnly: login.time,
          logoutDateOnly: logout.date,
          logoutTimeOnly: logout.time
        };
      });
      setLoginList(formattedList);
        //setTableData(formattedData);
        /*DATA FORMATE END */

     // setLoginList(loginData);
      setSearchUserId(values?.userId || "");
      setCurrentPage(page);

      // Always estimate total count from data if we don't have a reliable count API
      if (loginData.length > 0) {

     
        
        let estimatedTotal;
        if (loginData.length === pageSize) {
          // Full page - estimate more data exists
          estimatedTotal = (page * pageSize) + pageSize;
        } else {
          // Partial page - this is likely the last page
          estimatedTotal = ((page - 1) * pageSize) + loginData.length;
        }
        
        // Only update totalCount if our estimate is higher or totalCount is 0
        if (estimatedTotal > totalCount || totalCount === 0) {
          setTotalCount(estimatedTotal);
         // console.log("Updated total count to:", estimatedTotal);
        }
      } else if (page === 1 && loginData.length === 0) {
        // No data on first page
        setTotalCount(0);
      }

    } catch (err) {
     // console.log("Error fetching login list:", err);
      setLoginList([]);
      if (page === 1) {
        setTotalCount(0);
      }
    } finally {
      setLoading(false);
    }
  };

  const indexN = (cell, row, enumObject, index) => {
    return <div>{(currentPage - 1) * pageSize + index + 1}</div>;
  };

  const dateFormatter = (cell) => {
    return cell ? moment(cell).format("MMM DD, YYYY HH:mm") : "N/A";
  };

  const options = {
    sortName,
    sortOrder,
    onSortChange,
    page: currentPage,
    sizePerPage: pageSize,
    onPageChange,
    paginationSize: 5,
    prePage: "Prev",
    nextPage: "Next",
    firstPage: "First",
    lastPage: "Last",
    hideSizePerPage: true,
    paginationShowsTotal: (start, to) =>
      `Showing ${start} to ${to} of ${totalCount} results`,
    noDataText: loading ? "Loading..." : "No data available",
    remote: true,
    fetchInfo: {
      dataTotalSize: totalCount,
    },
  };

  // Debug info
  // console.log("Current State:", {
  //   loginListLength: loginList.length,
  //   totalCount,
  //   currentPage,
  //   loading,
  //   userId: userId ? "exists" : "missing",
  //   userData: userData ? "exists" : "missing"
  // });

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
  validationSchema={validateForm}
  onSubmit={handleSubmit}
>
  {({ values, errors, touched, setFieldValue }) => (
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
                margin:"15px",
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
            marginBottom:"18px",
           
          }}
          disabled={loading}
        >
          {loading ? "LOADING..." : "FILTER"}
        </button>
      </div>
    </Form>
  )}
</Formik>




      </div>

      <div className="row">
        <div className="col-lg-12 grid-margin stretch-card">
          <div className="card">
            <div className="card-body">
              {/* Debug Info */}
              {/* <div className="mb-2 text-muted small">
                Debug: Records: {loginList.length}, Total: {totalCount}, Page: {currentPage}
                {(!userId || !userData) && " - Using estimated count (no auth data)"}
              </div> */}
              
              {loading && (
                <div className="text-center my-3">
                  <div
                    className="spinner-border text-primary"
                    role="status"
                  ></div>
                </div>
              )}
             <BootstrapTable
                data={loginList}
                striped
                hover
                pagination={totalCount > 0}
                options={options}
                fetchInfo={{ dataTotalSize: totalCount }}
                remote={true}
              >
                <TableHeaderColumn
                  width="50"
                  isKey
                  dataField="id"
                  dataFormat={indexN}
                >
                  #
                </TableHeaderColumn>
                <TableHeaderColumn width="150" dataField="name" dataSort>
                  Name
                </TableHeaderColumn>
                <TableHeaderColumn width="175" dataField="email" dataSort>
                  Email
                </TableHeaderColumn>
                <TableHeaderColumn width="150" dataField="ipAddress" dataSort>
                  IP Address
                </TableHeaderColumn>
                <TableHeaderColumn width="200" dataField="sessionId" dataSort>
                  Session ID
                </TableHeaderColumn>
                
                {/* Use separate date and time fields */}
                <TableHeaderColumn
                  width="120"
                  dataField="loginDateOnly"
                  dataSort
                >
                  Login Date
                </TableHeaderColumn>
                <TableHeaderColumn
                  width="120"
                  dataField="loginTimeOnly"
                  dataSort
                >
                  Login Time
                </TableHeaderColumn>
                <TableHeaderColumn
                  width="120"
                  dataField="logoutDateOnly"
                  dataSort
                >
                  Logout Date
                </TableHeaderColumn>
                <TableHeaderColumn
                  width="120"
                  dataField="logoutTimeOnly"
                  dataSort
                >
                  Logout Time
                </TableHeaderColumn>
              </BootstrapTable>

            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginTracker;