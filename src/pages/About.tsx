import { Helmet } from "react-helmet-async";
import Layout from "@/components/layout/Layout";
import { Book, Users, Clock, Shield, Laptop, GraduationCap } from "lucide-react";

const About = () => {
  return (
    <>
      <Helmet>
        <title>About - LibraryMS</title>
        <meta
          name="description"
          content="Learn about the Library Management System developed for Samarkand International University of Technology."
        />
      </Helmet>
      <Layout>
        {/* Hero */}
        <section className="bg-hero text-primary-foreground py-20">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto text-center">
              <h1 className="text-4xl md:text-5xl font-serif font-bold mb-6">
                About LibraryMS
              </h1>
              <p className="text-xl text-primary-foreground/80 leading-relaxed">
                A modern library management system designed to streamline library operations
                for educational institutions.
              </p>
            </div>
          </div>
        </section>

        {/* Mission */}
        <section className="py-20">
          <div className="container mx-auto px-4">
            <div className="grid md:grid-cols-2 gap-12 items-center">
              <div>
                <h2 className="text-3xl font-serif font-bold text-foreground mb-6">
                  Our Mission
                </h2>
                <p className="text-muted-foreground text-lg leading-relaxed mb-4">
                  LibraryMS was developed to provide Samarkand International University of Technology
                  with a modern, efficient, and user-friendly library management solution.
                </p>
                <p className="text-muted-foreground text-lg leading-relaxed">
                  Our system enables students, faculty, and librarians to easily manage book borrowing,
                  returns, and inventory while providing a seamless digital experience.
                </p>
              </div>
              <div className="grid grid-cols-2 gap-4">
                {[
                  { icon: Book, label: "10,000+ Books", desc: "In our collection" },
                  { icon: Users, label: "2,500+ Users", desc: "Active members" },
                  { icon: Clock, label: "24/7 Access", desc: "Online catalog" },
                  { icon: Shield, label: "Secure", desc: "Data protection" },
                ].map((item) => (
                  <div
                    key={item.label}
                    className="p-6 rounded-xl bg-card border border-border text-center"
                  >
                    <item.icon className="w-8 h-8 text-accent mx-auto mb-3" />
                    <h3 className="font-semibold text-foreground">{item.label}</h3>
                    <p className="text-sm text-muted-foreground">{item.desc}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* User Roles */}
        <section className="py-20 bg-muted/30">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-serif font-bold text-foreground mb-12 text-center">
              User Roles & Capabilities
            </h2>
            <div className="grid md:grid-cols-3 gap-8">
              {[
                {
                  icon: GraduationCap,
                  title: "Students",
                  features: [
                    "Search and browse books",
                    "Borrow up to 5 books",
                    "14-day borrowing period",
                    "View borrowing history",
                    "Receive due date notifications",
                  ],
                },
                {
                  icon: Users,
                  title: "Faculty",
                  features: [
                    "Extended borrowing limits",
                    "30-day borrowing period",
                    "Access restricted materials",
                    "Recommend new books",
                    "Research paper access",
                  ],
                },
                {
                  icon: Laptop,
                  title: "Librarians",
                  features: [
                    "Full inventory management",
                    "Add/edit/remove books",
                    "User account management",
                    "Overdue reports & tracking",
                    "System administration",
                  ],
                },
              ].map((role) => (
                <div
                  key={role.title}
                  className="p-8 rounded-xl bg-card border border-border"
                >
                  <role.icon className="w-10 h-10 text-accent mb-4" />
                  <h3 className="font-serif text-xl font-semibold text-foreground mb-4">
                    {role.title}
                  </h3>
                  <ul className="space-y-2">
                    {role.features.map((feature) => (
                      <li
                        key={feature}
                        className="flex items-start gap-2 text-muted-foreground"
                      >
                        <span className="w-1.5 h-1.5 rounded-full bg-accent mt-2 shrink-0" />
                        {feature}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Technical Info */}
        <section className="py-20">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto">
              <h2 className="text-3xl font-serif font-bold text-foreground mb-6 text-center">
                Project Information
              </h2>
              <div className="p-8 rounded-xl bg-card border border-border">
                <dl className="space-y-4">
                  <div className="flex flex-col sm:flex-row sm:justify-between py-3 border-b border-border">
                    <dt className="font-medium text-foreground">Project Name</dt>
                    <dd className="text-muted-foreground">Library Management System (LMS)</dd>
                  </div>
                  <div className="flex flex-col sm:flex-row sm:justify-between py-3 border-b border-border">
                    <dt className="font-medium text-foreground">Institution</dt>
                    <dd className="text-muted-foreground">Samarkand International University of Technology</dd>
                  </div>
                  <div className="flex flex-col sm:flex-row sm:justify-between py-3 border-b border-border">
                    <dt className="font-medium text-foreground">Course</dt>
                    <dd className="text-muted-foreground">Software Engineering (Autumn 2025)</dd>
                  </div>
                  <div className="flex flex-col sm:flex-row sm:justify-between py-3 border-b border-border">
                    <dt className="font-medium text-foreground">Developer</dt>
                    <dd className="text-muted-foreground">Kambarov Fayozjon</dd>
                  </div>
                  <div className="flex flex-col sm:flex-row sm:justify-between py-3">
                    <dt className="font-medium text-foreground">Version</dt>
                    <dd className="text-muted-foreground">2.0 (Final Draft)</dd>
                  </div>
                </dl>
              </div>
            </div>
          </div>
        </section>
      </Layout>
    </>
  );
};

export default About;
