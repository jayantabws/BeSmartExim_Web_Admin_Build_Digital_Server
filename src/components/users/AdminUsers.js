import React, { Component,useState, useRef, useCallback, useEffect } from 'react'
import AxiosUser from '../shared/AxiosUser';
import imagePencil from '../../assets/images/pencil-square.svg';
import deleteIcon from '../../assets/images/delete.svg';
import Swal from 'sweetalert2';
import EditeUser from './EditUser';
import { Row, Col, Modal, Button, FormGroup } from 'react-bootstrap';
import {BootstrapTable, TableHeaderColumn} from 'react-bootstrap-table';



const AdminUsers = () => {

  const [userList, setUserList] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [rowData, setRowData] = useState([]);

  const [sortName, setSortName] = useState(undefined);
  const [sortOrder, setSortOrder] = useState(undefined);

  
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
      url: `/user-management/user/list?userType=ADMIN`
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
    }).then(()=> {
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

  const actionFormatter = (cell,row) => {
    return (<div><i className="bi bi-pencil-square"><img src={imagePencil} 
             onClick={(e)=> {editUser(row)}}/></i> &nbsp;&nbsp;&nbsp;
             <i className="bi bi-pencil-square"><img src={deleteIcon} 
             onClick={(e)=> {deleteUser(row)}}/></i>
             </div>)
  }

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
  


    return (
      <div>
        <div className="page-header">
            <nav aria-label="breadcrumb">
              <ol className="breadcrumb">
                <li className="breadcrumb-item"><a href="!#" onClick={event => event.preventDefault()}>Admin Users</a></li>
                <li className="breadcrumb-item active" aria-current="page"> <h3 className="page-title"> Admin User List </h3></li>
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
                    <TableHeaderColumn width='70' isKey dataField='id' dataFormat={ indexN }>Sl No</TableHeaderColumn>
                    <TableHeaderColumn width='150' dataField='firstname' dataFormat={ fullName } dataSort={ true }>Name1</TableHeaderColumn>
                    <TableHeaderColumn width='300' dataField='email' dataSort={ true }>Email</TableHeaderColumn>
                    <TableHeaderColumn width='150' dataField='mobile' dataSort={ true }>Mobile</TableHeaderColumn>
                    <TableHeaderColumn width='150' dataField='isActive' dataFormat={ statusFormatter } dataSort={ true }>Status</TableHeaderColumn>
                    <TableHeaderColumn width='150' dataField=''  dataFormat={ actionFormatter }>Action</TableHeaderColumn>
                </BootstrapTable>

                </div>
              </div>
            </div>
          </div>
                <Modal className="customModal brandModal" bsSize="md"
                    show={showModal}
                    onHide={handleClose}>
                    <Modal.Header closeButton className="custmModlHead">
                        <div ><h3>Update Admin User </h3> </div>
                    </Modal.Header>
                    <Modal.Body>                                           
                    <EditeUser 
                      isAdmin = {true}
                      rowData = {rowData}
                      modalSubmit = {modalSubmit}
                    />                       
                    </Modal.Body>
                </Modal>
        </div>
      </div>
    )

}

export default AdminUsers
