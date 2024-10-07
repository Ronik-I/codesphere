import React, { useEffect, useState } from "react";
import Editor from "@monaco-editor/react";
import axios from "axios";
import {
  Box,
  Button,
  Select,
  MenuItem,
  TextField,
  Typography,
  CircularProgress,
  Grid,
  Paper,
  InputLabel,
  FormControl,
} from "@mui/material";
import PlayArrowIcon from "@mui/icons-material/PlayArrow"; // Icon for the "Run Code" button
import CodeIcon from "@mui/icons-material/Code"; // Icon for the code section
import InputIcon from "@mui/icons-material/Input"; // Icon for the input section
import OutputIcon from "@mui/icons-material/Output"; // Icon for the output section
import { api_base_url } from "../helper";
import { useParams } from "react-router-dom";

const Judge0Component = () => {
  const [code, setCode] = useState(""); // State to hold the code
  const [language, setLanguage] = useState("python"); // Default language is Python
  const [input, setInput] = useState(""); // Input for the code
  const [output, setOutput] = useState(""); // Output from Judge0
  const [loading, setLoading] = useState(false); // State to track loading
  const [projectTitle, setProjectTitle] = useState("Code");

  // Supported languages and their IDs in Judge0
  const languageOptions = [
    { id: 45, label: "Assembly (NASM 2.14.02)" },
    { id: 46, label: "Bash (5.0.0)" },
    { id: 47, label: "Basic (FBC 1.07.1)" },
    { id: 104, label: "C (Clang 18.1.8)" },
    { id: 75, label: "C (Clang 7.0.1)" },
    { id: 76, label: "C++ (Clang 7.0.1)" },
    { id: 103, label: "C (GCC 14.1.0)" },
    { id: 105, label: "C++ (GCC 14.1.0)" },
    { id: 48, label: "C (GCC 7.4.0)" },
    { id: 52, label: "C++ (GCC 7.4.0)" },
    { id: 49, label: "C (GCC 8.3.0)" },
    { id: 53, label: "C++ (GCC 8.3.0)" },
    { id: 50, label: "C (GCC 9.2.0)" },
    { id: 54, label: "C++ (GCC 9.2.0)" },
    { id: 86, label: "Clojure (1.10.1)" },
    { id: 51, label: "C# (Mono 6.6.0.161)" },
    { id: 77, label: "COBOL (GnuCOBOL 2.2)" },
    { id: 55, label: "Common Lisp (SBCL 2.0.0)" },
    { id: 90, label: "Dart (2.19.2)" },
    { id: 56, label: "D (DMD 2.089.1)" },
    { id: 57, label: "Elixir (1.9.4)" },
    { id: 58, label: "Erlang (OTP 22.2)" },
    { id: 44, label: "Executable" },
    { id: 87, label: "F# (.NET Core SDK 3.1.202)" },
    { id: 59, label: "Fortran (GFortran 9.2.0)" },
    { id: 60, label: "Go (1.13.5)" },
    { id: 95, label: "Go (1.18.5)" },
    { id: 88, label: "Groovy (3.0.3)" },
    { id: 61, label: "Haskell (GHC 8.8.1)" },
    { id: 96, label: "JavaFX (JDK 17.0.6, OpenJFX 22.0.2)" },
    { id: 91, label: "Java (JDK 17.0.6)" },
    { id: 62, label: "Java (OpenJDK 13.0.1)" },
    { id: 63, label: "JavaScript (Node.js 12.14.0)" },
    { id: 93, label: "JavaScript (Node.js 18.15.0)" },
    { id: 97, label: "JavaScript (Node.js 20.17.0)" },
    { id: 102, label: "JavaScript (Node.js 22.08.0)" },
    { id: 78, label: "Kotlin (1.3.70)" },
    { id: 64, label: "Lua (5.3.5)" },
    { id: 89, label: "Multi-file program" },
    { id: 79, label: "Objective-C (Clang 7.0.1)" },
    { id: 65, label: "OCaml (4.09.0)" },
    { id: 66, label: "Octave (5.1.0)" },
    { id: 67, label: "Pascal (FPC 3.0.4)" },
    { id: 85, label: "Perl (5.28.1)" },
    { id: 68, label: "PHP (7.4.1)" },
    { id: 98, label: "PHP (8.3.11)" },
    { id: 43, label: "Plain Text" },
    { id: 69, label: "Prolog (GNU Prolog 1.4.5)" },
    { id: 70, label: "Python (2.7.17)" },
    { id: 92, label: "Python (3.11.2)" },
    { id: 100, label: "Python (3.12.5)" },
    { id: 71, label: "Python (3.8.1)" },
    { id: 80, label: "R (4.0.0)" },
    { id: 99, label: "R (4.4.1)" },
    { id: 72, label: "Ruby (2.7.0)" },
    { id: 73, label: "Rust (1.40.0)" },
    { id: 81, label: "Scala (2.13.2)" },
    { id: 82, label: "SQL (SQLite 3.27.2)" },
    { id: 83, label: "Swift (5.2.3)" },
    { id: 74, label: "TypeScript (3.7.4)" },
    { id: 94, label: "TypeScript (5.0.3)" },
    { id: 101, label: "TypeScript (5.6.2)" },
    { id: 84, label: "Visual Basic.Net (vbnc 0.0.0.5943)" },
    // Add more languages as needed
  ];
  const { projectID } = useParams();
  useEffect(() => {
    // Fetch project details using axios
    const getProject = async () => {
      try {
        const response = await axios.post(`${api_base_url}/getProject`, {
          userId: localStorage.getItem("userId"),
          projId: projectID, // projectID from useParams
        });

        const data = response.data;

        // Assuming the response structure contains the 'project' field
        if (data && data.project) {
          setCode(data.project.code); // Set HTML code from project
          setInput(data.project.input); // Set CSS code from project
          setLanguage(data.project.language); // Set JS code from project
          setProjectTitle(data.project.title); // Set project title
          // Uncomment if you want to set project type as well
          // setProjectType(data.project.type);
        } else {
          console.log("Project data is not available.");
        }
      } catch (error) {
        console.error("Error fetching project details:", error);
        alert("Failed to fetch project details. Please try again.");
      }
    };

    getProject();
  }, [projectID]); // Dependency array includes projectID to re-fetch data if it changes

  const saveProject = async () => {
    try {
      const response = await axios.post(`${api_base_url}/updateProject`, {
        userId: localStorage.getItem("userId"),
        projId: projectID,
        code: code,
        language: language,
        input: input,
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
  };

  // Handle keydown event for saving on Ctrl + S
  useEffect(() => {
    const handleKeyDown = (event) => {
      if ((event.ctrlKey || event.metaKey) && (event.key === "s" || event.key === "S" ) ) {
        event.preventDefault();
        saveProject(); // Call saveProject when Ctrl + S is pressed
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [code, language, input]);

  const handleRunCode = async () => {
    setLoading(true);

    const selectedLanguage = languageOptions.find(
      (opt) => opt.label.toLowerCase() === language
    );
    if (!selectedLanguage) return;

    try {
      // Base64 encode the source code and input
      const sourceCode = btoa(code);
      const stdin = btoa(input);

      const postOptions = {
        method: "POST",
        url: "https://judge0-ce.p.rapidapi.com/submissions",
        params: {
          base64_encoded: "true",
          wait: "false",
          fields: "*",
        },
        headers: {
          "x-rapidapi-key":
          import.meta.env.VITE_X_RAPIDAPI_KEY,
          "x-rapidapi-host": "judge0-ce.p.rapidapi.com",
          "Content-Type": "application/json",
        },
        data: {
          language_id: selectedLanguage.id,
          source_code: sourceCode,
          stdin: stdin,
        },
      };

      // Send code submission request
      const response = await axios.request(postOptions);
      const token = response.data.token;

      // Poll the result after submission
      setTimeout(async () => {
        try {
          const getOptions = {
            method: "GET",
            url: `https://judge0-ce.p.rapidapi.com/submissions/${token}`,
            params: {
              base64_encoded: "true",
              fields: "*",
            },
            headers: {
              "x-rapidapi-key":
                import.meta.env.VITE_X_RAPIDAPI_KEY,
              "x-rapidapi-host": "judge0-ce.p.rapidapi.com",
            },
          };

          // Fetch the result
          const result = await axios.request(getOptions);

          // Decode and set the output (stdout or stderr)
          const decodedOutput = atob(
            result.data.stdout || result.data.stderr || "No output"
          );
          setOutput(decodedOutput);
        } catch (error) {
          console.error("Error fetching output:", error);
          setOutput("Error fetching output");
        } finally {
          setLoading(false);
        }
      }, 1500);
    } catch (error) {
      console.error("Error running code:", error);
      setOutput("Error submitting code");
      setLoading(false);
    }
  };
  const downloadProject = () => {
    const blob = new Blob([code], { type: "text" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${projectTitle || "project"}.txt`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  return (
    <Box
      sx={{
        padding: "5px",
        alignItems: "center",
        display: "flex",
        flexDirection: "column",
      }}
    >
      <Typography variant="h4" sx={{ marginBottom: "0px" }}>
        <CodeIcon sx={{ marginRight: "8px" }} />
        {projectTitle}
      </Typography>

      <Grid container spacing={2}>
        {/* Language Dropdown */}
        <Grid container item xs={12} justifyContent="space-between" spacing={2}>
          <Grid item>
            <FormControl sx={{ width: "300px" }}>
              <InputLabel>Language</InputLabel>
              <Select
                size={"small"}
                value={language}
                onChange={(e) => setLanguage(e.target.value)}
              >
                {languageOptions.map((opt) => (
                  <MenuItem key={opt.id} value={opt.label.toLowerCase()}>
                    {opt.label}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          <Grid item>
            <Button
              variant="contained"
              color="primary"
              onClick={handleRunCode}
              disabled={loading}
              startIcon={<PlayArrowIcon />}
              sx={{ width: "200px" }}
            >
              {loading ? <CircularProgress size={24} /> : "Run Code"}
            </Button>
            <Button
              variant="contained"
              onClick={downloadProject}
              sx={{ marginLeft: "10px" }}
            >
              Download Project
            </Button>
          </Grid>
        </Grid>

        {/* Code Editor */}
        <Grid item xs={7} md={7}>
          <Paper elevation={3} sx={{ padding: "16px" }}>
            <Typography variant="h6" gutterBottom>
              <CodeIcon sx={{ marginRight: "8px" }} />
              Code
            </Typography>
            <Editor
              height="20rem"
              language={"python"}
              value={code}
              onChange={(value) => setCode(value || "")}
              theme={"vs-dark"}
            />
          </Paper>
        </Grid>

        {/* Input Field */}
        <Grid item container xs={5} md={5} direction="column">
          <Grid item xs={6} md={6}>
            <Paper elevation={3} sx={{ padding: "16px" }}>
              <Typography variant="h6" gutterBottom>
                <InputIcon sx={{ marginRight: "8px" }} />
                Input
              </Typography>
              <TextField
                label="Input"
                multiline
                rows={4}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                fullWidth
              />
            </Paper>
          </Grid>

          <Grid item xs={6} md={5.5}>
            <Paper elevation={3} sx={{ padding: "16px", height: "100%" }}>
              <Typography variant="h6" gutterBottom>
                <OutputIcon sx={{ marginRight: "8px" }} />
                Output
              </Typography>
              <Typography variant="body1" sx={{ whiteSpace: "pre-wrap" }}>
                {output}
              </Typography>
            </Paper>
          </Grid>
        </Grid>

        {/* Output Display */}
      </Grid>
    </Box>
  );
};

export default Judge0Component;
