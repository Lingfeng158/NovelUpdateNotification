'use strict';

import React, { useState } from 'react';
import { render } from 'react-dom';
import styled from 'styled-components';
import { BrowserRouter, Route, Redirect } from 'react-router-dom';

import { Header } from './components/header';
import { Landing } from './components/landing';
import {Login} from "./components/login";
import {Logout} from "./components/logout";
import {Register} from "./components/register";
import {Activity} from "./components/activity";
import {Edit} from "./components/edit";
import {Add} from "./components/add";
import {EditNovel} from "./components/editNovel";

const GridBase = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  grid-template-rows: auto auto auto;
  grid-template-areas:
    'hd'
    'main'
    'ft';

  @media (min-width: 500px) {
    grid-template-columns: 40px 50px 1fr 50px 40px;
    grid-template-rows: auto auto auto;
    grid-template-areas:
      'hd hd hd hd hd'
      'sb sb main main main'
      'ft ft ft ft ft';
  }
`;

const defaultUser = {
    username: '',
    primary_email:''
}

const MyApp = () => {
    // If the user has logged in, grab info from sessionStorage
    const data = localStorage.getItem('user');
    let [state, setState] = useState(data ? JSON.parse(data) : defaultUser);
    console.log(`Starting as user: ${state.username}`);

    const loggedIn = () => {
        // console.log(state.username && state.primary_email)
        return state.username;
    };

    const logIn = async username => {
        if(username===state.username)
            return;
        try {
            const response = await fetch(`/v1/user/${username}`);
            const user = await response.json();
            console.log(user);
            localStorage.setItem('user', JSON.stringify(user));
            setState(user);
        } catch (err) {
            alert('An unexpected error occurred.');
            logOut();
        }
    };



    const logOut = () => {
        // Wipe localStorage
        localStorage.removeItem('user');
        // Reset user state
        setState(defaultUser);
    };

    return (
        <BrowserRouter>
            <Header user={state.username} email={state.primary_email} />
            <Route exact path="/" component={Landing} />
            <Route
                path="/login"
                render={p =>
                    loggedIn() ? (
                        <Redirect to={`/activity/${state.username}`} />
                    ) : (
                        <Login {...p} logIn={logIn} />
                    )
                }
            />
            <Route
                path="/register"
                render={p =>
                    loggedIn() ? (
                        <Redirect to={`/activity/${state.username}`} />
                    ) : (
                        <Register {...p} />
                    )
                }
            />
            <Route path="/edit" render = {p=><Edit {...p}/>}/>
            <Route
                path="/activity/:username"
                render={p => <Activity {...p} logIn={logIn} currentUser={state.username}/>}
            />
            <Route path="/logout" render={p => <Logout {...p} logOut={logOut} />} />
            <Route path="/add" render={p=><Add {...p} currentUser={state.username}/>}/>
            <Route path ="/edit_novel/:novelID" render={p=><EditNovel {...p}/>}/>
        </BrowserRouter>

    );
};

render(<MyApp />, document.getElementById('mainDiv'));