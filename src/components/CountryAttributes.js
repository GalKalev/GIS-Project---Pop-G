import * as React from 'react';
import Backdrop from '@mui/material/Backdrop';
import Box from '@mui/material/Box';
import Modal from '@mui/material/Modal';
import Fade from '@mui/material/Fade';
import Button from '@mui/material/Button';
import EmojiFlagsIcon from '@mui/icons-material/EmojiFlags';
import { Icon, IconButton } from '@mui/material';
import InfoIcon from '@mui/icons-material/Info';
import FormControlLabel from '@mui/material/FormControlLabel';

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: '%100',
  backgroundColor: '#eee',
  borderRadius: 15,
  padding: 10,
  border: '2px solid #000',
  boxShadow: 24,
  p: 4,
};

export default function CountryAttributes({ continent, name_es, name_ja, name_tr, flag, capital, languages }) {
  const [open, setOpen] = React.useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const iconsSX = {
    width: '50px',
    height: '50px',
    objectFit: 'contain',
    position: 'absolute',
    left: -25,
    border: '1px solid black',
    borderRadius: 10,
    backgroundColor: 'white'
  }
  const infoContainerSX = {
    border: '1px solid black',
    padding: '10px 30px',
    borderRadius: 10,
    position: 'relative',
    display: 'flex',
    alignItems: 'center',
    marginTop: 2,
    justifyContent: 'center',
    marginTop: 3
  }

  return (
    <div>
      <FormControlLabel
        control={
          <IconButton
            size="small"
            aria-label="account of current user"
            aria-controls="menu-appbar"
            color="black"
            onClick={handleOpen}
            sx={{ display: 'flex', alignItems: 'center' }}
          >
            MORE INFO
            <InfoIcon />

          </IconButton>}

      />
      <Modal
        aria-labelledby="transition-modal-title"
        aria-describedby="transition-modal-description"
        open={open}
        onClose={handleClose}
        closeAfterTransition
        slots={{ backdrop: Backdrop }}
        slotProps={{
          backdrop: {
            timeout: 500,
          },
        }}
      >
        <Fade in={open}>
          <Box sx={style}>
            <Box sx={{ display: 'flex', justifyContent: 'space-around', textAlign: 'center' }}>
              <Box
                sx={infoContainerSX}
              >
                <EmojiFlagsIcon
                  sx={iconsSX}
                />
                <img
                  src={flag}
                  alt="Flag"
                  style={{ width: '150px', height: '150px', objectFit: 'contain' }}
                />

              </Box>
              <Box sx={{ display: 'flex', justifyContent: 'space-around', textAlign: 'center', flexDirection: 'column' }}>

                <Box sx={infoContainerSX}>
                  <Icon sx={iconsSX}>
                    <img
                      src="https://cdn-icons-png.flaticon.com/128/82/82269.png"
                      alt="Custom Icon"
                      style={{ width: '40px', height: '40px', objectFit: 'contain' }}
                    />
                  </Icon>
                  <div>{continent}</div>
                </Box>
                <Box sx={infoContainerSX}>
                  <Icon sx={iconsSX}>
                    <img
                      src="https://cdn-icons-png.flaticon.com/512/3008/3008506.png"
                      alt="Custom Icon"
                      style={{ width: '40px', height: '40px', objectFit: 'contain' }}
                    />
                  </Icon>
                  <div>{capital?.join(', ')}</div>
                </Box>


              </Box>
            </Box>

            <Box sx={infoContainerSX}>
              <Icon sx={iconsSX}>
                <img
                  src="https://t3.ftcdn.net/jpg/02/07/54/36/240_F_207543651_92R9UPXVDKqi08NklMcJRbWFqYBn2Bw2.jpg"
                  alt="Custom Icon"
                  style={{ width: '50px', height: '50px', objectFit: 'contain' }}
                />
              </Icon>
              <div>{languages?.join(', ')}</div>
            </Box>



            <Box sx={{ display: 'flex', justifyContent: 'space-between', textAlign: 'center' }}>
              <Box sx={infoContainerSX}>
                <Icon sx={iconsSX}>
                  <img
                    src="https://cdn-icons-png.flaticon.com/128/10601/10601048.png"
                    alt="Custom Icon"
                    style={{ width: '50px', height: '50px', objectFit: 'contain' }}
                  />
                </Icon>
                <div>{name_es}</div>
              </Box>
              <Box sx={infoContainerSX}>
                <Icon sx={iconsSX}>
                  <img
                    src="https://cdn-icons-png.flaticon.com/128/4628/4628673.png"
                    alt="Custom Icon"
                    style={{ width: '50px', height: '50px', objectFit: 'contain' }}
                  />
                </Icon>
                <div>{name_tr}</div>
              </Box>
              <Box sx={infoContainerSX}>
                <Icon sx={iconsSX}>
                  <img
                    src="https://cdn-icons-png.flaticon.com/128/4628/4628642.png"
                    alt="Custom Icon"
                    style={{ width: '50px', height: '50px', objectFit: 'contain' }}
                  />
                </Icon>
                <div>{name_ja}</div>
              </Box>



            </Box>

          </Box>
        </Fade>
      </Modal>
    </div>
  );
}
