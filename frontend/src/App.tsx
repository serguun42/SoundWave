import {
  Route,
  Navigate,
  createBrowserRouter,
  createRoutesFromElements,
  RouterProvider,
} from 'react-router-dom';
import { Root } from './pages/Root';
import { Auth } from './pages/Auth';
import { Documentation } from './pages/Documentation';
import { Home } from './pages/Home';
import { Playlist } from './pages/Playlist';
import { Error } from './pages/Error';

const router = createBrowserRouter(
  createRoutesFromElements(
    <>
      <Route path="/" element={<Root />}>
        <Route index element={<Navigate to="home" />} />
        <Route path="auth" element={<Auth />} />
        <Route path="home" element={<Home />} />
        <Route path="playlist:id" element={<Playlist />} />
      </Route>,
      <Route path="docs" element={<Documentation />} />
      <Route path="*" element={<Error />} />
    </>,
  ),
);

function App() {
  return (
    <RouterProvider router={router} />
  );
}

export { App };
