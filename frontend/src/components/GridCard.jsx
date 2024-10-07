import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, Typography, IconButton, Dialog, DialogActions, DialogContent, DialogTitle, Button } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import codeImg from "../images/code1.png"; 
import { api_base_url } from '../helper';

const GridCard = ({ item }) => {
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const navigate = useNavigate();

  const deleteProj = (id) => {
    fetch(api_base_url + "/deleteProject", {
      mode: "cors",
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        progId: id,
        userId: localStorage.getItem("userId"),
      }),
    })
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          setIsDeleteModalOpen(false);
          window.location.reload();
        } else {
          alert(data.message);
          setIsDeleteModalOpen(false);
        }
      });
  };

  return (
    <>
      <Card
        className="pulsating-card"
        sx={{ borderRadius: '1.25rem' }} // 20px = 1.25rem
        onClick={() => item.type === 'dev' ? navigate(`/deveditor/${item._id}`) : navigate(`/dsaeditor/${item._id}`)}
      >
        <CardContent sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '0.625rem', textAlign: 'center' }}> {/* 10px = 0.625rem */}
          {/* Image */}
          <img
            src={codeImg}
            alt="project"
            style={{ width: '4.5rem', height: '4.5rem', objectFit: 'cover', borderRadius: '0.5rem' }} // 90px = 5.625rem, 8px = 0.5rem
          />

          {/* Title */}
          <Typography 
            variant="h6" 
            sx={{ color: '#fff', marginTop: '0.1rem', textOverflow: 'ellipsis', overflow: 'hidden', whiteSpace: 'nowrap', width: '100%' }} // 16px = 1rem
            noWrap
          >
            {item?.title}
          </Typography>

          {/* Type or Language */}
          <Typography variant="caption" sx={{ color: 'gray', marginTop: '0.1rem' }}> {/* 5px = 0.3125rem */}
            {item?.type === 'dev' ? 'Development' : item?.language}
          </Typography>

          {/* Created Date */}
          <Typography variant="caption" sx={{ color: 'gray', marginTop: '0.0625rem', marginBottom: '0.625rem' }}> {/* 1px = 0.0625rem, 10px = 0.625rem */}
            Created on {new Date(item.date).toDateString()}
          </Typography>
        </CardContent>

        <IconButton
        size='small'
          sx={{
            position: 'absolute',
            top: '0.625rem',  // 10px = 0.625rem
            right: '0.625rem', // 10px = 0.625rem
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
            '&:hover': {
              backgroundColor: '#FF4343',
              '& .MuiSvgIcon-root': {
                color: '#202020', 
              },
            },
          }}
          onClick={(e) => {
            e.stopPropagation();
            setIsDeleteModalOpen(true);
          }}
        >
          <DeleteIcon fontSize='xs' sx={{ color: '#FF4343' }} /> 
        </IconButton>
      </Card>

      {/* Delete Confirmation Modal */}
      <Dialog open={isDeleteModalOpen} onClose={() => setIsDeleteModalOpen(false)}>
        <DialogTitle sx={{ color: '#fff', backgroundColor: '#1A1919' }}>
          <Typography variant="h6">Delete Project</Typography>
        </DialogTitle>
        <DialogContent sx={{ backgroundColor: '#141414', color: 'white' }}>
          <Typography variant="body1">Do you want to delete this project?</Typography>
        </DialogContent>
        <DialogActions sx={{ backgroundColor: '#1A1919' }}>
          <Button
            onClick={() => deleteProj(item._id)} 
            color="error"
            variant="contained"
            sx={{ backgroundColor: '#FF4343', color: 'white', '&:hover': { backgroundColor: '#D32F2F' } }}
          >
            Delete
          </Button>
          <Button
            onClick={() => setIsDeleteModalOpen(false)} 
            color="error"
            variant="outlined"
            sx={{ color: 'white', borderColor: 'white', '&:hover': { borderColor: '#FF4343' } }}
          >
            Cancel
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default GridCard;
