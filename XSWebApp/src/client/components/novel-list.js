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
    return (
        <tr style={index%2===0?{background: "lightgrey"}:{background: "white"}}>
            <td>{index+1}</td>
            <td>{novel.novel_name}</td>
            <td>{novel.novel_initial_url}</td>
            <td>{novel.novel_link}</td>
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