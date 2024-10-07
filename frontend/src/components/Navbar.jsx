import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Avatar, Button, Menu, MenuItem, Typography } from '@mui/material';
import { MdLightMode } from "react-icons/md";
import { BsGridFill } from "react-icons/bs";
import logo from "../images/logo.png";
import { api_base_url, toggleClass } from '../helper';

const Navbar = ({ isGridLayout, setIsGridLayout }) => {
  const navigate = useNavigate();
  
  const [data, setData] = useState(null);
  const [error, setError] = useState("");
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);
  

  useEffect(() => {
    fetch(api_base_url + "/getUserDetails", {
      mode: "cors",
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        userId: localStorage.getItem("userId")
      })
    }).then(res => res.json()).then(data => {
      if (data.success) {
        setData(data.user);
      }
      else {
        setError(data.message);
      }
    });
  }, []);

  const logout = () => {
    localStorage.removeItem("userId");
    localStorage.removeItem("token");
    localStorage.removeItem("isLoggedIn");
    window.location.reload();
  };

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <div className="navbar flex items-center justify-between px-[100px] h-[80px] bg-[#141414]">
      {/* Logo */}
      <div className="logo">
      <Link to="/" >
        <img className='w-[280px] cursor-pointer' src={logo} alt="" />
        </Link>
      </div>

      {/* Links */}
      <div className="links flex items-center gap-5">
        <Link to="/" className="nav-link">Home</Link>
        <Link to="/about" className="nav-link">About</Link>
        <Link to="/contact" className="nav-link">Contact</Link>
        <Link to="/services" className="nav-link">Services</Link>

        {/* Logout Button */}
        <Button
          onClick={logout}
          variant="contained"
          color="error"
          sx={{
            minWidth: '120px',
            ml: 2,
            transition: 'all 0.3s ease',
            '&:hover': {
              backgroundColor: '#D32F2F', // Dark red for hover
              transform: 'scale(1.05)',
            }
          }}
        >
          Logout
        </Button>

        {/* User Avatar & Dropdown */}
        <Avatar
          onClick={handleClick}
          name={data ? data.name : ""}
          size="40"
          round="50%"
          className='cursor-pointer ml-2'
          sx={{
            bgcolor: 'primary.main',
            cursor: 'pointer',
            transition: 'all 0.3s ease',
            '&:hover': {
              transform: 'scale(1.1)',
              boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.2)',
            }
          }}
        />
        <Menu
          anchorEl={anchorEl}
          open={open}
          onClose={handleClose}
          PaperProps={{
            sx: {
              width: 200,
              backgroundColor: '#1A1919',
              borderRadius: '10px',
            }
          }}
        >
          <MenuItem disabled sx={{ transition: 'all 0.3s ease', color: '#FFFFFF' }}>
            <Typography variant="body2" sx={{ lineHeight: 1 }}>{data ? data.name : ""}</Typography>
          </MenuItem>
          {/* <MenuItem
            onClick={() => toggleClass(".dropDownNavbar", "hidden")}
            sx={{
              transition: 'all 0.3s ease',
              color: '#FFFFFF',
              '&:hover': {
                backgroundColor: '#333',
                transform: 'translateX(5px)',
              }
            }}
          >
            <MdLightMode className='text-[20px]' /> Light mode
          </MenuItem> */}
          <MenuItem
            onClick={() => setIsGridLayout(!isGridLayout)}
            sx={{
              transition: 'all 0.3s ease',
              color: '#FFFFFF',
              '&:hover': {
                backgroundColor: '#333',
                transform: 'translateX(5px)',
              }
            }}
          >
            <BsGridFill className='text-[20px]' /> {isGridLayout ? "List" : "Grid"} layout
          </MenuItem>
          <MenuItem
            onClick={logout}
            sx={{
              color: 'error.main',
              transition: 'all 0.3s ease',
              '&:hover': {
                backgroundColor: '#D32F2F',
                transform: 'scale(1.05)',
                color: 'white'
              }
            }}
          >
            Logout
          </MenuItem>
        </Menu>
      </div>
    </div>
  );
}

export default Navbar;
