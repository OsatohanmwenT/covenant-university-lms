import { BookOpen, Users, Search, BarChart3, Shield, Clock } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';

const FeaturesSection = () => {
  const features = [
    {
      icon: BookOpen,
      title: "Digital Catalog Management",
      description: "Comprehensive book and resource management with automated cataloging, ISBN lookup, and metadata management."
    },
    {
      icon: Users,
      title: "Member Management",
      description: "Complete patron management system with registration, profiles, borrowing history, and automated notifications."
    },
    {
      icon: Search,
      title: "Advanced Search & Discovery",
      description: "Powerful search capabilities across all collections with filters, recommendations, and availability tracking."
    },
    {
      icon: BarChart3,
      title: "Analytics & Reporting",
      description: "Detailed insights into library usage, popular books, member statistics, and operational analytics."
    },
    {
      icon: Shield,
      title: "Security & Access Control",
      description: "Role-based access control, secure data handling, and comprehensive audit trails for all activities."
    },
    {
      icon: Clock,
      title: "Automated Operations",
      description: "Streamlined check-in/check-out, automated renewals, overdue notifications, and fine management."
    }
  ];

  return (
    <section id="services" className="py-20 px-5 md:px-16 bg-secondary/10">
      <div className="container mx-auto">
        <div className="text-center mb-6 md:mb-16">
          <h2 className="font-display text-3xl md:text-4xl text-light-200 font-bold mb-4">
            Powerful Features for Modern Libraries
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Everything you need to manage your library efficiently and provide exceptional service to your community.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <Card key={index} className="backdrop-blur-lg bg-white/5 border border-light-200/10 hover:border-light-200 transition-all duration-300 group">
              <CardContent className="p-4">
                <div className="bg-primary/10 p-3 rounded-lg w-fit mb-4 group-hover:bg-primary/20 transition-colors">
                  <feature.icon className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-lg font-semibold text-white mb-3">
                  {feature.title}
                </h3>
                <p className="text-muted-foreground leading-relaxed">
                  {feature.description}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;