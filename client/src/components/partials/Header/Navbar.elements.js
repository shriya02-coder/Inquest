import styled from 'styled-components';
import { FaMagento } from 'react-icons/fa'
import { Link } from 'react-router-dom'


export const NavLogo = styled(Link)
`
    color: #fff;
    justify-self: flex-start;
    cursor: pointer;
    text-decoration: none;
    font-size: 2rem;
    display: flex;
    align-items: center;
`

export const NavIcon = styled(FaMagento)
`
    margin-right: 0.5rem;

`