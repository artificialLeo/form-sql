import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Modal from '@material-ui/core/Modal';
import Backdrop from '@material-ui/core/Backdrop';
import Fade from '@material-ui/core/Fade';
import Button from "@material-ui/core/Button";
import Grid from "@material-ui/core/Grid";
import SentimentVeryDissatisfied from "@material-ui/icons/SentimentVeryDissatisfied";

const useStyles = makeStyles((theme) => ({
    modal: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',

    },
    paper: {
        backgroundColor: theme.palette.background.paper,
        boxShadow: theme.shadows[5],
        border: 0,
        borderRadius: '5px',
        transform: 'scale(.9)',
        overflow: 'auto',
        outline: 'none'
    },
    img: {

    }
}));

export default function ModalButton({caption, img, handleDelete}) {
    const classes = useStyles();
    const [open, setOpen] = React.useState(false);

    const handleOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };

    return (
        <div>
            <Button size="small" color="primary" onClick={handleOpen}>
                {caption}
            </Button>
            <Modal
                className={classes.modal}
                open={open}
                onClose={handleClose}
                closeAfterTransition
                BackdropComponent={Backdrop}
                BackdropProps={{
                    timeout: 500,
                }}
            >
                <Fade in={open}>
                    <div className={classes.paper}>
                        {img === false ?
                            <Button size="large" variant="contained" color="secondary" onClick={ () => {handleDelete(); handleClose()} }>
                                Are you sure?  <br/>
                                Click me!
                            </Button>
                         :
                            <img src={img} alt="Wallpaper" className={classes.img} onClick={handleClose}/> }
                    </div>
                </Fade>
            </Modal>
        </div>
    );
}