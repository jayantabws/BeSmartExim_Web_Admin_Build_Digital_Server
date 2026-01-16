import React, { useState, useEffect } from 'react';
import Axios from '../shared/Axios';
import Swal from 'sweetalert2';
import imagePencil from '../../assets/images/pencil-square.svg';
import deleteIcon from '../../assets/images/delete.svg';
import { Row, Col, Modal, Button, FormGroup } from 'react-bootstrap';
import { BootstrapTable, TableHeaderColumn } from 'react-bootstrap-table';
import { Formik, Field, Form } from 'formik';
import * as Yup from 'yup';
import AxiosUser from '../shared/AxiosUser';
import moment from 'moment';
import Select from "react-select";
import './DownloadTracker.css';

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

const searchBYList = {
  cityDestinationList: 'Destination City',
  cityOriginList: 'City of Origin',
  exporterList: 'Exporter List',
  hsCode4DigitList: 'HS Code (4 Digit)',
  hsCodeList: 'HS Code (8 Digit)',
  importerList: 'Importer List',
  portDestinationList: 'Destination Port',
  portOriginList: 'Port of Origin',
  searchValue: 'Search Value',
  searchBy:'Search By',
};

const DownloadTracker = () => {
  const [totalCount, setTotalCount] = useState(0);
  const [queryList, setQueryList] = useState([]);
  const [userList, setUserList] = useState([]);
  const [sortName, setSortName] = useState(undefined);
  const [sortOrder, setSortOrder] = useState(undefined);
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(0);
  const [pageSize] = useState(20);
  const [filterUserId, setFilterUserId] = useState("");
  const [filterFromDate, setFilterFromDate] = useState("");
  const [filterToDate, setFilterToDate] = useState("");

  function onSortChange(sortName, sortOrder) {
    console.info('onSortChange', arguments);
    setSortName(sortName);
    setSortOrder(sortOrder);
  }

  const getTotalCount = async (filterUserId = null, fromDate = null, toDate = null) => {
    try {
      let url = `/search-management/search/countAllnew?isDownloaded=Y`;
      const params = new URLSearchParams("isDownloaded=Y");
      
      if (filterUserId) {
        params.append('userId', filterUserId);
      }
      if (fromDate) {
        params.append('fromDate', fromDate);
      }
      if (toDate) {
         if(!fromDate){    
          setLoading(false);
          return;
        }
        params.append('toDate', toDate);
      }
      
      url = `/search-management/search/countAllnew?${params.toString()}`;

     // console.log("Download Count URL:", url);
      
      const res = await Axios({
        method: "GET",
        url: url,
      });

      //console.log("Download Count Response:", res.data);
      
      if (res.status === 200) {
        let count = 0;
        
        if (typeof res.data === 'number') {
          count = res.data;
        } else if (res.data?.totalCount) {
          count = res.data.totalCount;
        } else if (res.data?.downloadCount) {
          count = res.data.downloadCount;
        } else if (res.data?.count) {
          count = res.data.count;
        } else if (res.data?.total) {
          count = res.data.total;
        } else {
          count = res.data || 0;
        }
        
       // console.log("Setting download total count to:", count);
        setTotalCount(count);
      } else {
       // console.log("Non-200 response, setting count to 0");
        setTotalCount(0);
      }
    } catch (err) {
      console.error("Error fetching download count:", err);
      try {
        let fallbackUrl = `/search-management/search/newcount?isDownloaded=Y`;
        const params = new URLSearchParams("isDownloaded=Y");
        
        if (filterUserId) {
          params.append('userId', filterUserId);
        }
        if (fromDate) {
          params.append('fromDate', fromDate);
        }
        if (toDate) {
          params.append('toDate', toDate);
        }
        
        fallbackUrl = `/search-management/search/newcount?${params.toString()}`;
        
        const fallbackRes = await Axios({
          method: "GET",
          url: fallbackUrl,
        });
        
        if (fallbackRes.status === 200) {
          let count = fallbackRes.data || 0;
         // console.log("Setting download total count (fallback) to:", count);
          setTotalCount(count);
        }
      } catch (fallbackErr) {
        console.error("Error fetching fallback download count:", fallbackErr);
        setTotalCount(0);
      }
    }
  };

  useEffect(() => {
    getUsers();
    handleSubmitWithPage("", "", "", 0);
    getTotalCount();
  }, []);

  const getUsers = () => {
    AxiosUser({
      method: 'GET',
      url: '/user-management/user/list',
    })
      .then((res) => {
        setUserList(res.data.userList);
      })
      .catch((err) => {
        console.log('Err', err);
      });
  };

  const handleSubmit = (values) => {
    setCurrentPage(0);
    setFilterUserId(values.userId);
    setFilterFromDate(values.fromDate);
    setFilterToDate(values.toDate);
    
    // Reset count before making new requests
    setTotalCount(0);
    
    handleSubmitWithPage(values.userId, values.fromDate, values.toDate, 0);
    getTotalCount(values.userId, values.fromDate, values.toDate);
  };

  const handleSubmitWithPage = (userIdValue, fromDate, toDate, page) => {
    setLoading(true);
    let url = `search-management/search/listAllnew?pageNumber=${page}&pageSize=${pageSize}&isDownloaded=Y`;
    
    const params = new URLSearchParams(`pageNumber=${page}&pageSize=${pageSize}&isDownloaded=Y`);
    if (userIdValue) {
      params.append('userId', userIdValue);
    }
    if (fromDate) {
      params.append('fromDate', fromDate);
    }
    if (toDate) {
      if(!fromDate){
        alert("Please select 'From Date' when 'To Date' is selected.");
         setLoading(false);
        return;
      }
      params.append('toDate', toDate);
    }
    
    url = `search-management/search/listAllnew?${params.toString()}`;

    //console.log("Download List URL:", url);

    Axios({
      method: 'GET',
      url: url,
      headers: {
        'Content-Type': 'application/json',
      },
    })
      .then((res) => {
       
      const queryData = res.data.queryList || [];
        //console.log("Download List Response Data:", queryData);

        // Format the data with date/time separation using downloadedDate
        const formattedList = queryData.map((item, index) => {
          const downloaded = formatDateTime(item.downloadedDate || item.createdDate);

          return {
            ...item,
            // Ensure we have a unique key field
            searchId: item.searchId || `download-${page}-${index}`,
            downloadedDateOnly: downloaded.date,
            downloadedTimeOnly: downloaded.time
          };
        });

        setQueryList(formattedList);
        setCurrentPage(page);
        
        // If no data is returned, make sure count is also 0
        if (queryData.length === 0 && page === 1) {
          //console.log("No data found, ensuring count is 0");
          setTotalCount(0);
        }
      })
      .catch((err) => {
       // console.log('Err', err);
        setQueryList([]);
        // Reset count to 0 when there's an error
        setTotalCount(0);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const handlePageChange = (page) => {
    if (page >= 0 && page <= Math.ceil(totalCount / pageSize)) {
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
    return <div>{currentPage  * pageSize + index + 1}</div>;
  };

  const SearchType = (cell, row, enumObject, index) => {
    return cell.searchType;
  };

  const Query = (cell, row, enumObject, index) => {
    let textString = searchBYList ? Object.keys(searchBYList).map((item, index) => (
      cell[item] != "" && cell[item] != null ? `<b>${searchBYList[item]}</b>` + " : " + cell[item] : null
    )) : null
    let res = textString.filter(elements => {
      return elements !== null;
    });
    return (res)
  };

  const TradeType = (cell, row, enumObject, index) => {
    return cell.tradeType;
  };

  const Country = (cell, row, enumObject, index) => {
    return cell.countryCode;
  };

  const Period = (cell, row, enumObject, index) => {
    return (
      moment(cell.fromDate).format('MMM. DD, YYYY') +
      ' - ' +
      moment(cell.toDate).format('MMM. DD, YYYY')
    );
  };

  const CreatedDate = (cell, row) => {
    return moment(cell).format('MMM. DD, YYYY');
  };

  const combineColumns = (cell, row) => {
    return `${row.createdByName} (${row.createdByEmail})`;
  };

  const options = {
    sortName: sortName,
    sortOrder: sortOrder,
    onSortChange: onSortChange,
  };

  const totalPages = Math.ceil(totalCount / pageSize);

    const handleDateValidation = (field, value, setFieldValue, values) => {
      let fromDate = field === "fromDate" ? value : values.fromDate;
      let toDate = field === "toDate" ? value : values.toDate;  
      if (field === "fromDate") {
        if (toDate && value > toDate) {
          Swal.fire("Error", "'From Date' cannot be later than 'To Date'", "error");
          return;
        }
      } else if (field === "toDate") {
        if (fromDate && value < fromDate) {
          Swal.fire("Error", "'To Date' cannot be earlier than 'From Date'", "error");
          return;
        } 
      }
  
      setFieldValue(field, value);
    };


    const formatDateTime = (dateString) => {
  // If dateString contains a full ISO datetime, parse it
  if (dateString && (dateString.includes('T') || dateString.includes('Z'))) {
    const dateObj = moment(dateString);
    if (dateObj.isValid()) {
      return { 
        date: dateObj.format("DD/MM/YYYY"), 
        time: dateObj.format("hh:mm A") 
      };
    }
  }
  
  // Handle single date string
  if (dateString) {
    if (dateString.includes('T') || dateString.includes(' ')) {
      const dateObj = moment(dateString);
      if (dateObj.isValid()) {
        return { 
          date: dateObj.format("DD/MM/YYYY"), 
          time: dateObj.format("hh:mm:ss A") 
        };
      }
    }
    return { date: moment(dateString).format("DD/MM/YYYY"), time: "-" };
  }
  
  return { date: "-", time: "-" };
};

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
              <h3 className="page-title mb-0">Download Tracker</h3>
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
    className="d-flex flex-wrap align-items-end justify-content-start gap-4 bg-white p-3 rounded shadow-sm"
    style={{ width: "100%", marginTop: "10px" }}
  >
    {/* From Date */}
    <div className="flex-grow-1" style={{ minWidth: "260px",paddingRight:"15px" }}>
      <label className="form-label fw-semibold mb-2 ">
        From Date
      </label>
      <input
        type="date"
        name="fromDate"
        value={values.fromDate || ""}
       // onChange={(e) => setFieldValue("fromDate", e.target.value)}
        onChange={(e) => handleDateValidation("fromDate", e.target.value, setFieldValue, values)}
        className="form-control"
        style={{
          height: "42px",
          borderRadius: "6px",
        }}
      />
    </div>

    {/* To Date */}
    <div className="flex-grow-1" style={{ minWidth: "260px",paddingRight:"15px"}}>
      <label className="form-label fw-semibold mb-2 " >
        To Date
      </label>
      <input
        type="date"
        name="toDate"
        value={values.toDate || ""}
        //onChange={(e) => setFieldValue("toDate", e.target.value)}
          onChange={(e) => handleDateValidation("toDate", e.target.value, setFieldValue, values)}
        className="form-control"
        style={{
          height: "42px",
          borderRadius: "6px",
        }}
      />
    </div>

    {/* User Dropdown */}
    <div className="flex-grow-1" style={{ minWidth: "260px" ,paddingRight:"10px"}}>
      <label className="form-label fw-semibold mb-2 ">
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
          }),
          menu: (base) => ({
            ...base,
            zIndex: 9999,
          }),
        }}
      />
    </div>

    {/* Filter Button */}
    <div style={{ minWidth: "130px",paddingRight:"10px" }}>
      <label className="form-label fw-semibold mb-2 ">
        
      </label>
      <button
        type="submit"
        className="btn btn-primary fw-semibold shadow-sm w-100"
        style={{
          height: "42px",
          borderRadius: "6px",
        }}
        disabled={loading}
      >
        {loading ? "LOADING..." : "FILTER"}
      </button>
    </div>

    {/* Reset Button */}
    <div style={{ minWidth: "130px" }}>
      <label className="form-label fw-semibold mb-2 text-secondary">
        &nbsp;
      </label>
      <button
        type="button"
        onClick={() => {
          const defaultFromDate = "";
          const defaultToDate = "";
          //  const defaultFromDate = moment().subtract(30, 'days').format('YYYY-MM-DD');
          // const defaultToDate = moment().format('YYYY-MM-DD');
          
          resetForm({
            values: {
              userId: "",
              fromDate: defaultFromDate,
              toDate: defaultToDate,
            }
          });
          
          setCurrentPage(0);
          setFilterUserId("");
          setFilterFromDate(defaultFromDate);
          setFilterToDate(defaultToDate);

          // Reset count before making new requests
          setTotalCount(0);

          handleSubmitWithPage("", defaultFromDate, defaultToDate, 0);
          getTotalCount("", defaultFromDate, defaultToDate);
        }}
        className="btn btn-secondary fw-semibold shadow-sm w-100"
        style={{
          height: "42px",
          borderRadius: "6px",
        }}
      >
        RESET
      </button>
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
                  <p className="mt-2">Loading download data...</p>
                </div>
              ) : (
                <div>
                  <BootstrapTable data={queryList} striped hover options={options}>
                    <TableHeaderColumn width="25" isKey dataField="searchId" dataFormat={indexN}>Sl No</TableHeaderColumn>
                    <TableHeaderColumn width="200" dataField="userSearchQuery" dataFormat={Query} dataSort={true}>Query</TableHeaderColumn>
                    <TableHeaderColumn width="75" dataField="userSearchQuery" dataFormat={TradeType} dataSort={true}>Trade Type</TableHeaderColumn>
                    <TableHeaderColumn width="60" dataField="userSearchQuery" dataFormat={Country} dataSort={true}>Country</TableHeaderColumn>
                    <TableHeaderColumn width="210" dataField="userSearchQuery" dataFormat={Period} dataSort={true}>Period</TableHeaderColumn>
                    <TableHeaderColumn width="75" dataField="totalRecords" dataSort={true}>Total Records</TableHeaderColumn>
                    <TableHeaderColumn width="100" dataField="createdDate" dataFormat={CreatedDate} dataSort={true}>Downloaded on</TableHeaderColumn>
                        <TableHeaderColumn width="120" dataField="downloadedTimeOnly" dataSort={true}>Downloaded Time</TableHeaderColumn>
                    <TableHeaderColumn width="200" dataField="combinedColumn" dataFormat={combineColumns} dataSort={true}>Downloaded By</TableHeaderColumn>
                    <TableHeaderColumn width="100" dataField="recordsDownloaded" dataSort={true}>Records Downloaded</TableHeaderColumn>
                  </BootstrapTable>

                  {/* Custom Pagination */}
                  {totalCount > 0 && (
                    <div className="d-flex justify-content-between align-items-center mt-4 p-3" style={{ backgroundColor: '#f8f9fa', borderRadius: '8px' }}>
                      <div>
                        <span className="text-muted">
                          Showing <strong>{currentPage  * pageSize + 1}</strong> to{" "}
                          <strong>{Math.min(currentPage * pageSize, totalCount)}</strong> of{" "}
                          <strong>{totalCount}</strong> downloads
                        </span>
                      </div>
                      
                      <div className="d-flex align-items-center">
                        <button
                          className="btn btn-sm btn-outline-primary me-1"
                          disabled={currentPage === 0}
                          onClick={() => handlePageChange(0)}
                          style={{ marginRight: '5px' }}
                          title="First Page"
                        >
                          <i className="fas fa-angle-double-left"></i> First
                        </button>

                        <button
                          className="btn btn-sm btn-outline-primary"
                          disabled={currentPage === 0}
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
                                currentPage === pageNum - 1 
                                  ? 'btn-primary' 
                                  : 'btn-outline-primary'
                              }`}
                              onClick={() => handlePageChange(pageNum - 1)}
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
                          disabled={currentPage === totalPages - 1}
                          onClick={() => handlePageChange(currentPage + 1)}
                          style={{ marginRight: '5px' }}
                          title="Next Page"
                        >
                          Next <i className="fas fa-angle-right"></i>
                        </button>

                        <button
                          className="btn btn-sm btn-outline-primary"
                          disabled={currentPage === totalPages - 1}
                          onClick={() => handlePageChange(totalPages - 1)}
                          title="Last Page"
                        >
                          Last <i className="fas fa-angle-double-right"></i>
                        </button>
                      </div>
                    </div>
                  )}

                  {/* No Data Message */}
                  {!loading && queryList.length === 0 && (
                    <div className="text-center py-4">
                      <div className="alert alert-info">
                        <i className="fas fa-info-circle me-2"></i>
                        No download records found matching your search criteria.
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

export default DownloadTracker;