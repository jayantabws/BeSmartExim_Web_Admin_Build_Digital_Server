import React, { Component,useState, useRef, useCallback, useEffect } from 'react'
import AxiosMaster from '../shared/AxiosMaster';
import imagePencil from '../../assets/images/pencil-square.svg';
import deleteIcon from '../../assets/images/delete.svg';
import Swal from 'sweetalert2';
import EditCountry from './EditCountry';
import { Row, Col, Modal, Button, FormGroup } from 'react-bootstrap';
import {BootstrapTable, TableHeaderColumn} from 'react-bootstrap-table';
import { useHistory } from 'react-router-dom';
import moment from 'moment';


const Countries = () => {

  const [countryList, setCountryList] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [rowData, setRowData] = useState([]);

  const [sortName, setSortName] = useState(undefined);
  const [sortOrder, setSortOrder] = useState(undefined);

  const history = useHistory();
  
  function onSortChange(sortName, sortOrder) {
    console.info('onSortChange', arguments);
    setSortName(sortName);
    setSortOrder(sortOrder);
  }

  useEffect(() => {
    getCountries()
  },[])



  const getCountries = () => {
    AxiosMaster({
      method: "GET",
      url: `/masterdata-management/country/list`
    })
      .then(res => {
        setCountryList(res.data.countryList);
      })
      .catch(err => {
        console.log("Err", err);
      });
  }

  const editCountry = (item) => {
    setRowData(item)
    setShowModal(true)
  }  

  const handleClose = (e) => {
    setShowModal(false)
  }

  const modalSubmit = (e) => {
    setShowModal(false)
    getCountries()
  }

  const countryFullName = (cell,row) => {
    return row.name +" [ "+ row.shortcode+" ]"
  }


  const actionFormatter = (cell,row) => {
    return (<div><i className="bi bi-pencil-square"><img src={imagePencil} 
             onClick={(e)=> {editCountry(row)}}/></i>
             </div>)
  }

  const statusFormatter = (cell,row) => {
    return (<label className= {row.isActive == "Y" ? "badge badge-success" : "badge badge-danger"}>{row.isActive == "Y" ? "Active" : "Inactive"}</label>)
  }

  const periodExport = (cell,row,enumObject, index) => {
    return cell ? moment(row.exportFrom).format("MMM. DD, YYYY") +" - "+ moment(row.exportUpto).format("MMM. DD, YYYY") : null;
  }

  const periodImport = (cell,row,enumObject, index) => {
    return cell ? moment(row.importFrom).format("MMM. DD, YYYY") +" - "+ moment(row.importUpto).format("MMM. DD, YYYY") : null;
  }

  const indexN = (cell,row,enumObject, index) => {
    return  (<div>{index+1}</div>);
  }
  
  const options = {
    sortName: sortName,
    sortOrder: sortOrder,
    onSortChange: onSortChange
  };
  


    return (
      <>
      <div>
        <div className="page-header">
          <nav aria-label="breadcrumb">
            <ol className="breadcrumb">
              <li className="breadcrumb-item"><a href="!#" onClick={event => event.preventDefault()}>Countries</a></li>
              <li className="breadcrumb-item active" aria-current="page"><h3 className="page-title">Country List</h3></li>
            </ol>
          </nav>
        </div>
        <div className="row">
          <div className="col-lg-12 grid-margin stretch-card">
            <div className="card">
              <div className="card-body">                
                <div >
                <BootstrapTable  data={countryList} striped hover 
                    pagination={ true } search
                    options={ options }
                >
                    <TableHeaderColumn width='50' isKey dataField='id' dataFormat={ indexN }>Sl.</TableHeaderColumn>
                    <TableHeaderColumn width='150' dataField='name' dataFormat={ countryFullName } dataSort={ true }>Country Name</TableHeaderColumn>
                    <TableHeaderColumn width='100' dataField='isExport' dataSort={ true }>Export</TableHeaderColumn>
                    <TableHeaderColumn width='100' dataField='isImport' dataSort={ true }>Import</TableHeaderColumn>
                    <TableHeaderColumn width='200' dataField='exportFrom' dataFormat={ periodExport } dataSort={ true }>Export Data Available</TableHeaderColumn>
                    <TableHeaderColumn width='100' dataField='exportRecords' dataSort={ true }>Export Count</TableHeaderColumn>
                    <TableHeaderColumn width='200' dataField='importFrom' dataFormat={ periodImport } dataSort={ true }>Import Data Available</TableHeaderColumn>
                    <TableHeaderColumn width='100' dataField='importRecords' dataSort={ true }>Import Count</TableHeaderColumn>
                    <TableHeaderColumn width='100' dataField='isActive' dataFormat={ statusFormatter } dataSort={ true }>Status</TableHeaderColumn>
                    <TableHeaderColumn width='100' dataField=''  dataFormat={ actionFormatter }>Action</TableHeaderColumn>
                </BootstrapTable>
                
                </div>
              </div>
            </div>
          </div>
                <Modal className="customModal brandModal" bsSize="md"
                    show={showModal}
                    onHide={handleClose}>
                    <Modal.Header closeButton className="custmModlHead">
                        <div ><h3>Update Country </h3> </div>
                    </Modal.Header>
                    <Modal.Body>                                           
                    <EditCountry 
                      rowData = {rowData}
                      isAdmin = {false}
                      modalSubmit = {modalSubmit}
                    />                       
                    </Modal.Body>
                </Modal>
        </div>
      </div>
      </>
    )

}

export default Countries
