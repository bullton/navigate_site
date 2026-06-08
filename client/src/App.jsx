import { BrowserRouter, Routes, Route, useParams } from 'react-router-dom';
import Home from './pages/Home.jsx';
import AdminLogin from './pages/AdminLogin.jsx';
import AdminDashboard from './pages/AdminDashboard.jsx';
import AdminApps from './pages/AdminApps.jsx';
import AdminCategories from './pages/AdminCategories.jsx';
import AdminLinks from './pages/AdminLinks.jsx';
import AdminLayout from './components/AdminLayout.jsx';
import AppForm from './components/AppForm.jsx';
import { useEffect } from 'react';
import { useAdminStore } from './stores/index.js';

function AppEditWrapper() {
  const { id } = useParams();
  const { apps, fetchAdminApps } = useAdminStore();
  const app = apps.find((a) => a._id === id);

  useEffect(() => {
    if (!apps.length) {
      fetchAdminApps();
    }
  }, [apps.length, fetchAdminApps]);

  return <AppForm app={app} />;
}

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />

        <Route path="/admin" element={<AdminLogin />} />
        <Route element={<AdminLayout />}>
          <Route path="/admin/dashboard" element={<AdminDashboard />} />
          <Route path="/admin/apps" element={<AdminApps />} />
          <Route path="/admin/apps/new" element={<AppForm />} />
          <Route path="/admin/apps/:id/edit" element={<AppEditWrapper />} />
          <Route path="/admin/categories" element={<AdminCategories />} />
          <Route path="/admin/links" element={<AdminLinks />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;