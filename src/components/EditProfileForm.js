import React from 'react';
import { Formik, Field, Form, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { Avatar } from '@mui/material';

const FILE_SIZE = 160 * 1024;
const SUPPORTED_FORMATS = [
"image/jpg",
"image/jpeg",
"image/png"
];

const editProfileSchema = Yup.object().shape({
    displayName: Yup.string()
        .min(3, "Channel name is too small")
        .max(20, "Channel name is too big")
        .required("Channel name is required"),
    photo: Yup.mixed()
        .notRequired()
        // .test(
        //     "fileSize",
        //     "File too large",
        //     value => value && value.size <= FILE_SIZE
        // )
        // .test(
        //     "fileFormat",
        //     "Unsupported Format",
        //     value => value && SUPPORTED_FORMATS.includes(value.type)
        // )
});

const EditProfileForm = ({ handleSubmit, photo, editProfileInitialValues }) => {
return(
        <div className="col-md-4 offset-md-4 pt-4">
            <h1 className="text-center form-title">Edit Your Account Information</h1>
            <Formik
                initialValues={editProfileInitialValues}
                validationSchema={editProfileSchema}
                onSubmit={(values) => handleSubmit(values)}
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
                                />
                                <ErrorMessage
                                    name="photo"
                                    component="small"
                                    className="text-danger"
                                />
                            </div>
                            <div className="avatar">
                            <Avatar 
                                src={photo} referrerPolicy="no-referrer" sx={{ width: 60, height: 60 }}
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