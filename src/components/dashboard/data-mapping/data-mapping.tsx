/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable prefer-const */
import { useEffect, useState } from 'react';
import "./data-mapping.css";
import { Bounce, toast, ToastContainer } from 'react-toastify';
import "react-toastify/dist/ReactToastify.css";
import axiosInstance from '../../config/axiosConfig';


const DataMapping = () => {
    const admin_user_id = sessionStorage.getItem('user_id');
    const initialFormData = {
        us_year1: '',
        us_year2: '',
        ep_year1: '',
        ep_year2: '',
    };
    const apiColumnMappingFormData = {
        us_col1: 'NA',
        us_col2: 'NA',
        us_col3: 'NA',
        us_col4: 'NA',
        ep_col1: 'NA',
        ep_col2: 'NA',
        ep_col3: 'NA',
        ep_col4: 'NA',
    };
    const [errors, setErrors] = useState({
        us_year1: '',
        us_year2: '',
        ep_year1: '',
        ep_year2: '',
    });
    const [errorsApiColumn, setErrorsApiColumn] = useState({
        us_col1: '',
        us_col2: '',
        us_col3: '',
        us_col4: '',
        ep_col1: '',
        ep_col2: '',
        ep_col3: '',
        ep_col4: '',
    });
    const [formData, setFormData] = useState(initialFormData);
    const [apiColumnFormData, setApiColumnFormData] = useState(apiColumnMappingFormData);

    useEffect(() => {
        getMapping();
        getAPIColumnMapping();
    }, [])
    // const isDisabledForYear1: any = (year: number, region: any) => {
    //     if (region?.toLowerCase() === 'us') {
    //         return (
    //             formData.us_year2 &&
    //             (year >= parseInt(formData.us_year2) || year > currentYear)
    //         );
    //     } else {
    //         return (
    //             formData.ep_year2 &&
    //             (year >= parseInt(formData.ep_year2) || year > currentYear)
    //         );
    //     }
    // };
    // const isDisabledForYear2: any = (year: number, region: any) => {
    //     if (region?.toLowerCase() === 'us') {
    //         return (
    //             formData.us_year1 &&
    //             (year <= parseInt(formData.us_year1) ||
    //                 year > currentYear)
    //         );
    //     } else {
    //         return (
    //             formData.ep_year1 &&
    //             (year <= parseInt(formData.ep_year1) ||
    //                 year > currentYear)
    //         );
    //     }
    // };
    const clearValue = (region: any) => {
        let updatedFormData = { ...formData };
        if (region?.toLowerCase() === 'us') {
            updatedFormData.us_year1 = '';
            updatedFormData.us_year2 = '';
        } else {
            updatedFormData.ep_year1 = '';
            updatedFormData.ep_year2 = '';
        }
        setFormData(updatedFormData);
    }
    const clearAPIColumnValue = (region: any) => {
        let updatedFormData = { ...apiColumnMappingFormData };
        if (region?.toLowerCase() === 'us') {
            updatedFormData.us_col1 = "NA";
            updatedFormData.us_col2 = "NA";
            updatedFormData.us_col3 = "NA";
            updatedFormData.us_col4 = "NA";
        } else {
            updatedFormData.ep_col1 = "NA";
            updatedFormData.ep_col2 = "NA";
            updatedFormData.ep_col3 = "NA";
            updatedFormData.ep_col4 = "NA";
        }
        setApiColumnFormData(updatedFormData);
    }
    const getMapping = async () => {
        try {
            if (!process.env.isLocal) {
                const response = await axiosInstance.get(`${process.env.URL}getSalesMapping`);
                console.log(response?.data?.result);
                if (response.status === 200) {
                    let mappingList = response?.data?.result;
                    if (mappingList?.length > 0) {
                        let updatedFormData = { ...initialFormData };
                        mappingList.forEach((element: any) => {
                            if (element?.region?.toLowerCase() === 'us') {
                                updatedFormData.us_year1 = element.year1;
                                updatedFormData.us_year2 = element.year2;
                            } else if (element?.region == 'europe') {
                                updatedFormData.ep_year1 = element.year1;
                                updatedFormData.ep_year2 = element.year2;
                            }
                        });
                        setFormData(updatedFormData);
                    }
                }
            }
        } catch (error: any) {
            toast.error(error, {
                position: "top-center",
                autoClose: 2000,
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
    const getAPIColumnMapping = async () => {
        try {
            if (!process.env.isLocal) {
                const response = await axiosInstance.get(`${process.env.URL}getApiColumnMapping`);
                console.log(response?.data?.result);
                if (response.status === 200) {
                    let mappingList = response?.data?.result;
                    if (mappingList?.length > 0) {
                        let updatedFormData = { ...apiColumnMappingFormData };
                        mappingList.forEach((element: any) => {
                            if (element?.region?.toLowerCase() === 'us') {
                                updatedFormData.us_col1 = element.col1;
                                updatedFormData.us_col2 = element.col2;
                                updatedFormData.us_col3 = element.col3;
                                updatedFormData.us_col4 = element.col4;
                            } else if (element?.region == 'europe') {
                                updatedFormData.ep_col1 = element.col1;
                                updatedFormData.ep_col2 = element.col2;
                                updatedFormData.ep_col3 = element.col3;
                                updatedFormData.ep_col4 = element.col4;
                            }
                        });
                        setApiColumnFormData(updatedFormData);
                    }
                }
            }
        } catch (error: any) {
            toast.error(error, {
                position: "top-center",
                autoClose: 2000,
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
    const validateForm = (region: any) => {
        const newErrors = { ...errors };

        if (region?.toLowerCase() === 'us') {
            if (!formData.us_year1) newErrors.us_year1 = 'US Year 1';
            else newErrors.us_year1 = '';

            if (!formData.us_year2) newErrors.us_year2 = 'US Year 2';
            else newErrors.us_year2 = '';
        } else {
            if (!formData.ep_year1) newErrors.ep_year1 = 'Europe Year 1';
            else newErrors.ep_year1 = '';

            if (!formData.ep_year2) newErrors.ep_year2 = 'Europe Year 2';
            else newErrors.ep_year2 = '';
        }

        const errorMessages = Object.values(newErrors)
            .filter(error => error)
            .join(', ');

        if (errorMessages) {
            toast.error(`Please correct:( ${errorMessages} ) required!`, {
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

        setErrors(newErrors);
        return Object.values(newErrors).every(error => error === '');
    };
    const validateAPIColumnForm = (region: any) => {
        const newErrors = { ...errorsApiColumn };

        if (region?.toLowerCase() === 'us') {
            if (!apiColumnFormData.us_col1) newErrors.us_col1 = 'US column 1';
            else newErrors.us_col1 = '';
            if (!apiColumnFormData.us_col2) newErrors.us_col2 = 'US column 2';
            else newErrors.us_col2 = '';
            if (!apiColumnFormData.us_col3) newErrors.us_col3 = 'US column 3';
            else newErrors.us_col3 = '';
            if (!apiColumnFormData.us_col4) newErrors.us_col4 = 'US column 4';
            else newErrors.us_col4 = '';
        } else {
            if (!apiColumnFormData.ep_col1) newErrors.ep_col1 = 'Europe column 1';
            else newErrors.ep_col1 = '';
            if (!apiColumnFormData.ep_col2) newErrors.ep_col2 = 'Europe column 2';
            else newErrors.ep_col2 = '';
            if (!apiColumnFormData.ep_col3) newErrors.ep_col3 = 'Europe column 3';
            else newErrors.ep_col3 = '';
            if (!apiColumnFormData.ep_col4) newErrors.ep_col4 = 'Europe column 4';
            else newErrors.ep_col4 = '';
        }

        const errorMessages = Object.values(newErrors)
            .filter(error => error)
            .join(', ');

        if (errorMessages) {
            toast.error(`Please correct:( ${errorMessages} ) required!`, {
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

        setErrorsApiColumn(newErrors);
        return Object.values(newErrors).every(error => error === '');
    };
    const handleChange = (e: any) => {
        const { name, value } = e.target;
        // if (/^\d{0,4}$/.test(value)) {
        setFormData({ ...formData, [name]: value });
        // }
    };
    const handleAPIColumnChange = (e: any) => {
        const { name, value } = e.target;
        setApiColumnFormData({ ...apiColumnFormData, [name]: value });
    };
    const handleSubmit = async (value: any) => {
        let region = value;

        if (!validateForm(region)) {

            return;
        }
        try {
            if (!process.env.isLocal) {
                let body: any = {};
                if (region?.toLowerCase() === 'us') {
                    body = {
                        region: region?.toLowerCase(),
                        year1: formData.us_year1,
                        year2: formData.us_year2,
                        createdBy: admin_user_id
                    }
                } else {
                    body = {
                        region: region?.toLowerCase(),
                        year1: formData.ep_year1,
                        year2: formData.ep_year2,
                        createdBy: admin_user_id
                    }
                }
                console.log("body::", body);

                const response = await axiosInstance.post(`${process.env.URL}/insertSalesMapping`, body);
                if (response.status === 200 || response.status === 201) {
                    toast.success('Mapping Added Successfully', {
                        position: "top-center",
                        autoClose: 2000,
                        hideProgressBar: false,
                        closeOnClick: true,
                        pauseOnHover: true,
                        draggable: true,
                        progress: undefined,
                        theme: "light",
                        transition: Bounce,
                    })

                    getMapping();

                } else {
                    toast.error('Internal Error', {
                        position: "top-center",
                        autoClose: 2000,
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
                toast.success('Demo mapping Added Successfully', {
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
    const handleAPIColumnSubmit = async (value: any) => {
        let region = value;

        if (!validateAPIColumnForm(region)) {
            return;
        }
        try {
            if (!process.env.isLocal) {
                let body: any = {};
                if (region?.toLowerCase() === 'us') {
                    body = {
                        region: region?.toLowerCase(),
                        col1: apiColumnFormData.us_col1,
                        col2: apiColumnFormData.us_col2,
                        col3: apiColumnFormData.us_col3,
                        col4: apiColumnFormData.us_col4,
                        createdBy: admin_user_id
                    }
                } else {
                    body = {
                        region: region?.toLowerCase(),
                        col1: apiColumnFormData.ep_col1,
                        col2: apiColumnFormData.ep_col2,
                        col3: apiColumnFormData.ep_col3,
                        col4: apiColumnFormData.ep_col4,
                        createdBy: admin_user_id
                    }
                }
                console.log("body::", body);

                const response = await axiosInstance.post(`${process.env.URL}/insertApiColumnMapping`, body);
                if (response.status === 200 || response.status === 201) {
                    toast.success('Mapping Added Successfully', {
                        position: "top-center",
                        autoClose: 2000,
                        hideProgressBar: false,
                        closeOnClick: true,
                        pauseOnHover: true,
                        draggable: true,
                        progress: undefined,
                        theme: "light",
                        transition: Bounce,
                    })
                    getAPIColumnMapping();

                } else {
                    toast.error('Internal Error', {
                        position: "top-center",
                        autoClose: 2000,
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
                toast.success('Demo mapping Added Successfully', {
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
        <div className="container">
            <ToastContainer></ToastContainer>
            <div className="heading">Manage Mapping Data</div>
            <div className="form_container">
                <form>
                    <div style={{ fontSize: "18px", fontWeight: "bold", marginBottom: "5px" }}>Sales Mapping Data</div>
                    <div className="row">

                        <div className="content">
                            <label className="textbox-head">Region</label>
                            <input type="text" className="textbox text_disable" name="region" value={"United State"} readOnly />
                        </div>
                        <div className="content">
                            <label className="textbox-head">Sales Year 1</label>
                            <input type="text" className="textbox" name="us_year1" placeholder="Year 1" value={formData.us_year1} onChange={handleChange} />
                            {/* {errors.ep_year1 && <span className="error">{errors.ep_year1}</span>} */}
                        </div>
                        <div className="content">
                            <label className="textbox-head">Sales Year 2</label>
                            <input type="text" className="textbox" name="us_year2" placeholder="Year 2" value={formData.us_year2} onChange={handleChange} />
                            {/* {errors.ep_year2 && <span className="error">{errors.ep_year2}</span>} */}
                        </div>
                        <div className="content">
                            <div className="actBtn_container">
                                <button className='save_btn' onClick={(e: any) => { handleSubmit('US'); e.preventDefault(); }}>Save</button>
                                <button onClick={(e: any) => { clearValue('US'); e.preventDefault(); }}>Clear</button>
                            </div>
                        </div>
                    </div>
                    <div className="row">

                        <div className="content">
                            <label className="textbox-head">Region</label>
                            <input type="text" className="textbox text_disable" name="region" value={"Europe"} readOnly />
                        </div>
                        <div className="content">
                            <label className="textbox-head">Sales Year 1</label>
                            <input type="text" className="textbox" name="ep_year1" placeholder="Year 1" value={formData.ep_year1} onChange={handleChange} />
                            {/* {errors.ep_year1 && <span className="error">{errors.ep_year1}</span>} */}
                        </div>
                        <div className="content">
                            <label className="textbox-head">Sales Year 2</label>
                            <input type="text" className="textbox" name="ep_year2" placeholder="Year 2" value={formData.ep_year2} onChange={handleChange} />
                            {/* {errors.ep_year2 && <span className="error">{errors.ep_year2}</span>} */}
                        </div>
                        <div className="content">
                            <div className="actBtn_container">
                                <button className='save_btn' onClick={(e: any) => { handleSubmit('Europe'); e.preventDefault(); }}>Save</button>
                                <button onClick={(e: any) => { clearValue('Europe'); e.preventDefault(); }}>Clear</button>
                            </div>
                        </div>
                    </div>
                </form>
                <form>
                    <div style={{ fontSize: "18px", fontWeight: "bold", marginBottom: "0px", marginTop: "10px" }}>API Column Mapping Data</div>
                    <div className="row">

                        <div className="content">
                            <label className="textbox-head">Region</label>
                            <input type="text" className="textbox text_disable" name="region" value={"United State"} readOnly />
                        </div>
                        <div className="content">
                            <label className="textbox-head">Column 1</label>
                            <input type="text" className="textbox" name="us_col1" placeholder="Column 1" value={apiColumnFormData.us_col1} onChange={handleAPIColumnChange} />
                            {/* {errors.ep_col1 && <span className="error">{errors.ep_col1}</span>} */}
                        </div>
                        <div className="content">
                            <label className="textbox-head">Column 2</label>
                            <input type="text" className="textbox" name="us_col2" placeholder="Column 2" value={apiColumnFormData.us_col2} onChange={handleAPIColumnChange} />
                            {/* {errors.ep_col2 && <span className="error">{errors.ep_col2}</span>} */}
                        </div>
                        <div className="content">
                            <label className="textbox-head">Column 3</label>
                            <input type="text" className="textbox" name="us_col3" placeholder="Column 3" value={apiColumnFormData.us_col3} onChange={handleAPIColumnChange} />
                            {/* {errors.ep_col2 && <span className="error">{errors.ep_col2}</span>} */}
                        </div>
                        <div className="content">
                            <label className="textbox-head">Column 4</label>
                            <input type="text" className="textbox" name="us_col4" placeholder="Column 4" value={apiColumnFormData.us_col4} onChange={handleAPIColumnChange} />
                            {/* {errors.ep_col2 && <span className="error">{errors.ep_col2}</span>} */}
                        </div>
                        <div className="content">
                            <div className="actBtn_container">
                                <button className='save_btn' onClick={(e: any) => { handleAPIColumnSubmit('US'); e.preventDefault(); }}>Save</button>
                                <button onClick={(e: any) => { clearAPIColumnValue('US'); e.preventDefault(); }}>Clear</button>
                            </div>
                        </div>
                    </div>
                    <div className="row">

                        <div className="content">
                            <label className="textbox-head">Region</label>
                            <input type="text" className="textbox text_disable" name="region" value={"Europe"} readOnly />
                        </div>
                        <div className="content">
                            <label className="textbox-head">Column 1</label>
                            <input type="text" className="textbox" name="ep_col1" placeholder="Column 1" value={apiColumnFormData.ep_col1} onChange={handleAPIColumnChange} />
                            {/* {errors.ep_col1 && <span className="error">{errors.ep_col1}</span>} */}
                        </div>
                        <div className="content">
                            <label className="textbox-head">Column 2</label>
                            <input type="text" className="textbox" name="ep_col2" placeholder="Column 2" value={apiColumnFormData.ep_col2} onChange={handleAPIColumnChange} />
                            {/* {errors.ep_col2 && <span className="error">{errors.ep_col2}</span>} */}
                        </div>
                        <div className="content">
                            <label className="textbox-head">Column 3</label>
                            <input type="text" className="textbox" name="ep_col3" placeholder="Column 3" value={apiColumnFormData.ep_col3} onChange={handleAPIColumnChange} />
                            {/* {errors.ep_col2 && <span className="error">{errors.ep_col2}</span>} */}
                        </div>
                        <div className="content">
                            <label className="textbox-head">Column 4</label>
                            <input type="text" className="textbox" name="ep_col4" placeholder="Column 4" value={apiColumnFormData.ep_col4} onChange={handleAPIColumnChange} />
                            {/* {errors.ep_col2 && <span className="error">{errors.ep_col2}</span>} */}
                        </div>
                        <div className="content">
                            <div className="actBtn_container">
                                <button className='save_btn' onClick={(e: any) => { handleAPIColumnSubmit('Europe'); e.preventDefault(); }}>Save</button>
                                <button onClick={(e: any) => { clearAPIColumnValue('Europe'); e.preventDefault(); }}>Clear</button>
                            </div>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    );
}


export default DataMapping;