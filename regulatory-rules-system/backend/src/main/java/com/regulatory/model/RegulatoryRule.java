package com.regulatory.model;

import lombok.Data;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import javax.validation.constraints.*;

@Data
@Document(collection = "regulatory_rules")
public class RegulatoryRule {
    @Id
    private String id;

    @NotBlank(message = "Rule type is required")
    private String ruleType;

    @NotBlank(message = "MD State is required")
    private String mdState;

    @NotBlank(message = "Ship to state is required")
    private String shipToState;

    private String zipCode;

    private String channel;

    private String regCatCode;

    private String drugSchedule;

    @Min(value = 0, message = "Refill number must be non-negative")
    private Integer refillNumber;

    @Min(value = 0, message = "Quantity must be non-negative")
    private Integer quantity;

    @Min(value = 0, message = "Days supply must be non-negative")
    private Integer daysSupply;

    private String userLocation;

    private String dispensingLocation;

    private String protocol;

    @Min(value = 0, message = "Days ago must be non-negative")
    private Integer daysAgo;

    @Min(value = 0, message = "Max days supply must be non-negative")
    private Integer maxDaysSupply;

    @Min(value = 0, message = "Max quantity must be non-negative")
    private Integer maxQuantity;

    @Min(value = 0, message = "Max refill must be non-negative")
    private Integer maxRefill;

    @Min(value = 0, message = "Max days allowed to expiry date must be non-negative")
    private Integer maxDaysAllowedToExpiryDate;

    @NotBlank(message = "Sequence number is required")
    private String sequenceNumber;
}
