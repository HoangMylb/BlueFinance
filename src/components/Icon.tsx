import React from 'react';
import * as Icons from 'lucide-react';

interface IconProps {
  name: string;
  className?: string;
  size?: number;
}

/**
 * A dynamic icon renderer that maps string names to Lucide icons.
 */
export const Icon: React.FC<IconProps> = ({ name, className = '', size }) => {
  // Safe lookup for the icon
  const IconComponent = (Icons as any)[name];

  if (!IconComponent) {
    // Fallback icon if not found
    return <Icons.HelpCircle className={className} size={size} />;
  }

  return <IconComponent className={className} size={size} />;
};

export default Icon;
