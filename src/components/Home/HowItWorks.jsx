import { Bath, Bed, Ruler , MapPin ,Home, Handshake, FileText, Key} from "lucide-react"; 
export const HowItWorks = () => {
    const steps = [
      {
        icon: <Home className="w-10 h-10 " />,
        title: "Find real estate",
        description: "Sumo petentium ut per, at his wisim utinam adipiscing. Est el graeco quod suavitate vix."
      },
      {
        icon: <Handshake className="w-10 h-10" />,
        title: "Meet relator",
        description: "Sumo petentium ut per, at his wisim utinam adipiscing. Est el graeco quod suavitate vix."
      },
      {
        icon: <FileText className="w-10 h-10" />,
        title: "Documents",
        description: "Sumo petentium ut per, at his wisim utinam adipiscing. Est el graeco quod suavitate vix."
      },
      {
        icon: <Key className="w-10 h-10" />,
        title: "Take the keys",
        description: "Sumo petentium ut per, at his wisim utinam adipiscing. Est el graeco quod suavitate vix."
      }
    ];
  
    return (
  <section className="py-16 px-4 sm:px-6 lg:px-8 bg-gray-50">
    <div className="max-w-7xl mx-auto">
      <div className="mb-12">
        <h2 className="text-5xl md:text-4xl font-bold text-gray-900 mb-4">How It Works?</h2>
        <p className="text-6xl">Find a perfect home</p>
      </div>
  
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4">
        {steps.map((step, index) => (
          <div 
            key={index}
            className={`
              bg-white p-8 duration-300 text-left
              relative
              ${index < steps.length - 1 ? 'md:border-r border-gray-200' : ''}
              ${index < steps.length - 2 ? 'lg:border-r border-gray-200' : ''}
            `}
          >
            <div className="mb-6">
              <div className="p-1">
                {step.icon}
              </div>
            </div>
            <h3 className="text-3xl font-semibold text-gray-900 mb-3">{step.title}</h3>
            <p className="text-xl text-gray-600">{step.description}</p>
          </div>
        ))}
      </div>
    </div>
  </section>
    );
  };