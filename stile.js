import { createTheme } from '@mui/material/styles';

const theme = createTheme({
    palette: {
      primary: {
        light: '#b0bec5',
        main: '#3f50b5',
        dark: '#002884',
        contrastText: '#fff',
      },
      secondary: {
        light: '#b0bec5',
        main: '#f44336',
        dark: '#ba000d',
        contrastText: '#000',
      },
    },
  });
const sx_header = {
    backgroundColor: theme.palette.primary.light
}
const sx_headerBorrow = {
    backgroundColor: theme.palette.secondary.light
}

const sx_card = {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'baseline',
    mb: 2,
}
export {sx_header, sx_card, sx_headerBorrow, theme}