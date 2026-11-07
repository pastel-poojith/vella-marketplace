import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Compass } from 'lucide-react';

export const NotFoundPage: React.FC = () => {
  return (
    <div className="max-w-2xl mx-auto px-4 py-24 text-center space-y-6">
      <div className="w-16 h-16 bg-sand-200 text-sand-600 rounded-full flex items-center justify-center mx-auto">
        <Compass className="w-8 h-8" />
      </div>
      <span className="text-xs uppercase tracking-widest text-accent-700 font-bold block">
        Error 404
      </span>
      <h1 className="font-serif text-4xl sm:text-5xl font-bold text-ink-900">
        Page Not Discovered
      </h1>
      <p className="text-sm text-sand-700 font-light max-w-md mx-auto leading-relaxed">
        The corridor or gallery you are seeking does not exist or may have been relocated.
      </p>
      <div>
        <Link
          to="/"
          className="inline-flex items-center gap-2 px-8 py-3.5 bg-ink-900 hover:bg-accent-600 text-sand-50 rounded text-xs uppercase font-semibold tracking-wider transition-colors shadow"
        >
          <ArrowLeft className="w-4 h-4" />
          Return to Marketplace Home
        </Link>
      </div>
    </div>
  );
};
