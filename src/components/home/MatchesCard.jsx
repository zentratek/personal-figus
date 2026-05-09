import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { getUserProfile } from '../../services/userService';
import { findMatches } from '../../services/tradeService';

/**
 * MatchesCard - Shows today's possible trades
 * Phase 7: Real matching algorithm with group members
 */
export function MatchesCard() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [matchCount, setMatchCount] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadMatchCount();
  }, [user.uid]);

  const loadMatchCount = async () => {
    try {
      const profile = await getUserProfile(user.uid);

      if (!profile?.groupId) {
        setLoading(false);
        return;
      }

      const matches = await findMatches(user.uid, profile.groupId);
      setMatchCount(matches.length);
    } catch (error) {
      console.error('Error loading match count:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleClick = () => {
    navigate('/cambios');
  };

  if (loading) {
    return (
      <button
        disabled
        className="w-full p-3.5 rounded-[14px] bg-gradient-to-r from-[var(--primary)] to-[#FF5DA8] border-2 border-black shadow-[4px_4px_0_#000] flex items-center gap-3 opacity-50"
      >
        <div className="w-10 h-10 rounded-full bg-black flex items-center justify-center flex-shrink-0 border border-[var(--lime)]">
          <svg className="animate-spin h-4 w-4 text-[var(--lime)]" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
          </svg>
        </div>
        <div className="flex-1 text-left">
          <div className="text-xs font-bold text-black">Buscando matches...</div>
        </div>
      </button>
    );
  }

  return (
    <button
      onClick={handleClick}
      className="w-full p-3.5 rounded-[14px] bg-gradient-to-r from-[var(--primary)] to-[#FF5DA8] border-2 border-black shadow-[4px_4px_0_#000] hover:translate-x-[1px] hover:translate-y-[1px] hover:shadow-[2px_2px_0_#000] active:translate-x-[4px] active:translate-y-[4px] active:shadow-none transition-all flex items-center gap-3"
    >
      {/* Icon */}
      <div className="w-10 h-10 rounded-full bg-black flex items-center justify-center flex-shrink-0 border border-[var(--lime)]">
        <svg className="w-5 h-5 text-[var(--lime)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <circle cx="12" cy="12" r="10" strokeWidth={2} />
          <circle cx="12" cy="12" r="3" fill="currentColor" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 2v4m0 12v4M2 12h4m12 0h4" />
        </svg>
      </div>

      {/* Text */}
      <div className="flex-1 text-left">
        <div className="text-xs font-bold text-black">
          {matchCount === 0 ? (
            'No hay matches disponibles'
          ) : (
            <>
              <span className="text-sm">{matchCount} {matchCount === 1 ? 'match' : 'matches'}</span> {matchCount === 1 ? 'disponible' : 'disponibles'} - ahora
            </>
          )}
        </div>
      </div>

      {/* Arrow */}
      <div className="text-black text-xl flex-shrink-0">
        →
      </div>
    </button>
  );
}
