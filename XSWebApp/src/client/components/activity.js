import React, { Fragment, useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import {NovelList} from './novel-list';
import {
    ErrorMessage,
    InfoBlock,
    InfoData,
    InfoLabels,
    ShortP
} from './shared';

const ProfileBlockBase = styled.div`
  display: grid;
  grid-template-columns: auto;
  grid-template-rows: auto;
  grid-template-areas: 'pic' 'profile';
  padding: 1em;

  @media (min-width: 500px) {
    grid-template-columns: auto 1fr;
    grid-template-areas: 'pic profile';
    padding: 2em;
  }
`;

const ProfileBase = styled.div`
  grid-area: main;
  display: flex;
  flex-direction: column;
  justify-content: center;
`;

const EditLinkBase = styled.div`
  grid-area: sb;
  display: none;
  // & > a {
  //   cursor: not-allowed;
  // }
  @media (min-width: 500px) {
    display: inherit;
  }
`;

const ProfileBlock = props => {
    return (
        <ProfileBlockBase>
        </ProfileBlockBase>
    );
};

const GameHeaderBase = styled.div`
  display: flex;
  margin: 1em;
  & > a {
    margin-right: 1em;
  }
  & > h4 {
    margin: 0;
    flex-grow: 1;
  }
`;

const GameTable = styled.table`
  width: 100%;
  text-align: center;
  @media (max-width: 499px) {
    & > tbody > tr > td:nth-of-type(2),
    & > thead > tr > th:nth-of-type(2) {
      display: none;
    }
  }
`;



export const Activity = props=>{

    let [state, setState] = useState({
        username: '',
        primary_email: '',
        novels: [],
        error: ''
    });

    const fetchUser = username => {
        fetch(`/v1/user/${username}`)
            .then(res => res.json())
            .then(data => {
                setState({...data, error: ''});
                if(data.loggedIn){
                    props.logIn(data.username);
                }
            })
            .catch(err => console.log(err));
    };

    useEffect(() => {
        fetchUser(props.match.params.username);
    }, [props]);


    // Is the logged in user viewing their own profile
    const isUser = state.username === props.currentUser;

    const EdBtn = ({id})=>{
        return (
            <button onClick={ev=>{
                ev.preventDefault();
                props.history.push(`/edit_novel/${id}`);
            }}>Edit</button>
        )
    }

    const DelBtn = ({id})=>{

        const delHdlr = async ev=>{
            ev.preventDefault();
            // console.log(`del btn triggered, id=${id}`);
            const res = await fetch(`/v1/novel/${id}`, {
                method : "DELETE"
            })
            if(res.ok){
                let data = await res.json();
                // console.log(data);
                setState({...state, novels: data.novels});
            }else{
                let data = await res.json();
                setState({...state, error: data.error});
                console.log(data.error);
            }
        }
        return (
            <button onClick={delHdlr}>Delete</button>
        )
    }

    return (
        <Fragment>
            <ErrorMessage msg={state.error} />
            <GameHeaderBase>
                <h4>
                    Tracked Novels ({state.novels.length}
                    ):
                </h4>
                {isUser ? (
                    <Link id="addLink" style={{ marginBottom: '1em' }} to="/add">
                        Add New Entry
                    </Link>
                ) : null}
            </GameHeaderBase>
            <GameTable>
                <thead>
                <tr>
                    <th>Index</th>
                    <th>Name</th>
                    <th>Chapters to Read</th>
                    <th>Link to Website</th>
                    <th>Actions</th>
                </tr>
                </thead>
                <NovelList novels={state.novels} isUser = {isUser} DelBtn={DelBtn} EdBtn={EdBtn}/>
            </GameTable>
            {/*<div>{JSON.stringify(state)}</div>*/}
        </Fragment>
    )
}
