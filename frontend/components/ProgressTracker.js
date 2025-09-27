import { useState, useEffect } from 'react';
import { Trophy, Star, Target, TrendingUp } from 'lucide-react';

const ProgressTracker = ({ userProgress, totalLessons, completedQuizzes, totalQuizzes }) => {
  const [level, setLevel] = useState(1);
  const [xp, setXp] = useState(0);
  const [nextLevelXp, setNextLevelXp] = useState(100);

  useEffect(() => {
    // Calculate XP based on completed lessons and quizzes
    const lessonXp = (userProgress?.completedLessons || 0) * 50;
    const quizXp = (completedQuizzes || 0) * 75;
    const totalXp = lessonXp + quizXp;
    
    // Calculate level (every 200 XP = 1 level)
    const calculatedLevel = Math.floor(totalXp / 200) + 1;
    const currentLevelXp = totalXp % 200;
    
    setLevel(calculatedLevel);
    setXp(currentLevelXp);
    setNextLevelXp(200);
  }, [userProgress, completedQuizzes]);

  const progressPercentage = (xp / nextLevelXp) * 100;
  const completionRate = totalLessons > 0 ? Math.round((userProgress?.completedLessons || 0) / totalLessons * 100) : 0;

  return (
    <div className="bg-gradient-to-r from-primary-600 to-primary-700 rounded-lg p-6 text-white">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-3">
          <div className="w-12 h-12 bg-white bg-opacity-20 rounded-full flex items-center justify-center">
            <Trophy className="h-6 w-6 text-yellow-300" />
          </div>
          <div>
            <h3 className="text-lg font-semibold">Level {level}</h3>
            <p className="text-primary-100 text-sm">Financial Learner</p>
          </div>
        </div>
        <div className="text-right">
          <div className="text-2xl font-bold">{completionRate}%</div>
          <div className="text-primary-100 text-sm">Complete</div>
        </div>
      </div>

      {/* XP Progress Bar */}
      <div className="mb-4">
        <div className="flex justify-between text-sm text-primary-100 mb-1">
          <span>XP Progress</span>
          <span>{xp}/{nextLevelXp}</span>
        </div>
        <div className="w-full bg-primary-500 rounded-full h-2">
          <div 
            className="bg-yellow-300 h-2 rounded-full transition-all duration-500"
            style={{ width: `${progressPercentage}%` }}
          />
        </div>
      </div>

      {/* Achievement Stats */}
      <div className="grid grid-cols-3 gap-4">
        <div className="text-center">
          <div className="flex items-center justify-center mb-1">
            <BookOpen className="h-4 w-4 mr-1" />
            <span className="font-semibold">{userProgress?.completedLessons || 0}</span>
          </div>
          <p className="text-xs text-primary-100">Lessons</p>
        </div>
        <div className="text-center">
          <div className="flex items-center justify-center mb-1">
            <Brain className="h-4 w-4 mr-1" />
            <span className="font-semibold">{completedQuizzes || 0}</span>
          </div>
          <p className="text-xs text-primary-100">Quizzes</p>
        </div>
        <div className="text-center">
          <div className="flex items-center justify-center mb-1">
            <Star className="h-4 w-4 mr-1" />
            <span className="font-semibold">{level}</span>
          </div>
          <p className="text-xs text-primary-100">Level</p>
        </div>
      </div>
    </div>
  );
};

export default ProgressTracker;