import React from 'react';
import { Home, PenTool, Wrench } from 'lucide-react';

export default function RenovationServices() {
  const services = [
    {
      icon: Home,
      title: "Find inspiration",
      description: "Sumo petentium ut per, at his wisim utinam adipis cing. Est e graeco quod suavitate vix ad praesent."
    },
    {
      icon: PenTool,
      title: "Find architect/designer",
      description: "Sumo petentium ut per, at his wisim utinam adipis cing. Est e graeco quod suavitate vix ad praesent."
    },
    {
      icon: Wrench,
      title: "Begin renovation",
      description: "Sumo petentium ut per, at his wisim utinam adipis cing. Est e graeco quod suavitate vix ad praesent."
    }
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 py-16 bg-white">
      <div className="grid lg:grid-cols-2 gap-12 items-center">
        
        <div className="space-y-8">
          <div className="space-y-4">
            <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 leading-tight">
              Our expert will help you make the renovation
            </h2>
          </div>
          
          <div className="space-y-8">
            {services.map((service, index) => {
              const IconComponent = service.icon;
              return (
                <div key={index} className="flex gap-4">
                  <div className="flex-shrink-0">
                    <div className="w-12 h-12 border-2 border-gray-900 rounded-lg flex items-center justify-center">
                      <IconComponent className="w-6 h-6 text-gray-900" />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <h3 className="text-xl font-semibold text-gray-900">
                      {service.title}
                    </h3>
                    <p className="text-gray-600 leading-relaxed">
                      {service.description}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

      
        <div className="relative">
          <div className="grid grid-cols-2 gap-4">
           
            <div className="row-span-2 aspect-[3/4] rounded-2xl overflow-hidden mt-20">
              <img 
                src="https://newhome.qodeinteractive.com/wp-content/uploads/2023/03/main-home-img-4.jpg"
                alt="Person working on laptop with architectural plans"
                className="w-full h-full object-cover"
              />
            </div>

           
            <div className="aspect-square rounded-2xl overflow-hidden">
              <img 
                src="https://images.unsplash.com/photo-1600880292203-757bb62b4baf?w=400&h=400&fit=crop"
                alt="Team collaborating on renovation plans"
                className="w-full h-full object-cover"
              />
            </div>

            
            <div className="aspect-square rounded-2xl overflow-hidden">
              <img 
                src="https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=800&h=400&fit=crop"
                alt="Empty modern room ready for renovation"
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}