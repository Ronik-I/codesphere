import React, { useState } from 'react';
import { Card, CardContent, Typography, IconButton, Dialog, DialogActions, DialogContent, DialogTitle, Button } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import { api_base_url } from '../helper';
import { useNavigate } from 'react-router-dom';
import img from "../images/code.png"; // Ensure this path is correct

const ListCard = ({ item }) => {
  const navigate = useNavigate();
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

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
        className="listCard mb-2 cursor-pointer hover:bg-[#202020]" 
        onClick={() => { item.type=='dev'?navigate(`/deveditor/${item._id}`): navigate(`/dsaeditor/${item._id}`) }} 
        sx={{ display: 'flex', justifyContent: 'space-between', backgroundColor: '#141414' }}
      >
        <CardContent sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <img className='w-[80px]' src={img} alt="" />
          <div>
            <Typography variant="h6" sx={{ color: 'white' }}>{item.title}</Typography>
            <Typography variant="body2" sx={{ color: 'gray' }}>
              Created on {new Date(item.date).toDateString()}
            </Typography>
          </div>
        </CardContent>
        <IconButton onClick={(e) => { setIsDeleteModalOpen(true); e.stopPropagation(); }} color="inherit">
          <DeleteIcon sx={{ color: 'white' }} />
        </IconButton>
      </Card>

      <Dialog open={isDeleteModalOpen} onClose={() => setIsDeleteModalOpen(false)}>
        <DialogTitle>Confirm Delete</DialogTitle>
        <DialogContent>
          <Typography>Do you want to delete this project?</Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => deleteProj(item._id)} color="error">Delete</Button>
          <Button onClick={() => setIsDeleteModalOpen(false)} color="primary">Cancel</Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default ListCard;
