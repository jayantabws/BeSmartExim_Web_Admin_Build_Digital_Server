import React, { Component,useState, useRef, useCallback, useEffect } from 'react'
import AxiosUser from '../shared/AxiosUser';
import imageDetails from '../../assets/images/details.svg';
import imagePencil from '../../assets/images/pencil-square.svg';
import Swal from 'sweetalert2';
import UserSubscriptionDetails from './UserSubscriptionDetails';
import { Row, Col, Modal, Button, FormGroup } from 'react-bootstrap';
import {BootstrapTable, TableHeaderColumn} from 'react-bootstrap-table';
import CreateUserSubscription from './CreateUserSubscription';
import EditUserSubscriptionDetails from './EditUserSubscriptionDetails';
import moment from 'moment';



const UserSubscriptionList = (props) => {

  const [userSubscriptionList, setUserSubscriptionList] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showUserModal, setShowUserModal] = useState(false);
  const [rowData, setRowData] = useState([]);

  const [sortName, setSortName] = useState(undefined);
  const [sortOrder, setSortOrder] = useState(undefined);
  const [subscribeCountryList, setSubscribeCountryList] = useState(undefined);
  

  
  function onSortChange(sortName, sortOrder) {
    console.info('onSortChange', arguments);
    setSortName(sortName);
    setSortOrder(sortOrder);
  }

  useEffect(() => {
    getUserSubscriptionList()
  },[])



  const getUserSubscriptionList = () => {
    AxiosUser({
      method: "GET",
      url: `/user-management/user-subscription/list?userId=${props.match.params.id}`
    })
      .then(res => {
        setUserSubscriptionList(res.data.userSubscriptionList);
      })
      .catch(err => {
        console.log("Err", err);
      });
  }

  const showDetails = (item) => {
    setShowModal(true)
    setRowData(item)
  }

  const handleClose = (e) => {
    setShowModal(false)
  }

  const modalSubmit = (e) => {
    setShowModal(false)
    getUserSubscriptionList()
  }

  

  const showUserModalDetails = (item) => {
    setShowUserModal(true)
  }

  const userModalSubmit = (e) => {
    setShowUserModal(false)
    getUserSubscriptionList()
  }

  const handleCloseUserModal = (e) => {
    setShowUserModal(false)
  }


  const editSubscription = (item) => {
    defaultCountryList(item)
    setRowData(item)
    setShowEditModal(true)
  }


  const handleEditClose = (e) => {
    setShowEditModal(false)
  }

  const editModalSubmit = (e) => {
    setShowEditModal(false)
    getUserSubscriptionList()
  }



  const fullName = (cell,row) => {
    return row.firstname +" "+ row.lastname
  }

  const actionFormatter = (cell,row) => {
    return (<div>
      {row.isActive == "Y" ?
            <i className="bi bi-pencil-square"><img src={imagePencil} 
                onClick={(e)=> {editSubscription(row)}}/></i> : null} &nbsp;&nbsp;&nbsp;

              <i className="bi bi-pencil-square"><img src={imageDetails} 
             onClick={(e)=> {showDetails(row)}}/></i>
             </div>)
  }

  const statusFormatter = (cell,row) => {
    return (<label className= {row.isActive == "Y" ? "badge badge-success" : "badge badge-danger"}>{row.isActive == "Y" ? "Active" : "Inactive"}</label>)
  }

  const indexN = (cell,row,enumObject, index) => {
    return  (<div>{index+1}</div>);
  }

  const dateFormatter = (cell,row) => {
    return moment(cell).format("MMM. DD,  YYYY HH:mm")
  }

  
  const options = {
    sortName: sortName,
    sortOrder: sortOrder,
    onSortChange: onSortChange
  };
  
  const defaultCountryList = (rowData)=>{
    let countryList = []
    rowData && rowData.countries.length> 0 && rowData.countries.forEach(item=>{
      countryList.push({value: item.trim() ,label: item.trim()});
    });
    setSubscribeCountryList(countryList)
  }


    return (
      <div>
        <div className="page-header">
          <nav aria-label="breadcrumb">
            <ol className="breadcrumb">
              <li className="breadcrumb-item"><a href="!#" onClick={event => event.preventDefault()}>Users</a></li>
              <li className="breadcrumb-item active" aria-current="page"> <h3 className="page-title"> User Subscription List </h3></li>
            </ol>
          </nav> 
          <div class="row justify-content-end">
          <div class="col-xs-12 col-sm-12 col-md-8 col-lg-8"><button className="btn btn-primary" onClick = {() =>  showUserModalDetails()}>Add New</button></div>
          </div>         
        </div>
        <div className="row">
          <div className="col-lg-12 grid-margin stretch-card">
            <div className="card">
              <div className="card-body"> 
                <div >
                <BootstrapTable  data={userSubscriptionList} striped hover 
                    pagination={ true } search
                    options={ options }
                >
                    <TableHeaderColumn width='70' isKey dataField='id' dataFormat={ indexN }>Sl No</TableHeaderColumn>
                    <TableHeaderColumn width='150' dataField='name' dataSort={ true }>Name</TableHeaderColumn>
                    <TableHeaderColumn width='150' dataField='price' dataSort={ true }>Price</TableHeaderColumn>
                    <TableHeaderColumn width='100' dataField='validityInDay' dataSort={ true }>Validity</TableHeaderColumn>
                    <TableHeaderColumn width='200' dataField='createdDate' dataFormat={ dateFormatter } dataSort={ true }>Create Date</TableHeaderColumn>
                    <TableHeaderColumn width='200' dataField='accountExpireDate' dataFormat={ dateFormatter } dataSort={ true }>Expire Date</TableHeaderColumn>
                    <TableHeaderColumn width='150' dataField='isActive' dataFormat={ statusFormatter } dataSort={ true }>Activation Status</TableHeaderColumn>
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
                        <div ><h3>Subscription Details </h3> </div>
                    </Modal.Header>
                    <Modal.Body>                                           
                    <UserSubscriptionDetails 
                      rowData = {rowData}
                      isAdmin = {false}
                      modalSubmit = {modalSubmit}
                    />                       
                    </Modal.Body>
                </Modal>

                <Modal className="customModal brandModal" bsSize="md"
                    show={showUserModal}
                    onHide={handleCloseUserModal}>
                    <Modal.Header closeButton className="custmModlHead">
                        <div ><h3>Create User Subscription </h3> </div>
                    </Modal.Header>
                    <Modal.Body>                                           
                    <CreateUserSubscription 
                      ID = {props.match.params.id}
                      userModalSubmit = {userModalSubmit}                      
                    />                       
                    </Modal.Body>
                </Modal>

                <Modal className="customModal brandModal" bsSize="md"
                    show={showEditModal}
                    onHide={handleEditClose}>
                    <Modal.Header closeButton className="custmModlHead">
                        <div ><h3>Edit Subscription Details </h3> </div>
                    </Modal.Header>
                    <Modal.Body>                                           
                    <EditUserSubscriptionDetails 
                      rowData = {rowData}
                      isAdmin = {false}
                      modalSubmit = {editModalSubmit}
                      defaultCountryList = {subscribeCountryList}
                    />                       
                    </Modal.Body>
                </Modal>
    
        </div>
      </div>
    )

}

export default UserSubscriptionList