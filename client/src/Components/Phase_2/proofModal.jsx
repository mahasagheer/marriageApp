import { useState } from "react";
import { sendMessage, updatePayment } from "../../slice/AgencyChatSlice";
import { useDispatch } from "react-redux";
import { Button } from "../Layout/Button";
import { toast } from "react-toastify";

export const UploadProofModal = ({ paymentData, onClose, setPaymentConfirmation,selectedSession }) => {
    const [file, setFile] = useState({
        proofImage: null
    });
    const [loading, setLoading] = useState(false)
    const dispatch = useDispatch()
    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!file.proofImage) return toast.error('Select a file');
        const formData = new FormData();
        formData.append('proofImage', file.proofImage);
        // upload proof
       
                  setLoading(true);
        await dispatch(updatePayment({ paymentId: paymentData._id, formData })).unwrap().then((res) => {
            const payload = {
                sessionId: selectedSession._id,
                sender: 'user',
                type: 'paymentConfirmation',
                text: 'Payment Proof',
                formData: {
                  proofImage:res?.payment?.proofImage,
                  paymentId:paymentData._id,
                  status:"proof_uploaded"
                }
              };
            dispatch(sendMessage(payload))
            toast.success(res.payment && 'Proof uploaded') 
            toast.error(res.payment && 'Upload failed');
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
            <div className="bg-white dark:bg-gray-800 rounded-lg p-6 w-[90%] md:w-full md:max-w-md ">
                <h2 className="text-xl font-semibold mb-4">Upload Payment Proof</h2>
                <p className="mb-2 text-sm text-gray-600 dark:text-gray-200">Amount: Rs {paymentData.paymentDetails.amount}</p>
                <p className="mb-2 text-sm text-gray-600 dark:text-gray-200">Bank: {paymentData.paymentDetails.bankName}</p>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <input
                        name='proofImage'
                        type="file"
                        accept="image/*"
                        onChange={handleFile}
                        className="w-full border rounded p-2"
                    />
                    <div className="flex justify-end gap-2">
                        <Button
                            onClick={onClose}
                            btnText={"Cancel"}
                            hoverColor="bg-gray-800"
                            btnColor='dark:bg-gray-700 bg-gray-200'
                textColor='text-gray-800 dark:text-white'
                            // className="px-4 py-2 rounded bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-200"
                        />
                           
                        <Button
                            type="submit"
                            disabled={loading}
                            onClick={handleSubmit}
                            btnText={loading ? 'Uploading...' : 'Submit'}
                            // className="px-4 py-2 rounded bg-blue-600 text-white"
                        />
                            
                    
                    </div>
                </form>
            </div>
        </div>
    );
};
