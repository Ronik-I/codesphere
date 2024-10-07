import { useEffect, useState } from 'react';
import Editor from '@monaco-editor/react';
import { MdLightMode } from 'react-icons/md';
import { AiOutlineExpandAlt } from "react-icons/ai";
import { api_base_url } from '../helper';
import { useParams } from 'react-router-dom';
import { IconButton, Button, Paper, Box, Typography, Tabs, Tab } from '@mui/material';
import axios from 'axios';

const EditorComponent = () => {
  const [tab, setTab] = useState("html");
  const [isLightMode, setIsLightMode] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [htmlCode, setHtmlCode] = useState("<h1>Hello world</h1>");
  const [cssCode, setCssCode] = useState("body { background-color: #f4f4f4; }");
  const [jsCode, setJsCode] = useState("// some comment");
  const [projectTitle, setProjectTitle] = useState('');

  const { projectID } = useParams();

  const changeTheme = () => {
    const body = document.body;
    if (isLightMode) {
      body.classList.remove("lightMode");
      setIsLightMode(false);
    } else {
      body.classList.add("lightMode");
      setIsLightMode(true);
    }
  };

  const run = () => {
    const html = htmlCode;
    const css = `<style>${cssCode}</style>`;
    const js = `<script>${jsCode}</script>`;
    const iframe = document.getElementById("iframe");

    if (iframe) {
      iframe.srcdoc = html + css + js;
    }
  };

  useEffect(() => {
    setTimeout(() => {
      run();
    }, 200);
  }, [htmlCode, cssCode, jsCode]);

  useEffect(() => {
    const getProject = async () => {
      try {
        const response = await axios.post(`${api_base_url}/getProject`, {
          userId: localStorage.getItem("userId"),
          projId: projectID,
        });

        const data = response.data;
        setHtmlCode(data.project.htmlCode);
        setCssCode(data.project.cssCode);
        setJsCode(data.project.jsCode);
        setProjectTitle(data.project.title);
      } catch (error) {
        console.error("Error fetching project details:", error);
        alert("Failed to fetch project details. Please try again.");
      }
    };

    getProject();
  }, [projectID]);

  useEffect(() => {
    const handleKeyDown = async (event) => {
      if (event.ctrlKey &&  (event.key === "s" || event.key === "S" )) {
        event.preventDefault();

        try {
          const response = await axios.post(`${api_base_url}/updateProject`, {
            userId: localStorage.getItem("userId"),
            projId: projectID,
            htmlCode: htmlCode,
            cssCode: cssCode,
            jsCode: jsCode,
          });

          const data = response.data;
          if (data.success) {
            alert("Project saved successfully");
          } else {
            alert("Something went wrong");
          }
        } catch (error) {
          console.error("Error saving project:", error);
          alert("Failed to save project. Please try again.");
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [projectID, htmlCode, cssCode, jsCode]);

  const handleTabChange = (event, newValue) => {
    setTab(newValue);
  };

  // Function to download the entire HTML document
  const downloadProject = () => {
    const fullHtmlDocument = `  ${htmlCode}
    <style>${cssCode}</style>
    <script>${jsCode}</script>    `;
    const blob = new Blob([fullHtmlDocument], { type: 'text/html' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${projectTitle || 'project'}.html`; // Use project title for the file name
    a.click();
    window.URL.revokeObjectURL(url);
  };

  return (
    <>
      {/* AppBar as the top navbar */}
      <Box 
        sx={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center', 
          height: '40px', 
          backgroundColor: isLightMode ? 'white' : '#141414', 
          padding: '0 16px',
          boxShadow: 1
        }}
      >
        <Typography variant="body2">
          {projectTitle}
        </Typography>
        
        <Box>
          {/* <IconButton onClick={changeTheme} color="inherit">
            <MdLightMode />
          </IconButton> */}
          <IconButton onClick={() => setIsExpanded(!isExpanded)} color="inherit">
            <AiOutlineExpandAlt />
          </IconButton>
          <Button variant="contained" onClick={downloadProject} sx={{ marginLeft: '10px' }}>
            Download Project
          </Button>
        </Box>
      </Box>

      {/* Main content area */}
      <Box display="flex" >
        {/* Left side editor with tabs */}
        <Paper elevation={2} sx={{ width: isExpanded ? '100%' : '50%', marginRight: 2 }}>
          <Tabs
            value={tab}
            onChange={handleTabChange}
            variant="fullWidth"
            textColor="primary"
            indicatorColor="primary"
            sx={{ minHeight: "40px", height: "40px", padding: 0 }}
          >
            <Tab label="HTML" value="html" />
            <Tab label="CSS" value="css" />
            <Tab label="JavaScript" value="js" />
          </Tabs>

          {/* Monaco Editor */}
          <Box>
            {tab === "html" ? (
              <Editor
                height="80vh"
                theme={isLightMode ? "vs-light" : "vs-dark"}
                language="html"
                value={htmlCode}
                onChange={(value) => {
                  setHtmlCode(value || "");
                  run();
                }}
              />
            ) : tab === "css" ? (
              <Editor
                height="80vh"
                theme={isLightMode ? "vs-light" : "vs-dark"}
                language="css"
                value={cssCode}
                onChange={(value) => {
                  setCssCode(value || "");
                  run();
                }}
              />
            ) : (
              <Editor
                height="80vh"
                theme={isLightMode ? "vs-light" : "vs-dark"}
                language="javascript"
                value={jsCode}
                onChange={(value) => {
                  setJsCode(value || "");
                  run();
                }}
              />
            )}
          </Box>
        </Paper>

        {/* Right side output iframe */}
        {!isExpanded && (
          <Paper elevation={2} sx={{ width: '50%' }}>
            <iframe
              className='bg-white'
              id="iframe"
              style={{ width: '100%', height: '100%', border: 'none' }}
              title="output"
            />
          </Paper>
        )}
      </Box>
    </>
  );
};

export default EditorComponent;
