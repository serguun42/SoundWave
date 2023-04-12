import { RouterProvider, createBrowserRouter } from 'react-router-dom';
import Root from './pages/Root';
import Auth from './pages/Auth';
import Error from './pages/Error';
import Main from './components/Main';
import Playlist from './components/Playlist';

const router = createBrowserRouter([
  {
    path: '/',
    element: <Root />,
    errorElement: <Error />,
    children: [
      {
        path: '',
        element: <Main />,
      },
      {
        path: 'playlist/:id',
        element: <Playlist />,
      },
    ],
  },
  {
    path: 'auth',
    element: <Auth />,
  },
]);

export default function App() {
  return (
    <RouterProvider router={router} />
  );
}
