import {
  Route,
  Navigate,
  createBrowserRouter,
  createRoutesFromElements,
  RouterProvider,
} from 'react-router-dom';
import { Spinner } from './components/Spinner';
import { Root } from './pages/Root';
import { Auth } from './pages/Auth';
import { Documentation } from './pages/Documentation';
import { Home } from './pages/Home';
import { LikedPlaylists } from './pages/LikedPlaylists';
import { Playlist } from './pages/Playlist';
import { Error } from './pages/Error';

function App() {
  const router = createBrowserRouter(
    createRoutesFromElements(
      <>
        <Route path="/" element={<Root />}>
          <Route index element={<Navigate to="home" />} />
          <Route path="home" element={<Home />} />
          <Route path="likedPlaylists" element={<LikedPlaylists />} />
          <Route path="playlist/:type" element={<Playlist />} />
        </Route>,
        <Route path="auth" element={<Auth />} />
        <Route path="docs" element={<Documentation />} />
        <Route path="*" element={<Error />} />
      </>,
    ),
  );

  return (
    <>
      <RouterProvider router={router} />
      <Spinner />
    </>
  );
}

export { App };
