package com.seniorDesign.services;

import com.google.common.collect.ImmutableList;
import com.seniorDesign.models.AttributeCountModel;
import com.seniorDesign.models.LocationModel;
import com.seniorDesign.storage.RestaurantMap;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

/**
 * This class will house the functionality for retrieving the locations of maps and generating a histogram for
 * attributes in the yelp data.
 */
@Service
public class CartogramService {
    @Autowired
    private RestaurantMap restaurantMap;

    public List<LocationModel> getAllRestaurantLocations() {
        return restaurantMap.getAllLocations();
    }

    public List<AttributeCountModel> getAttributeHistogram(List<String> businessIds) {
        ImmutableList.Builder<AttributeCountModel> attributeCountModelBuilder = ImmutableList.builder();
        restaurantMap.getAttributeCountMap(businessIds).forEach((
                k, v) -> attributeCountModelBuilder.add(new AttributeCountModel(k, v)));
        return attributeCountModelBuilder.build();
    }
}
