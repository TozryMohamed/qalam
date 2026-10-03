import { Routes, Route, useParams, useSearchParams } from 'react-router-dom';

// Layouts
import MainLayout from '../layouts/MainLayout';
import DashboardLayout from '../layouts/DashboardLayout';

// Pages publiques
import Home from '../pages/Home';
import Blog from '../pages/Blog';
import PostDetail from '../pages/PostDetail';
import Categories from '../pages/Categories';
import CategoryPage from '../pages/CategoryPage';
import Search from '../pages/Search';
import About from '../pages/About';

// Pages auth
import Login from '../pages/Login';
import Register from '../pages/Register';
import ForgotPassword from '../pages/ForgotPassword';
import ResetPassword from '../pages/ResetPassword';
import VerifyEmail from '../pages/VerifyEmail';

// Pages utilisateur
import Profile from '../pages/Profile';
import NotFound from '../pages/NotFound';

// Pages auteur
import AuthorDashboard from '../pages/author/Dashboard';
import PostEditor from '../pages/author/PostEditor';

// Pages admin
import AdminDashboard from '../pages/admin/AdminDashboard';
import AdminUsers from '../pages/admin/AdminUsers';
import AdminPosts from '../pages/admin/AdminPosts';
import AdminComments from '../pages/admin/AdminComments';

// Guards
import ProtectedRoute from '../components/ProtectedRoute';
import AuthorRoute from '../components/AuthorRoute';
import AdminRoute from '../components/AdminRoute';

/* -------------------------------------------------------------------------- */
/*  Wrappers avec `key` — forcent le remontage du composant quand l'URL change */
/*  Cela évite tout setState synchrone dans les useEffect des pages.          */
/* -------------------------------------------------------------------------- */

function PostDetailRoute() {
  const { slug } = useParams();
  return <PostDetail key={slug} />;
}

function CategoryRoute() {
  const { category } = useParams();
  return <CategoryPage key={category} />;
}

function SearchRoute() {
  const [params] = useSearchParams();
  const q = params.get('q') || '';
  return <Search key={q} initialQuery={q} />;
}

function BlogRoute() {
  const [params] = useSearchParams();
  const key = [
    params.get('page') || '0',
    params.get('category') || '',
    params.get('q') || '',
  ].join('|');
  return <Blog key={key} />;
}

/* -------------------------------------------------------------------------- */

export default function AppRoutes() {
  return (
    <Routes>
      {/* ======================= LAYOUT PUBLIC ======================= */}
      <Route element={<MainLayout />}>
        <Route path="/" element={<Home />} />
        <Route path="/blog" element={<BlogRoute />} />
        <Route path="/blog/:slug" element={<PostDetailRoute />} />
        <Route path="/categories" element={<Categories />} />
        <Route path="/category/:category" element={<CategoryRoute />} />
        <Route path="/search" element={<SearchRoute />} />
        <Route path="/about" element={<About />} />

        {/* Auth */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password" element={<ResetPassword />} />
        <Route path="/verify-email" element={<VerifyEmail />} />

        {/* Utilisateur connecté */}
        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          }
        />

        {/* 404 */}
        <Route path="*" element={<NotFound />} />
      </Route>

      {/* ================== LAYOUT DASHBOARD (author + admin) =========== */}
      <Route
        element={
          <AuthorRoute>
            <DashboardLayout />
          </AuthorRoute>
        }
      >
        {/* Auteur */}
        <Route path="/author" element={<AuthorDashboard />} />
        <Route path="/author/new" element={<PostEditor />} />
        <Route path="/author/:id/edit" element={<PostEditor />} />

        {/* Admin (nested dans AuthorRoute car admin ⊇ author) */}
        <Route
          path="/admin"
          element={
            <AdminRoute>
              <AdminDashboard />
            </AdminRoute>
          }
        />
        <Route
          path="/admin/users"
          element={
            <AdminRoute>
              <AdminUsers />
            </AdminRoute>
          }
        />
        <Route
          path="/admin/posts"
          element={
            <AdminRoute>
              <AdminPosts />
            </AdminRoute>
          }
        />
        <Route
          path="/admin/comments"
          element={
            <AdminRoute>
              <AdminComments />
            </AdminRoute>
          }
        />
      </Route>
    </Routes>
  );
}