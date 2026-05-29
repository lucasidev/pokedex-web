import { Route, Routes } from 'react-router-dom';
import { Layout } from '@/components/Layout';
import { AuthPage } from '@/features/auth/AuthPage';
import { HomePage } from '@/pages/HomePage';
import { NotFoundPage } from '@/routes/NotFoundPage';
import { ProtectedRoute } from '@/routes/ProtectedRoute';

export function App() {
  return (
    <Layout>
      <Routes>
        <Route path="/auth" element={<AuthPage />} />
        <Route element={<ProtectedRoute />}>
          <Route path="/" element={<HomePage />} />
        </Route>
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </Layout>
  );
}
