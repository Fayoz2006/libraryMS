import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { UserPlus, ArrowRight } from "lucide-react";

const CTASection = () => {
  return (
    <section className="py-20 bg-hero text-primary-foreground">
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-serif font-bold mb-4">
            Ready to Get Started?
          </h2>
          <p className="text-primary-foreground/80 text-lg mb-8 leading-relaxed">
            Join thousands of students and faculty members who are already using our library system. 
            Register today and unlock access to our entire collection.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/register">
              <Button variant="hero" size="xl" className="w-full sm:w-auto">
                <UserPlus className="w-5 h-5" />
                Create Account
              </Button>
            </Link>
            <Link to="/about">
              <Button
                variant="outline"
                size="xl"
                className="w-full sm:w-auto border-primary-foreground/30 text-primary-foreground hover:bg-primary-foreground/10 hover:text-primary-foreground"
              >
                Learn More
                <ArrowRight className="w-5 h-5" />
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CTASection;
