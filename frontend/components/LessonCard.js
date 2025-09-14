import { useState } from 'react';
import { BookOpen, Clock, CheckCircle, Play, Lock } from 'lucide-react';

const LessonCard = ({ 
  lesson, 
  isCompleted = false, 
  isLocked = false, 
  progress = 0,
  onStart,
  onContinue 
}) => {
  const [isHovered, setIsHovered] = useState(false);

  const getDifficultyColor = (level) => {
    switch (level) {
      case 'beginner':
        return 'bg-green-100 text-green-800';
      case 'intermediate':
        return 'bg-yellow-100 text-yellow-800';
      case 'advanced':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getCategoryIcon = (category) => {
    switch (category.toLowerCase()) {
      case 'budgeting':
        return '💰';
      case 'saving':
        return '🏦';
      case 'investing':
        return '📈';
      case 'debt':
        return '💳';
      case 'retirement':
        return '👴';
      default:
        return '📚';
    }
  };

  const handleClick = () => {
    if (isLocked) return;
    
    if (isCompleted) {
      onContinue?.(lesson);
    } else {
      onStart?.(lesson);
    }
  };

  return (
    <div
      className={`relative bg-white rounded-lg shadow-sm border border-gray-200 p-6 transition-all duration-200 ${
        isLocked 
          ? 'opacity-60 cursor-not-allowed' 
          : 'hover:shadow-md hover:border-primary-300 cursor-pointer'
      } ${isHovered && !isLocked ? 'transform -translate-y-1' : ''}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={handleClick}
    >
      {/* Lock overlay */}
      {isLocked && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-100 bg-opacity-75 rounded-lg">
          <Lock className="h-8 w-8 text-gray-400" />
        </div>
      )}

      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center space-x-3">
          <div className="text-2xl">{getCategoryIcon(lesson.category)}</div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900">{lesson.title}</h3>
            <p className="text-sm text-gray-600 capitalize">{lesson.category}</p>
          </div>
        </div>
        
        <div className="flex items-center space-x-2">
          <span className={`px-2 py-1 text-xs font-medium rounded-full ${getDifficultyColor(lesson.difficulty_level)}`}>
            {lesson.difficulty_level}
          </span>
          {isCompleted && (
            <CheckCircle className="h-5 w-5 text-green-500" />
          )}
        </div>
      </div>

      {/* Description */}
      <p className="text-gray-600 text-sm mb-4 line-clamp-2">
        {lesson.content.substring(0, 120)}...
      </p>

      {/* Progress bar */}
      {progress > 0 && !isCompleted && (
        <div className="mb-4">
          <div className="flex justify-between text-sm text-gray-600 mb-1">
            <span>Progress</span>
            <span>{progress}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className="bg-primary-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
      )}

      {/* Footer */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4 text-sm text-gray-500">
          <div className="flex items-center space-x-1">
            <Clock className="h-4 w-4" />
            <span>5-10 min</span>
          </div>
          <div className="flex items-center space-x-1">
            <BookOpen className="h-4 w-4" />
            <span>Lesson</span>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          {isCompleted ? (
            <button className="flex items-center space-x-1 text-primary-600 hover:text-primary-700 text-sm font-medium">
              <Play className="h-4 w-4" />
              <span>Review</span>
            </button>
          ) : (
            <button className="flex items-center space-x-1 text-primary-600 hover:text-primary-700 text-sm font-medium">
              <Play className="h-4 w-4" />
              <span>Start</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default LessonCard;

