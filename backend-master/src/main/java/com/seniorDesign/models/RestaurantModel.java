package com.seniorDesign.models;


import com.fasterxml.jackson.annotation.JsonCreator;
import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.EqualsAndHashCode;
import lombok.Getter;

import java.util.List;

@Getter
@EqualsAndHashCode
public class RestaurantModel {
    private String name;
    private String address;
    private double latitude;
    private double longitude;
    private List<String> attributes;

    @JsonCreator
    public RestaurantModel(@JsonProperty("name") String name,
                           @JsonProperty("address") String address,
                           @JsonProperty("latitude") double latitude,
                           @JsonProperty("longitude") double longitude,
                           @JsonProperty("restaurant_attributes") List<String> attributes) {
        this.name = name;
        this.address = address;
        this.latitude = latitude;
        this.longitude = longitude;
        this.attributes = attributes;
    }
}
