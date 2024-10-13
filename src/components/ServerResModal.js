import * as React from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Modal from '@mui/material/Modal';
import SentimentSatisfiedAltIcon from '@mui/icons-material/SentimentSatisfiedAlt';
import SentimentVeryDissatisfiedIcon from '@mui/icons-material/SentimentVeryDissatisfied';
import { useDispatch, useSelector } from 'react-redux';
import { openModal, closeModal } from '../features/modal/modalSlice';

const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: '30%',
    bgcolor: 'background.paper',
    border: '2px solid #000',
    boxShadow: 24,
    p: 4,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',  
    justifyContent: 'center', 
    textAlign: 'center' ,
    borderRadius:10
};

// export default function ServerResModal({ isOpen, setIsOpen, isSuccessful, message }) {
export default function ServerResModal() {
    const {isOpen, message, isSuccessful} = useSelector((store) => store.modal);
    const dispatch = useDispatch();

    const handleClose = () => dispatch(closeModal());
    // const handleClose = () => setIsOpen(false);

    return (
        <div>
            <Modal
                open={isOpen}
                onClose={handleClose}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
            >
                <Box sx={style}>
                    {isSuccessful ? (
                        <SentimentSatisfiedAltIcon sx={{ fontSize: 80, color:'green' }} /> // Increase icon size
                    ) : (
                        <SentimentVeryDissatisfiedIcon sx={{ fontSize: 80 , color:'#f11138'}} /> // Increase icon size
                    )}
                    <Typography variant="h6" sx={{ mt: 2 }}>
                        {message}
                    </Typography>
                </Box>
            </Modal>
        </div>
    );
}
