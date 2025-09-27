import { Trophy, Star, Target, Zap, Award, Medal } from 'lucide-react';

const GameificationBadge = ({ type, title, description, earned = false, progress = 0 }) => {
  const getBadgeIcon = (type) => {
    switch (type) {
      case 'first_lesson': return Trophy;
      case 'quiz_master': return Star;
      case 'saver': return Target;
      case 'streak': return Zap;
      case 'completion': return Award;
      default: return Medal;
    }
  };

  const getBadgeColor = (type, earned) => {
    if (!earned) return 'bg-gray-100 text-gray-400 border-gray-200';
    
    switch (type) {
      case 'first_lesson': return 'bg-blue-100 text-blue-600 border-blue-200';
      case 'quiz_master': return 'bg-yellow-100 text-yellow-600 border-yellow-200';
      case 'saver': return 'bg-green-100 text-green-600 border-green-200';
      case 'streak': return 'bg-purple-100 text-purple-600 border-purple-200';
      case 'completion': return 'bg-red-100 text-red-600 border-red-200';
      default: return 'bg-gray-100 text-gray-600 border-gray-200';
    }
  };

  const Icon = getBadgeIcon(type);
  const colorClass = getBadgeColor(type, earned);

  return (
    <div className={`relative p-4 rounded-lg border-2 transition-all duration-200 ${colorClass} ${earned ? 'shadow-sm' : 'opacity-60'}`}>
      <div className="flex items-center space-x-3">
        <div className={`w-10 h-10 rounded-full flex items-center justify-center ${earned ? 'bg-white bg-opacity-50' : 'bg-gray-200'}`}>
          <Icon className="h-5 w-5" />
        </div>
        <div className="flex-1">
          <h3 className="font-semibold text-sm">{title}</h3>
          <p className="text-xs opacity-75">{description}</p>
          {!earned && progress > 0 && (
            <div className="mt-2">
              <div className="w-full bg-white bg-opacity-30 rounded-full h-1">
                <div 
                  className="bg-current h-1 rounded-full transition-all duration-300"
                  style={{ width: `${progress}%` }}
                />
              </div>
              <p className="text-xs mt-1 opacity-75">{progress}% complete</p>
            </div>
          )}
        </div>
      </div>
      {earned && (
        <div className="absolute -top-1 -right-1 w-6 h-6 bg-yellow-400 rounded-full flex items-center justify-center">
          <Star className="h-3 w-3 text-yellow-800 fill-current" />
        </div>
      )}
    </div>
  );
};

export default GameificationBadge;