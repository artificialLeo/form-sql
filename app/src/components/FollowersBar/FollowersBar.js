import React, {useEffect, useState} from 'react';
import { NavLink } from "react-router-dom";
import axios from "axios";
import {useAuth0} from "@auth0/auth0-react";

import { makeStyles } from '@material-ui/core/styles';
import IconButton from '@material-ui/core/IconButton';
import Paper from '@material-ui/core/Paper';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import ListItemText from '@material-ui/core/ListItemText';
import ListSubheader from '@material-ui/core/ListSubheader';
import Avatar from '@material-ui/core/Avatar';
import StarRounded from '@material-ui/icons/StarRounded';

const useStyles = makeStyles((theme) => ({
    text: {
        padding: theme.spacing(2, 2, 0),
    },
    paper: {
        marginTop: '40px',
        position: 'fixed',
        width: '300px',
        height: '100vh',
        overflow: 'auto',
        zIndex: 2
    },
    list: {
        marginBottom: theme.spacing(2),
    },
    subheader: {
        backgroundColor: theme.palette.background.paper,
    },
    appBar: {
        top: 'auto',
        bottom: 0,
    },
    grow: {
        flexGrow: 1,
    },
    fabButton: {
        position: 'absolute',
        zIndex: 1,
        top: -30,
        left: 0,
        right: 0,
        margin: '0 auto',
    },
    dn: {
        display: 'none ! important'
    },
    menuItem: {
        position: 'relative'
    },
    menuButton: {
        position: 'absolute',
        right: '2%',
        top: '6.5%'
    },
    followersMenuButton: {
        position: 'fixed',
        right: '2%',
        top: '12%',
        zIndex: '3'
    },
    linkStyles: {
        textDecoration: 'none'
    }
}));

export default function FollowersBar({ isMenuShown }) {
    const classes = useStyles();

    const { user } = useAuth0();

    const [followers, setFollowers] = useState([]);
    const [guests, setGuests] = useState([]);

    useEffect(() => {
        axios.get("http://localhost:4000/api/users/")
            .then(response => {

                let currentFollowers = response.data.filter(item => item.mail === user.email ).map( item => item.followers );

                let renderedFollowers = response.data.filter( item => currentFollowers[0].includes(item.mail) ).filter( item => item.mail !== user.email );
                let renderedGuests = response.data.filter( item => !currentFollowers[0].includes(item.mail) ).filter( item => item.mail !== user.email );

                setFollowers(renderedFollowers);

                setGuests(renderedGuests);
            });
    }, [user.email]);
    return (
        <React.Fragment>
            <Paper square className={isMenuShown ? classes.paper : classes.dn}>
                {/*<Typography className={classes.text} variant="h5" gutterBottom>*/}
                {/*    {"Filler"}*/}
                {/*</Typography>*/}
                <List className={classes.list}>
                        <React.Fragment >
                            <ListSubheader className={classes.subheader}>Followers</ListSubheader>

                            {  followers.map((item, i) => <FollowersBarUser key={i} name={item.mail} avatar={item.ava} follows={true} /> ) }

                            <ListSubheader className={classes.subheader}>Guests</ListSubheader>

                            {  guests.map((item, i) => <FollowersBarUser key={i} name={item.mail} avatar={item.ava} follows={false} /> ) }
                        </React.Fragment>
                </List>
            </Paper>
        </React.Fragment>
    );
}


const FollowersBarUser = ({ avatar, name, ids, follows }) => {
    const classes = useStyles();

    const { user } = useAuth0();

    const [followColor, setFollowColor] = useState(follows);

    const follow = (email, follows) => {
        if ( followColor ) {
            setFollowColor(false);
            axios.put('http://localhost:4000/api/followers', {params: { mail: user.email, userName: email  } });
        } else {
            setFollowColor(true);
            axios.post('http://localhost:4000/api/followers', {params: { mail: user.email, userName: email  } });
        }
    };

    return (
        <div key={ids} className={classes.menuItem}>
            <NavLink to={`/user/${name}`} className={classes.linkStyles}>
                <ListItem button>
                    <ListItemAvatar>
                        <Avatar alt="Profile Picture" src={avatar}/>
                    </ListItemAvatar>
                    <ListItemText primary={name}/>
                </ListItem>
            </NavLink>
            <IconButton edge="start" color="inherit" aria-label="add-favs" className={classes.menuButton} onClick={follow.bind(this, name, follows)}>
                <StarRounded  color={ followColor ? "primary" : "disabled"} />
            </IconButton>
        </div>

    );
};