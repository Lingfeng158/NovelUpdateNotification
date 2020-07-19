import styled from "styled-components";
import {Link} from "react-router-dom";
import React, { Fragment, useState, useEffect } from 'react';


const ActionTD = styled.td`
  display: flex;
  // flex-direction: ${props => (props.vertical ? 'row' : 'column')};
  flex-direction: column;
`

const AltTR = styled.tr`
tr:nth-child(odd) {
  background: red;
}
`

const Novel = ({novel, index, isUser, DelBtn, EdBtn}) => {
    // console.log(novel)
    let [keepings, updateK]=useState(0);
    useEffect(()=>{
        let func = async ()=>{
            let res = await fetch('/v1/ext', {
                body:JSON.stringify({novel_initial_url:novel.novel_initial_url}),
                method:'PUT',
                headers:{
                    'content-type':'application/json'
                }
            });
            if(res.ok){
                let data=await res.json();
                updateK(data.count);
            }
        };

        func();

    }, [novel]);

    console.log(novel.last_read);

    const clickHdlr = async ev=>{
        let res = await fetch(`/v1/novelChapter/${novel._id}`, {
            method:"PUT",
            body:JSON.stringify({last_read:keepings}),
            headers:{
                'content-type':'application/json'
            }
        });
    }
    return (
        <tr style={index%2===0?{background: "lightgrey"}:{background: "white"}}>
            <td>{index+1}</td>
            <td>{novel.novel_name}</td>
            <td>{keepings-novel.last_read<0?0:keepings-novel.last_read}</td>
            <td>
                {keepings-novel.last_read<=0?<div>Up to Date</div>:<a href={novel.novel_link} target="_blank" onClick={clickHdlr}>Catch Up</a>}
            </td>
            {
                isUser?<ActionTD >
                    <DelBtn id={novel._id}/>
                    <EdBtn id={novel._id}/>
                    {/*<Link to={`/novel_delete/${novel._id}`} >Delete</Link>*/}
                    {/*<Link to={`/novel_edit/${novel._id}`}>Edit</Link>*/}
                </ActionTD>:<></>
            }

        </tr>
    );
};

export const NovelList = ({novels, isUser, DelBtn, EdBtn})=>{
    return (

        <tbody >
        {novels.length===0?<></>:
            novels.map((novel, index)=>{
                return <Novel novel={novel} index={index} key={index} isUser = {isUser} DelBtn={DelBtn} EdBtn={EdBtn}/>
            })}

        </tbody>
    );


}