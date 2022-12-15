import React from 'react';
import { AppBar, Button, Container, CssBaseline, IconButton, Toolbar, Typography } from "@mui/material";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { Brightness4, Brightness7 } from '@mui/icons-material';
import App from "./App";
import LevelUpPanel from './LevelUpPanel';

const ColorModeContext = React.createContext({
    toggleColorMode: () => {}
});

export enum ThemeKeys {
    PALETTE_MODE = "PALLETE_MODE"
}

const Layout = () => {
    const [mode, setMode] = React.useState<"light" | "dark">("light");
    const [isLevelUpMode, setIsLevelUpMode] = React.useState<boolean>(false);
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

                        <Button
                            color="inherit"
                            onClick={e => setIsLevelUpMode(false)}
                            sx={{ my: 2, display: 'block' }}
                        >3凸5体
                        </Button>
                        <Button
                            color="inherit"
                            onClick={e => setIsLevelUpMode(true)}
                            sx={{ my: 2, display: 'block' }}
                        >素材
                        </Button>

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
                    {isLevelUpMode ? <LevelUpPanel /> : <App />}
                </Container>
            </ThemeProvider>
        </ColorModeContext.Provider>
    );

};

export default Layout;