import { Helmet } from "react-helmet-async";
import Layout from "@/components/layout/Layout";
import HeroSection from "@/components/home/HeroSection";
import FeaturesSection from "@/components/home/FeaturesSection";
import BooksPreview from "@/components/home/BooksPreview";
import CTASection from "@/components/home/CTASection";

const Index = () => {
  return (
    <>
      <Helmet>
        <title>LibraryMS - Library Management System | SIUT</title>
        <meta
          name="description"
          content="A modern library management system for Samarkand International University of Technology. Browse, borrow, and manage books online."
        />
      </Helmet>
      <Layout>
        <HeroSection />
        <FeaturesSection />
        <BooksPreview />
        <CTASection />
      </Layout>
    </>
  );
};

export default Index;
