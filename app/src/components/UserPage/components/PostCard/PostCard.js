import React from 'react';

import { makeStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import CardMedia from '@material-ui/core/CardMedia';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import CommentsBlock from "../CommentsBlock/CommentsBlock";
import ModalButton from "../../../Modal/Modal";
import {useAuth0} from "@auth0/auth0-react";


const useStyles = makeStyles((theme) => ({
    root: {
        flexGrow: 1,
    },
    menuButton: {
        marginRight: theme.spacing(2),
    },
    title: {
        flexGrow: 1,
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
}));


const PostCard = ({description, img, comments, ids, deleteCard, isAuth, liked}) => {
    const classes = useStyles();
    const {user} = useAuth0();

    return (
        <Grid item xs={12} sm={6} md={4}>
            <Card className={classes.card}>
                <CardMedia
                    className={classes.cardMedia}
                    image="https://source.unsplash.com/random"
                    title="Image title"
                />
                <CardContent className={classes.cardContent}>
                    <Typography gutterBottom variant="h5" component="h2">
                        {description} + {`card id: ${ids}`}
                    </Typography>
                </CardContent>
                <CardActions>
                    <ModalButton caption={"View"} img={img}/>

                    {isAuth ? <ModalButton caption={"Delete"} img={false} handleDelete={deleteCard}/> : ''}
                </CardActions>
                <CommentsBlock ids={ids} coms={comments} likes={liked}
                               currentUser={user.nickname} currentUserEmail={user.email}/>
            </Card>
        </Grid>
    );
};

export default PostCard;