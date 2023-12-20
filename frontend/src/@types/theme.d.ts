import { Theme, ThemeOptions } from "@mui/material/styles";

declare module "@mui/material/styles" {
  interface CustomTheme extends Theme {
    status: {
      danger: string;
    };
  }
  // allow configuration using `createTheme`
  interface CustomThemeOptions extends ThemeOptions {
    status?: {
      danger?: string;
    };
    palette?: {
      primary?: object;
      secondary?: object;
      background?: object;
    };
    typography?: object;
  }
  export function createTheme(options?: CustomThemeOptions): CustomTheme;
}
