package com.seniorDesign.services;

import com.seniorDesign.models.BriefRestaurantModel;
import com.seniorDesign.models.TemporalModel;
import com.seniorDesign.storage.RestaurantMap;
import com.seniorDesign.storage.TemporalMap;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class TemporalService {
    @Autowired
    private TemporalMap temporalMap;

    @Autowired
    private RestaurantMap restaurantMap;

    /**
     * Given a specific restaurant (name and address concatenated together) and a start date, gives back a list of
     * rating counts for each rating, the average and total for 24 months.
     *
     * @param res       A restaurant name and its address concatenated together.
     * @param startDate The starting date (month) for the return data.
     * @param months    number of months per ticks
     * @return An {@link List} of rating counts including average and total each month.
     */
    public List<TemporalModel> getRating(String res, String startDate, String months) {
        return this.temporalMap.getTemporalModels(res, startDate, Integer.parseInt(months));
    }

    public List<BriefRestaurantModel> getRestaurantsSummary() {
        return this.restaurantMap.getRestaurantsSummary();
    }
}