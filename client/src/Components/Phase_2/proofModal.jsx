import { useState } from "react";
import { sendMessage, updatePayment } from "../../slice/AgencyChatSlice";
import { useDispatch } from "react-redux";

export const UploadProofModal = ({ paymentData, onClose, setPaymentConfirmation,selectedSession }) => {
    const [file, setFile] = useState({
        proofImage: null
    });
    const [loading, setLoading] = useState(false)
    const dispatch = useDispatch()
    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!file.proofImage) return alert('Select a file');
        const formData = new FormData();
        formData.append('proofImage', file.proofImage);
        // upload proof
       
                  setLoading(true);
        await dispatch(updatePayment({ paymentId: paymentData._id, formData })).unwrap().then((res) => {
           console.log(res)
            const payload = {
                sessionId: selectedSession._id,
                sender: 'user',
                type: 'paymentConfirmation',
                text: 'Payment Proof',
                formData: {
                  proofImage:res?.payment?.proofImage,
                  status:"proof_uploaded"
                }
              };
            dispatch(sendMessage(payload))
            alert(res.payment ? 'Proof uploaded' : 'Upload failed');
        })
        
        setPaymentConfirmation(false);
        setLoading(false);



    };


    const handleFile = (e) => {
        const { name, files } = e.target;
        if (files && files[0]) {
            setFile((prev) => ({
                ...prev,
                [name]: files[0],
            }));
        }
    };

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 w-full max-w-md">
                <h2 className="text-xl font-semibold mb-4">Upload Payment Proof</h2>
                <p className="mb-2 text-sm text-gray-600">Amount: Rs {paymentData.paymentDetails.amount}</p>
                <p className="mb-2 text-sm text-gray-600">Bank: {paymentData.paymentDetails.bankName}</p>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <input
                        name='proofImage'
                        type="file"
                        accept="image/*"
                        onChange={handleFile}
                        className="w-full border rounded p-2"
                    />
                    <div className="flex justify-end gap-2">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-4 py-2 rounded bg-gray-200 text-gray-700"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={loading}
                            className="px-4 py-2 rounded bg-blue-600 text-white"
                        >
                            {loading ? 'Uploading...' : 'Submit'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};
