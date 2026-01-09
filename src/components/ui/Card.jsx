const Card = ({ children, className = '', hover = false, padding = true }) => {
  return (
    <div className={`bg-white rounded-xl border border-gray-200 shadow-sm ${hover ? 'hover:shadow-md transition-shadow duration-200 cursor-pointer' : ''} ${className}`}>
      {padding ? <div className="p-6">{children}</div> : children}
    </div>
  );
};

export default Card;