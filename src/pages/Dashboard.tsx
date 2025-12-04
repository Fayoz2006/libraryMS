import { Helmet } from "react-helmet-async";
import { Navigate } from "react-router-dom";
import Layout from "@/components/layout/Layout";
import { useAuth } from "@/hooks/useAuth";
import { useUserRole } from "@/hooks/useUserRole";
import StudentDashboard from "@/components/dashboard/StudentDashboard";
import FacultyDashboard from "@/components/dashboard/FacultyDashboard";
import LibrarianDashboard from "@/components/dashboard/LibrarianDashboard";
import { Loader2 } from "lucide-react";

const Dashboard = () => {
  const { user, loading: authLoading } = useAuth();
  const { role, loading: roleLoading, isLibrarian, isFaculty } = useUserRole();

  if (authLoading || roleLoading) {
    return (
      <Layout>
        <div className="flex items-center justify-center min-h-[60vh]">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
        </div>
      </Layout>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return (
    <>
      <Helmet>
        <title>Dashboard - LibraryMS</title>
        <meta name="description" content="Your personal library dashboard" />
      </Helmet>
      <Layout>
        {isLibrarian ? (
          <LibrarianDashboard />
        ) : isFaculty ? (
          <FacultyDashboard />
        ) : (
          <StudentDashboard />
        )}
      </Layout>
    </>
  );
};

export default Dashboard;
