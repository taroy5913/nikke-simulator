import { AppBar, Box, Container, CssBaseline, Grid, Toolbar, Typography } from "@mui/material";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import App from "./App";

const Layout = () => {
   const theme = createTheme({
    typography: {
        fontSize: 12,
    }
   });
    return (
        <ThemeProvider theme={theme}>
            <CssBaseline />
            <AppBar
                position="absolute"
                color="default"
                elevation={0}
                sx={{
                    position: "relative",
                    borderBottom: (t) => `1px solid $(t.pallet.divider)`,
                }}
            >
                <Toolbar>
                    <Typography variant="h6" color="inherit" noWrap>
                        NIKKE Simulator
                    </Typography>
                </Toolbar>
            </AppBar>
            <Container component="main" maxWidth="sm" sx={{mb: 4}}>
                <App />
            </Container>
        </ThemeProvider>
    );

};

export default Layout;