package com.seniorDesign.models;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public class AttributeCountModel {
    @JsonProperty("Name")
    String attributeName;

    @JsonProperty("Count")
    int count;
}
