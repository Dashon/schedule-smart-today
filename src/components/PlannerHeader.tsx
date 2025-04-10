
import React from 'react';

const PlannerHeader = () => {
  return (
    <div className="text-center mb-8">
      <h1 className="text-3xl md:text-4xl font-bold text-planner-navy mb-2">
        Daily Planner Assistant
      </h1>
      <p className="text-muted-foreground max-w-2xl mx-auto">
        Add your tasks, and our AI will optimize your daily schedule for maximum productivity
      </p>
    </div>
  );
};

export default PlannerHeader;
