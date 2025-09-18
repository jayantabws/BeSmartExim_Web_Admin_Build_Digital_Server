import React, { useState, useEffect } from 'react';
import AxiosMaster from '../shared/AxiosMaster'; // Import AxiosMaster
import AxiosSubscription from '../shared/AxiosSubscription';
import { useParams } from 'react-router-dom';

const EditSubscription = () => {
  const { subscriptionId } = useParams(); // Access the subscriptionId from the URL

  const [subscriptionData, setSubscriptionData] = useState({
    name: '',
    description: '',
    price: '',
    validityDay: '',
    isCustom: '',
    isActive: '',
    countryId : "",
  continentId: "",
  DATA_ACCCESS: "",
  DOWNLOAD_LIMIT : "",
  MAX_DOWNLOAD_DAY: "",
  WORKSPACE: "",
  SUPPORT: "",
  TICKET_MANAGER : "",
  RECORD_PER_WORKSPACE: "",
  SUB_USER: "",
  DISPLAY_FIELDS: "",
  QUERY_PER_DAY : "",

  });

  useEffect(() => {
    // Fetch the current subscription data based on subscriptionId when the component mounts
    AxiosMaster({
      method: 'GET',
      url: `/masterdata-management/subscription/${subscriptionId}`,
      headers: {
        'Content-Type': 'application/json',
      },
    })
      .then((res) => {
        // Set the subscription data in state
        setSubscriptionData(res.data);
      })
      .catch((err) => {
        console.log('Err', err);
        // Handle the error appropriately
      });
  }, [subscriptionId]);

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    // Update the subscriptionData state with the new value
    setSubscriptionData({
      ...subscriptionData,
      [name]: value,
    });
  };

  const handleSubmit = () => {
    // Send a PUT request to update the subscription data
    AxiosMaster({
      method: 'PUT',
      url: `/masterdata-management/subscription/${subscriptionId}`,
      data: JSON.stringify(subscriptionData),
      headers: {
        'Content-Type': 'application/json',
      },
    })
      .then((res) => {
        // Handle success and possibly show a success message
        console.log('Subscription updated successfully', res);
      })
      .catch((err) => {
        console.log('Err', err);
        // Handle the error appropriately and show an error message
      });
  };

  return (
    <div>
      <h2>Edit Subscription {subscriptionId}</h2>
      <form>
        <div>
          <label>Name:</label>
          <input
            type="text"
            name="name"
            value={subscriptionData.name}
            onChange={handleInputChange}
          />
        </div>
        <div>
          <label>Description:</label>
          <input
            type="text"
            name="description"
            value={subscriptionData.description}
            onChange={handleInputChange}
          />
        </div>
        <div>
          <label>Price:</label>
          <input
            type="text"
            name="price"
            value={subscriptionData.price}
            onChange={handleInputChange}
          />
        </div>
        <div>
          <label>Validity Day:</label>
          <input
            type="text"
            name="validityDay"
            value={subscriptionData.validityDay}
            onChange={handleInputChange}
          />
        </div>
        <div>
          <label>isCustom:</label>
          <input
            type="text"
            name="isCustom"
            value={subscriptionData.isCustom}
            onChange={handleInputChange}
          />
        </div>
        <div>
          <label>isActive:</label>
          <input
            type="text"
            name="isActive"
            value={subscriptionData.isActive}
            onChange={handleInputChange}
          />
        </div>



        {/* Add similar fields for other subscription properties */}
        <button type="button" onClick={handleSubmit}>
          Save
        </button>
      </form>
    </div>
  );
};

export default EditSubscription;
