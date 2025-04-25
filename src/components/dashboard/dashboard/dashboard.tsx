import React from 'react';
import editIcon from "../../../assets/images/edit icon.svg";
import deleteIcon from "../../../assets/images/delete.svg";
import tickIcon from "../../../assets/images/tick.svg";
import cancelIcon from "../../../assets/images/cancel.svg";
import "./dashboard.css"
import uploadUs from "../../../assets/images/upload us.svg";
import uploadEu from "../../../assets/images/upload eu.svg";
import flagUs from "../../../assets/images/flag-us 1.svg";
import flagEu from "../../../assets/images/flag-eu 1.svg";
import { useEffect, useState } from "react";
import DrugCard from "../drug-cards/drug-card";
import "react-toastify/dist/ReactToastify.css";
import { IoChevronBackOutline } from "react-icons/io5";
import { MdOutlineSync } from "react-icons/md";
import { MdRefresh } from "react-icons/md";
import Userdetail from "../../../assets/json/getUserdetail.json";
import AdminDataStatistics from "../../../assets/json/getAdminDataStatistics.json";




// Import FilePond styles
import 'filepond/dist/filepond.min.css'

import { FilePond } from "react-filepond";

import { Bounce, toast, ToastContainer } from "react-toastify";
import axios from "axios";
import Select from 'react-select';
import axiosInstance from '../../config/axiosConfig';
import PageLoader from '../../Commom/loaders/pageLoader';
// import FilePondPluginFileValidateType from 'filepond-plugin-file-validate-type';
// registerPlugin(FilePondPluginFileValidateType);

const optionsArr: any[] = [
    { value: "USA", label: "United States" },
    { value: "Europe", label: "Europe" },
];

interface Option {
    value: string,
    label: string
}

interface Order {

    _id: string,
    accountNumber: string,
    clientName: string,
    company: string,
    email: string,
    address: string,
    country: string,
    gst_vat: string,
    startDate: string,
    endDate: string,
    subscription: string,
    membershipStatus: string,
    accountManager: string,
    accessReason: any[],
    isValid: boolean,
    latestLoginDetail: string

}
interface ChildComponentProps {
    update: any;
    fetchUpdates: () => void;
}

