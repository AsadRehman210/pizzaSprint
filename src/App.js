import { Route, Routes, Navigate, useNavigate } from "react-router-dom";
import { Suspense, lazy, useEffect, useState } from "react";
import { ErrorBoundary } from "react-error-boundary";
import ErrorPage from "./components/common/ErrorPage";
import Footer from "./components/common/Footer";
import Header from "./components/common/Header";
import VerifyPage from "./pages/VerifyPage";
import { useDispatch, useSelector } from "react-redux";
import {
  DeliveryArea,
  Menu,
  RestaurantInfo,
  selectIsAuthenticated,
  showToken,
} from "./redux/slice/authSlice";
import LoaderContainer from "./components/common/LoaderContainer";
import { setupInterceptors } from "./api";
import Contact from "./pages/Contact";
import ScrollToTop from "./components/common/ScrollToTop";
import Topbutton from "./components/common/Topbutton";

const Home = lazy(() => import("./pages/Home"));

const ProtectedRoute = ({ children }) => {
  const isAuthenticated = useSelector(selectIsAuthenticated);
  const token = useSelector(showToken);

  return isAuthenticated && token ? children : <Navigate to="/" replace />;
};

function App() {
  const isAuthenticated = useSelector(selectIsAuthenticated);
  const token = useSelector(showToken);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  useEffect(() => {
    setupInterceptors(navigate);

    const initializeApp = async () => {
      try {
        if (isAuthenticated && token) {
          await Promise.all([
            dispatch(Menu()).unwrap(),
            dispatch(RestaurantInfo()).unwrap(),
            dispatch(DeliveryArea()).unwrap(),
          ]);
        }
      } catch (error) {
        console.error("Initialization error:", error);
      } finally {
        setLoading(false);
      }
    };

    initializeApp();
  }, [dispatch, token, isAuthenticated, navigate]);

  if (loading) {
    return <LoaderContainer />;
  }

  return (
    <ErrorBoundary
      FallbackComponent={({ error, resetErrorBoundary }) => (
        <ErrorPage error={error} onRetry={resetErrorBoundary} />
      )}
      onError={(error) => console.error("App Error:", error)}
    >
      <Suspense fallback={<LoaderContainer />}>
        {isAuthenticated && <Header />}
        <ScrollToTop />
        <Routes>
          <Route
            path="/"
            element={
              isAuthenticated ? (
                <Navigate to="/home" replace />
              ) : (
                <VerifyPage
                  onVerified={() => {
                    // This will trigger the useEffect again
                    setLoading(true);
                  }}
                />
              )
            }
          />
          <Route
            path="/home"
            element={
              <ProtectedRoute>
                <Home />
              </ProtectedRoute>
            }
          />
          <Route
            path="/contact"
            element={
              <ProtectedRoute>
                <Contact />
              </ProtectedRoute>
            }
          />
        </Routes>
        {isAuthenticated && <Footer />}
        <Topbutton />
      </Suspense>
    </ErrorBoundary>
  );
}

export default App;
