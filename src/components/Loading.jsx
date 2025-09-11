import React from "react";

function Loading({ 
  variant = "default", 
  size = "medium", 
  message = "Cargando...",
  fullScreen = true 
}) {
  const sizes = {
    small: "w-6 h-6",
    medium: "w-12 h-12",
    large: "w-16 h-16",
    xl: "w-24 h-24"
  };

  const LoadingSpinner = () => {
    switch (variant) {
      case "dots":
        return (
          <div className="flex space-x-2">
            {[...Array(3)].map((_, i) => (
              <div
                key={i}
                className={`bg-primary-500 rounded-full animate-bounce ${sizes[size]}`}
                style={{ animationDelay: `${i * 0.1}s` }}
              ></div>
            ))}
          </div>
        );
      
      case "pulse":
        return (
          <div className="relative">
            <div className={`bg-primary-200 rounded-full ${sizes[size]} animate-ping absolute`}></div>
            <div className={`bg-primary-500 rounded-full ${sizes[size]} animate-pulse`}></div>
          </div>
        );
      
      case "paw":
        return (
          <div className="relative">
            <div className="animate-bounce">
              <span className="text-6xl">🐾</span>
            </div>
            <div className="absolute top-0 left-0 w-full h-full animate-pulse bg-primary-500/20 rounded-full"></div>
          </div>
        );
      
      case "heart":
        return (
          <div className="relative">
            <div className="animate-pulse">
              <span className="text-6xl text-red-500">❤️</span>
            </div>
            <div className="absolute -top-2 -left-2 w-20 h-20 animate-ping bg-red-200 rounded-full opacity-30"></div>
          </div>
        );
      
      default:
        return (
          <div className="relative">
            <div className={`animate-spin rounded-full border-4 border-primary-200 border-t-primary-500 ${sizes[size]}`}></div>
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-lg animate-pulse">🐾</span>
            </div>
          </div>
        );
    }
  };

  const LoadingContent = () => (
    <div className="flex flex-col items-center justify-center space-y-4">
      <LoadingSpinner />
      
      {message && (
        <div className="text-center">
          <p className="text-lg font-medium text-gray-700 mb-2">{message}</p>
          <div className="flex items-center justify-center space-x-1">
            {[...Array(3)].map((_, i) => (
              <div
                key={i}
                className="w-2 h-2 bg-primary-500 rounded-full animate-bounce"
                style={{ animationDelay: `${i * 0.2}s` }}
              ></div>
            ))}
          </div>
        </div>
      )}
    </div>
  );

  if (fullScreen) {
    return (
      <div className="fixed inset-0 bg-gradient-to-br from-primary-50 via-white to-secondary-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-2xl shadow-xl p-8 mx-4 max-w-sm w-full">
          <LoadingContent />
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center p-8">
      <LoadingContent />
    </div>
  );
}

// Componente específico para carga de página completa
export function FullPageLoading({ message = "Cargando PetClinic QR..." }) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-secondary-50 flex items-center justify-center">
      <div className="text-center">
        {/* Logo animado */}
        <div className="mb-8">
          <div className="w-24 h-24 bg-gradient-to-r from-primary-500 to-secondary-500 rounded-2xl flex items-center justify-center mx-auto mb-4 animate-bounce">
            <span className="text-4xl text-white">🐾</span>
          </div>
          <h1 className="text-2xl font-bold font-display text-gray-800">PetClinic QR</h1>
        </div>
        
        {/* Loading animation */}
        <div className="mb-6">
          <div className="flex justify-center space-x-2">
            {[...Array(4)].map((_, i) => (
              <div
                key={i}
                className="w-3 h-3 bg-primary-500 rounded-full animate-bounce"
                style={{ animationDelay: `${i * 0.1}s` }}
              ></div>
            ))}
          </div>
        </div>
        
        <p className="text-gray-600">{message}</p>
      </div>
    </div>
  );
}

// Componente para botones con loading
export function ButtonLoading({ 
  children, 
  loading = false, 
  loadingText = "Cargando...",
  ...props 
}) {
  return (
    <button
      {...props}
      disabled={loading || props.disabled}
      className={`relative ${props.className} ${loading ? 'cursor-not-allowed' : ''}`}
    >
      {loading && (
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
        </div>
      )}
      <span className={loading ? 'opacity-0' : 'opacity-100'}>
        {loading ? loadingText : children}
      </span>
    </button>
  );
}

export default Loading;