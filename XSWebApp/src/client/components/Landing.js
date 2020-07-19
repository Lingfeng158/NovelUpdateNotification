'use strict';

import React, {useState} from 'react';
import styled from 'styled-components';

const LandingBase = styled.div`
  display: flex;
  justify-content: center;
   grid-column-start: sb;
   grid-column-end: main;
`;

const StyledHeader = styled.div`
  font-size: 3em;
  color: antiquewhite;
  @media screen and (max-width: 1000px) {
  //landing
    font-size: 2em;
    color: antiquewhite;
  }
  @media screen and (max-width: 600px) {
    font-size: 1.6em;
    border-right: 2em solid transparent;
  }
`;

export const Landing = () => {

    return (<LandingBase>
        <h1>This is my landing page!</h1>

    </LandingBase>);
};