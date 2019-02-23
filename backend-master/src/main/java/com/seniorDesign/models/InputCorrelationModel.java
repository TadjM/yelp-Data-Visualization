package com.seniorDesign.models;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.AllArgsConstructor;
import lombok.EqualsAndHashCode;
import lombok.Getter;

import java.util.List;

@Getter
@EqualsAndHashCode
@AllArgsConstructor
public class InputCorrelationModel {
    @JsonProperty("business_ids")
    List<String> businessIds;

    @JsonProperty("attribute_names")
    List<String> attributeNames;
}
