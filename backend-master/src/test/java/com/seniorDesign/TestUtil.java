package com.seniorDesign;

import com.google.common.collect.ImmutableList;
import com.seniorDesign.models.LocationModel;
import com.seniorDesign.models.RestaurantModel;
import com.seniorDesign.models.TemporalModel;

import java.util.Arrays;
import java.util.Collections;
import java.util.Map;

public class TestUtil {
    public static ImmutableList<TemporalModel> getTestTemporalData() {
        ImmutableList.Builder<TemporalModel> temporalModelBuilder = ImmutableList.builder();
        for (int i = 0; i < 120; i++) {
            String date = String.valueOf(2018 + i / 12) + "-" + String.format("%02d", i % 12 + 1);
            temporalModelBuilder.add(new TemporalModel(date, 1, 2, 3, 4, 5));
        }
        return temporalModelBuilder.build();
    }

    public static ImmutableList<RestaurantModel> getTestRestaurantData() {
        return ImmutableList.of(
                new RestaurantModel("MacDonalds", "A Street", 1, 4,
                        ImmutableList.copyOf(Arrays.asList("CreditCard", "Parking"))),
                new RestaurantModel("Burger King", "B Street", 2, 5,
                        ImmutableList.copyOf(Collections.singletonList("CreditCard"))),
                new RestaurantModel("Wendy's", "C Street", 3, 6,
                        ImmutableList.copyOf(Collections.singletonList("CreditCard"))));
    }

    public static ImmutableList<LocationModel> getGroundTruthLocationData() {
        ImmutableList<RestaurantModel> restaurantModels = TestUtil.getTestRestaurantData();
        ImmutableList.Builder<LocationModel> locationModelBuilder = ImmutableList.builder();
        for (int i = 0; i < restaurantModels.size(); i++) {
            RestaurantModel restaurantModel = restaurantModels.get(i);
            locationModelBuilder.add(new LocationModel(
                    String.valueOf(i), restaurantModel.getName(), restaurantModel.getLatitude(), restaurantModel.getLongitude()));
        }
        return locationModelBuilder.build();
    }

    /**
     * Takes some arguments and inserts them into the URL of a GET request.
     *
     * @param baseURL The URL of the resource we want to query.
     * @param args    Key Value pairs which we want to insert as arguments into the URL.
     * @return The {@code baseURL} with {@code args} inserted into it.
     */
    public static String buildGETQuery(String baseURL, Map<String, String> args) {
        StringBuilder sb = new StringBuilder();
        sb.append(baseURL);
        sb.append("?");
        args.forEach((k, v) -> sb.append(k + "=" + v + "&"));
        return sb.toString();
    }

}
