import React from 'react';

const FormStepper = ({ steps, currentStep, onStepClick }) => {
  return (
    <div className="mb-8">
      <div className="flex items-center justify-between">
        {steps.map((step, index) => {
          const isCompleted = index < currentStep;
          const isCurrent = index === currentStep;
          const isFuture = index > currentStep;

          return (
            <React.Fragment key={index}>
              {/* Step Circle */}
              <div className="flex flex-col items-center flex-1">
                <button
                  onClick={() => onStepClick && onStepClick(index)}
                  disabled={isFuture || !onStepClick}
                  className={`
                    relative flex items-center justify-center w-12 h-12 rounded-full font-semibold text-lg transition-all duration-300 border
                    ${isCompleted 
                      ? 'bg-emerald-600 text-white border-emerald-600 cursor-pointer hover:bg-emerald-700' 
                      : isCurrent 
                      ? 'bg-emerald-600 text-white border-emerald-600 cursor-pointer hover:bg-emerald-700' 
                      : 'bg-slate-100 text-slate-400 border-slate-200 cursor-not-allowed'
                    }
                    ${!onStepClick ? 'cursor-default' : ''}
                  `}
                >
                  {isCompleted ? (
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  ) : (
                    <span>{index + 1}</span>
                  )}
                </button>
                
              {/* Step Title */}
              <div className="mt-2 text-center">
                <p className={`text-sm font-medium ${isCurrent ? 'text-emerald-700' : isCompleted ? 'text-emerald-700' : 'text-slate-500'}`}>
                  {step.title}
                </p>
              </div>
            </div>

            {/* Line from this step to next */}
            {index < steps.length - 1 && (
              <div className={`flex-1 h-1 mx-2 transition-all duration-300 ${
                isCompleted ? 'bg-emerald-600' : 'bg-slate-200'
              }`} />
            )}
          </React.Fragment>
          );
        })}
      </div>
    </div>
  );
};

export default FormStepper;
