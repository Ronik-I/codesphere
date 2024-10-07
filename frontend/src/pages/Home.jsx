import React, { useEffect, useState } from "react";
import axios from "axios";
import Navbar from "../components/Navbar";
import ListCard from "../components/ListCard";
import GridCard from "../components/GridCard";
import { api_base_url } from "../helper";
import { useNavigate } from "react-router-dom";
import {
  TextField,
  Button,
  Grid,
  Box,
  Modal,
  Typography,
  ToggleButtonGroup,
  ToggleButton,
  Snackbar,
  Alert,
} from "@mui/material";
import Loader from "../components/Loader";

const Home = ({ isGridLayout }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [data, setData] = useState(null);
  const [error, setError] = useState("");
  const [searchQuery, setSearchQuery] = useState(""); // State for search query
  const [projTitle, setProjTitle] = useState("");
  const [projectType, setProjectType] = useState("Development");
  const navigate = useNavigate();
  const [isCreateModelShow, setIsCreateModelShow] = useState(false);
  const [severity, setSeverity] = useState();
  const [open, setOpen] = useState(false);

  // Filter data based on search query
  const filteredData = data
    ? data.filter((item) =>
        item.title.toLowerCase().includes(searchQuery.toLowerCase())
      ) // Case insensitive filtering
    : [];

  const createProj = async () => {
    if (projTitle === "") {
      alert("Please Enter Project Title");
    } else {
      setIsLoading(true);
      try {
        const response = await axios.post(`${api_base_url}/createProject`, {
          title: projTitle,
          userId: localStorage.getItem("userId"),
          type: projectType == "Development" ? "dev" : "dsa",
        });

        const data = response.data;
        if (data.success) {
          console.log(data);
          setIsCreateModelShow(false);
          setProjTitle("");
          // alert('Project Created Successfully');
          setSeverity("success");
          setOpen(true);

          if (projectType == "Development") {
            setTimeout(() => navigate(`/deveditor/${data.projectId}`), 1000);
          } else navigate(`/dsaeditor/${data.projectId}`);
          setIsLoading(false);
        } else {
          alert("Something Went Wrong");
          setIsLoading(false);
        }
      } catch (error) {
        console.error(error);
        alert("Error while creating project");
        setIsLoading(false);
      }
    }
  };

  const getProj = async () => {
    setIsLoading(true);

    try {
      const response = await axios.post(`${api_base_url}/getProjects`, {
        userId: localStorage.getItem("userId"),
      });
      setIsLoading(false);

      const data = response.data;
      if (data.success) {
        setData(data.projects);
      } else {
        setError(data.message);
      }
    } catch (error) {
      console.error(error);
      setError("Failed to fetch projects");
      setIsLoading(false);
    }
  };

  useEffect(() => {
    getProj();
    console.log(isGridLayout);
  }, []);

  const [userData, setUserData] = useState(null);
  const [userError, setUserError] = useState("");

  const handleToggleChange = (event, newType) => {
    if (newType) {
      setProjectType(newType);
    }
  };

  const getUserDetails = async () => {
    setIsLoading(true);

    try {
      const response = await axios.post(`${api_base_url}/getUserDetails`, {
        userId: localStorage.getItem("userId"),
      });

      const data = response.data;
      if (data.success) {
        setUserData(data.user);
      } else {
        setUserError(data.message);
      }
      setIsLoading(false);
    } catch (error) {
      console.error(error);
      setUserError("Failed to fetch user details");
      setIsLoading(false);
    }
  };

  useEffect(() => {
    getUserDetails();
  }, []);

  return (
    <>
      {/* <Navbar isGridLayout={isGridLayout} setIsGridLayout={setIsGridLayout} /> */}
      {isLoading && <Loader />}
      <Snackbar
        open={open}
        autoHideDuration={6000}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      >
        <Alert severity={severity} variant="filled" sx={{ width: "100%" }}>
          Project Created Successfully!
        </Alert>
      </Snackbar>
      <Box className="flex items-center justify-between px-[100px] my-[40px]">
        <Typography variant="h6">
          Hi, {userData ? userData.username : ""} 👋
        </Typography>
        <Box className="flex items-center gap-3 ">
          {/* Search Bar */}
          <TextField
            className="inputBox"
            variant="outlined"
            placeholder="Search Here... !"
            value={searchQuery} // Bind search input to searchQuery state
            onChange={(e) => setSearchQuery(e.target.value)} // Update searchQuery on input change
          />
          <Button
            onClick={() => setIsCreateModelShow(true)}
            variant="contained"
            color="primary"
            sx={{ padding: "5px 10px", borderRadius: "5px" }}
          >
            +
          </Button>
        </Box>
      </Box>

      {/* Project Display */}
      <Box className="cards">
        {isGridLayout ? (
          <Grid
            container
            spacing={2}
            sx={{ paddingX: "100px", paddingBottom: "15px" }}
          >
            {filteredData.length > 0 ? (
              filteredData.map((item, index) => (
                <Grid item xs={12} sm={6} md={3} key={index}>
                  <GridCard item={item} />
                </Grid>
              ))
            ) : (
              <Typography>No projects found</Typography>
            )}
          </Grid>
        ) : (
          <Box className="list" sx={{ paddingX: "100px" }}>
            {filteredData.length > 0 ? (
              filteredData.map((item, index) => (
                <ListCard key={index} item={item} />
              ))
            ) : (
              <Typography>No projects found</Typography>
            )}
          </Box>
        )}
      </Box>

      {/* Modal for Creating a New Project */}
      <Modal
        open={isCreateModelShow}
        onClose={() => setIsCreateModelShow(false)}
        aria-labelledby="create-project-modal"
        aria-describedby="create-new-project-modal"
      >
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: "400px",
            padding: "20px",
            backgroundColor: "#141414",
            borderRadius: "10px",
            boxShadow: "0px 4px 20px rgba(0, 0, 0, 0.5)",
          }}
        >
          <Typography variant="h6" sx={{ marginBottom: "16px", color: "#fff" }}>
            Create New Project
          </Typography>

          {/* Project Title Input */}
          <TextField
            variant="outlined"
            fullWidth
            placeholder="Project Title"
            value={projTitle}
            onChange={(e) => setProjTitle(e.target.value)}
            sx={{
              backgroundColor: "#202020",
              marginBottom: "16px",
              color: "#fff",
            }}
            InputProps={{
              style: { color: "white" },
            }}
          />

          {/* Project Type Toggle Button Group */}
          <Typography sx={{ marginBottom: "8px", color: "#fff" }}>
            Select Project Type:
          </Typography>
          <ToggleButtonGroup
            value={projectType}
            exclusive
            onChange={handleToggleChange}
            color="primary"
            sx={{ marginBottom: "16px" }}
          >
            <ToggleButton value="Development" sx={{ color: "#fff" }}>
              Development
            </ToggleButton>
            <ToggleButton value="DSA" sx={{ color: "#fff" }}>
              DSA
            </ToggleButton>
          </ToggleButtonGroup>

          {/* Action Buttons */}
          <Box display="flex" justifyContent="space-between" gap="10px">
            <Button
              onClick={createProj}
              variant="contained"
              color="primary"
              sx={{ width: "100%", padding: "10px" }}
            >
              Create
            </Button>
            <Button
              onClick={() => setIsCreateModelShow(false)}
              variant="contained"
              color="secondary"
              sx={{ width: "100%", padding: "10px" }}
            >
              Cancel
            </Button>
          </Box>
        </Box>
      </Modal>
    </>
  );
};

export default Home;
