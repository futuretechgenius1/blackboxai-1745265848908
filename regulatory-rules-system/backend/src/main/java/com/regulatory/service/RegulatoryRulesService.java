package com.regulatory.service;

import com.regulatory.model.RegulatoryRule;
import com.regulatory.repository.RegulatoryRulesRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.ArrayList;
import java.util.HashMap;

@Service
@RequiredArgsConstructor
public class RegulatoryRulesService {

    private final RegulatoryRulesRepository repository;

    public Page<RegulatoryRule> getRules(String ruleType, String mdState, String shipToState, String channel, Pageable pageable) {
        return repository.findByFilters(ruleType, mdState, shipToState, channel, pageable);
    }

    public Optional<RegulatoryRule> getRuleById(String id) {
        return repository.findById(id);
    }

    @Transactional
    public RegulatoryRule createRule(RegulatoryRule rule) {
        validateRule(rule);
        return repository.save(rule);
    }

    @Transactional
    public RegulatoryRule updateRule(String id, RegulatoryRule rule) {
        validateRule(rule);
        rule.setId(id);
        return repository.save(rule);
    }

    private void validateRule(RegulatoryRule rule) {
        // Add any additional business validation logic here
        List<RegulatoryRule> existingRules = repository.findBySequenceNumber(rule.getSequenceNumber());
        if (!existingRules.isEmpty() && (rule.getId() == null || 
            !existingRules.get(0).getId().equals(rule.getId()))) {
            throw new IllegalArgumentException("Sequence number already exists");
        }

        // Validate relationships between fields
        if (rule.getMaxDaysSupply() != null && rule.getDaysSupply() != null &&
            rule.getDaysSupply() > rule.getMaxDaysSupply()) {
            throw new IllegalArgumentException("Days supply cannot exceed max days supply");
        }

        if (rule.getMaxQuantity() != null && rule.getQuantity() != null &&
            rule.getQuantity() > rule.getMaxQuantity()) {
            throw new IllegalArgumentException("Quantity cannot exceed max quantity");
        }

        if (rule.getMaxRefill() != null && rule.getRefillNumber() != null &&
            rule.getRefillNumber() > rule.getMaxRefill()) {
            throw new IllegalArgumentException("Refill number cannot exceed max refill");
        }
    }

    public List<Map<String, Object>> getFieldMetadata() {
        List<Map<String, Object>> metadata = new ArrayList<>();
        
        // Rule Type
        Map<String, Object> ruleType = new HashMap<>();
        ruleType.put("field", "ruleType");
        ruleType.put("label", "Rule Type");
        ruleType.put("type", "dropdown");
        ruleType.put("options", List.of("State", "Federal"));
        ruleType.put("required", true);
        metadata.add(ruleType);

        // MD State
        Map<String, Object> mdState = new HashMap<>();
        mdState.put("field", "mdState");
        mdState.put("label", "MD State");
        mdState.put("type", "dropdown");
        mdState.put("options", List.of("AL", "AK", "AZ", "AR", "CA", "CO", "CT", "DE", "FL", "GA",
                                     "HI", "ID", "IL", "IN", "IA", "KS", "KY", "LA", "ME", "MD",
                                     "MA", "MI", "MN", "MS", "MO", "MT", "NE", "NV", "NH", "NJ",
                                     "NM", "NY", "NC", "ND", "OH", "OK", "OR", "PA", "RI", "SC",
                                     "SD", "TN", "TX", "UT", "VT", "VA", "WA", "WV", "WI", "WY"));
        mdState.put("required", true);
        metadata.add(mdState);

        // Ship To State
        Map<String, Object> shipToState = new HashMap<>();
        shipToState.put("field", "shipToState");
        shipToState.put("label", "Ship To State");
        shipToState.put("type", "dropdown");
        shipToState.put("options", List.of("AL", "AK", "AZ", "AR", "CA", "CO", "CT", "DE", "FL", "GA",
                                         "HI", "ID", "IL", "IN", "IA", "KS", "KY", "LA", "ME", "MD",
                                         "MA", "MI", "MN", "MS", "MO", "MT", "NE", "NV", "NH", "NJ",
                                         "NM", "NY", "NC", "ND", "OH", "OK", "OR", "PA", "RI", "SC",
                                         "SD", "TN", "TX", "UT", "VT", "VA", "WA", "WV", "WI", "WY"));
        shipToState.put("required", true);
        metadata.add(shipToState);

        // Numeric fields
        addNumericField(metadata, "refillNumber", "Refill Number", 0, null, false);
        addNumericField(metadata, "quantity", "Quantity", 0, null, false);
        addNumericField(metadata, "daysSupply", "Days Supply", 0, null, false);
        addNumericField(metadata, "daysAgo", "Days Ago", 0, null, false);
        addNumericField(metadata, "maxDaysSupply", "Max Days Supply", 0, null, false);
        addNumericField(metadata, "maxQuantity", "Max Quantity", 0, null, false);
        addNumericField(metadata, "maxRefill", "Max Refill", 0, null, false);
        addNumericField(metadata, "maxDaysAllowedToExpiryDate", "Max Days Allowed To Expiry Date", 0, null, false);

        // Text fields
        addTextField(metadata, "zipCode", "Zip Code", false);
        addTextField(metadata, "channel", "Channel", false);
        addTextField(metadata, "regCatCode", "Reg Cat Code", false);
        addTextField(metadata, "drugSchedule", "Drug Schedule", false);
        addTextField(metadata, "userLocation", "User Location", false);
        addTextField(metadata, "dispensingLocation", "Dispensing Location", false);
        addTextField(metadata, "protocol", "Protocol", false);
        addTextField(metadata, "sequenceNumber", "Sequence Number", true);

        return metadata;
    }

    private void addNumericField(List<Map<String, Object>> metadata, String field, String label, 
                               Integer min, Integer max, boolean required) {
        Map<String, Object> numericField = new HashMap<>();
        numericField.put("field", field);
        numericField.put("label", label);
        numericField.put("type", "number");
        if (min != null) numericField.put("min", min);
        if (max != null) numericField.put("max", max);
        numericField.put("required", required);
        metadata.add(numericField);
    }

    private void addTextField(List<Map<String, Object>> metadata, String field, String label, boolean required) {
        Map<String, Object> textField = new HashMap<>();
        textField.put("field", field);
        textField.put("label", label);
        textField.put("type", "text");
        textField.put("required", required);
        metadata.add(textField);
    }
}
