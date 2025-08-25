import HomeTemplate from "../pages/HomeTemplate";
import HomePage from "../pages/HomeTemplate/HomePage";

import ListMoviePage from "../pages/HomeTemplate/ListMoviePage";
import NewsPage from "../pages/HomeTemplate/NewsPage";
import LoginPage from "../pages/HomeTemplate/LoginPage";
import RegisterPage from "../pages/HomeTemplate/RegisterPage";
import MovieDetail from "../pages/HomeTemplate/MovieDetail";
import TicketRoom from "../pages/HomeTemplate/TicketRoom";
import ProfilePage from "../pages/HomeTemplate/ProfilePage";
import CinemasPage from "../pages/HomeTemplate/CinemasPage";

import AdminTemplate from "../pages/AdminTemplate";
import Dashboard from "../pages/AdminTemplate/Dashboard";
import AddUserPage from "../pages/AdminTemplate/AddUserPage";
import AuthPage from "../pages/AdminTemplate/AuthPage";
import FilmManagement from "../pages/AdminTemplate/FilmManagement";
import AddFilm from "../pages/AdminTemplate/FilmManagement/AddFilm";
import EditFilm from "../pages/AdminTemplate/FilmManagement/EditFilm";
import Showtime from "../pages/AdminTemplate/FilmManagement/Showtime";
import AdminProfilePage from "../pages/AdminTemplate/ProfilePage";
import { Route } from "react-router-dom";

const routes = [
  {
    path: "",
    element: HomeTemplate,
    nested: [
      {
        path: "",
        element: HomePage,
      },

      {
        path: "list-movie",
        element: ListMoviePage,
      },
      {
        path: "cinemas",
        element: CinemasPage,
      },
      {
        path: "cinema/:id",
        element: CinemasPage,
      },
      {
        path: "news",
        element: NewsPage,
      },
      {
        path: "login",
        element: LoginPage,
      },
      {
        path: "register",
        element: RegisterPage,
      },
      {
        path: "movie/:id",
        element: MovieDetail,
      },
      {
        path: "dat-ve/:id",
        element: TicketRoom,
      },
      {
        path: "ticket-room/:id",
        element: TicketRoom,
      },
      {
        path: "profile",
        element: ProfilePage,
      },
    ],
  },
  {
    path: "admin",
    element: AdminTemplate,
    nested: [
      {
        path: "",
        element: Dashboard,
      },
      {
        path: "dashboard",
        element: Dashboard,
      },
      {
        path: "add-user",
        element: AddUserPage,
      },
      {
        path: "films",
        element: FilmManagement,
      },
      {
        path: "films/addnew",
        element: AddFilm,
      },
      {
        path: "films/edit/:id",
        element: EditFilm,
      },
      {
        path: "films/showtime/:id",
        element: Showtime,
      },
      {
        path: "showtimes",
        element: Showtime,
      },
      {
        path: "profile",
        element: AdminProfilePage,
      },
    ],
  },
  {
    path: "admin/login",
    element: AuthPage,
  },
];

export const generateRoutes = () => {
  return routes.map((route) => {
    if (route.nested) {
      return (
        <Route key={route.path} path={route.path} element={<route.element />}>
          {route.nested.map((item) => (
            <Route
              key={item.path}
              path={item.path}
              element={<item.element />}
            />
          ))}
        </Route>
      );
    } else {
      return (
        <Route key={route.path} path={route.path} element={<route.element />} />
      );
    }
  });
};
