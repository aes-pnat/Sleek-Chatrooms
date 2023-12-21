import { ThemeOptions, createTheme } from "@mui/material/styles";
import { darkScrollbar } from "@mui/material";

const darkTheme: ThemeOptions = createTheme({
  palette: {
    mode: "dark",
    // primary: {
    //   main: "#3f51b5",
    // },
    // secondary: {
    //   main: "#f50057",
    // },
  },
  components: {
    MuiCssBaseline: {
      styleOverrides: (themeParam) => ({
        body: themeParam.palette.mode === "dark" ? darkScrollbar() : null,
      }),
    },
  },
});

const lightTheme: ThemeOptions = createTheme({
  palette: {
    mode: "light",
    // primary: {
    //   main: "#3f51b5",
    // },
    // secondary: {
    //   main: "#f50057",
    // },
  },
});

export const themes = {
  dark: darkTheme,
  light: lightTheme,
};
