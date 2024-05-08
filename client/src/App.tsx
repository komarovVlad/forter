import { Provider } from 'react-redux';
import { Chat } from './pages/Chat';
import { store } from './store';
import { createTheme, ThemeProvider } from '@mui/material';

const theme = createTheme();

function App() {
  return (
    <Provider store={store}>
      <ThemeProvider theme={theme}>
        <Chat />
      </ThemeProvider>
    </Provider>
  );
}

export default App;
