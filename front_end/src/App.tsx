import "bootstrap/dist/css/bootstrap.min.css";
import { lazy, Suspense } from "react";
import React from "react";
import { Route, Switch } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import NavigationBar from "./modules/navigation/NavigationBar";

const HomePage = lazy(() => import("./modules/homepage/HomePage"));
const NotFoundPage = lazy(() => import("./modules/NotFoundPage"));
const ToDoPage = lazy(() => import("./modules/todopage/ToDoPage"));
const ProfilePage = lazy(() => import("./modules/profile/ProfilePage"));
const GymsPage = lazy(() => import("./modules/gyms/GymsPage"));

const App: React.FC = () => {
  return (
    <div className="container-fluid">
      <ToastContainer autoClose={3000} hideProgressBar={true} />
      <NavigationBar />
      <Suspense fallback={<div />}>
        <Switch>
          <Route exact={true} path="/" component={HomePage} />
          <Route exact={true} path="/index" component={HomePage} />
          <Route path="/todo" component={ToDoPage} />
          <Route path="/profile" component={ProfilePage} />
          <Route path="/gyms" component={GymsPage} />
          <Route component={NotFoundPage} />
        </Switch>
      </Suspense>
    </div>
  );
};

export default React.memo(App);