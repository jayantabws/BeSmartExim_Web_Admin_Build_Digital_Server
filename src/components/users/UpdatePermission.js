import React, { useState, useEffect } from "react";
import Swal from "sweetalert2";
import AxiosUser from "../shared/AxiosUser";

const UpdatePermission = (props) => {

  const [myPermissionData, setMyPermissionData] = useState({});

  // load permissions from props
  useEffect(() => {
    if (props.permissionData) {
      setMyPermissionData({
        id: props.permissionData.id,
        userId: props.permissionData.userId,
         users: props.permissionData.users === "Y" ? "Y" : "N",
        adminUsers: props.permissionData.adminUsers === "Y" ? "Y" : "N",
        subscriptions: props.permissionData.subscriptions === "Y" ? "Y" : "N",
        activityLog: props.permissionData.activityLog === "Y" ? "Y" : "N",
        countries: props.permissionData.countries === "Y" ? "Y" : "N",
        contacts: props.permissionData.contacts === "Y" ? "Y" : "N",
        siteSettings: props.permissionData.siteSettings === "Y" ? "Y" : "N"
      });
    }
  }, [props.permissionData]);

  // toggle checkbox
  const handleCheckboxChange = (field) => {
    setMyPermissionData((prev) => ({
      ...prev,
      [field]: prev[field] === "Y" ? "N" : "Y"
    }));
  };

  // save permissions
  const handleSave = () => {

    const dataToAppend = {
      ...myPermissionData,
      id: props.permissionData.id,
      userId: props.permissionData.userId
    };

    AxiosUser({
      method: "PUT",
      url: `user-management/permission/${props.permissionData.userId}`,
      data: dataToAppend,
      headers: {
        "Content-Type": "application/json"
      }
    })
      .then((res) => {
        Swal.fire({
          title: "Success",
          text: "Admin Permission updated successfully",
          icon: "success"
        }).then(() => {props.handleClosePermission()});;
        
      })
      .catch((err) => {
        let errorMsg = "Something went wrong";

        if (err?.data?.errorMsg) {
          errorMsg = err.data.errorMsg;
        }

        Swal.fire({
          title: "Oops!",
          text: errorMsg,
          icon: "error"
        });
      });
  };

  // permission list (dynamic rendering)
  const permissions = [
    { key: "users", label: "Users" },
    { key: "adminUsers", label: "Admin Users" },
    { key: "subscriptions", label: "Subscriptions" },
    { key: "activityLog", label: "Activity Log" },
    { key: "countries", label: "Countries" },
    { key: "contacts", label: "Contacts" },
    { key: "siteSettings", label: "Site Settings" },
    {key:"userTracker",label: "User Tracker"}
  ];

  return (
    <div style={styles.container}>
      {/* <h2 style={styles.title}>Update Permissions</h2> */}

      <div style={styles.card}>
        <div style={styles.permissionsList}>

          {permissions.map((perm) => (
            <div key={perm.key} style={styles.permissionItem}>

              <label style={styles.label}>
                <input
                  type="checkbox"
                  checked={myPermissionData?.[perm.key] === "Y"}
                  onChange={() => handleCheckboxChange(perm.key)}
                  style={styles.checkbox}
                />
                {perm.label}
              </label>

              <span style={styles.status}>
                {myPermissionData?.[perm.key] === "Y"
                  ? "✅ Yes"
                  : "❌ No"}
              </span>

            </div>
          ))}

        </div>

        <div style={styles.buttonGroup}>
          <button onClick={handleSave} style={styles.saveButton}>
            Save Permissions
          </button>
        </div>
      </div>

     
    </div>
  );
};

const styles = {
  container: {
    fontFamily: "Arial",
    maxWidth: "500px",
    margin: "0 auto",
    padding: "20px"
  },

  title: {
    textAlign: "center",
    marginBottom: "20px"
  },

  card: {
    background: "white",
    padding: "20px",
    borderRadius: "8px",
    boxShadow: "0 2px 10px rgba(0,0,0,0.1)"
  },

  permissionsList: {
    marginBottom: "20px"
  },

  permissionItem: {
    display: "flex",
    justifyContent: "space-between",
    padding: "12px",
    borderBottom: "1px solid #eee"
  },

  label: {
    display: "flex",
    alignItems: "center",
    gap: "10px"
  },

  checkbox: {
    width: "18px",
    height: "18px"
  },

  status: {
    fontWeight: "bold"
  },

  buttonGroup: {
    marginTop: "20px"
  },

  saveButton: {
    width: "100%",
    padding: "12px",
    background: "#4CAF50",
    color: "white",
    border: "none",
    borderRadius: "4px",
    cursor: "pointer"
  },

  preview: {
    marginTop: "20px",
    background: "#f5f5f5",
    padding: "10px",
    borderRadius: "5px"
  },

  previewTitle: {
    fontSize: "14px",
    marginBottom: "10px"
  },

  pre: {
    fontSize: "12px"
  }
};

export default UpdatePermission;