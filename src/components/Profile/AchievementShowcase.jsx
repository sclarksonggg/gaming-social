import React, { useState } from 'react';
import { Trophy, Filter, Plus, ChevronDown, ChevronUp } from 'lucide-react';

const AchievementShowcase = ({ achievements, onAddAchievement }) => {
  const [expanded, setExpanded] = useState(false);
  const [sortCriteria, setSortCriteria] = useState('earnedDate');
  const [filterGame, setFilterGame] = useState('');

  const sortedAchievements = [...achievements].sort((a, b) => {
    if (sortCriteria === 'earnedDate') {
      return new Date(b.earnedDate) - new Date(a.earnedDate);
    } else {
      return a.game.localeCompare(b.game);
    }
  });

  const filteredAchievements = sortedAchievements.filter(achievement => 
    achievement.game.toLowerCase().includes(filterGame.toLowerCase())
  );

  const displayedAchievements = expanded ? filteredAchievements : filteredAchievements.slice(0, 4);

  return (
    <div className="bg-gray-800 p-4 rounded-lg shadow-md">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold text-white flex items-center">
          <Trophy className="mr-2" /> Achievements
        </h2>
        <button
          onClick={onAddAchievement}
          className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded inline-flex items-center text-sm"
        >
          <Plus size={16} className="mr-1" />
          Add
        </button>
      </div>
      <div className="mb-4 flex items-center">
        <Filter className="mr-2 text-white" size={16} />
        <input
          type="text"
          placeholder="Filter by game"
          value={filterGame}
          onChange={(e) => setFilterGame(e.target.value)}
          className="bg-gray-700 text-white p-1 rounded text-sm flex-grow"
        />
        <select
          value={sortCriteria}
          onChange={(e) => setSortCriteria(e.target.value)}
          className="bg-gray-700 text-white p-1 rounded ml-2 text-sm"
        >
          <option value="earnedDate">Date</option>
          <option value="game">Game</option>
        </select>
      </div>
      <div className="grid grid-cols-2 gap-2">
        {displayedAchievements.map((achievement, index) => (
          <div key={index} className="bg-gray-700 p-2 rounded-md">
            <h3 className="text-sm font-semibold text-white">{achievement.title}</h3>
            <p className="text-xs text-gray-300">{achievement.game}</p>
            <p className="text-xs text-gray-400">{new Date(achievement.earnedDate).toLocaleDateString()}</p>
          </div>
        ))}
      </div>
      {achievements.length > 4 && (
        <button
          onClick={() => setExpanded(!expanded)}
          className="mt-2 text-blue-400 hover:text-blue-300 text-sm flex items-center justify-center w-full"
        >
          {expanded ? (
            <>
              <ChevronUp size={16} className="mr-1" /> Show Less
            </>
          ) : (
            <>
              <ChevronDown size={16} className="mr-1" /> Show More
            </>
          )}
        </button>
      )}
    </div>
  );
};

export default AchievementShowcase;