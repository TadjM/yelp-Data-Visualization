package com.seniorDesign.services;

import com.seniorDesign.config.VizTestingConfiguration;
import com.seniorDesign.models.CorrelationModel;
import org.hamcrest.MatcherAssert;
import org.hamcrest.Matchers;
import org.junit.Assert;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.test.context.ContextConfiguration;
import org.springframework.test.context.junit4.SpringRunner;

import java.util.Arrays;
import java.util.List;

@RunWith(SpringRunner.class)
@ContextConfiguration(classes = {VizTestingConfiguration.class})
public class HeatMapServiceTest {
    @Autowired
    private HeatMapService heatMapService;

    @Test
    public void TestPearsonsCorrelation() {
        // TODO: Make the function we're testing deterministic and test the output.
        for (int i = 0; i < 100; i++) {
            List<CorrelationModel> ret = heatMapService.getPearsonCorrelation(
                    Arrays.asList("b1", "b2"),
                    Arrays.asList("a1", "a2"));

            Assert.assertEquals(4, ret.size());
            Assert.assertEquals("b1", ret.get(0).getBusinessId());
            Assert.assertEquals("a1", ret.get(0).getAttribute());

            Assert.assertEquals("b1", ret.get(1).getBusinessId());
            Assert.assertEquals("a2", ret.get(1).getAttribute());

            Assert.assertEquals("b2", ret.get(2).getBusinessId());
            Assert.assertEquals("a1", ret.get(2).getAttribute());

            Assert.assertEquals("b2", ret.get(3).getBusinessId());
            Assert.assertEquals("a2", ret.get(3).getAttribute());

            ret.forEach(model -> {
                MatcherAssert.assertThat(model.getCorrelation(), Matchers.greaterThanOrEqualTo(-1.0));
                MatcherAssert.assertThat(model.getCorrelation(), Matchers.lessThanOrEqualTo(1.0));
            });
        }
    }
}
