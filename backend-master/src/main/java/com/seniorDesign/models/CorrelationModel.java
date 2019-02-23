package com.seniorDesign.models;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.AllArgsConstructor;
import lombok.EqualsAndHashCode;
import lombok.Getter;

@Getter
@EqualsAndHashCode
@AllArgsConstructor
public class CorrelationModel {
    @JsonProperty("business_id")
    String businessId;

    @JsonProperty("attribute")
    String attribute;

    @JsonProperty("correlation")
    double correlation;
}