const Dashboard: React.FC<ChildComponentProps> = ({ update, fetchUpdates }) => {


    // const orders_data: Order[] = [
    //     {
    //         accountNo: "INP 101",
    //         accountManager: "Name",
    //         clientName: "Deepak Malik",
    //         company: "ABC Pharma",
    //         email: "abc@gmail.com",
    //         address: "Sector 18, Gurugram, Haryana",
    //         country: "India",
    //     },
    //     {
    //         accountNo: "INP 102",
    //         accountManager: "Name",
    //         clientName: "Deepak Malik",
    //         company: "ABC Pharma",
    //         email: "abc@gmail.com",
    //         address: "Sector 18, Gurugram, Haryana",
    //         country: "India",
    //     },
    // ];

    const [isEditConfirmation, setEditConfirmation] = useState<boolean[]>([]);
    const [isDeleteConfirmation, setDeleteConfirmation] = useState<boolean[]>([]);
    const [isEditing, setIsEditing] = useState<boolean[]>([]);
    const [isUploading, setIsUplaoding] = useState(false);
    const [currentRegion, setCurrentRegion] = useState('');
    const [orders, setOrders] = useState<Order[]>([]);
    const [editedOrders, setEditedOrders] = useState<Order[]>([]);
    const [drugs, setDrugs] = useState<any[]>([]);
    const userId = sessionStorage.getItem("user_id");
    const [errors, setErrors] = useState<any[]>([]);
    const [isUploadVlidate, setIsUploadVlidate] = useState(false);

    const admin_user_id = sessionStorage.getItem('user_id');

    useEffect(() => {
        fetchData();
        fetchDrugs();
        fetchUpdates();
    }, []);


    const fetchData = async () => {
        try {
            if (!process.env.isLocal) {
                const response = await axiosInstance.get(`${process.env.URL}getUserdetail?userId=${userId}`);
                setOrders(response.data.result);
            } else {
                const localResponse: any = Userdetail
                setOrders(localResponse);
            }
        } catch (error: any) {
            toast.error(error, {
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
        }
    };

    const fetchDrugs = async () => {
        try {
            if (!process.env.isLocal) {
                const response = await axiosInstance.get(`${process.env.URL}getAdminDataStatistics`);
                setDrugs(response.data.data);
            } else {
                const localResponse: any = AdminDataStatistics
                setDrugs(localResponse);
            }

        } catch (error: any) {
            toast.error(error, {
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
        }
    };

    const updateData = async (order: Order) => {
        try {

            const userDetail = {
                userId: order._id,
                clientName: order.clientName,
                company: order.company,
                email: order.email,
                address: order.address,
                country: order.country,
                gst_vat: order.gst_vat,
                startDate: order.startDate,
                endDate: order.endDate,
                subscription: order.subscription,
                membershipStatus: order.membershipStatus,
                accountManager: order.accountManager,
                accessReason: order.accessReason,
                updatedBy: admin_user_id
            };

            if (!process.env.isLocal) {
                const response = await axiosInstance.post(`${process.env.URL}updateUserdetail?adminUserId=${admin_user_id}`, userDetail);
                if (response.status === 200 || response.status === 201) {
                    toast.success('User Updated Successfully', {
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
                    fetchData();

                }
                else {
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
                toast.success('User Updated Successfully', {
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
            }

        } catch (error: any) {
            toast.error(error, {
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
        }
    }

    const deleteData = async (userId: string) => {
        try {
            const reqbody: any = {
                userId: userId
            }

            if (!process.env.isLocal) {
                const response = await axiosInstance.delete(`${process.env.URL}deleteUserdetail?adminUserId=${admin_user_id}`, {
                    data: reqbody
                });
                if (response.status === 200) {
                    toast.success('User Disabled Successfully', {
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
                    fetchData();


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
                toast.success('User Disabled Successfully', {
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
            }
        } catch (error: any) {
            toast.error(error, {
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
        }


    }


    const onEditClick = (index: number) => {
        const newArr = [...isEditConfirmation];
        newArr[index] = true;
        setEditConfirmation(newArr);
        const newisEditing = [...isEditing];
        newisEditing[index] = true;
        setIsEditing(newisEditing);
        const orderEditing = orders[index];
        let userIndex = editedOrders.findIndex(order => order._id === orderEditing._id);
        if (userIndex === -1) {
            editedOrders?.push(orderEditing);
        }
    }

    const onDeleteClick = (index: number) => {

        const newArr = [...isDeleteConfirmation];
        newArr[index] = true;
        setDeleteConfirmation(newArr);
    }

    const camelCaseToCapitalizedWords = (str: string) => {
        return str
            .replace(/([A-Z])/g, ' $1') // Add space before each uppercase letter
            .replace(/^./, (match) => match.toUpperCase()) // Capitalize the first letter of the string
            .split(' ')
            .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()) // Capitalize first letter of each word
            .join(' ');
    };

    const handleInputChange = (e: any, id: string) => {
        const { name, value } = e.target;

        let userIndex = editedOrders.findIndex(order => order._id === id);

        const updatedUser = {
            ...editedOrders[userIndex],
            [name]: value
        };
        const newEditedOrders = [...editedOrders];
        newEditedOrders[userIndex] = updatedUser;
        setEditedOrders(newEditedOrders);

        const newErrors = errors;

        if (value.trim() !== '') {
            newErrors[userIndex] = { ...newErrors[userIndex], [name]: '' };
        } else {
            newErrors[userIndex] = { ...newErrors[userIndex], [name]: `${camelCaseToCapitalizedWords(name)} is required` };
        }

        if (name === 'email' && value.trim() !== '' && !validateEmail(value)) {
            newErrors[userIndex] = { ...newErrors[userIndex], [name]: 'Provide a valid email.' };
        }

        setErrors(newErrors);

    };

    const handleSelectChange = (e: any, id: string) => {

        const access_module_values: any[] = [];

        e.map((val: Option) => access_module_values.push(val.value));

        const newErrors = errors;

        let userIndex = editedOrders.findIndex(order => order._id === id);
        if (access_module_values.length > 0) {
            newErrors[userIndex] = { ...newErrors[userIndex], accessReason: '' };
        } else {
            newErrors[userIndex] = { ...newErrors[userIndex], accessReason: `At least one access module is required` };
        }

        setErrors(newErrors);

        const updatedUser = {
            ...editedOrders[userIndex],
            accessReason: access_module_values
        };
        const newEditedOrders = [...editedOrders];
        newEditedOrders[userIndex] = updatedUser;
        setEditedOrders(newEditedOrders);
    }


    const handleSaveClick = (index: number, id: string) => {

        let userIndex = editedOrders.findIndex(order => order._id === id);

        const updatedUser = editedOrders[userIndex];
        const isValid = validateAllFields(userIndex);

        if (isValid) {
            const newArr = [...isEditConfirmation];
            newArr[index] = false;
            setEditConfirmation(newArr);

            const newisEditing = [...isEditing];
            newisEditing[index] = false;
            setIsEditing(newisEditing);

            updateData(updatedUser);
        } else {
            toast.error('Please correct the details before update.', {
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
        }

    };

    const handleCancelClick = (index: number) => {
        if (index !== null) {
            const newArr = [...isEditConfirmation];
            newArr[index] = false;

            setEditConfirmation(newArr);

            const editedIndex = editedOrders.findIndex((val) => val._id == orders[index]._id);

            const newEditedOrders = [...editedOrders];
            newEditedOrders[editedIndex] = orders[index];
            setEditedOrders(newEditedOrders);
            const newErrors = errors;
            newErrors[editedIndex] = {};
            setErrors(newErrors);

            const newisEditing = [...isEditing];
            newisEditing[index] = false;
            setIsEditing(newisEditing);

        }
    };



    const [files, setFiles] = useState<any[]>([]);

    const handleUploadClick = async () => {
        if (!files || files.length == 0) {

            toast.info('Please select a file first!', {
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
            return;
        }
        setIsUploadVlidate(true)
        const formData = new FormData();
        formData.append('file', files[0].file);

        const userId = sessionStorage.getItem("user_id");

        try {
            let endpoint = '';
            if (currentRegion == "us") {
                endpoint = 'bulkUploaderForUS';
            }
            else {
                endpoint = 'bulkUploaderForEurope';
            }
            if (!process.env.isLocal) {
                setIsUploadVlidate(true)
                const response = await fetch(`${process.env.URL}${endpoint}?userId=${userId}`, {
                    method: 'POST',
                    body: formData,
                });
                if (response.ok) {
                    toast.success("File upload is in progress.", {
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
                    setIsUploadVlidate(false)
                    setFiles([]);

                    setTimeout(() => {

                        fetchUpdates();
                    }, 2000)
                } else {
                    toast.error('File upload Failed!', {
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
                    setIsUploadVlidate(false)
                }
            } else {
                toast.success("Demo File upload is in progress.", {
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
                setFiles([]);
            }
        } catch (error: any) {
            toast.error(error, {
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

    const onEuUpload = () => {
        setCurrentRegion("eu");
        setIsUplaoding(true);
        window.scrollTo({
            top: 500,
            behavior: "smooth"
        });
    }

    const onUsUpload = () => {
        setCurrentRegion("us");
        setIsUplaoding(true);
        window.scrollTo({
            top: 500,
            behavior: "smooth"
        });
    }

    const confirmDelete = (index: number) => {

        deleteData(orders[index]._id);

        // const newOrders = [...orders];
        // newOrders.splice(index, 1);
        // setOrders(newOrders);

        const newArr = [...isDeleteConfirmation];
        newArr[index] = false;
        setDeleteConfirmation(newArr);

    }

    const cancelDelete = (index: number) => {
        const newArr = [...isDeleteConfirmation];
        newArr[index] = false;

        setDeleteConfirmation(newArr);
    }

    const findAccessModuleOption = (options: any[] | undefined) => {

        const selectOptions: any[] = [];
        if (options) {

            options.map((val) => {
                const index = optionsArr.findIndex((opt) => opt.value === val);
                if (index != -1) {
                    selectOptions.push(optionsArr[index]);
                }
            })

        }

        return selectOptions;

    }

    const resetIsUploading = () => {
        setIsUplaoding(false);
    }

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);

        const day = date.getDate();
        const daySuffix = (day: any) => {
            if (day > 3 && day < 21) return 'th'; // covers 11th to 20th
            switch (day % 10) {
                case 1: return 'st';
                case 2: return 'nd';
                case 3: return 'rd';
                default: return 'th';
            }
        };

        const monthNames = [
            "January", "February", "March", "April", "May", "June",
            "July", "August", "September", "October", "November", "December"
        ];

        const month = monthNames[date.getMonth()];
        const year = date.getFullYear();

        let hours = date.getHours();
        const minutes = date.getMinutes();
        const ampm = hours >= 12 ? 'PM' : 'AM';
        hours = hours % 12;
        hours = hours ? hours : 12; // the hour '0' should be '12'
        const minutesStr = minutes < 10 ? '0' + minutes : minutes;

        return `${day}${daySuffix(day)} ${month} ${year}; ${hours}:${minutesStr} ${ampm}`;
    };


    const handleFileInput = (file: any) => {

        const ACCEPTED_FILE_TYPES = ['application/zip', 'application/x-zip-compressed'];


        if (!ACCEPTED_FILE_TYPES.includes(file.fileType)) {
            toast.warn(`File type is not accepted. Only ZIP files are allowed.`, {
                position: "top-center",
                autoClose: 1000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: "light",
            });
            return false;
        }

        return true;
    };

    const validateEmail = (email: string) => {
        // Regular expression for validating email format
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    };

    const validateAllFields = (index: any) => {
        const newErrors = errors;

        if (!editedOrders[index].accountManager || editedOrders[index].accountManager.trim() === "") {
            if (!newErrors[index]) newErrors[index] = {};
            newErrors[index].accountManager = "Account Manager is required";
        }
        if (!editedOrders[index].clientName || editedOrders[index].clientName.trim() === "") {
            if (!newErrors[index]) newErrors[index] = {};
            newErrors[index].clientName = "Client Name is required";
        }
        if (!editedOrders[index].company || editedOrders[index].company.trim() === "") {
            if (!newErrors[index]) newErrors[index] = {};
            newErrors[index].company = "Company is required";
        }
        if (!editedOrders[index].email || !validateEmail(editedOrders[index].email)) {
            if (!newErrors[index]) newErrors[index] = {};
            newErrors[index].email = "Valid Email is required";
        }
        if (!editedOrders[index].address || editedOrders[index].address.trim() === "") {
            if (!newErrors[index]) newErrors[index] = {};
            newErrors[index].address = "Address is required";
        }
        if (!editedOrders[index].country || editedOrders[index].country.trim() === "") {
            if (!newErrors[index]) newErrors[index] = {};
            newErrors[index].country = "Country is required";
        }
        if (!editedOrders[index].gst_vat || editedOrders[index].gst_vat.trim() === "") {
            if (!newErrors[index]) newErrors[index] = {};
            newErrors[index].gst_vat = "GST/VAT is required";
        }
        if (!editedOrders[index].membershipStatus) {
            if (!newErrors[index]) newErrors[index] = {};
            newErrors[index].membershipStatus = "Membership Status is required";
        }
        if (!editedOrders[index].startDate) {
            if (!newErrors[index]) newErrors[index] = {};
            newErrors[index].startDate = "Start Date is required";
        }
        if (!editedOrders[index].endDate) {
            if (!newErrors[index]) newErrors[index] = {};
            newErrors[index].endDate = "End Date is required";
        }
        if (!editedOrders[index].subscription || editedOrders[index].subscription.trim() === "") {
            if (!newErrors[index]) newErrors[index] = {};
            newErrors[index].subscription = "Subscription is required";
        }
        if (!editedOrders[index].accessReason || editedOrders[index].accessReason.length == 0) {
            if (!newErrors[index]) newErrors[index] = {};
            newErrors[index].accessReason = "At least one access module is required.";
        }

        setErrors(newErrors);

        if (!errors || !errors[index]) {
            return true;
        }

        return Object.values(errors[index]).every(error => error === '');
    };

    const findUserIndex = (id: any) => {
        let userIndex = editedOrders.findIndex(order => order._id === id);
        return userIndex;
    }

    const enableUser = async (index: any) => {
        const orderToEnable = orders[index];
        const reqbody = {
            userId: orderToEnable._id
        }
        try {
            const response = await axios.post(`${process.env.URL}enableUser`, reqbody);
            if (response.status == 200) {
                toast.success(response.data.message, {
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
                fetchData();

            } else {
                toast.error(response.data.message, {
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
            }
        } catch (error: any) {
            toast.error(error, {
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
        }
    }
    const refreshContent = () => {
        setIsRotating(true);
        fetchDrugs();
    }
    const [isRotating, setIsRotating] = useState(false);


    return (
        <div className="cont">
            <ToastContainer></ToastContainer>
            <div className="heading-container">

                <div className="heading">
                    Dashboard
                    <div onClick={refreshContent} onAnimationEnd={() => setIsRotating(false)}>
                        <MdRefresh className={`refresh-icon ${isRotating ? 'rotate' : ''}`} />
                    </div>
                </div>

                <div className="upload">

                    <div className="text">
                        Last uploaded on <span className="date-time">{(update?.adminLatestUpdateStatus) ? formatDate(update.adminLatestUpdateStatus) : 'NA'}</span>
                    </div>
                    <div className="eu-upload" onClick={onEuUpload}>
                        <div className="upload-icon">
                            <img src={uploadEu} alt="" />
                        </div>
                        <div className="text">
                            Upload - EU
                        </div>
                        <div className="flag">
                            <img src={flagEu} alt="" />
                        </div>
                    </div>

                    <div className="us-upload" onClick={onUsUpload}>
                        <div className="upload-icon">
                            <img src={uploadUs} alt="" />
                        </div>
                        <div className="text">
                            Upload - US
                        </div>
                        <div className="flag">
                            <img src={flagUs} alt="" />
                        </div>
                    </div>

                </div>
            </div>

            <div className="drug-cards">
                {Array.isArray(drugs) && drugs.length > 0 ? (
                    drugs.map((val, index) => (
                        <DrugCard key={index} drug={val} />
                    ))
                ) : (
                    <p>No drugs available</p>
                )}


            </div>

            {isUploading && (

                <>

                    <div className="back-to-orders">
                        <IoChevronBackOutline />
                        {/* <FaCircleChevronLeft/> */}
                        <a onClick={resetIsUploading}> Back To Recent Orders</a>
                    </div>

                    <div className="file-upload">
                        {isUploadVlidate && <PageLoader />}
                        <div className="upload-head">
                            {currentRegion == 'us' && (
                                <span >Upload US</span>
                            )}
                            {currentRegion == 'eu' && (
                                <span>Upload EU</span>
                            )}

                        </div>
                        <div className="upload-area">
                            <div className="file-pond">
                                <FilePond
                                    files={files}
                                    onupdatefiles={setFiles}
                                    allowMultiple={false}
                                    maxFiles={1}
                                    disabled={isUploadVlidate}
                                    // acceptedFileTypes={['application/zip']}
                                    // fileValidateTypeLabelExpectedTypesMap={{ 'application/zip': '.zip' }}
                                    name="files"
                                    beforeAddFile={handleFileInput}
                                    labelIdle='Drag & Drop your files or <span class="filepond--label-action">Browse</span>'
                                />

                            </div>
                            <div className="upload-button">
                                <button onClick={handleUploadClick} disabled={isUploadVlidate} className="upload-file-text">Upload File</button>
                            </div>
                        </div>
                    </div>
                </>

            )}

            {!isUploading && (
                <div className="recent-orders">
                    <div className="title">
                        <div className="text-wrapper">Recent Orders</div>
                    </div>
                    <div className="table-with-scroll">
                        <div className="table">
                            <table>
                                <thead className="fixed-row">
                                    <tr>
                                        <th className="fixed-column">Account No.</th>
                                        <th>Account Manager</th>
                                        <th>Client Name</th>
                                        <th>Company</th>
                                        <th>Email</th>
                                        <th>Address</th>
                                        <th>Country</th>
                                        <th>GST/VAT</th>
                                        <th>Membership Status</th>
                                        <th>Start Date</th>
                                        <th>End Date</th>
                                        <th>Subscription</th>
                                        <th>Access Module</th>
                                        <th>Latest Login</th>
                                        <th className="fixed-column">Action</th>

                                    </tr>
                                </thead>
                                <tbody>
                                    {orders.map((order, index) => (
                                        <tr key={order._id}>
                                            {(!isEditing[index]) && (

                                                order.isValid ? (
                                                    <>
                                                        <td className="fixed-column">{order.accountNumber}</td>
                                                        <td>{order.accountManager} </td>
                                                        <td>{order.clientName}</td>
                                                        <td>{order.company}</td>
                                                        <td>{order.email}</td>
                                                        <td>{order.address}</td>
                                                        <td>{order.country}</td>
                                                        <td>{order.gst_vat} </td>
                                                        <td>{order.membershipStatus}</td>
                                                        <td>{order.startDate}</td>
                                                        <td>{order.endDate}</td>
                                                        <td>{order.subscription}</td>
                                                        <td>{order.accessReason.join(', ')}</td>
                                                        <td>{order.latestLoginDetail ? formatDate(order.latestLoginDetail) : 'NA'}</td>
                                                    </>

                                                ) : (
                                                    <>
                                                        <td className="fixed-column not-valid">{order.accountNumber}</td>
                                                        <td className="not-valid">{order.accountManager} </td>
                                                        <td className="not-valid">{order.clientName}</td>
                                                        <td className="not-valid">{order.company}</td>
                                                        <td className="not-valid">{order.email}</td>
                                                        <td className="not-valid">{order.address}</td>
                                                        <td className="not-valid">{order.country}</td>
                                                        <td className="not-valid">{order.gst_vat} </td>
                                                        <td className="not-valid">{order.membershipStatus}</td>
                                                        <td className="not-valid">{order.startDate}</td>
                                                        <td className="not-valid">{order.endDate}</td>
                                                        <td className="not-valid">{order.subscription}</td>
                                                        <td className="not-valid">{order.accessReason}</td>
                                                        <td className="not-valid">{order.latestLoginDetail ? formatDate(order.latestLoginDetail) : 'NA'}</td>

                                                    </>
                                                )

                                            )}
                                            {(isEditing[index]) && (
                                                <>
                                                    <td className="fixed-column">{order.accountNumber}</td>
                                                    <td>
                                                        <input
                                                            className="input-fields"
                                                            type="text"
                                                            name="accountManager"
                                                            value={editedOrders?.find((val) => val._id === order._id)?.accountManager}
                                                            onChange={(e) => handleInputChange(e, orders[index]._id)}
                                                            required
                                                        />
                                                        {errors[findUserIndex(order._id)]?.accountManager && <span className="error">{errors[findUserIndex(order._id)]?.accountManager}</span>}
                                                    </td>
                                                    <td>
                                                        <input
                                                            className="input-fields"
                                                            type="text"
                                                            name="clientName"
                                                            value={editedOrders?.find((val) => val._id === order._id)?.clientName}
                                                            onChange={(e) => handleInputChange(e, orders[index]._id)}
                                                        />
                                                        {errors[findUserIndex(order._id)]?.clientName && <span className="error">{errors[findUserIndex(order._id)]?.clientName}</span>}
                                                    </td>
                                                    <td>
                                                        <input
                                                            className="input-fields"
                                                            type="text"
                                                            name="company"
                                                            value={editedOrders?.find((val) => val._id === order._id)?.company}
                                                            onChange={(e) => handleInputChange(e, orders[index]._id)}
                                                        />
                                                        {errors[findUserIndex(order._id)]?.company && <span className="error">{errors[findUserIndex(order._id)]?.company}</span>}
                                                    </td>
                                                    <td>
                                                        <input
                                                            className="input-fields"
                                                            type="email"
                                                            name="email"
                                                            value={editedOrders?.find((val) => val._id === order._id)?.email}
                                                            onChange={(e) => handleInputChange(e, orders[index]._id)}
                                                        />
                                                        {errors[findUserIndex(order._id)]?.email && <span className="error">{errors[findUserIndex(order._id)]?.email}</span>}
                                                    </td>
                                                    <td>
                                                        <input
                                                            className="input-fields"
                                                            type="text"
                                                            name="address"
                                                            value={editedOrders?.find((val) => val._id === order._id)?.address}
                                                            onChange={(e) => handleInputChange(e, orders[index]._id)}
                                                        />
                                                        {errors[findUserIndex(order._id)]?.address && <span className="error">{errors[findUserIndex(order._id)]?.address}</span>}
                                                    </td>
                                                    <td>
                                                        <input
                                                            className="input-fields"
                                                            type="text"
                                                            name="country"
                                                            value={editedOrders?.find((val) => val._id === order._id)?.country}
                                                            onChange={(e) => handleInputChange(e, orders[index]._id)}
                                                        />
                                                        {errors[findUserIndex(order._id)]?.country && <span className="error">{errors[findUserIndex(order._id)]?.country}</span>}
                                                    </td>
                                                    <td>
                                                        <input
                                                            className="input-fields"
                                                            type="text"
                                                            name="gst_vat"
                                                            value={editedOrders?.find((val) => val._id === order._id)?.gst_vat}
                                                            onChange={(e) => handleInputChange(e, orders[index]._id)}
                                                        />
                                                        {errors[findUserIndex(order._id)]?.gst_vat && <span className="error">{errors[findUserIndex(order._id)]?.gst_vat}</span>}
                                                    </td>
                                                    <td>
                                                        {/* <input
                                                            type="number"
                                                            name="gst_vat"
                                                            value={editedOrders?.find((val) => val._id === order._id)?.gst_vat}
                                                            onChange={(e) => handleInputChange(e, orders[index]._id)}
                                                        /> */}
                                                        <select className="input-fields" name="membershipStatus" value={editedOrders?.find((val) => val._id === order._id)?.membershipStatus} onChange={(e) => handleInputChange(e, orders[index]._id)}>
                                                            <option value="Trial">Trial</option>
                                                            <option value="Purchase">Purchase</option>
                                                        </select>
                                                        {errors[findUserIndex(order._id)]?.membershipStatus && <span className="error">{errors[findUserIndex(order._id)]?.membershipStatus}</span>}

                                                    </td>
                                                    <td>
                                                        <input
                                                            className="input-fields"
                                                            type="date"
                                                            name="startDate"
                                                            value={editedOrders?.find((val) => val._id === order._id)?.startDate}
                                                            onChange={(e) => handleInputChange(e, orders[index]._id)}
                                                        />
                                                        {errors[findUserIndex(order._id)]?.startDate && <span className="error">{errors[findUserIndex(order._id)]?.startDate}</span>}
                                                    </td>
                                                    <td>
                                                        <input
                                                            className="input-fields"
                                                            type="date"
                                                            name="endDate"
                                                            value={editedOrders?.find((val) => val._id === order._id)?.endDate}
                                                            onChange={(e) => handleInputChange(e, orders[index]._id)}
                                                        />
                                                        {errors[findUserIndex(order._id)]?.endDate && <span className="error">{errors[findUserIndex(order._id)]?.endDate}</span>}
                                                    </td>
                                                    <td>
                                                        <input
                                                            className="input-fields"
                                                            type="text"
                                                            name="subscription"
                                                            value={editedOrders?.find((val) => val._id === order._id)?.subscription}
                                                            onChange={(e) => handleInputChange(e, orders[index]._id)}
                                                        />
                                                        {errors[findUserIndex(order._id)]?.subscription && <span className="error">{errors[findUserIndex(order._id)]?.subscription}</span>}
                                                    </td>
                                                    <td>
                                                        <Select className="multi-select" isMulti options={optionsArr} value={findAccessModuleOption(editedOrders?.find((val) => val._id === order._id)?.accessReason)} onChange={(e) => handleSelectChange(e, orders[index]._id)} />
                                                        {errors[findUserIndex(order._id)]?.accessReason && <span className="error">{errors[findUserIndex(order._id)]?.accessReason}</span>}
                                                    </td>
                                                    <td>{order.latestLoginDetail ? formatDate(order.latestLoginDetail) : 'NA'}</td>

                                                </>
                                            )}
                                            <td className="fixed-column">
                                                <div className="action-icons">

                                                    {order.isValid ? (
                                                        <>
                                                            <div className="edit">
                                                                {(!isEditConfirmation[index]) && (
                                                                    <img src={editIcon} alt="Edit Icon" onClick={() => { onEditClick(index) }} />
                                                                )}
                                                                {(isEditConfirmation[index]) && (
                                                                    <div className="tick-cancel">
                                                                        <img src={tickIcon} alt="Ticket Icon" onClick={() => handleSaveClick(index, order._id)} />
                                                                        <img src={cancelIcon} alt="Cancel Icon" onClick={() => handleCancelClick(index)} />

                                                                    </div>
                                                                )
                                                                }

                                                            </div>
                                                            <div className="delete">
                                                                {(!isDeleteConfirmation[index]) && (
                                                                    <img src={deleteIcon} alt="Delete Icon" onClick={() => { onDeleteClick(index) }} />
                                                                )}
                                                                {(isDeleteConfirmation[index]) && (
                                                                    <div className="tick-cancel">
                                                                        <img src={tickIcon} alt="Ticket Icon" onClick={() => { confirmDelete(index) }} />
                                                                        <img src={cancelIcon} alt="Cancel Icon" onClick={() => { cancelDelete(index) }} />

                                                                    </div>
                                                                )
                                                                }

                                                            </div>
                                                        </>

                                                    ) : (
                                                        <>
                                                            <div className="user-disable-cont">
                                                                <div className="user-disable">
                                                                    User Disabled
                                                                </div>
                                                                <div className="enable-user">
                                                                    <button className="revive-user" onClick={() => enableUser(index)}>
                                                                        <MdOutlineSync className="enable-icon" ></MdOutlineSync >
                                                                        <span>Enable User</span>
                                                                    </button>
                                                                </div>

                                                            </div>
                                                        </>
                                                    )}
                                                </div>
                                            </td>
                                        </tr>

                                    ))}
                                </tbody>


                            </table>
                        </div>
                        <div className="scroll-bar">
                            <div className="scroll" />
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Dashboard;
