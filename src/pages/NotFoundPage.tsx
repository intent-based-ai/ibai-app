
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';

const NotFoundPage = () => {
  return (
    <div className="min-h-[calc(100vh-4rem)] flex flex-col items-center justify-center text-center p-4">
      <h1 className="text-5xl font-bold mb-4">404</h1>
      <p className="text-xl mb-8">Oops! The page you're looking for isn't here.</p>
      <Link to="/">
        <Button size="lg">
          Back to Home
        </Button>
      </Link>
    </div>
  );
};

export default NotFoundPage;
