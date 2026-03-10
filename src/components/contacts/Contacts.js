import React, { useState, useEffect } from 'react';
import AxiosACT from '../shared/AxiosACT';
import imagePencil from '../../assets/images/pencil-square.svg';
import EditContact from './EditContact';
import { Modal } from 'react-bootstrap';
import { BootstrapTable, TableHeaderColumn } from 'react-bootstrap-table';
import moment from 'moment';

const Contacts = () => {
  const [contactList, setContactList] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [rowData, setRowData] = useState([]);

  const [sortName, setSortName] = useState(undefined);
  const [sortOrder, setSortOrder] = useState(undefined);

  function onSortChange(sortName, sortOrder) {
    setSortName(sortName);
    setSortOrder(sortOrder);
  }

  useEffect(() => {
    getContacts();
  }, []);

  const getContacts = () => {
    AxiosACT({
      method: "GET",
      url: `/activity-management/listcontact/all`
    })
      .then((res) => {
        setContactList(res.data.contactList || []);
      })
      .catch((err) => {
        console.log("Err", err);
      });
  };

  const editContact = (item) => {
    setRowData(item);
    setShowModal(true);
  };

  const handleClose = () => {
    setShowModal(false);
  };

  const modalSubmit = () => {
    setShowModal(false);
    getContacts();
  };

  const textCellFormatter = (cell) => {
    return (
      <div className="table-cell-text" title={cell || ""}>
        {cell || "-"}
      </div>
    );
  };

  const actionFormatter = (cell, row) => {
    return (
      <div className="action-cell">
        <img
          src={imagePencil}
          alt="Edit"
          className="action-icon"
          onClick={() => editContact(row)}
        />
      </div>
    );
  };

  const dateCreated = (cell, row) => {
    return row.createdDate
      ? moment(row.createdDate).format("MMM. DD, YYYY")
      : "-";
  };

  const indexN = (cell, row, enumObject, index) => {
    return <div className="center-cell">{index + 1}</div>;
  };

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
              <li className="breadcrumb-item">
                <a href="!#" onClick={(event) => event.preventDefault()}>
                  Contacts
                </a>
              </li>
              <li className="breadcrumb-item active" aria-current="page">
                <h3 className="page-title">Contact List</h3>
              </li>
            </ol>
          </nav>
        </div>

        <div className="row">
          <div className="col-lg-12 grid-margin stretch-card">
            <div className="card">
              <div className="card-body">
                <div className="contact-table-wrapper">
                  <BootstrapTable
                    data={contactList}
                    striped
                    hover
                    pagination={true}
                    search
                    options={options}
                    tableClassName="contact-table"
                  >
                    <TableHeaderColumn
                      width="70"
                      isKey
                      dataField="id"
                      dataFormat={indexN}
                      thStyle={{ textAlign: "center", verticalAlign: "middle" }}
                      tdStyle={{ textAlign: "center", verticalAlign: "middle" }}
                    >
                      Sl.
                    </TableHeaderColumn>

                    <TableHeaderColumn
                      width="220"
                      dataField="companyName"
                      dataFormat={textCellFormatter}
                      dataSort={true}
                      thStyle={{ textAlign: "left", verticalAlign: "middle" }}
                      tdStyle={{ textAlign: "left", verticalAlign: "middle" }}
                    >
                      Company Name
                    </TableHeaderColumn>

                    <TableHeaderColumn
                      width="240"
                      dataField="address"
                      dataFormat={textCellFormatter}
                      dataSort={true}
                      thStyle={{ textAlign: "left", verticalAlign: "middle" }}
                      tdStyle={{ textAlign: "left", verticalAlign: "middle" }}
                    >
                      Address
                    </TableHeaderColumn>

                    <TableHeaderColumn
                      width="200"
                      dataField="email"
                      dataFormat={textCellFormatter}
                      dataSort={true}
                      thStyle={{ textAlign: "left", verticalAlign: "middle" }}
                      tdStyle={{ textAlign: "left", verticalAlign: "middle" }}
                    >
                      Email
                    </TableHeaderColumn>

                    <TableHeaderColumn
                      width="150"
                      dataField="mobile"
                      dataFormat={textCellFormatter}
                      dataSort={true}
                      thStyle={{ textAlign: "left", verticalAlign: "middle" }}
                      tdStyle={{ textAlign: "left", verticalAlign: "middle" }}
                    >
                      Mobile
                    </TableHeaderColumn>

                    <TableHeaderColumn
                      width="180"
                      dataField="website"
                      dataFormat={textCellFormatter}
                      dataSort={true}
                      thStyle={{ textAlign: "left", verticalAlign: "middle" }}
                      tdStyle={{ textAlign: "left", verticalAlign: "middle" }}
                    >
                      Website
                    </TableHeaderColumn>

                    <TableHeaderColumn
                      width="220"
                      dataField="creatorEmail"
                      dataFormat={textCellFormatter}
                      dataSort={true}
                      thStyle={{ textAlign: "left", verticalAlign: "middle" }}
                      tdStyle={{ textAlign: "left", verticalAlign: "middle" }}
                    >
                      Creator Email
                    </TableHeaderColumn>

                    <TableHeaderColumn
                      width="220"
                      dataField="creatorCompany"
                      dataFormat={textCellFormatter}
                      dataSort={true}
                      thStyle={{ textAlign: "left", verticalAlign: "middle" }}
                      tdStyle={{ textAlign: "left", verticalAlign: "middle" }}
                    >
                      Creator Company Name
                    </TableHeaderColumn>

                    <TableHeaderColumn
                      width="140"
                      dataField="createdDate"
                      dataFormat={dateCreated}
                      dataSort={true}
                      thStyle={{ textAlign: "center", verticalAlign: "middle" }}
                      tdStyle={{ textAlign: "center", verticalAlign: "middle" }}
                    >
                      Date Created
                    </TableHeaderColumn>

                    <TableHeaderColumn
                      width="90"
                      dataField="action"
                      dataFormat={actionFormatter}
                      thStyle={{ textAlign: "center", verticalAlign: "middle" }}
                      tdStyle={{ textAlign: "center", verticalAlign: "middle" }}
                    >
                      Action
                    </TableHeaderColumn>
                  </BootstrapTable>
                </div>
              </div>
            </div>
          </div>

          <Modal
            className="customModal brandModal"
            bsSize="md"
            show={showModal}
            onHide={handleClose}
          >
            <Modal.Header closeButton className="custmModlHead">
              <div>
                <h3>Update Contact</h3>
              </div>
            </Modal.Header>
            <Modal.Body>
              <EditContact
                rowData={rowData}
                isAdmin={false}
                modalSubmit={modalSubmit}
              />
            </Modal.Body>
          </Modal>
        </div>
      </div>
    </>
  );
};

export default Contacts;