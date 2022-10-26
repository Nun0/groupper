import React from 'react';
import {Formik, Field, Form, ErrorMessage} from 'formik';
import * as Yup from 'yup';
import { useState } from 'react';
import { Avatar } from '@mui/material';

const newChannelSchema = Yup.object().shape({
    channelName: Yup.string()
        .min(3, "Channel name is too small")
        .max(20, "Channel name is too big")
        .required("Channel name is required"),
    description: Yup.string()
        .min(2, "Channel name is too small")
        .max(255, "Channel name is too big")
        .required("Channel description is required"),
});

const newChannelInitialValues = {
    channelName: "",
    description: ""
};

const NewChannelForm = ({ handleSubmit, setImage }) => {
    const [photoPreview, setPhotoPreview] = useState();

    const handlePhotoChange = (e) => {
        let src = URL.createObjectURL(e.target.files[0]);
        setPhotoPreview(src);
        setImage(e.target.files[0]);
    }

return(
    <div className="col-md-6 offset-md-3 pt-3">
        <h1 className="text-center form-title">Create a New Group</h1>
        <Formik
            initialValues={newChannelInitialValues}
            validationSchema={newChannelSchema}
            onSubmit={(values) => handleSubmit(values)}
        >
            {({ resetForm }) => (
                <Form noValidate>
                    <div className="file-upload mt-4">
                            <div className="form-group">
                                <label htmlFor="description">
                                    Upload Group Picture:
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
                            <div className="channel-form-avatar">
                                <Avatar 
                                src={photoPreview} referrerPolicy="no-referrer" sx={{ width: 150, height: 150 }}
                            />
                            </div>
                    </div>
                    <div className="form-group mb-3">
                        <label htmlFor="channelName">
                            Group Name:
                        </label>
                        <Field
                            type="text"
                            id="channelName"
                            name="channelName"
                            className="form-input form-control"
                        />
                        <ErrorMessage
                            name="channelName"
                            component="small"
                            className="text-danger mb-4"
                        />
                    </div>
                    <div className="form-group mb-3">
                        <label htmlFor="description">
                            Description:
                        </label>
                        <Field
                            type="text"
                            id="description"
                            name="description"
                            className="form-input form-control"
                        />
                        <ErrorMessage
                            name="description"
                            component="small"
                            className="text-danger"
                        />
                    </div>
                    <div className="form-group gap-3 d-flex">
                        <button
                            type="submit"
                            className="btn btn-primary"
                            id="edit"
                        >
                            New Group
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

export default NewChannelForm