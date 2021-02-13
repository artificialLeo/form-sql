import React, {useEffect, useRef, useState} from 'react';

import { makeStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import IconButton from '@material-ui/core/IconButton';
import clsx from 'clsx';
import Collapse from '@material-ui/core/Collapse';
import { red } from '@material-ui/core/colors';
import FavoriteIcon from '@material-ui/icons/Favorite';
import ShareIcon from '@material-ui/icons/Share';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import Paper from '@material-ui/core/Paper';
import InputBase from '@material-ui/core/InputBase';
import Divider from '@material-ui/core/Divider';
import AddComment from '@material-ui/icons/AddComment';
import InsertEmoticon from '@material-ui/icons/InsertEmoticon';
import AddBox from '@material-ui/icons/AddBox';
import Alert from '@material-ui/lab/Alert';
import axios from "axios";

const useStyles1 = makeStyles((theme) => ({
    root: {
        maxWidth: '100%',
        borderTop: '1px solid white',
        borderRadius: '0'
    },
    media: {
        height: 0,
        paddingTop: '56.25%', // 16:9
    },
    expand: {
        transform: 'rotate(0deg)',
        marginLeft: 'auto',
        transition: theme.transitions.create('transform', {
            duration: theme.transitions.duration.shortest,
        }),
    },
    expandOpen: {
        transform: 'rotate(180deg)',
    },
    avatar: {
        backgroundColor: red[500],
    },
    reverse: {
        display: 'flex',
        flexDirection: 'column-reverse'
    },
    comsCaption: {
        fontWeight: 'bold',
        marginLeft: '20px',
        marginBottom: '0px',
        color: '#7090ff'
    }
}));

const CommentsBlock = ({likes, coms, ids, currentUser, currentUserEmail}) => {
    const classes = useStyles1();
    const [expanded, setExpanded] = useState(false);
    const [like, setLike] = useState('false');
    let [numberOfLikes, setNumberOfLikes] = useState(likes.length);

    useEffect(() => {
        if (likes.includes(currentUserEmail)) {
            setLike('true');
        }
    }, []);

    const handleExpandClick = () => {
        setExpanded(!expanded);
    };

    const renderComment = (author, text, i) => {
        return (
            <div key={i}>
                <Grid container alignItems="center" >
                    <Typography variant="h5" style={{fontWeight: 'bold'}} >{author}:&nbsp;&nbsp;</Typography>
                    <Typography variant="h5" >{text}</Typography>
                </Grid>
                <hr/>
            </div>
        );
    };

    const likePost = () => {

        if (like === 'false') {
            setLike('true');
            setNumberOfLikes(++numberOfLikes);
            axios.post("http://localhost:4000/api/like", {
                params: { id: ids, mail: currentUserEmail, liked: 'false', user: window.location.pathname.split("/").slice(2)[0] }});
        } else {
            setLike('false');
            setNumberOfLikes(--numberOfLikes);
            axios.put("http://localhost:4000/api/removelike", {
                params: { id: ids, mail: currentUserEmail, liked: 'true', user: window.location.pathname.split("/").slice(2)[0] }});
        }
    };

    return (
        <Card className={classes.root}>
            <CardContent>
                <CustomizedInputBase ids={ids} authorizedUserMail={currentUser}/>
            </CardContent>
            <CardActions disableSpacing>

                <Grid container alignItems="center">
                    <IconButton aria-label="like" onClick={likePost}>
                        <FavoriteIcon color={ like === 'true' ? 'secondary' : 'primary' } />
                    </IconButton>
                    <Typography variant="h5">{numberOfLikes}</Typography>
                </Grid>

                <IconButton
                    className={clsx(classes.expand, {
                        [classes.expandOpen]: expanded,
                    })}
                    onClick={handleExpandClick}
                    aria-expanded={expanded}
                    aria-label="show more"
                >
                    <ExpandMoreIcon />
                </IconButton>
            </CardActions>
            <Collapse in={expanded} timeout="auto" unmountOnExit>
                <Typography variant="h5" paragraph className={classes.comsCaption}>Comments:</Typography>
                <CardContent className={classes.reverse}>

                    {coms.map( ( item, i ) => renderComment( item.author, item.text, i ) )}

                </CardContent>
            </Collapse>
        </Card>
    );
};

export default CommentsBlock;

const useStyles2 = makeStyles((theme) => ({
    root: {
        display: 'flex',
        alignItems: 'center',
        maxWidth: '100%',
    },
    input: {
        marginLeft: theme.spacing(1),
        flex: 1,
    },
    iconButton: {
        padding: 10,
    },
    divider: {
        height: 28,
        margin: 4,
    },
}));


const CustomizedInputBase = ({ids, authorizedUserMail}) => {
    const classes = useStyles2();
    const valuePost = useRef(null);
    const [textValue, setTextValue] = useState('');
    const [alertShown, setAlertShown] = useState(false);

    const sendValue = (e) => {
        setTextValue(e.target.value);
    };

    const toggleAlert = (e) => {
        setAlertShown(true);
        setTimeout(setAlertShown, 1500, false);
    };

    const addComment = (id) => {

        if (textValue.length !== 0) {
            axios.post("http://localhost:4000/api/comments", {
                params: {
                    id: id, mail: window.location.pathname.split("/").slice(2)[0],
                    userName: authorizedUserMail, userText: textValue
                }
            }).then(response => {
                valuePost.current.value = '';
                setTextValue('');
                toggleAlert();
                // axios.put("http://localhost:4000/api/newcomment/", //working. but bad project structure
                //     {params: {mail: window.location.pathname.split("/").slice(2)[0], id: id}})
                //     .then(response => {
                //         let temp = response.data.posts.find(item => item.postComId === id).comments;
                //
                //         setCommentsList(temp)
                //     });
            });
        }
    };

    return (
        <div>
        {alertShown && <Alert severity="success">Successfully added reload and check it out!</Alert>}
        <Paper component="form" className={classes.root}>

            <IconButton disabled className={classes.iconButton} aria-label="menu">
                <AddComment />
            </IconButton>

            <InputBase innerRef={valuePost} value={textValue} onChange={sendValue}
                        className={classes.input}
                placeholder="Add Your Comment"
                inputProps={{ 'aria-label': 'Add' }}
            />
            <IconButton disabled type="button" className={classes.iconButton} aria-label="search">
                <InsertEmoticon />
            </IconButton>
            <Divider className={classes.divider} orientation="vertical" />
            <IconButton color="primary" className={classes.iconButton} aria-label="AddBox" onClick={addComment.bind(this, ids)}>
                <AddBox style={{color: 'green'}} />
            </IconButton>
        </Paper>
        </div>
    );
};