import { Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import Layout from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { BookX, Home, Search } from "lucide-react";

const NotFound = () => {
  return (
    <>
      <Helmet>
        <title>Page Not Found - LibraryMS</title>
      </Helmet>
      <Layout>
        <div className="min-h-[70vh] flex items-center justify-center px-4">
          <div className="text-center max-w-md">
            <div className="w-24 h-24 rounded-full bg-muted flex items-center justify-center mx-auto mb-6">
              <BookX className="w-12 h-12 text-muted-foreground" />
            </div>
            <h1 className="text-6xl font-serif font-bold text-foreground mb-4">404</h1>
            <h2 className="text-2xl font-serif font-semibold text-foreground mb-4">
              Page Not Found
            </h2>
            <p className="text-muted-foreground mb-8">
              The page you're looking for doesn't exist or has been moved. 
              Let's get you back on track.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Link to="/">
                <Button className="w-full sm:w-auto gap-2">
                  <Home className="w-4 h-4" />
                  Go Home
                </Button>
              </Link>
              <Link to="/catalog">
                <Button variant="outline" className="w-full sm:w-auto gap-2">
                  <Search className="w-4 h-4" />
                  Browse Books
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </Layout>
    </>
  );
};

export default NotFound;
