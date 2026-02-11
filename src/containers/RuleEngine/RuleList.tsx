import React, { useEffect, useState, useCallback, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../../state/store';
import { fetchRules, selectRules, selectRuleEngineLoading, selectRuleEngineError } from '../../state/slices/ruleEngine.slice';
import RuleListComponent from '../../components/ruleEngine/RuleList';
import { useRuleEnginePermissions } from '../../hooks/useRuleEnginePermissions';

const RuleList: React.FC = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);
  const [searchTerm, setSearchTerm] = useState('');

  const { canCreate } = useRuleEnginePermissions();
  const rules = useAppSelector(selectRules);
  const loading = useAppSelector(selectRuleEngineLoading);
  const error = useAppSelector(selectRuleEngineError);

  const safeRules = rules ?? [];

  const filteredRules = useMemo(() => {
    if (!searchTerm) return safeRules;
    const searchLower = searchTerm.toLowerCase();
    return safeRules.filter(rule => 
      rule.name.toLowerCase().includes(searchLower) ||
      (rule.description && rule.description.toLowerCase().includes(searchLower))
    );
  }, [safeRules, searchTerm]);

  // Fetch rules only once
  useEffect(() => {
    dispatch(fetchRules());
  }, [dispatch]);

  // Handle resize
  useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Memoized handlers
  const handleAddRule = useCallback(() => {
    navigate('/rule-engine/create');
  }, [navigate]);

  const handleSearchChange = useCallback((term: string) => {
    setSearchTerm(term);
  }, []);

  // Early return if no permission
  if (!canCreate) {
    return null;
  }

  return (
    <RuleListComponent
      rules={filteredRules}
      isLoading={loading}
      error={error}
      searchTerm={searchTerm}
      onSearchChange={handleSearchChange}
      onAddRule={handleAddRule}
      windowWidth={windowWidth}
    />
  );
};

export default RuleList; 