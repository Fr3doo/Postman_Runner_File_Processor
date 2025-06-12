import React from 'react';

export type CardProps = React.HTMLAttributes<HTMLDivElement>;

export const Card: React.FC<CardProps> = ({
  className = '',
  children,
  ...props
}) => {
  return (
    <div className={`bg-white rounded-xl shadow p-6 ${className}`} {...props}>
      {children}
    </div>
  );
};

export default Card;
