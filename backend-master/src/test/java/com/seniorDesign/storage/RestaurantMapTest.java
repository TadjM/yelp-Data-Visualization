package com.seniorDesign.storage;

import com.seniorDesign.TestUtil;
import com.seniorDesign.config.VizTestingConfiguration;
import com.seniorDesign.models.BriefRestaurantModel;
import org.junit.Assert;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.test.context.ContextConfiguration;
import org.springframework.test.context.junit4.SpringRunner;

import java.util.Arrays;
import java.util.List;
import java.util.Map;

@RunWith(SpringRunner.class)
@ContextConfiguration(classes = {VizTestingConfiguration.class})
public class RestaurantMapTest {
    @Autowired
    private RestaurantMap restaurantMap;

    @Test
    public void TestGetAllLocations() {
        Assert.assertEquals(TestUtil.getGroundTruthLocationData(), this.restaurantMap.getAllLocations());
    }

    @Test
    public void TestGetSingleRestaurant() {
        Assert.assertEquals(TestUtil.getTestRestaurantData().get(0), this.restaurantMap.getRestaurantModel(String.valueOf(0)));
    }

    @Test
    public void TestGetHistogram() {
        Map<String, Integer> attributeCountMap = this.restaurantMap.getAttributeCountMap(Arrays.asList("0", "1", "2"));
        Assert.assertEquals((Integer) 3, attributeCountMap.get("CreditCard"));
        Assert.assertEquals((Integer) 1, attributeCountMap.get("Parking"));
    }

    @Test
    public void TestGetSummary() {
        List<BriefRestaurantModel> briefRestaurantModels = this.restaurantMap.getRestaurantsSummary();
        List<BriefRestaurantModel> groundTruthModels = Arrays.asList(
                new BriefRestaurantModel("0", "A Street", "MacDonalds"),
                new BriefRestaurantModel("1", "B Street", "Burger King"),
                new BriefRestaurantModel("2", "C Street", "Wendy's"));

        Assert.assertEquals(groundTruthModels, briefRestaurantModels);
    }
}
