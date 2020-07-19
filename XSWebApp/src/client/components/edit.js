import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import {
    ErrorMessage,
    FormBase,
    FormInput,
    FormLabel,
    FormButton,
    ModalNotify
} from './shared';

export const Edit = ({ history }) => {
    let [state, setState] = useState({
        first_name: '',
        last_name: '',
        city: '',
        primary_email:''
    });
    let [error, setError] = useState('');
    let [notify, setNotify] = useState('');

    const onChange = ev => {
        setError('');
        // Update from form and clear errors
        setState({
            ...state,
            [ev.target.name]: ev.target.value
        });
    };

    const onSubmit = async ev => {
        ev.preventDefault();
        // Only proceed if there are no errors
        if (error !== '') return;
        const res = await fetch('/v1/user', {
            method: 'PUT',
            body: JSON.stringify(state),
            credentials: 'include',
            headers: {
                'content-type': 'application/json'
            }
        });
        if (res.ok) {
            // Notify users
            setNotify(`Profile updated.`);
        } else {
            const err = await res.json();
            setError(err.error);
        }
    };

    const onAcceptEdit = () => {
        history.goBack();
    };

    return (
        <div style={{ gridArea: 'main' }}>
            {notify !== '' ? (
                <ModalNotify
                    id="notification"
                    msg={notify}
                    onAccept={onAcceptEdit}
                />
            ) : null}
            <ErrorMessage msg={error} />
            <FormBase>

                <FormLabel htmlFor="primary_email">Email:</FormLabel>
                <FormInput
                    id="primary_email"
                    name="primary_email"
                    placeholder="Primary Email"
                    onChange={onChange}
                    value={state.primary_email}
                />

                <div />
                <FormButton id="submitBtn" onClick={onSubmit}>
                    Submit
                </FormButton>
            </FormBase>
        </div>
    );
};

Edit.propTypes = {
    history: PropTypes.object.isRequired
};