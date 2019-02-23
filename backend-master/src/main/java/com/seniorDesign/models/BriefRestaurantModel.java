package com.seniorDesign.models;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.AllArgsConstructor;
import lombok.EqualsAndHashCode;
import lombok.Getter;

@Getter
@EqualsAndHashCode
@AllArgsConstructor
public class BriefRestaurantModel {
    @JsonProperty("business_id")
    String businessId;

    @JsonProperty("restaurant_address")
    String address;

    @JsonProperty("restaurant_name")
    String name;
}
