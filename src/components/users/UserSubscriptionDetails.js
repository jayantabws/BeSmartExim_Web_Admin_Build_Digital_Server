import React, { Component,useState, useRef, useCallback, useEffect, Fragment } from 'react'
import { Row, Col, Modal, Button, FormGroup, OverlayTrigger, Tooltip } from 'react-bootstrap';
import AxiosMaster from '../shared/AxiosMaster';
import Swal from 'sweetalert2';
import moment from 'moment';




const UserSubscriptionDetails = (props) => {
 
  const [subscriptionDetails, setSubscriptionDetails] = useState([]);

  

  const getSubscriptionDetails = () => {
    let subscriptionId = props.rowData.subscriptionId

    AxiosMaster({
      method: "GET",
      url: `masterdata-management/subscription/${subscriptionId}`,    
    })
      .then(res => {
        setSubscriptionDetails(res.data)
      })
      .catch(err => {
        setSubscriptionDetails([])
      });
  }


  useEffect(() => {
    getSubscriptionDetails(props)
  },[])


    return (
      <div>
                <table width={450} border={2}>
                  <tbody>
                    <tr>
                      <th>Item Name</th>
                      <th>Assigned</th>
                      <th>Available</th>
                    </tr>
                    <tr>
                      <td>Total Download Limit</td>
                      <td>{subscriptionDetails && subscriptionDetails.downloadLimit}</td>
                      <td>{props.rowData.downloadLimit}</td>
                    </tr>
                    <tr>
                      <td>Record Download Per Day</td>
                      <td>{subscriptionDetails && subscriptionDetails.maxDownloadPerDay}</td>
                      <td>{props.rowData.downloadPerDay}</td>
                    </tr>
                    <tr>
                      <td>Total Workspace</td>
                      <td>{subscriptionDetails && subscriptionDetails.workspaceLimit}</td>
                      <td>{props.rowData.totalWorkspace}</td>
                    </tr>
                    <tr>
                      <td>Maximum Limit To Download Records Per Search</td>
                      <td>{subscriptionDetails && subscriptionDetails.recordPerWorkspace}</td>
                      <td>{props.rowData.recordsPerWorkspace}</td>
                    </tr>
                    <tr>
                      <td>Data Available From Date</td>
                      <td>{subscriptionDetails && subscriptionDetails.dataAccess}</td>
                      <td>{props.rowData.dataAccessInMonth}</td>
                    </tr>
                    <tr>
                      <td>Data Available Upto Date</td>
                      <td colspan={2}>{props.rowData.dataAccessUpto}</td>
                    </tr>
                    <tr>
                      <td>Search Query Per Day</td>
                      <td>{subscriptionDetails && subscriptionDetails.searchQueryPerDay}</td>
                      <td>{props.rowData.queryPerDay}</td>
                    </tr>                    
                    <tr>
                      <td>Plan Create Date</td>                     
                      <td colSpan={2}>{moment(props.rowData.createdDate).format("DD-MM-YYYY")}</td>
                    </tr>
                    <tr>
                      <td>Plan Expire Date</td>
                      <td colSpan={2}>{moment(props.rowData.accountExpireDate).format("DD-MM-YYYY")}</td>
                    </tr>
                    <tr>
                      <td>Allowed Chapter</td>
                      <td colSpan={2}>{props.rowData.allowedChapter ? props.rowData.allowedChapter : "None"}</td>
                    </tr>
                  </tbody>
                  
                </table>

{/*

                  <div className="form-group">
                    <label><b>Subscription Plan Name</b></label><br />
                    {props.rowData.name}
                  </div>
                  <div className="form-group">
                    <label><b>Plan Description</b></label><br />
                    {props.rowData.description}
                  </div>
                  <div className="form-group">
                    <label><b>Price (in INR)</b></label><br />
                    {props.rowData.price}
                  </div>
                  <div className="form-group">
                    <label><b>Package Validity (in Day)</b></label><br />
                    {props.rowData.validityInDay}
                  </div>
                  <div className="form-group">
                    <label><b>Total Download Limit</b></label><br />
                    {props.rowData.downloadLimit}
                  </div>
                  <div className="form-group">
                    <label><b>Record Download Per Day</b></label><br />
                    {props.rowData.downloadPerDay}
                  </div>
                  <div className="form-group">
                    <label><b>Total Workspace</b></label><br />
                    {props.rowData.totalWorkspace}
                  </div>
                  <div className="form-group">
                    <label><b>Maximum Number of Records Per Workspace</b></label><br />
                    {props.rowData.recordsPerWorkspace}
                  </div>
                  <div className="form-group">
                    <label><b>Maximum Sub User Account</b></label><br />
                    {props.rowData.subUserCount}
                  </div>
                  <div className="form-group">
                    <label><b>Data Available Upto</b></label><br />
                    {props.rowData.dataAccessInMonth}
                  </div>
                  <div className="form-group">
                    <label><b>Support Available</b></label><br />
                    {props.rowData.support}
                  </div>
                  <div className="form-group">
                    <label><b>Ticket Manager</b></label><br />
                    {props.rowData.ticketManager}
                  </div>
                  <div className="form-group">
                    <label><b>Data Available Upto</b></label><br />
                    {props.rowData.dataAccessInMonth}
                  </div>
                  <div className="form-group">
                    <label><b>Display Fields</b></label><br />
                    {props.rowData.displayFields}
                  </div>
                  <div className="form-group">
                    <label><b>Search Query Per Day</b></label><br />
                    {props.rowData.queryPerDay}
                  </div>
                  <div className="form-group">
                    <label><b>Plan Create Date</b></label><br />
                    {props.rowData.createdDate}
                  </div>
                  <div className="form-group">
                    <label><b>Plan Expire Date</b></label><br />
                    {props.rowData.accountExpireDate}
                  </div>
                  <div className="form-group">
                    <label><b>Plan Status</b></label><br />
                    {props.rowData.isActive}
                  </div>
              */}
               

               
      </div>
    )

}

export default UserSubscriptionDetails
