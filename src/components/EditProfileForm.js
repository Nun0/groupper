import React from 'react';
import { Formik, Field, Form, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { Avatar } from '@mui/material';
import { useState } from 'react';
import { useEffect } from 'react';

const editProfileSchema = Yup.object().shape({
    displayName: Yup.string()
        .min(3, "Channel name is too small")
        .max(20, "Channel name is too big")
        .required("Channel name is required")
});

const EditProfileForm = ({ handleSubmitUser, photo, editProfileInitialValues, setImage }) => {
    const [photoPreview, setPhotoPreview] = useState(photo);
    
    useEffect(() => {
        setPhotoPreview(photo);
    }, [])
    

    const handlePhotoChange = (e) => {
        let src = URL.createObjectURL(e.target.files[0]);
        setPhotoPreview(src);
        setImage(e.target.files[0]);
    }

return(
        <div className="col-md-4 offset-md-4 pt-4">
            <h1 className="text-center form-title">Edit Your Account Information</h1>
            <Formik
                initialValues={editProfileInitialValues}
                validationSchema={editProfileSchema}
                onSubmit={(values) => handleSubmitUser(values)}
            >
                {({ resetForm }) => (
                    <Form noValidate>
                        <div className="form-group mb-3">
                            <label htmlFor="displayName">
                                Change Your Name:
                            </label>
                            <Field
                                type="text"
                                id="displayName"
                                name="displayName"
                                className="form-input form-control"
                            />
                            <ErrorMessage
                                name="displayName"
                                component="small"
                                className="text-danger mb-4"
                            />
                        </div>
                        <div className="file-upload">
                            <div className="form-group mb-3">
                                <label htmlFor="description">
                                    Change Profile Picture:
                                </label>
                                <Field
                                    type="file"
                                    id="photo"
                                    name="photo"
                                    className="form-input form-control"
                                    onChange={handlePhotoChange}
                                />
                                <ErrorMessage
                                    name="photo"
                                    component="small"
                                    className="text-danger"
                                />
                            </div>
                            <div className="avatar">
                            <Avatar 
                                src={photoPreview} referrerPolicy="no-referrer" sx={{ width: 60, height: 60 }}
                            />
                            </div>
                        </div>
                        
                        <div className="form-group gap-3 d-flex">
                            <button
                                type="submit"
                                className="btn btn-primary"
                                id="edit"
                            >
                                Edit Profile
                            </button>
                            <button
                                type="button"
                                onClick={resetForm}
                                className="btn btn-danger"
                                id="cancel"
                            >
                                Cancel
                            </button>
                        </div>
                    </Form>
                )}
            </Formik>
        </div>
)}

export default EditProfileForm