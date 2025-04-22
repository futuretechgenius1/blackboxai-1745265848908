package com.regulatory.repository;

import com.regulatory.model.RegulatoryRule;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;
import java.util.List;

public interface RegulatoryRulesRepository extends MongoRepository<RegulatoryRule, String> {
    
    Page<RegulatoryRule> findByRuleTypeAndMdState(String ruleType, String mdState, Pageable pageable);
    
    @Query("{ $and: [ " +
           "?#{ [0] == null ? { $where: '1' } : { 'ruleType': [0] } }, " +
           "?#{ [1] == null ? { $where: '1' } : { 'mdState': [1] } }, " +
           "?#{ [2] == null ? { $where: '1' } : { 'shipToState': [2] } }, " +
           "?#{ [3] == null ? { $where: '1' } : { 'channel': [3] } } " +
           "] }")
    Page<RegulatoryRule> findByFilters(String ruleType, String mdState, String shipToState, String channel, Pageable pageable);
    
    List<RegulatoryRule> findBySequenceNumber(String sequenceNumber);
}
