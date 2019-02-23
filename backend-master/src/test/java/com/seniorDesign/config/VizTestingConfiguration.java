package com.seniorDesign.config;

import com.google.common.collect.Maps;
import com.seniorDesign.TestUtil;
import com.seniorDesign.models.RestaurantModel;
import com.seniorDesign.models.TemporalModel;
import com.seniorDesign.services.HeatMapService;
import com.seniorDesign.storage.RestaurantMap;
import com.seniorDesign.storage.TemporalMap;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import java.util.List;
import java.util.Map;

@Configuration
public class VizTestingConfiguration {
    private final Logger logger = LoggerFactory.getLogger(VizTestingConfiguration.class);

    @Bean
    public TemporalMap temporalMap() {
        logger.info("Creating TemporalMap for testing");
        Map<String, TemporalModel> nameToData = Maps.newHashMap();
        TestUtil.getTestTemporalData().forEach(model -> nameToData.put("MacDonalds_" + model.getMonth(), model));
        return new TemporalMap(nameToData);
    }

    @Bean
    public RestaurantMap restaurantMap() {
        logger.info("Creating RestaurantMap for testing");
        List<RestaurantModel> restaurantModels = TestUtil.getTestRestaurantData();
        Map<String, RestaurantModel> businessIdToData = Maps.newHashMap();
        for (int i = 0; i < restaurantModels.size(); i++) {
            businessIdToData.put(String.valueOf(i), restaurantModels.get(i));
        }
        return new RestaurantMap(businessIdToData);
    }

    @Bean
    public HeatMapService heatMapService() {
        logger.info("Creating HeatMapService for testing");
        return new HeatMapService();
    }
}
