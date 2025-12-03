import { Search, BookOpen, Clock, Users, Shield, Bell } from "lucide-react";

const features = [
  {
    icon: Search,
    title: "Smart Search",
    description: "Find books quickly by title, author, ISBN, or category with our powerful search functionality.",
  },
  {
    icon: BookOpen,
    title: "Easy Borrowing",
    description: "Borrow books in just a few clicks. Track your loans and return dates effortlessly.",
  },
  {
    icon: Clock,
    title: "Due Date Reminders",
    description: "Never miss a return date with automatic notifications and reminders.",
  },
  {
    icon: Users,
    title: "Role-Based Access",
    description: "Tailored experiences for students, faculty, and librarians with appropriate permissions.",
  },
  {
    icon: Shield,
    title: "Secure System",
    description: "Your data is protected with industry-standard security measures and authentication.",
  },
  {
    icon: Bell,
    title: "Notifications",
    description: "Stay updated with new arrivals, overdue alerts, and library announcements.",
  },
];

const FeaturesSection = () => {
  return (
    <section className="py-20 bg-background">
      <div className="container mx-auto px-4">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <h2 className="text-3xl md:text-4xl font-serif font-bold text-foreground mb-4">
            Everything You Need
          </h2>
          <p className="text-muted-foreground text-lg">
            A comprehensive library management system with features designed to enhance your academic journey.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, index) => (
            <div
              key={feature.title}
              className="group p-6 rounded-xl bg-card border border-border hover:shadow-lg transition-all duration-300 hover:-translate-y-1"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div className="w-12 h-12 rounded-lg bg-accent/10 flex items-center justify-center mb-4 group-hover:bg-accent/20 transition-colors">
                <feature.icon className="w-6 h-6 text-accent" />
              </div>
              <h3 className="font-serif text-xl font-semibold text-foreground mb-2">
                {feature.title}
              </h3>
              <p className="text-muted-foreground leading-relaxed">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;
