package com.seniorDesign.models;


import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.AllArgsConstructor;
import lombok.EqualsAndHashCode;

@EqualsAndHashCode
@AllArgsConstructor
public class LocationModel {
    @JsonProperty("business_id")
    private String businessId;

    @JsonProperty("restaurant_name")
    private String name;

    @JsonProperty("latitude")
    private double latitude;

    @JsonProperty("longitude")
    private double longitude;
}
