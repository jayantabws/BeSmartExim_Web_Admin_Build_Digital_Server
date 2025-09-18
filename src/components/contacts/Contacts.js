import React, { Component,useState, useRef, useCallback, useEffect } from 'react'
import AxiosACT from '../shared/AxiosACT';
import imagePencil from '../../assets/images/pencil-square.svg';
import deleteIcon from '../../assets/images/delete.svg';
import Swal from 'sweetalert2';
import EditContact from './EditContact';
import { Row, Col, Modal, Button, FormGroup } from 'react-bootstrap';
import {BootstrapTable, TableHeaderColumn} from 'react-bootstrap-table';
import { useHistory } from 'react-router-dom';
import moment from 'moment';


const Contacts = () => {

  const [contactList, setContactList] = useState([]);
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
    getContacts()
  },[])



  const getContacts = () => {
    AxiosACT({
      method: "GET",
      url: `/activity-management/listcontact/all`
    })
      .then(res => {
        setContactList(res.data.contactList);
      })
      .catch(err => {
        console.log("Err", err);
      });
  }

  const editContact = (item) => {
    setRowData(item)
    setShowModal(true)
  }  

  const handleClose = (e) => {
    setShowModal(false)
  }

  const modalSubmit = (e) => {
    setShowModal(false)
    getContacts()
  }

  const actionFormatter = (cell,row) => {
    return (<div><i className="bi bi-pencil-square"><img src={imagePencil} 
             onClick={(e)=> {editContact(row)}}/></i>
             </div>)
  }  

  const dateCreated = (cell,row,enumObject, index) => {
    return cell ? moment(row.createdDate).format("MMM. DD, YYYY") : null;
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
              <li className="breadcrumb-item"><a href="!#" onClick={event => event.preventDefault()}>Contacts</a></li>
              <li className="breadcrumb-item active" aria-current="page"><h3 className="page-title">Contact List</h3></li>
            </ol>
          </nav>
        </div>
        <div className="row">
          <div className="col-lg-12 grid-margin stretch-card">
            <div className="card">
              <div className="card-body">                
                <div >
                <BootstrapTable  data={contactList} striped hover 
                    pagination={ true } search
                    options={ options }
                >
                    <TableHeaderColumn width='50' isKey dataField='id' dataFormat={ indexN }>Sl.</TableHeaderColumn>
                    <TableHeaderColumn width='200' dataField='companyName' dataSort={ true }>Company Name</TableHeaderColumn>
                    <TableHeaderColumn width='150' dataField='address' dataSort={ true }>Address</TableHeaderColumn>
                    <TableHeaderColumn width='150' dataField='email' dataSort={ true }>Email</TableHeaderColumn>
                    <TableHeaderColumn width='150' dataField='mobile' dataSort={ true }>Mobile</TableHeaderColumn>
                    <TableHeaderColumn width='150' dataField='website' dataSort={ true }>Website</TableHeaderColumn>
                    <TableHeaderColumn width='100' dataField='createdDate' dataFormat={ dateCreated } dataSort={ true }>Date Created</TableHeaderColumn>
                    <TableHeaderColumn width='50' dataField=''  dataFormat={ actionFormatter }>Action</TableHeaderColumn>
                </BootstrapTable>
                
                </div>
              </div>
            </div>
          </div>
                <Modal className="customModal brandModal" bsSize="md"
                    show={showModal}
                    onHide={handleClose}>
                    <Modal.Header closeButton className="custmModlHead">
                        <div ><h3>Update Contact </h3> </div>
                    </Modal.Header>
                    <Modal.Body>                                           
                    <EditContact 
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

export default Contacts
