package com.seniorDesign.config;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.datatype.guava.GuavaModule;
import com.google.common.collect.Maps;
import com.seniorDesign.models.RestaurantModel;
import com.seniorDesign.models.TemporalModel;
import com.seniorDesign.storage.RestaurantMap;
import com.seniorDesign.storage.TemporalMap;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import java.io.IOException;
import java.net.URL;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Configuration
public class VisualizationConfiguration {
    private final ObjectMapper mapper = new ObjectMapper().registerModule(new GuavaModule());

    @Bean
    TemporalMap temporalMap(@Value("${app.temporal_file_bucket}") String bucketName,
                            @Value("${app.temporal_file_name}") String fileName) {
        Map<String, TemporalModel> nameToData = Maps.newHashMap();

        try {
            Map<String, List<TemporalModel>> temporaryMap = mapper.readValue(
                    ConfigUtil.getCloudData(new URL("https://storage.googleapis.com/" + bucketName + "/" + fileName)),
                    new TypeReference<HashMap<String, List<TemporalModel>>>() {
                    });

            temporaryMap.forEach((key, value) -> value.forEach(temporalModel ->
                    nameToData.put(key + "_" + temporalModel.getMonth(), temporalModel)));
        } catch (IOException e) {
            e.printStackTrace();
        }
        return new TemporalMap(nameToData);
    }

    @Bean
    RestaurantMap restaurantMap(@Value("${app.temporal_file_bucket}") String bucketName,
                                @Value("${app.restaurant_data}") String fileName) {
        Map<String, RestaurantModel> businessIdToData = null;

        try {
            businessIdToData = mapper.readValue(
                    ConfigUtil.getCloudData(new URL("https://storage.googleapis.com/" + bucketName + "/" + fileName)),
                    new TypeReference<HashMap<String, RestaurantModel>>() {
                    });
        } catch (IOException e) {
            e.printStackTrace();
        }
        return new RestaurantMap(businessIdToData);
    }
}
