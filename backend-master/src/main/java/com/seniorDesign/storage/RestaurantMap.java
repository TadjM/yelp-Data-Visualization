package com.seniorDesign.storage;


import com.google.common.collect.ImmutableList;
import com.google.common.collect.Maps;
import com.seniorDesign.models.BriefRestaurantModel;
import com.seniorDesign.models.LocationModel;
import com.seniorDesign.models.RestaurantModel;
import lombok.NonNull;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.util.List;
import java.util.Map;

public class RestaurantMap {
    private final Logger logger = LoggerFactory.getLogger(RestaurantMap.class);

    @NonNull
    private Map<String, RestaurantModel> businessIdToData;

    public RestaurantMap(Map<String, RestaurantModel> businessIdToData) {
        this.businessIdToData = businessIdToData;
    }

    /**
     * retrieves a {@link RestaurantModel} object given {@code businessId}.
     *
     * @param businessId A restaurant's business id
     * @return The {@link RestaurantModel} object identified by {@code businessId}.
     */
    public RestaurantModel getRestaurantModel(String businessId) {
        return this.businessIdToData.get(businessId);
    }

    /**
     * retrieves a list of all {@link LocationModel}s
     *
     * @return a list of all {@link LocationModel}s
     */
    public List<LocationModel> getAllLocations() {
        ImmutableList.Builder<LocationModel> locationModelBuilder = ImmutableList.builder();
        for (String i : businessIdToData.keySet()) {
            RestaurantModel restaurantModel = businessIdToData.get(i);
            locationModelBuilder.add(
                    new LocationModel(i, restaurantModel.getName(), restaurantModel.getLatitude(), restaurantModel.getLongitude()));
        }
        return locationModelBuilder.build();
    }

    public Map<String, Integer> getAttributeCountMap(List<String> businessIds) {
        ImmutableList.Builder<RestaurantModel> restaurantModelBuilder = ImmutableList.builder();
        businessIds.forEach(id -> restaurantModelBuilder.add(this.getRestaurantModel(id)));
        ImmutableList<RestaurantModel> attributeCountModels = restaurantModelBuilder.build();

        Map<String, Integer> attributeCountMap = Maps.newHashMap();
        attributeCountModels.forEach(model -> model.getAttributes().forEach(attribute -> {
            attributeCountMap.computeIfPresent(attribute, (k, v) -> ++v);
            attributeCountMap.putIfAbsent(attribute, 1);
        }));
        return attributeCountMap;
    }

    public List<BriefRestaurantModel> getRestaurantsSummary() {
        ImmutableList.Builder<BriefRestaurantModel> briefRestaurantModelBuilder = ImmutableList.builder();
        this.businessIdToData.forEach((businessId, model) -> briefRestaurantModelBuilder.add(
                new BriefRestaurantModel(businessId, model.getAddress(), model.getName())
        ));
        return briefRestaurantModelBuilder.build();
    }
}
