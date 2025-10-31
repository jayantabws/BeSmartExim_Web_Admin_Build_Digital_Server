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

const validateForm = Yup.object().shape({
  userId: Yup.string().required('This field is required'),
});

const initialValues = {
  userId: '',
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
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize] = useState(20); // 20 records per page
  const [filterUserId, setFilterUserId] = useState("");

  function onSortChange(sortName, sortOrder) {
    console.info('onSortChange', arguments);
    setSortName(sortName);
    setSortOrder(sortOrder);
  }

  const getTotalCount = async (filterUserId = null) => {
    try {
      let url = `/search-management/search/countAllnew?isDownloaded=Y`;
      if (filterUserId) {
        url += `&userId=${filterUserId}`;
      }

      console.log("Download Count URL:", url);
      
      const res = await Axios({
        method: "GET",
        url: url,
      });

      console.log("Download Count Response:", res.data);
      
      if (res.status === 200) {
        let count = 0;
        
        // Handle different response structures
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
        
        console.log("Setting download total count to:", count);
        setTotalCount(count);
      }
    } catch (err) {
      console.error("Error fetching download count:", err);
      // If downloadcount endpoint doesn't exist, try using newcount with isDownloaded flag
      try {
        let fallbackUrl = `/search-management/search/newcount?isDownloaded=Y`;
        if (filterUserId) {
          fallbackUrl += `&userId=${filterUserId}`;
        }
        
        const fallbackRes = await Axios({
          method: "GET",
          url: fallbackUrl,
        });
        
        if (fallbackRes.status === 200) {
          let count = fallbackRes.data || 0;
          console.log("Setting download total count (fallback) to:", count);
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
    handleSubmitWithPage("", 1);
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
    setCurrentPage(1); // Reset to first page when filtering
    setFilterUserId(values.userId);
    handleSubmitWithPage(values.userId, 1);
    getTotalCount(values.userId);
  };

  const handleSubmitWithPage = (userIdValue, page) => {
    setLoading(true);
    let url = `search-management/search/listAllnew?pageNumber=${page}&pageSize=${pageSize}&isDownloaded=Y`;
    if (userIdValue) {
      url += `&userId=${userIdValue}`;
    }

    Axios({
      method: 'GET',
      url: url,
      headers: {
        'Content-Type': 'application/json',
      },
    })
      .then((res) => {
        console.log("Download URL", url);
        console.log("Download List", res.data.queryList);
        console.log("Download Data Length ", res.data.queryList?.length || 0);
        setQueryList(res.data.queryList || []);
        setCurrentPage(page);
      })
      .catch((err) => {
        console.log('Err', err);
        setQueryList([]);
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

  return (
    <div>
      <div className="page-header">
        <nav aria-label="breadcrumb">
          <ol className="breadcrumb">
            <li className="breadcrumb-item">
              <a href="!#" onClick={(event) => event.preventDefault()}>
                Activity Log
              </a>
            </li>
            <li className="breadcrumb-item active" aria-current="page">
              {' '}
              <h3 className="page-title"> Download Tracker </h3>
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
            );
          }}
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
                    <TableHeaderColumn width="200" dataField="combinedColumn" dataFormat={combineColumns} dataSort={true}>Downloaded By</TableHeaderColumn>
                    <TableHeaderColumn width="100" dataField="recordsDownloaded" dataSort={true}>Records Downloaded</TableHeaderColumn>
                  </BootstrapTable>

                  {/* Custom Pagination */}
                  {totalCount > 0 && (
                    <div className="d-flex justify-content-between align-items-center mt-4 p-3" style={{ backgroundColor: '#f8f9fa', borderRadius: '8px' }}>
                      <div>
                        <span className="text-muted">
                          Showing <strong>{(currentPage - 1) * pageSize + 1}</strong> to{" "}
                          <strong>{Math.min(currentPage * pageSize, totalCount)}</strong> of{" "}
                          <strong>{totalCount}</strong> downloads
                        </span>
                      </div>
                      
                      <div className="d-flex align-items-center">
                        {/* First Page */}
                        <button
                          className="btn btn-sm btn-outline-primary me-1"
                          disabled={currentPage === 1}
                          onClick={() => handlePageChange(1)}
                          style={{ marginRight: '5px' }}
                          title="First Page"
                        >
                          <i className="fas fa-angle-double-left"></i> First
                        </button>

                        {/* Previous Page */}
                        <button
                          className="btn btn-sm btn-outline-primary"
                          disabled={currentPage === 1}
                          onClick={() => handlePageChange(currentPage - 1)}
                          style={{ marginRight: '5px' }}
                          title="Previous Page"
                        >
                          <i className="fas fa-angle-left"></i> Prev
                        </button>

                        {/* Page Numbers */}
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

                        {/* Next Page */}
                        <button
                          className="btn btn-sm btn-outline-primary"
                          disabled={currentPage === totalPages}
                          onClick={() => handlePageChange(currentPage + 1)}
                          style={{ marginRight: '5px' }}
                          title="Next Page"
                        >
                          Next <i className="fas fa-angle-right"></i>
                        </button>

                        {/* Last Page */}
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
                  {!loading && queryList.length === 0 && (
                    <div className="text-center py-5">
                      <div className="mb-3">
                        <i className="fas fa-download fa-3x text-muted"></i>
                      </div>
                      <h5 className="text-muted">No Download Records Found</h5>
                      <p className="text-muted">
                        {filterUserId ? 'No download records found for the selected user.' : 'No download records available.'}
                      </p>
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