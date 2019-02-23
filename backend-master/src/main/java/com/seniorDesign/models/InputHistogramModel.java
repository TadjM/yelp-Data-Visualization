package com.seniorDesign.models;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.AllArgsConstructor;
import lombok.Getter;

import java.util.List;

@Getter
@AllArgsConstructor
public class InputHistogramModel {
    @JsonProperty("business_ids")
    List<String> businessIds;
}
