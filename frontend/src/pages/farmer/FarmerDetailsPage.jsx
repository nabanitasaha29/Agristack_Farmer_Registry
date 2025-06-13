import React, { useState } from 'react';
import CredentialForm from './components/FarmerDetails/CredentialForm';
import StatusView from './components/FarmerDetails/StatusView';

const FarmerDetailsPage = () => {
  const [statusData, setStatusData] = useState(null);

  const handleSuccess = (data) => {
    // Called after valid credentials
    setStatusData(data);
  };

  return (
    <div>
      <h2>Farmer Details</h2>
      {statusData ? (
        <StatusView data={statusData} />
      ) : (
        <CredentialForm onSuccess={handleSuccess} />
      )}
    </div>
  );
};

export default FarmerDetailsPage;
