import { createBrowserRouter } from 'react-router-dom';

import { MainLayout }  from '../layouts/MainLayout';
import { AdminLayout } from '../layouts/Adminlayout/AdminLayout';

import { Home }           from '../pages/Home/Home';
import { SearchMagazines } from '../pages/SearchMagazine/SearchMagazines';
import { Login }          from '../pages/Login/Login';
import { CreateAccount }  from '../pages/Register/CreateAccount';
import { ForgotPassword } from '../pages/ForgotPassword/ForgotPassword';
import { ResetPassword }  from '../pages/ResetPassword/ResetPassword';
import { SuggestMagazine } from '../pages/SuggestMagazine/SuggestMagazine';
import { UserDashboard }  from '../pages/UserDashboard/UserDashboard';
import { Profile }        from '../pages/Profile/Profile';

import { AdminDashboard }       from '../pages/admin/Dashboard/AdminDashboard';
import { AdminMagazines }       from '../pages/admin/Magazines/AdminMagazines';
import { MagazineCreate }       from '../pages/admin/MagazinesCreate/MagazineCreate';
import { MagazineDetails }      from '../pages/admin/MagazinesDetails/MagazineDetails';
import { AdminSubmissions }     from '../pages/admin/Submissions/AdminSubmissions';
import { SubmissionsDetailsPage } from '../pages/admin/SubmissionsDetails/SubmissionsDetails';
import { AdminCategories }      from '../pages/admin/Categories/AdminCategories';
import { CategoriesCreate }     from '../pages/admin/CategoriesCreate/CategoriesCreate';
import { UsersManagement }      from '../pages/admin/Users/UsersManagement';
import { AdminCreate }          from '../pages/admin/AdminCreate/AdminCreate';

import { NotFound }      from '../pages/Errors/NotFound';
import { ProtectedRoute } from './ProtectedRoute';

export const router = createBrowserRouter([
  {
    path: '/',
    element: <MainLayout />,
    children: [
      { index: true,             element: <Home /> },
      { path: 'search',          element: <SearchMagazines /> },
      { path: 'login',           element: <Login /> },
      { path: 'register',        element: <CreateAccount /> },
      { path: 'forgot-password', element: <ForgotPassword /> },
      { path: 'reset-password',  element: <ResetPassword /> },
      {
        path: 'suggest-magazine',
        element: (
          <ProtectedRoute>
            <SuggestMagazine />
          </ProtectedRoute>
        ),
      },
      {
        path: 'dashboard',
        element: (
          <ProtectedRoute>
            <UserDashboard />
          </ProtectedRoute>
        ),
      },
      {
        path: 'profile',
        element: (
          <ProtectedRoute>
            <Profile />
          </ProtectedRoute>
        ),
      },
    ],
  },
  {
    path: '/admin',
    element: (
      <ProtectedRoute requireAdmin>
        <AdminLayout />
      </ProtectedRoute>
    ),
    children: [
      { index: true,                       element: <AdminDashboard /> },
      { path: 'magazines',                 element: <AdminMagazines /> },
      { path: 'magazines/create',          element: <MagazineCreate /> },
      { path: 'magazines/:id',             element: <MagazineDetails /> },
      { path: 'submissions',               element: <AdminSubmissions /> },
      { path: 'submissions/:id',           element: <SubmissionsDetailsPage /> },
      { path: 'categories',                element: <AdminCategories /> },
      { path: 'categories/create',         element: <CategoriesCreate /> },
      { path: 'users',                     element: <UsersManagement /> },
      { path: 'admins/create',             element: <AdminCreate /> },
    ],
  },
  { path: '*', element: <NotFound /> },
]);
