export const PaymentCard = ({ payment }) => {
    const getStatusStyles = (status) => {
        switch (status) {
          case "pending":
            return "bg-yellow-100 text-yellow-700";
          case "proof_uploaded":
            return "bg-blue-100 text-blue-700";
          case "verified":
            return "bg-green-100 text-green-700";
            case "verified":
                return "bg-red-100 text-red-700"; 
          default:
            return "bg-gray-100 text-gray-700";
        }
      };

      const getStatusLabel = (status) => {
        switch (status) {
          case "pending":
            return "Pending";
          case "proof_uploaded":
            return "Proof Uploaded";
          case "rejected":
            return "Rejected";
          case "verified":
            return "Verified";
          default:
            return status;
        }
      };

      const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString("en-GB", {
          day: "2-digit",
          month: "short", // gives "Nov"
          year: "numeric",
        });
      };
      
    return (
      <div className="bg-white dark:bg-gray-900 shadow rounded-2xl p-4 border">
        <div className="flex justify-between items-center mb-2">
          <h3 className="font-semibold text-lg dark:text-gray-200">Rs {payment?.paymentDetails?.amount}</h3>
          <span
            className={`text-sm font-medium px-2 py-1 rounded ${getStatusStyles(
                payment.status
              )}`}
          >
           {getStatusLabel(payment.status)} 
          </span>
        </div>
        <p className="text-sm text-gray-600 dark:text-gray-300">Agency: {payment.agencyProfile.name}</p>
        <p className="text-sm text-gray-600 dark:text-gray-300">Agency Address: {payment.agencyProfile.address.street}, {payment.agencyProfile.address.city}, {payment.agencyProfile.address.state}, {payment.agencyProfile.address.country}</p>
        <p className="text-sm text-gray-600 dark:text-gray-300">Bank: {payment.paymentDetails.bankName}</p>
        <p className="text-sm text-gray-500 dark:text-gray-300">Date: {formatDate(payment.createdAt)}</p>
  
        {payment.proofImage && (
            <img
              src={`http://localhost:5000/${payment.proofImage}`}
              alt="Payment Proof"
              className="mt-3 w-full max-w-xs rounded border"
            />
        )}
      </div>
    ); 
  };
  