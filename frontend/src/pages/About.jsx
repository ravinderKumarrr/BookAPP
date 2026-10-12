import React from 'react';
import { Link } from 'react-router-dom';
import { Users, Wallet, Leaf, ShieldCheck } from 'lucide-react';

const About = () => {
  return (
    <div className="container-app py-10 sm:py-16">
      <div className="max-w-2xl mx-auto text-center mb-10">
        <h1 className="text-2xl sm:text-3xl font-bold text-textDark mb-3">About BookApp</h1>
        <p className="text-sm sm:text-base text-textDark/60">
          BookApp is a local book marketplace built to connect readers in the same city. We make it simple to buy
          affordable second-hand books and sell the ones you no longer need, while keeping reading sustainable and
          community-driven.
        </p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-12">
        {[
          { icon: Users, title: 'Local Community', desc: 'Every listing is tied to a city so you can meet nearby.' },
          { icon: Wallet, title: 'Affordable Books', desc: 'Save money by buying pre-loved books directly from sellers.' },
          { icon: Leaf, title: 'Sustainable Reading', desc: 'Keep books in circulation instead of the landfill.' },
          { icon: ShieldCheck, title: 'Trusted Users', desc: 'Simple profiles and messaging keep transactions transparent.' },
        ].map((f) => (
          <div key={f.title} className="bg-cardWhite rounded-2xl shadow-sm p-4 flex flex-col items-start gap-2 border border-black/5">
            <div className="w-10 h-10 rounded-xl bg-secondary/10 flex items-center justify-center">
              <f.icon className="w-5 h-5 text-primary" />
            </div>
            <h3 className="font-semibold text-sm text-textDark">{f.title}</h3>
            <p className="text-xs text-textDark/60">{f.desc}</p>
          </div>
        ))}
      </div>

      <div className="text-center">
        <Link to="/books" className="bg-primary text-white font-medium px-6 py-3 rounded-xl hover:bg-primary/90 transition text-sm">
          Start Browsing Books
        </Link>
      </div>
    </div>
  );
};

export default About;
