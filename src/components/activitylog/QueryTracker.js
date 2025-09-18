import React, { useState, useEffect } from 'react';
import Axios from '../shared/Axios';
import Swal from 'sweetalert2';
import imagePencil from '../../assets/images/pencil-square.svg';
import deleteIcon from '../../assets/images/delete.svg';
import { Row, Col, Modal, Button, FormGroup } from 'react-bootstrap';
import { BootstrapTable, TableHeaderColumn } from 'react-bootstrap-table';
import { Formik, Field, Form } from "formik";
import * as Yup from "yup";
import AxiosUser from '../shared/AxiosUser';
import moment from 'moment';

const validateForm = Yup.object().shape({
  userId: Yup.string().required("This field is required"),
});

const initialValues = {
  userId: "",
};

const searchBYList = {
  cityDestinationList: "Destination City",
  cityOriginList: "City of Origin",
  exporterList: "Exporter List",
  hsCode4DigitList: "HS Code (4 Digit)",
  hsCodeList: "HS Code (8 Digit)",
  importerList: "Importer List",
  portDestinationList: "Destination Port",
  portOriginList: "Port of Origin",
  searchValue: "Search Value",
};

const QueryTracker = () => {
  const [queryList, setQueryList] = useState([]);
  const [userList, setUserList] = useState([]);
  const [sortName, setSortName] = useState(undefined);
  const [sortOrder, setSortOrder] = useState(undefined);

  function onSortChange(sortName, sortOrder) {
    console.info('onSortChange', arguments);
    setSortName(sortName);
    setSortOrder(sortOrder);
  }

  useEffect(() => {
    getUsers();
    handleSubmit("");
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
    let url = "";
    if (values.userId) {
      url = `search-management/search/listAll?userId=${values.userId}`;
    } else {
      url = `search-management/search/listAll`;
    }
    Axios({
      method: "GET",
      url: url,
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((res) => {
        setQueryList(res.data.queryList);
      })
      .catch((err) => {
        console.log("Err", err);
      });
  };

  const indexN = (cell, row, enumObject, index) => {
    return <div>{index + 1}</div>;
  };

  const SearchType = (cell, row, enumObject, index) => {
    return cell.searchType;
  };

  const Query = (cell, row, enumObject, index) => {
    let textString  =  searchBYList ? Object.keys(searchBYList).map((item, index) => (
      cell[item] != "" && cell[item] != null ? `<b>${searchBYList[item]}</b>` +" : "+ cell[item] : null
    ) ) : null 
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
    return moment(cell.fromDate).format("MMM. DD, YYYY") + " - " + moment(cell.toDate).format("MMM. DD, YYYY");
  };

  const CreatedDate = (cell, row) => {
    return moment(cell).format("MMM. DD, YYYY");
  };
  const combineColumns = (cell, row) => {
    return `${row.createdByName} (${row.createdByEmail})`;
  };

  const options = {
    sortName: sortName,
    sortOrder: sortOrder,
    onSortChange: onSortChange,
  };

  return (
    <div>
      <div className="page-header">
        <nav aria-label="breadcrumb">
          <ol className="breadcrumb">
            <li className="breadcrumb-item"><a href="!#" onClick={(event) => event.preventDefault()}>Activity Log</a></li>
            <li className="breadcrumb-item active" aria-current="page"><h3 className="page-title"> Query Tracker </h3></li>
          </ol>
        </nav>
        <Formik
          initialValues={initialValues}
          onSubmit={handleSubmit}
        >
          {({ values, errors, setFieldValue, setFieldError, touched, isValid, handleSubmit, submitForm }) => {
            return (
              <Form>
                <div className="row justify-content-end">
                  <div className="col-xs-12 col-sm-12 col-md-5 col-lg-5">
                    <div className="form-group">
                      <Field
                        name="userId"
                        component="select"
                        className={`form-control ${touched.userId && errors.userId ? "is-invalid" : ""}`}
                        autoComplete="off"
                        onChange={(event) => {
                          setFieldValue("userId", event.target.value);
                        }}
                      >
                        <option value="">Please Select User ID</option>
                        {userList && userList.length > 0 ? userList.map((title, qIndex) => (
                          <option key={qIndex} value={title.id}>{title.firstname + "  " + title.lastname + " ( " + title.email + " )"}</option>
                        )) : null}
                        {touched.userId && errors.userId && (<p className="error">{errors.userId}</p>)}
                      </Field>
                    </div>
                  </div>
                  <div className="col-xs-12 col-sm-12 col-md-2 col-lg-2">
                    <button type="submit" className="btn btn-primary">FILTER</button>
                  </div>
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
              <div>
                <BootstrapTable data={queryList} striped hover pagination={true} search options={options}>
                  <TableHeaderColumn width='50' isKey dataField='searchId' dataFormat={indexN}>Sl No</TableHeaderColumn>
                  <TableHeaderColumn width='100' dataField='userSearchQuery' dataFormat={SearchType} dataSort={true}>Search Type</TableHeaderColumn>
                  <TableHeaderColumn width='300' dataField='userSearchQuery' dataFormat={Query} dataSort={true}>Query</TableHeaderColumn>
                  <TableHeaderColumn width='75' dataField='userSearchQuery' dataFormat={TradeType} dataSort={true}>Trade Type</TableHeaderColumn>
                  <TableHeaderColumn width='75' dataField='userSearchQuery' dataFormat={Country} dataSort={true}>Country</TableHeaderColumn>
                  <TableHeaderColumn width='200' dataField='userSearchQuery' dataFormat={Period} dataSort={true}>Period</TableHeaderColumn>
                  <TableHeaderColumn width='75' dataField='totalRecords' dataSort={true}>Total Records</TableHeaderColumn>
                  <TableHeaderColumn width='100' dataField='createdDate' dataFormat={CreatedDate} dataSort={true}>Created Date</TableHeaderColumn>
                  <TableHeaderColumn width="200" dataField="combinedColumn" dataFormat={combineColumns} dataSort={true}>Downloaded By</TableHeaderColumn>
                </BootstrapTable>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default QueryTracker;
