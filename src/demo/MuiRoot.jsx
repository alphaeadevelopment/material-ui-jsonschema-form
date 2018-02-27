import React from 'react';
import 'typeface-roboto'; // eslint-disable-line import/extensions
import Reboot from 'material-ui/Reboot';

import { MuiThemeProvider } from 'material-ui/styles';
import theme from './theme';

export default ({ children }) => (
  <MuiThemeProvider theme={theme}>
    <Reboot />
    {children}
  </MuiThemeProvider>
);
