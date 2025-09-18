import React, { Component,useState, useRef, useCallback, useEffect } from 'react'
import AxiosUser from '../shared/AxiosUser';
import imagePencil from '../../assets/images/pencil-square.svg';
import deleteIcon from '../../assets/images/delete.svg';
import subscribeIcon from '../../assets/images/subscribe.svg';
import Swal from 'sweetalert2';
import EditeUser from './EditUser';
import { Row, Col, Modal, Button, FormGroup } from 'react-bootstrap';
import {BootstrapTable, TableHeaderColumn} from 'react-bootstrap-table';
import { useHistory } from 'react-router-dom';
import moment from 'moment';



const Users = () => {

  const [userList, setUserList] = useState([]);
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
    getUsers()
  },[])



  const getUsers = () => {
    AxiosUser({
      method: "GET",
      url: `/user-management/user/list?userType=USER`
    })
      .then(res => {
        setUserList(res.data.userList);
      })
      .catch(err => {
        console.log("Err", err);
      });
  }

  const editUser = (item) => {
    setRowData(item)
    setShowModal(true)
  }

  const deleteUser = (item) => {
    Swal.fire({
      title: 'Delete User',
      text: "Are you sure you want to Delete User?",
      icon: 'error',
      dangerMode: true,
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',

    }).then((isConfirm)=> {
      if(isConfirm.value){
        const postData = {
          "isDelete": "Y"
        }
        AxiosUser({
          method: "PUT",
          url: `user-management/user/${item.id}`,
          data: JSON.stringify(postData),
          headers: {
            "Content-Type": "application/json"
          }
        })
          .then(res => {
            Swal.fire({
              title: 'Thank You',
              text: "User Deleted",
              icon: 'success',
            }).then(() => {getUsers()});
          })
          .catch(err => {
            console.log("Err", err);
            let errorMsg = "Somethhing went wrong, please try again."
            if (err.data.errorMsg) {
              errorMsg = err.data.errorMsg;
            }
            Swal.fire({
              title: 'Oops!',
              text: errorMsg,
              icon: 'error',
            })
          });
      } 
  
    })
  }

  

  const handleClose = (e) => {
    setShowModal(false)
  }

  const modalSubmit = (e) => {
    setShowModal(false)
    getUsers()
  }

  const fullName = (cell,row) => {
    return row.firstname +" "+ row.lastname
  }


  const actionFormatter = (cell, row) => {
    
    if (row.uplineId > 0) {
      return (
        <div>
          <i className="bi bi-pencil-square">
            <img src={imagePencil} onClick={(e) => { editUser(row) }} />
          </i>
          &nbsp;&nbsp;&nbsp;
          <i className="bi bi-pencil-square">
            <img src={deleteIcon} onClick={(e) => { deleteUser(row) }} />
          </i>
        </div>
      );
    } else {
      
      return (
        <div>
          <i className="bi bi-pencil-square">
            <img src={imagePencil} onClick={(e) => { editUser(row) }} />
          </i>
          &nbsp;&nbsp;&nbsp;
          <i className="bi bi-pencil-square">
            <img src={deleteIcon} onClick={(e) => { deleteUser(row) }} />
          </i>
          &nbsp;&nbsp;&nbsp;
          <i className="bi bi-pencil-square">
            <img src={subscribeIcon} onClick={(e) => { history.push(`userSubscriptionList/${row.id}/${row.firstname + " " + row.lastname}`) }} />
          </i>
        </div>
      );
    }
  };
  

  const statusFormatter = (cell,row) => {
    return (<label className= {row.isActive == "Y" ? "badge badge-success" : "badge badge-danger"}>{row.isActive == "Y" ? "Active" : "Inactive"}</label>)
  }

  const indexN = (cell,row,enumObject, index) => {
    return  (<div>{index+1}</div>);
  }
  
  const options = {
    sortName: sortName,
    sortOrder: sortOrder,
    onSortChange: onSortChange
  };
  
  const createDateFormatter = (cell,row) => {
    return moment(cell).format("MMM. DD,  YYYY")
  }

  const expireDateFormatter = (cell,row) => {
    return cell != null ? moment(cell).format("MMM. DD,  YYYY") : "No Active Plan"
  }

    return (
      <>
      <div>
        <div className="page-header">
          
          <nav aria-label="breadcrumb">
            <ol className="breadcrumb">
              <li className="breadcrumb-item"><a href="!#" onClick={event => event.preventDefault()}>Users</a></li>
              <li className="breadcrumb-item active" aria-current="page"><h3 className="page-title"><i class="fa-solid fa-user"></i> User List </h3></li>
            </ol>
          </nav>
        </div>
        <div className="row">
          <div className="col-lg-12 grid-margin stretch-card">
            <div className="card">
              <div className="card-body">
                
                <div >
                <BootstrapTable  data={userList} striped hover 
                    pagination={ true } search
                    options={ options }
                >
                    <TableHeaderColumn width='50' isKey dataField='id' dataFormat={ indexN }>Sl No</TableHeaderColumn>
                    <TableHeaderColumn width='120' dataField='firstname' dataFormat={ fullName } dataSort={ true }>Name</TableHeaderColumn>
                    <TableHeaderColumn width='120' dataField='companyName' dataSort={ true }>Company Name</TableHeaderColumn>
                    <TableHeaderColumn width='250' dataField='email' dataSort={ true }>Email</TableHeaderColumn>
                    <TableHeaderColumn width='100' dataField='mobile' dataSort={ true }>Mobile</TableHeaderColumn>

                    <TableHeaderColumn width='140' dataField='createdDate' dataFormat={ createDateFormatter } dataSort={ true }>Create Date</TableHeaderColumn>
                    <TableHeaderColumn width='140' dataField='subscriptionExpiredDate' dataFormat={ expireDateFormatter } dataSort={ true }>Subscription Expire Date</TableHeaderColumn>

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
                        <div ><h3>Update User </h3> </div>
                    </Modal.Header>
                    <Modal.Body>                                           
                    <EditeUser 
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

export default Users
