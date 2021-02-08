import React, {useEffect, useState} from 'react';
import {connect, useSelector, useDispatch} from "react-redux";
import { getData } from "../../store/reducers";
import { selectDataList } from "../../store/actions";
import {NavLink} from "react-router-dom";

import { makeStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Button from '@material-ui/core/Button';
import CssBaseline from '@material-ui/core/CssBaseline';
import Grid from '@material-ui/core/Grid';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import Container from '@material-ui/core/Container';
import Link from '@material-ui/core/Link';
import IconButton from '@material-ui/core/IconButton';
import MenuIcon from '@material-ui/icons/Menu';
import CloseRounded from '@material-ui/icons/CloseRounded';
import FollowersBar from "../FollowersBar/FollowersBar";
import Avatar from "@material-ui/core/Avatar";
import {useAuth0} from "@auth0/auth0-react";
import axios from "axios";
import PostCard from "../Modal/components/PostCard/PostCard";
import CircularProgress from "@material-ui/core/CircularProgress";
import Pagination from "@material-ui/lab/Pagination";


const useStyles = makeStyles((theme) => ({
    root: {
        flexGrow: 1,
    },
    menuButton: {
        marginRight: theme.spacing(2),
    },
    title: {
        flexGrow: 1,
        fontSize: '12px'
    },
    icon: {
        marginRight: theme.spacing(2),
    },
    heroContent: {
        backgroundColor: theme.palette.background.paper,
        padding: theme.spacing(8, 0, 6),
        marginTop: '20px'
    },
    heroButtons: {
        marginTop: theme.spacing(4),
    },
    cardGrid: {
        paddingTop: theme.spacing(8),
        paddingBottom: theme.spacing(8),
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center'
    },
    card: {
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
    },
    cardMedia: {
        paddingTop: '56.25%', // 16:9
    },
    cardContent: {
        flexGrow: 1,
    },
    footer: {
        backgroundColor: theme.palette.background.paper,
        padding: theme.spacing(6),
    },
    avatar: {
        width: theme.spacing(5),
        height: theme.spacing(5),
        marginRight: '10px'
    },
    avatarLarge: {
        width: theme.spacing(25),
        height: theme.spacing(25),
    },
    pagination: {
        marginTop: '35px',
    },
    logout: {
        color: 'white',
        border: '1px solid red',
        boxShadow: '0px 0px 4px 1px rgba(61,127,188,0.75)'

}
}));

const UserPage = ({ getData, data, history }) => {
    const classes = useStyles();
    const { logout, user } = useAuth0();
    const [bottomMenuShown, setBottomMenuShown] = useState(false);
    const [isRenderedDataAuthenticatedUser, setIsRenderedDataAuthenticatedUser] = useState(false);
    const [renderedData, setRenderedData] = useState(null);
    const [renderedPosts, setRenderedPosts] = useState([]);
    const [isFollower, setIsFollower] = useState(false);
    const [loaderInfo, setLoaderInfo] = useState(false);
    const [loaderPosts, setLoaderPosts] = useState(true);
    const [amountOfPages, setAmountOfPages] = useState(1);
    const [activePage, setActivePage] = useState(1);
    const [currentUserPosts, setCurrentUserPosts] = useState([]);





    useEffect( () => {
        getData();

        let tempPath = history.location.pathname.split("/").slice(2)[0];// window.location.pathname.split("/").slice(2)
        tempPath === user.email ? setIsRenderedDataAuthenticatedUser(true) : setIsRenderedDataAuthenticatedUser(false);

        axios.get("http://localhost:4000/api/users/").then(response => {
            let tempData = response.data.find(item => item.mail === tempPath);
            let pagesInWindow = Math.ceil(tempData.posts.length / 6);

            setAmountOfPages(pagesInWindow);
            setRenderedData(tempData);
            setRenderedPosts(tempData.posts);
        });

        !isRenderedDataAuthenticatedUser &&
        axios.get("http://localhost:4000/api/users/" + tempPath, { params: { id: user.email }})
            .then(response => {
                let isFollow = response.data.followers.includes(tempPath);

                setIsFollower(isFollow);
            });

        axios.put("http://localhost:4000/api/page", { params: { mail: tempPath, page: 1 }})
            .then(response => {
                let guestPots = response.data.posts;

                setCurrentUserPosts(guestPots)
                setLoaderPosts(false)
            });


    }, []);

    const followHandler = () => {
        let tempPath = history.location.pathname.split("/").slice(2)[0];

        if ( isFollower ) {
            axios.put('http://localhost:4000/api/followers', {params: { mail: user.email, userName: tempPath  } });
        } else {
            axios.post('http://localhost:4000/api/followers', {params: { mail: user.email, userName: tempPath  } });
        }
        setIsFollower(!isFollower)
    };

    const handleUpload = () => {
        window.cloudinary.openUploadWidget({ cloud_name: 'dqnzdtcol', upload_preset: 'hc8gbswh', tags:['xmas']});
    };

    const handleDeleteCard = (deleteId) => {
        axios.put("http://localhost:4000/api/users/", { params: { id: deleteId, mail: user.email }}).then(response => {
            const newRenderList = currentUserPosts && currentUserPosts.filter((item) => item.postComId !== deleteId);
            setCurrentUserPosts(newRenderList);
        });
        // deletePost(deleteId, user.email);

    };

    const paginationHandler = (event, value) => {
        let tempPath = history.location.pathname.split("/").slice(2)[0];
        setActivePage(value);

        axios.put("http://localhost:4000/api/page", { params: { mail: tempPath, page: value }})
            .then(response => {
                let guestPots = response.data.posts;

                setCurrentUserPosts(guestPots)
            });
    };


    return (
        <React.Fragment>
            <CssBaseline />
            <AppBar position="fixed" >
                <Toolbar>
                    <IconButton edge="start" className={classes.menuButton}
                                color="inherit" aria-label="menu"
                                onClick={() => setBottomMenuShown(!bottomMenuShown)}>
                        { !bottomMenuShown ? <MenuIcon /> : <CloseRounded/> }
                    </IconButton>
                    <NavLink to={`/user/${user.email}`}>
                        <Avatar src={user.picture} className={classes.avatar} />
                    </NavLink>
                    <Typography variant="h6" className={classes.title}>
                        {user.email}
                    </Typography>
                    <Button className={classes.logout} onClick={logout}>Log&nbsp;out</Button>
                </Toolbar>
            </AppBar>
            <FollowersBar  isMenuShown={bottomMenuShown}/>
            <main>
                {/* Hero unit */}
                <div className={classes.heroContent}>
                    <Grid container justify="center" alignItems="center" direction="column" maxwidth="sm">
                        <Typography component="h1" variant="h2" align="center" color="textPrimary" gutterBottom>
                            {renderedData && renderedData.name}
                        </Typography>

                        <Avatar src={renderedData && renderedData.ava} className={classes.avatarLarge} />

                        <div className={classes.heroButtons}>
                            <Grid container spacing={2} justify="center">
                                {!isRenderedDataAuthenticatedUser ?
                                    <Grid item>
                                        <Button variant="contained" color="primary" onClick={followHandler}>
                                            {isFollower ? 'Unfollow' : 'Follow'}
                                        </Button>
                                    </Grid>
                                    :
                                    <Grid item>
                                        <Button variant="outlined" color="primary" onClick={handleUpload}>
                                            Add post
                                        </Button>
                                    </Grid>
                                }
                            </Grid>
                        </div>
                    </Grid>
                </div>
                <Container className={classes.cardGrid} maxwidth="md">
                    {/* End hero unit */}
                    <Grid container spacing={4}>
                        {loaderPosts && <CircularProgress color="secondary" />}
                        {currentUserPosts && currentUserPosts.length === 0 ? <Typography variant="h1" color="secondary">No Posts.</Typography> : ''}
                        {currentUserPosts && currentUserPosts.map((card, i) => (
                            <PostCard key={i} comments={card.comments}
                                          img={card.img}
                                          description={card.description}
                                          ids={card.postComId}
                                          deleteCard={handleDeleteCard.bind(this, card.postComId)}
                                          isAuth={isRenderedDataAuthenticatedUser}
                                          liked={card.liked}
                            />
                        ))}
                    </Grid>
                    { amountOfPages > 1 && <Pagination className={classes.pagination}
                                                       count={amountOfPages && amountOfPages}
                                                       page={activePage}
                                                       color="primary"
                                                       onChange={paginationHandler}
                    />}

                </Container>
            </main>
            {/* Footer */}
            <footer className={classes.footer}>
                <Typography variant="h6" align="center" gutterBottom>
                    Step project
                </Typography>
                <Typography variant="subtitle1" align="center" color="textSecondary" component="p">
                    All rights reserved!
                </Typography>
                {/* Copyright */}
                <Typography variant="body2" color="textSecondary" align="center">
                    {'Copyright © '}
                    <Link color="inherit" href="https://dan-it.com.ua/">
                        Dan-it.com
                    </Link>{' '}
                    {new Date().getFullYear()}
                    {'.'}
                </Typography>
                {/* Copyright */}
            </footer>
            {/* End footer */}
        </React.Fragment>
    );
};

const mapStateToProps = (state) => ({
    data: selectDataList(state)
});

export default connect(mapStateToProps, {getData})(UserPage);
