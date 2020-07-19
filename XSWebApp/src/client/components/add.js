import {Fragment} from "react";
import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import {
    ErrorMessage,
    FormBase,
    FormLabel,
    FormInput,
    FormButton
} from './shared';

const FormContainer = styled.div`
    grid-area:main
`
const ButtonGap = styled.div`
 padding-top: 30px;
`;


function encodeUnicode(str) {
    let res = [];
    for ( let i=0; i<str.length; i++ ) {
        res[i] = ( "00" + str.charCodeAt(i).toString(16) ).slice(-4);
    }
    return "\\u" + res.join("\\u");
}

function decodeUnicode(str) {
    str = str.replace(/\\/g, "%");
    //转换中文
    str = unescape(str);
    //将其他受影响的转换回原来
    str = str.replace(/%/g, "\\");
    //对网址的链接进行处理
    str = str.replace(/\\/g, "");
    return str;
}

export const Add = props=>{
    let [entry, setEntry]=useState({
        novel_name:'',
        novel_initial_url:'',
        novel_link:''
    });
    let [error, setError] = useState('');

    const onSubmit = async ev=>{
        ev.preventDefault();
        const res = await fetch('/v1/novel', {
            body: JSON.stringify(entry),
            method:'POST',
            credentials:'include',
            headers:{
                'content-type':'application/json'
            }
        });
        // console.log(res);
        const data = await res.json();
        // console.log(data);
        if(res.ok){
            props.history.push(`/activity/${props.currentUser}`);
        }else{
            setError(`Error:${data.error}`);
        }
    }

    return (
        <FormContainer>
            <ErrorMessage msg={error} />
            <FormBase>
                <FormLabel htmlFor="novel_name">Novel Name:</FormLabel>
                <FormInput
                    // id="username"
                    name="novel_name"
                    type="text"
                    placeholder="Novel Name"
                    // value={decodeUnicode(entry.novel_name)}
                    onChange={ev => setEntry({
                        ...entry,
                        [ev.target.name]:ev.target.value
                    })}
                />

                <FormLabel htmlFor="novel_initial_url">Original URL (Qidian only):</FormLabel>
                <FormInput
                    // id="password"
                    name="novel_initial_url"
                    type="text"
                    placeholder="www.qidian.com/"
                    value={entry.novel_initial_url}
                    onChange={ev => setEntry({
                        ...entry,
                        [ev.target.name]:ev.target.value
                    })}
                />
                <FormLabel htmlFor="novel_link">External Novel Link:</FormLabel>
                <FormInput
                    // id="password"
                    name="novel_link"
                    type="text"
                    placeholder="www.dingdian.com"
                    value={entry.novel_link}
                    onChange={ev => setEntry({
                        ...entry,
                        [ev.target.name]:ev.target.value
                    })}
                />
                <ButtonGap />
                <FormButton id="submitBtn" onClick={onSubmit}>
                    Submit
                </FormButton>
            </FormBase>
        </FormContainer>
    );
}