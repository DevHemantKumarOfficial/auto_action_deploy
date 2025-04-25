import { useState } from 'react';
import Select from 'react-select';
import "./user-registration.css";
import { Bounce, toast, ToastContainer } from 'react-toastify';
import "react-toastify/dist/ReactToastify.css";
import axiosInstance from '../../config/axiosConfig';

const optionsArr: any[] = [
    { value: "USA", label: "United States" },
    { value: "Europe", label: "Europe" },
];
interface ChildComponentProps {
    fetchUpdates: () => void;
}

const UserRegistration: React.FC<ChildComponentProps> = ({ fetchUpdates}) => {

    const currentDate = new Date().toISOString().split('T')[0];

    const endDate = new Date(new Date().setDate(new Date().getDate() + 30)).toISOString().split('T')[0];

    const initialFormData = {
        accountNumber: '',
        clientName: '',
        company: '',
        email: '',
        address: '',
        country: '',
        gstVat: '',
        subscriptionTransactional: '',
        accountManager: '',
        trialPurchase: 'Trial',
        startDate: currentDate,
        endDate: endDate,
        accessModule: [optionsArr[0]],
    };

    const [formData, setFormData] = useState(initialFormData);

    const [errors, setErrors] = useState({
        accountNumber: '',
        clientName: '',
        company: '',
        email: '',
        address: '',
        country: '',
        gstVat: '',
        subscriptionTransactional: '',
        accountManager: '',
        startDate: '',
        endDate: '',
        accessModule: '',
    });

    const admin_user_id = sessionStorage.getItem('user_id');

    const validateEmail = (email: string) => {
        // Regular expression for validating email format
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    };
    const validateForm = () => {
        const newErrors = { ...errors };

        if (!formData.accountNumber) newErrors.accountNumber = 'Account Number is required';
        else newErrors.accountNumber = '';

        if (!formData.clientName) newErrors.clientName = 'Client Name is required';
        else newErrors.clientName = '';

        if (!formData.company) { newErrors.company = 'Company is required'; }
        else newErrors.company = '';

        if (!formData.email) { newErrors.email = 'Email is required'; }
        else if (!validateEmail(formData.email)) {
            newErrors.email = 'Invalid email format';
        }

        else newErrors.email = '';

        if (!formData.address) newErrors.address = 'Address is required';
        else newErrors.address = '';

        if (!formData.country) newErrors.country = 'Country is required';
        else newErrors.country = '';

        if (!formData.gstVat) newErrors.gstVat = 'GST/VAT is required';
        else newErrors.gstVat = '';

        if (!formData.subscriptionTransactional) newErrors.subscriptionTransactional = 'Subscription/Transactional is required';
        else newErrors.subscriptionTransactional = '';

        if (!formData.accountManager) newErrors.accountManager = 'Account Manager is required';
        else newErrors.accountManager = '';

        if (!formData.startDate) newErrors.startDate = 'Start Date is required';
        else newErrors.startDate = '';

        if (!formData.endDate) newErrors.endDate = 'End Date is required';
        else newErrors.endDate = '';

        if (formData.accessModule.length === 0) newErrors.accessModule = 'At least one access module is required';
        else newErrors.accessModule = '';

        setErrors(newErrors);
        return Object.values(newErrors).every(error => error === '');
    };

    const handleChange = (e: any) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleSelectChange = (selectedOptions: any) => {
        setFormData({ ...formData, accessModule: selectedOptions });
    };

    const handleSubmit = async (e: any) => {
        e.preventDefault();
        if (!validateForm()) {

            toast.error('Please correct the errors in the form', {
                position: "top-center",
                autoClose: 3000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: "light",
                transition: Bounce,
            });
            return;
        }
        try {
            if (!process.env.isLocal) {
                const response = await axiosInstance.post(`${process.env.URL}auth/signup?adminUserId=${admin_user_id}`, {
                    accountNumber: formData.accountNumber,
                    clientName: formData.clientName,
                    company: formData.company,
                    email: formData.email,
                    address: formData.address,
                    country: formData.country,
                    gst_vat: formData.gstVat,
                    startDate: formData.startDate,
                    endDate: formData.endDate,
                    subscription: formData.subscriptionTransactional,
                    membershipStatus: formData.trialPurchase,
                    accountManager: formData.accountManager,
                    accessReason: formData.accessModule.map((val) => val.value),
                    roles: "user",
                    createdBy: admin_user_id
                });
                if (response.status === 200 || response.status === 201) {
                    toast.success('User Added Successfully', {
                        position: "top-center",
                        autoClose: 3000,
                        hideProgressBar: false,
                        closeOnClick: true,
                        pauseOnHover: true,
                        draggable: true,
                        progress: undefined,
                        theme: "light",
                        transition: Bounce,
                    })
    
                    setFormData(initialFormData);
                    fetchUpdates();
    
                } else {
                    toast.error('Internal Error', {
                        position: "top-center",
                        autoClose: 3000,
                        hideProgressBar: false,
                        closeOnClick: true,
                        pauseOnHover: true,
                        draggable: true,
                        progress: undefined,
                        theme: "light",
                        transition: Bounce,
                    });
                }
            } else {
                toast.success('Demo User Added Successfully', {
                    position: "top-center",
                    autoClose: 3000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                    theme: "light",
                    transition: Bounce,
                })

                setFormData(initialFormData);
            }
        } catch (error: any) {
            const msg = error.response.data.message;
            toast.error(msg, {
                position: "top-center",
                autoClose: 3000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: "light",
                transition: Bounce,
            });

        } 
    };

    return (
        <div className="a-container">
            <ToastContainer></ToastContainer>
            <div className="heading">Add Customer</div>
            <div className="form">
                <form onSubmit={handleSubmit}>
                    <div className="roww">
                        <div className="content">
                            <label className="textbox-head">Account Number</label>
                            <input type="text" className="textbox" name="accountNumber" placeholder="AX000" value={formData.accountNumber} onChange={handleChange} />
                            {errors.accountNumber && <span className="error">{errors.accountNumber}</span>}
                        </div>
                        <div className="content">
                            <label className="textbox-head">Client Name</label>
                            <input type="text" className="textbox" name="clientName" placeholder="Client Name" value={formData.clientName} onChange={handleChange} />
                            {errors.clientName && <span className="error">{errors.clientName}</span>}
                        </div>
                        <div className="content">
                            <label className="textbox-head">Company</label>
                            <input type="text" className="textbox" name="company" placeholder="ABC Pharma" value={formData.company} onChange={handleChange} />
                            {errors.company && <span className="error">{errors.company}</span>}
                        </div>
             

                   
                        <div className="content">
                            <label className="textbox-head">Email</label>
                            <input type="text" className="textbox" name="email" placeholder="abc@email.com" value={formData.email} onChange={handleChange} />
                            {errors.email && <span className="error">{errors.email}</span>}
                        </div>
                        <div className="content">
                            <label className="textbox-head">Address</label>
                            <input type="text" className="textbox" name="address" placeholder="Delhi" value={formData.address} onChange={handleChange} />
                            {errors.address && <span className="error">{errors.address}</span>}
                        </div>
                        <div className="content">
                            <label className="textbox-head">Country</label>
                            <input type="text" className="textbox" name="country" placeholder="India" value={formData.country} onChange={handleChange} />
                            {errors.country && <span className="error">{errors.country}</span>}
                        </div>
                  

               
                        <div className="content">
                            <label className="textbox-head">GST/VAT</label>
                            <input type="text" className="textbox" name="gstVat" placeholder="GST Number" value={formData.gstVat} onChange={handleChange} />
                            {errors.gstVat && <span className="error">{errors.gstVat}</span>}
                        </div>
                        <div className="content">
                            <label className="textbox-head">Subscription/Transactional</label>
                            <input type="text" className="textbox" name="subscriptionTransactional" placeholder="Subscription" value={formData.subscriptionTransactional} onChange={handleChange} />
                            {errors.subscriptionTransactional && <span className="error">{errors.subscriptionTransactional}</span>}
                        </div>
                        <div className="content">
                            <label className="textbox-head">Account Manager</label>
                            <input type="text" className="textbox" name="accountManager" placeholder="Account Manager" value={formData.accountManager} onChange={handleChange} />
                            {errors.accountManager && <span className="error">{errors.accountManager}</span>}
                        </div>
               

                        <div className="content">
                            <label className="textbox-head">Trial/Purchase</label>
                            <select className="textbox" name="trialPurchase" value={formData.trialPurchase} onChange={handleChange}>
                                <option value="Trial">Trial</option>
                                <option value="Purchase">Purchase</option>
                            </select>
                            {/* { && <span className="error">{errors.accountNumber}</span>} */}
                        </div>
                        <div className="content">
                            <label className="textbox-head">Start Date</label>
                            <input type="date" className="textbox" name="startDate" placeholder="Start date" value={formData.startDate} onChange={handleChange} />
                        </div>
                        <div className="content">
                            <label className="textbox-head">End Date</label>
                            <input type="date" className="textbox" name="endDate" placeholder="End Date" value={formData.endDate} onChange={handleChange} />
                        </div>
     
                        <div className="content content-2">
                            <label className="textbox-head">Inphamed Access Module</label>
                            <Select isMulti options={optionsArr} value={formData.accessModule} onChange={handleSelectChange} />
                        {errors.accessModule && <span className="error">{errors.accessModule}</span>}
                        </div>
                    </div>

                    <div className="submit-button">
                        <button type="submit">Add Customer</button>
                    </div>
                </form>
            </div>

        </div>
    );
}


export default UserRegistration;