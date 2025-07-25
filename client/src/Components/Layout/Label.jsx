export const Label = ({ icon: Icon, children }) => {
    // Add a check for Icon to prevent errors
    if (!Icon) {
      return (
        <label className="text-sm font-medium text-gray-700 flex items-center gap-2 mb-1 dark:text-gray-200">
          {children}
        </label>
      );
    }
  
    return (
      <label className="text-sm font-medium text-gray-700 flex items-center gap-2 mb-1 dark:text-gray-200">
        <Icon className="w-4 h-4" />
        {children}
      </label>
    );
  };