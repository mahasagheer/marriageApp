// src/components/AgencyCreate.js
import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Input } from "../../Components/Layout/Input";
import { Button } from "../../Components/Layout/Button";
import { Label } from '../../Components/Layout/Label';
import ImagePicker from '../../Components/Layout/ImagePicker';
import { createAgency, fetchAgencyById, updateAgency } from '../../slice/agencySlice';
import { useDispatch } from 'react-redux';

export const AgencyProfile = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        name: '',
        businessNo: '',
        cnicNo: '',
        licenseNo: '',
        yearOfExp: '',
        verification: 'pending',
        contactNo: '',
        address: {
            street: '',
            city: '',
            state: '',
            postalCode: '',
            country: ''
        },
        images: [],
        profile: '',
        isVerified: false
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [errors, setErrors] = useState({});
    const { id } = useParams();
    const[edit,setEdit]=useState(false)
const dispatch=useDispatch()
    // Validation rules
    const validate = () => {
        const newErrors = {};
        
        // Agency Name validation
        if (!formData.name.trim()) {
            newErrors.name = 'Agency name is required';
        } else if (formData.name.length < 3) {
            newErrors.name = 'Agency name must be at least 3 characters';
        }

        // Business Number validation
        if (!formData.businessNo.trim()) {
            newErrors.businessNo = 'Business number is required';
        } else if (!/^[0-9]{10,15}$/.test(formData.businessNo)) {
            newErrors.businessNo = 'Business number must be 10-15 digits';
        }

        // CNIC validation (if provided)
        if (formData.cnicNo && !/^[0-9]{5}-[0-9]{7}-[0-9]{1}$/.test(formData.cnicNo)) {
            newErrors.cnicNo = 'CNIC must be in format 12345-1234567-1';
        }

        // License Number validation
        if (!formData.licenseNo.trim()) {
            newErrors.licenseNo = 'License number is required';
        }

        // Years of Experience validation
        if (!formData.yearOfExp) {
            newErrors.yearOfExp = 'Years of experience is required';
        } else if (isNaN(formData.yearOfExp)) {
            newErrors.yearOfExp = 'Must be a number';
        } else if (formData.yearOfExp < 0 || formData.yearOfExp > 100) {
            newErrors.yearOfExp = 'Must be between 0 and 100';
        }

        // Contact Number validation
        if (!formData.contactNo.trim()) {
            newErrors.contactNo = 'Contact number is required';
        } else if (!/^[0-9+]{11,15}$/.test(formData.contactNo)) {
            newErrors.contactNo = 'Invalid contact number format';
        }

        // Address validations
        if (!formData.address.street.trim()) {
            newErrors['address.street'] = 'Street address is required';
        }

        if (!formData.address.city.trim()) {
            newErrors['address.city'] = 'City is required';
        }

        if (!formData.address.country.trim()) {
            newErrors['address.country'] = 'Country is required';
        }

        // Profile description validation
        if (formData.profile && formData.profile.length > 500) {
            newErrors.profile = 'Profile description must be less than 500 characters';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };
    useEffect(() => {
        if (id) {
          dispatch(fetchAgencyById(id))
            .unwrap()
            .then((res) => {
                setEdit(true)
                setFormData(res?.data)
            })
            .catch((error) => console.error("Error fetching profile:", error));
        }
      }, [id, dispatch]);
    useEffect(() => {
        if (Object.keys(errors).length > 0) {
            validate();
        }
    }, [formData]);

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
    
        if (name.includes('address.')) {
            const addressField = name.split('.')[1];
            setFormData(prev => ({
                ...prev,
                address: {
                    ...prev.address,
                    [addressField]: value
                }
            }));
        } else {
            setFormData(prev => ({
                ...prev,
                [name]: type === 'checkbox' ? checked : value
            }));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (!validate()) {
            return;
        }

        setLoading(true);
        setError(null);

        try {
            // If you want to send as FormData (for file uploads)
            const data = new FormData();
            Object.entries(formData).forEach(([key, value]) => {
                if (key === "address") {
                    // For nested address object, append each field
                    Object.entries(value).forEach(([addrKey, addrValue]) => {
                        data.append(`address[${addrKey}]`, addrValue);
                    });
                } else if (key === "images" && Array.isArray(value)) {
                    // For images array, append each file
                    value.forEach((file, idx) => {
                        data.append(`images`, file);
                    });
                } else {
                    data.append(key, value);
                }
            });
            if (id && edit) {
                await dispatch(updateAgency({ id: id, updates: data })).finally((res)=>{
                    alert("✅ Profile updated successfully!");
                });
              } else {
             const response =  await dispatch(createAgency(data)).finally((res)=>{
                alert("✅ Profile created successfully!");
             });
        
              }
              navigate("/agency/profile");
            
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    // Helper function to format CNIC
    const formatCNIC = (e) => {
        let value = e.target.value.replace(/\D/g, '');
        if (value.length > 5) {
            value = value.substring(0, 5) + '-' + value.substring(5);
        }
        if (value.length > 13) {
            value = value.substring(0, 13) + '-' + value.substring(13);
        }
        if (value.length > 15) {
            value = value.substring(0, 15);
        }
        setFormData(prev => ({
            ...prev,
            cnicNo: value
        }));
    };

    // Helper function to format phone number
    const formatPhone = (e) => {
        let value = e.target.value.replace(/\D/g, '');
        if (value.length > 0) {
            value = '+' + value;
        }
        if (value.length > 15) {
            value = value.substring(0, 15);
        }
        setFormData(prev => ({
            ...prev,
            contactNo: value
        }));
    };

    return (
        <div className='ml-[3rem] min-h-screen bg-gray-50 dark:bg-gray-900'>
            <h1 className="text-3xl font-bold text-center mb-6 dark:text-white">
                {id ? "✏️ Edit Agency Profile" : " Create Your Agency Profile"}
            </h1>

            {error && (
                <div className="p-4 mb-6 text-sm text-red-700 bg-red-100 rounded-lg">
                    {error}
                </div>
            )}

            <form  className="bg-white dark:bg-gray-800 shadow rounded-lg p-6" >
                <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                    {/* Basic Information */}
                    <div className="md:col-span-2">
                        <h2 className="text-lg font-medium dark:text-gray-200 text-gray-900 mb-4">Basic Information</h2>
                        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                            <div>
                                <Label>
                                    Agency Name *
                                </Label>
                                <Input
                                    type="text"
                                    id="name"
                                    name="name"
                                    value={formData.name}
                                    onChange={handleChange}
                                    required
                                />
                                {errors.name && <p className="mt-1 text-sm text-red-600">{errors.name}</p>}
                            </div>
                            <div>
                                <Label>
                                    Business Number *
                                </Label>
                                <Input
                                    type="text"
                                    id="businessNo"
                                    name="businessNo"
                                    value={formData.businessNo}
                                    onChange={handleChange}
                                    required
                                />
                                {errors.businessNo && <p className="mt-1 text-sm text-red-600">{errors.businessNo}</p>}
                            </div>
                            <div>
                                <Label>CNIC Number</Label>
                                <Input
                                    type="text"
                                    id="cnicNo"
                                    name="cnicNo"
                                    value={formData.cnicNo}
                                    onChange={formatCNIC}
                                    placeholder="12345-1234567-1"
                                />
                                {errors.cnicNo && <p className="mt-1 text-sm text-red-600">{errors.cnicNo}</p>}
                            </div>
                            <div>
                                <Label>License Number *</Label>
                                <Input
                                    type="text"
                                    id="licenseNo"
                                    name="licenseNo"
                                    value={formData.licenseNo}
                                    onChange={handleChange}
                                    required
                                />
                                {errors.licenseNo && <p className="mt-1 text-sm text-red-600">{errors.licenseNo}</p>}
                            </div>
                            <div>
                                <Label>Years of Experience *</Label>
                                <Input
                                    type="number"
                                    id="yearOfExp"
                                    name="yearOfExp"
                                    value={formData.yearOfExp}
                                    onChange={handleChange}
                                    min="0"
                                    max="100"
                                    required
                                />
                                {errors.yearOfExp && <p className="mt-1 text-sm text-red-600">{errors.yearOfExp}</p>}
                            </div>
                            <div>
                                <Label>Contact Number *</Label>
                                <Input
                                    type="tel"
                                    id="contactNo"
                                    name="contactNo"
                                    value={formData.contactNo}
                                    onChange={formatPhone}
                                    required
                                    placeholder="+1234567890"
                                />
                                {errors.contactNo && <p className="mt-1 text-sm text-red-600">{errors.contactNo}</p>}
                            </div>
                        </div>
                    </div>

                    {/* Address Information */}
                    <div className="md:col-span-2">
                        <h2 className="text-lg font-medium text-gray-900 mb-4 dark:text-gray-200">Address Information</h2>
                        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                            <div>
                                <Label>Street *</Label>
                                <Input
                                    type="text"
                                    id="address.street"
                                    name="address.street"
                                    value={formData?.address?.street}
                                    onChange={handleChange}
                                    required
                                />
                                {errors['address.street'] && <p className="mt-1 text-sm text-red-600">{errors['address.street']}</p>}
                            </div>
                            <div>
                                <Label>City *</Label>
                                <Input
                                    type="text"
                                    id="address.city"
                                    name="address.city"
                                    value={formData?.address?.city}
                                    onChange={handleChange}
                                    required
                                />
                                {errors['address.city'] && <p className="mt-1 text-sm text-red-600">{errors['address.city']}</p>}
                            </div>
                            <div>
                                <Label>State</Label>
                                <Input
                                    type="text"
                                    id="address.state"
                                    name="address.state"
                                    value={formData?.address?.state}
                                    onChange={handleChange}
                                />
                            </div>
                            <div>
                                <Label>Postal Code</Label>
                                <Input
                                    type="text"
                                    id="address.postalCode"
                                    name="address.postalCode"
                                    value={formData?.address?.postalCode}
                                    onChange={handleChange}
                                />
                            </div>
                            <div>
                                <Label>Country *</Label>
                                <Input
                                    type="text"
                                    id="address.country"
                                    name="address.country"
                                    value={formData?.address?.country}
                                    onChange={handleChange}
                                    required
                                />
                                {errors['address.country'] && <p className="mt-1 text-sm text-red-600">{errors['address.country']}</p>}
                            </div>
                        </div>
                    </div>

                    {/* Additional Information */}
                    <div className="md:col-span-2">
                        <h2 className="text-lg font-medium text-gray-900 mb-4 dark:text-gray-200">Additional Information</h2>
                        <div>
                            <Label>Profile Description</Label>
                            <textarea
                                id="description"
                                name="description"
                                rows={4}
                                value={formData.description}
                                onChange={handleChange}
                                className="w-full p-3 border border-gray-300 rounded-lg"
                                maxLength={500}
                            />
                            {errors.description && <p className="mt-1 text-sm text-red-600">{errors.description}</p>}
                            <p className="text-xs text-gray-500 mt-1">
                                {formData?.description?.length}/500 characters
                            </p>
                        </div>
                        <div className='mt-4'>
                            <Label>Upload Documents</Label> 
                            <ImagePicker form={formData} setForm={setFormData} id={id} />
                            {errors?.images && <p className="mt-1 text-sm text-red-600">{errors.images}</p>}
                        </div>
                    </div>
                </div>

                <div className="mt-8 flex justify-end space-x-4">
                    <Button
                        type="button"
                        onClick={() => navigate('/')}
                        btnText="Cancel"
                        className="bg-gray-300 hover:bg-gray-400"
                    />
                    <Button
                        btnText={loading ? (
                            <span className="flex items-center">
                                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                </svg>
                                {id ? 'Updating...' : 'Creating...'}
                            </span>
                        ) : (id ? 'Update Agency' : 'Create Agency')}
                        onClick={handleSubmit}
                    />
                </div>
            </form>
        </div>
    );
};