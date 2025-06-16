import React from "react";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import HomePage from "./pages/HomePage";
import ChalkBoxDashboard from "./components/dashboard/ChalkBoxDashboard";
import Dashboard from "./components/dashboard/Dashboard";
import MyWorkshop from "./components/dashboard/workshop/MyWorkshop";
import JoinWorkshops from "./components/dashboard/workshop/JoinWorkshops";
import LoginForm from "./components/form/LoginForm";
import StudentProfile from "./components/dashboard/profile/StudentProfile";
import OpenSourceProjectsFeed from "./components/dashboard/forum/OpenSourceProjectsFeed";
import FreelanceProjectFeed from "./components/dashboard/freelance/FreelanceProjectFeed";
import ChalkBoxEmployerDashboard from "./components/edasboard/ChalkBoxEmployerDashboard";
import EDashboard from "./components/edasboard/EDashboard";
import JobPostingForm from "./components/edasboard/FreelanceProjectForm ";
import Collaboration from "./components/edasboard/Collaboration";
import FreelanceProjectForm from "./components/edasboard/FreelanceProjectForm ";
import EmployerJobDashboard from "./components/edasboard/EmployerJobDashboard";
import OpenSourceContributions from "./components/edasboard/OpenSourceContributions";
import CompanyProfile from "./components/edasboard/CompanyProfile";
import ProposalInvitationsPanel from "./components/dashboard/freelance/ProposalInvitationsPanel";
import WorkshopRequests from "./components/dashboard/workshop/WorkshopRequests";

// Import dispute components
import DisputeList from "./components/disputes/DisputeList";
import DisputeDetail from "./components/disputes/DisputeDetail";
import DisputeForm from "./components/disputes/DisputeForm";
import TokenRewards from "./components/disputes/TokenRewards";

// Import contract components
import ContractList from "./components/contracts/ContractList";
import ContractDetail from "./components/contracts/ContractDetail";

const App = () => {
  const router = createBrowserRouter([
    {
      path: "/",
      element: <HomePage />,
    },
    {
      path: "/login",
      element: <LoginForm />,
    },
    {
      path: "/employer-dashboard",
      element: <ChalkBoxEmployerDashboard />,
      children: [
        {
          path: "",
          element: <EDashboard />,
        },
        {
          path: "/employer-dashboard/post-open-source-project",
          element: <Collaboration />,
        },
        {
          path: "/employer-dashboard/active-jobs",
          element: <EmployerJobDashboard />,
        },
        {
          path: "/employer-dashboard/post-job",
          element: <FreelanceProjectForm />,
        },
        {
          path: "/employer-dashboard/opensource-contributer",
          element: <OpenSourceContributions />,
        },
        {
          path: "/employer-dashboard/company-profile",
          element: <CompanyProfile />,
        },
        // Contract routes for employer
        {
          path: "/employer-dashboard/contracts",
          element: <ContractList />,
        },
        {
          path: "/employer-dashboard/contracts/:id",
          element: <ContractDetail />,
        },
        {
          path: "/employer-dashboard/contracts/active",
          element: <ContractList status="active" />,
        },
        {
          path: "/employer-dashboard/contracts/completed",
          element: <ContractList status="completed" />,
        },
        // Add dispute routes for employer
        {
          path: "/employer-dashboard/disputes",
          element: <DisputeList />,
        },
        {
          path: "/employer-dashboard/disputes/:id",
          element: <DisputeDetail />,
        },
        {
          path: "/employer-dashboard/disputes/raise",
          element: <DisputeForm />,
        },
        {
          path: "/employer-dashboard/disputes/rewards",
          element: <TokenRewards />,
        },
      ],
    },

    {
      path: "/dashboard",
      element: <ChalkBoxDashboard />,
      children: [
        {
          path: "",
          element: <Dashboard />,
        },
        {
          path: "/dashboard/my-workshops",
          element: <MyWorkshop />,
        },
        {
          path: "/dashboard/join-workshops",
          element: <JoinWorkshops />,
        },
        {
          path: "/dashboard/workshops-requests",
          element: <WorkshopRequests />,
        },
        {
          path: "/dashboard/profile",
          element: <StudentProfile />,
        },
        {
          path: "/dashboard/collaborate",
          element: <OpenSourceProjectsFeed />,
        },
        {
          path: "/dashboard/freelance-feed",
          element: <FreelanceProjectFeed />,
        },
        {
          path:"/dashboard/freelance-feed/invite",
          element:<ProposalInvitationsPanel />
        },
        // Contract routes
        {
          path: "/dashboard/contracts",
          element: <ContractList />,
        },
        {
          path: "/dashboard/contracts/:id",
          element: <ContractDetail />,
        },
        {
          path: "/dashboard/contracts/active",
          element: <ContractList status="active" />,
        },
        {
          path: "/dashboard/contracts/completed",
          element: <ContractList status="completed" />,
        },
        // Add dispute routes for student
        {
          path: "/dashboard/disputes",
          element: <DisputeList />,
        },
        {
          path: "/dashboard/disputes/:id",
          element: <DisputeDetail />,
        },
        {
          path: "/dashboard/disputes/raise",
          element: <DisputeForm />,
        },
        {
          path: "/dashboard/disputes/rewards",
          element: <TokenRewards />,
        },
      ],
    },
  ]);

  return (
    <>
      <RouterProvider router={router} />
    </>
  );
};

export default App;
