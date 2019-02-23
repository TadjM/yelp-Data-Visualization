package com.seniorDesign.storage;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.google.common.collect.ImmutableList;
import com.seniorDesign.config.VizTestingConfiguration;
import com.seniorDesign.models.TemporalModel;
import org.junit.Assert;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.test.context.ContextConfiguration;
import org.springframework.test.context.junit4.SpringRunner;

import java.io.IOException;
import java.util.HashMap;
import java.util.List;

@RunWith(SpringRunner.class)
@ContextConfiguration(classes = {VizTestingConfiguration.class})
public class TemporalMapTest {
    @Autowired
    private TemporalMap temporalMap;

    @Test
    public void TestRetrieveWithTicksOfSizeTwo() {
        ImmutableList<TemporalModel> groundTruthData = ImmutableList.of(
                new TemporalModel("2018-01", 2, 4, 6, 8, 10),
                new TemporalModel("2018-03", 2, 4, 6, 8, 10),
                new TemporalModel("2018-05", 2, 4, 6, 8, 10),
                new TemporalModel("2018-07", 2, 4, 6, 8, 10),
                new TemporalModel("2018-09", 2, 4, 6, 8, 10),
                new TemporalModel("2018-11", 2, 4, 6, 8, 10),
                new TemporalModel("2019-01", 2, 4, 6, 8, 10),
                new TemporalModel("2019-03", 2, 4, 6, 8, 10),
                new TemporalModel("2019-05", 2, 4, 6, 8, 10),
                new TemporalModel("2019-07", 2, 4, 6, 8, 10),
                new TemporalModel("2019-09", 2, 4, 6, 8, 10),
                new TemporalModel("2019-11", 2, 4, 6, 8, 10));

        List<TemporalModel> resultList = this.temporalMap.getTemporalModels("MacDonalds", "2018-01", 2);
        Assert.assertEquals(groundTruthData, resultList);
    }

    @Test
    public void TestPutAndGetSingleRecord() {
        ObjectMapper mapper = new ObjectMapper();
        String payload = "{\"RestaurantA_AddressA_2013-01\": {\"fourStarCount\": 1, \"month\": \"2013-01\", \"threeStarCount\": 3, \"oneStarCount\": 5, \"fiveStarCount\": 1, \"twoStarCount\": 3}}";
        try {
            this.temporalMap = new TemporalMap(mapper.readValue(payload, new TypeReference<HashMap<String, TemporalModel>>() {
            }));
        } catch (IOException e) {
            e.printStackTrace();
        }

        Assert.assertNotNull(this.temporalMap.getTemporalModel("RestaurantA_AddressA_2013-01"));

        TemporalModel result = this.temporalMap.getTemporalModel("RestaurantA_AddressA_2013-01");
        TemporalModel expectedModel = new TemporalModel("2013-01", 5, 3, 3, 1, 1);

        Assert.assertEquals(expectedModel, result);
    }
}
