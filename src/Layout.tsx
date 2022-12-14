import React from 'react';
import { AppBar, Container, CssBaseline, IconButton, Toolbar, Typography } from "@mui/material";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { Brightness4, Brightness7 } from '@mui/icons-material';
import App from "./App";

const ColorModeContext = React.createContext({
    toggleColorMode: () => {}
});

export enum ThemeKeys {
    PALETTE_MODE = "PALLETE_MODE"
}

const Layout = () => {
    const [mode, setMode] = React.useState<"light" | "dark">("light");
    React.useEffect(() => {
        setMode(localStorage.getItem(ThemeKeys.PALETTE_MODE) === "dark" ? "dark" : "light");
    }, []);
    React.useEffect(() => {
        localStorage.setItem(ThemeKeys.PALETTE_MODE, mode);
    }, [mode]);
    const colorMode = React.useMemo(() => ({
        toggleColorMode: () => {
            setMode((prevMode) => (prevMode === "light" ? "dark" : "light"));
        }
    }), []);
    const theme = React.useMemo(() => {
        return createTheme({
            palette: {
                mode
            },
            typography: {
                fontSize: 12,
            }
        });
    }, [mode]);

    return (
        <ColorModeContext.Provider value={colorMode}>
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
                        <Typography
                            variant="h6"
                            color="inherit"
                            noWrap
                            sx={{ flexGrow: 1 }}
                        >
                            NIKKE Simulator
                        </Typography>
                        <IconButton
                            sx={{ml: 1}}
                            onClick={colorMode.toggleColorMode}
                            color="inherit"
                        >
                            {theme.palette.mode === "dark" ? <Brightness7 /> : <Brightness4 />}
                        </IconButton>
                    </Toolbar>
                </AppBar>
                <Container component="main" maxWidth="sm" sx={{mb: 4}}>
                    <App />
                </Container>
            </ThemeProvider>
        </ColorModeContext.Provider>
    );

};

export default Layout;