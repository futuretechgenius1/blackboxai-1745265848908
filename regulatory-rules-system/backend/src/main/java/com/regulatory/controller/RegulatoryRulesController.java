package com.regulatory.controller;

import com.regulatory.model.RegulatoryRule;
import com.regulatory.service.RegulatoryRulesService;
import lombok.RequiredArgsConstructor;
import org.apache.commons.csv.CSVFormat;
import org.apache.commons.csv.CSVPrinter;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import javax.servlet.http.HttpServletResponse;
import javax.validation.Valid;
import java.io.IOException;
import java.io.OutputStreamWriter;
import java.io.Writer;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/rules")
@RequiredArgsConstructor
@CrossOrigin(origins = "${cors.allowed-origins}", allowCredentials = "true")
public class RegulatoryRulesController {

    private final RegulatoryRulesService service;

    @GetMapping("/fields")
    public ResponseEntity<List<Map<String, Object>>> getFieldMetadata() {
        return ResponseEntity.ok(service.getFieldMetadata());
    }

    @GetMapping
    public ResponseEntity<Page<RegulatoryRule>> getRules(
            @RequestParam(required = false) String ruleType,
            @RequestParam(required = false) String mdState,
            @RequestParam(required = false) String shipToState,
            @RequestParam(required = false) String channel,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "25") int size,
            @RequestParam(defaultValue = "sequenceNumber") String sort) {

        PageRequest pageRequest = PageRequest.of(page, size, Sort.by(sort));
        Page<RegulatoryRule> rules = service.getRules(ruleType, mdState, shipToState, channel, pageRequest);
        return ResponseEntity.ok(rules);
    }

    @GetMapping("/{id}")
    public ResponseEntity<RegulatoryRule> getRuleById(@PathVariable String id) {
        return service.getRuleById(id)
                .map(ResponseEntity::ok)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Rule not found"));
    }

    @PostMapping
    @PreAuthorize("hasRole('WRITE_ACCESS')")
    public ResponseEntity<RegulatoryRule> createRule(@Valid @RequestBody RegulatoryRule rule) {
        try {
            RegulatoryRule createdRule = service.createRule(rule);
            return new ResponseEntity<>(createdRule, HttpStatus.CREATED);
        } catch (IllegalArgumentException e) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, e.getMessage());
        }
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('WRITE_ACCESS')")
    public ResponseEntity<RegulatoryRule> updateRule(
            @PathVariable String id,
            @Valid @RequestBody RegulatoryRule rule) {
        try {
            RegulatoryRule updatedRule = service.updateRule(id, rule);
            return ResponseEntity.ok(updatedRule);
        } catch (IllegalArgumentException e) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, e.getMessage());
        }
    }

    @GetMapping("/extract")
    public void exportToCsv(
            @RequestParam(required = false) String ruleType,
            @RequestParam(required = false) String mdState,
            @RequestParam(required = false) String shipToState,
            @RequestParam(required = false) String channel,
            HttpServletResponse response) throws IOException {
        
        response.setContentType("text/csv");
        response.setHeader(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=regulatory_rules.csv");

        // Get all rules for export (no pagination)
        Page<RegulatoryRule> rules = service.getRules(ruleType, mdState, shipToState, channel, 
            PageRequest.of(0, Integer.MAX_VALUE, Sort.by("sequenceNumber")));

        String[] headers = {
            "Sequence Number", "Rule Type", "MD State", "Ship To State", "Zip Code",
            "Channel", "Reg Cat Code", "Drug Schedule", "Refill Number", "Quantity",
            "Days Supply", "User Location", "Dispensing Location", "Protocol",
            "Days Ago", "Max Days Supply", "Max Quantity", "Max Refill",
            "Max Days Allowed To Expiry Date"
        };

        try (Writer writer = new OutputStreamWriter(response.getOutputStream());
             CSVPrinter csvPrinter = new CSVPrinter(writer, CSVFormat.DEFAULT.withHeader(headers))) {
            
            for (RegulatoryRule rule : rules.getContent()) {
                csvPrinter.printRecord(
                    rule.getSequenceNumber(),
                    rule.getRuleType(),
                    rule.getMdState(),
                    rule.getShipToState(),
                    rule.getZipCode(),
                    rule.getChannel(),
                    rule.getRegCatCode(),
                    rule.getDrugSchedule(),
                    rule.getRefillNumber(),
                    rule.getQuantity(),
                    rule.getDaysSupply(),
                    rule.getUserLocation(),
                    rule.getDispensingLocation(),
                    rule.getProtocol(),
                    rule.getDaysAgo(),
                    rule.getMaxDaysSupply(),
                    rule.getMaxQuantity(),
                    rule.getMaxRefill(),
                    rule.getMaxDaysAllowedToExpiryDate()
                );
            }
            csvPrinter.flush();
        }
    }

    @GetMapping("/user/access")
    public ResponseEntity<Map<String, Object>> getUserAccess() {
        // This is a simplified version. In a real application, you would get this from
        // the security context or user service
        return ResponseEntity.ok(Map.of(
            "role", "WRITE_ACCESS",
            "permissions", List.of("create", "edit", "export")
        ));
    }
}
