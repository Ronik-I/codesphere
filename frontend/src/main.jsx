import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import { createTheme } from '@mui/material/styles'; // Changed from createMuiTheme
import { ThemeProvider } from '@mui/material/styles'; // Changed from @material-ui/styles
import CssBaseline from '@mui/material/CssBaseline'; // Changed from @material-ui/core/CssBaseline

const theme = createTheme({
  palette: {
    mode: 'dark', // `type` is replaced with `mode` in MUI v5
  },
});

createRoot(document.getElementById('root')).render(
  <StrictMode>
     <ThemeProvider theme={theme}>
     <CssBaseline />
    <App />
     </ThemeProvider>
  </StrictMode>
)
