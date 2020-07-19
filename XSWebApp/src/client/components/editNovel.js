import React, { useState, useEffect } from 'react';
import {
    ErrorMessage,
    FormBase,
    FormInput,
    FormLabel,
    FormButton,
    ModalNotify
} from './shared';

export const EditNovel = props => {
    let novelID = props.match.params.novelID;
    let [entry, setEntry]=useState({
        novel_name:'',
        novel_initial_url:'',
        novel_link:''
    });

    useEffect(()=>{
        let func = async()=>{
            let res=await fetch(`/v1/novel/${novelID}`, {
                method : "GET"
            });
            let data=await res.json();
            setEntry({...data})
        }
        func();

    }, []);

    const onChange = ev=>{
        ev.preventDefault();
        setEntry({
            ...entry,
            [ev.target.name]:ev.target.value
        })
    }

    const onSubmit = async ev=>{
        ev.preventDefault();
        let res=await fetch(`/v1/novel/${novelID}`, {
            body:JSON.stringify({
                novel_name:entry.novel_name,
                novel_initial_url:entry.novel_initial_url,
                novel_link:entry.novel_link
            }),
            method:"PUT",
            credentials:'include',
            headers:{
                'content-type':'application/json'
            }
        });
        if(res.ok){
            props.history.goBack();
        }else{
            let data = await res.json();
            console.log(data.error);
        }
    }

    return (
        <div style={{ gridArea: 'main' }}>
            {/*<ErrorMessage msg={error} />*/}
            <FormBase>

                <FormLabel htmlFor="novel_name">Novel Name:</FormLabel>
                <FormInput
                    id="novel_name"
                    name="novel_name"
                    onChange={onChange}
                    value={entry.novel_name}
                />
                <FormLabel htmlFor="novel_initial_url">Original URL (Qidian only):</FormLabel>
                <FormInput
                    id="novel_initial_url"
                    name="novel_initial_url"
                    onChange={onChange}
                    value={entry.novel_initial_url}
                />
                <FormLabel htmlFor="novel_link">External Novel Link:</FormLabel>
                <FormInput
                    id="novel_link"
                    name="novel_link"
                    onChange={onChange}
                    value={entry.novel_link}
                />

                <div />
                <FormButton id="submitBtn" onClick={onSubmit}>
                    Submit
                </FormButton>
            </FormBase>
        </div>
    );
};