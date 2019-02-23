package com.seniorDesign.controllers;

import com.google.common.collect.ImmutableList;
import com.seniorDesign.models.*;
import com.seniorDesign.services.CartogramService;
import com.seniorDesign.services.HeatMapService;
import com.seniorDesign.services.TemporalService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;


@RestController
public class ApiController {
    @Autowired
    private TemporalService temporalService;

    @Autowired
    private CartogramService cartogramService;

    @Autowired
    private HeatMapService heatMapService;

    /**
     * Displays some sample text on the homepage. Can be used to test that the application is up and running.
     *
     * @return a response String.
     */
    @CrossOrigin
    @GetMapping("/")
    String home() {
        return "Senior Design";
    }

    /**
     * Given a specific business ID and a start date, gives back a list of
     * rating counts for each rating, the average and total for 24 months.
     *
     * @param businessId business ID of the restaurant.
     * @param startDate  The starting date (month) for the return data.
     * @param months     number of months per tick
     * @return A Json response containing a list of rating counts including average and total each month.
     */
    @CrossOrigin
    @GetMapping("${app.temporal_url}")
    public List<TemporalModel> getRating(@RequestParam("business_id") String businessId, @RequestParam("start_date") String startDate, @RequestParam("months") String months) {
        return temporalService.getRating(businessId, startDate, months);
    }

    /**
     * Retrieves all of the locations of restaurants. The purpose of this endpoint is primarily to help the frontend
     * fill up a map with waypoints.
     *
     * @return A list of {@link LocationModel} objects.
     */
    @CrossOrigin
    @GetMapping("${app.populate_map_url}")
    public List<LocationModel> getMapPopulationData() {
        return cartogramService.getAllRestaurantLocations();
    }

    /**
     * Retrieves a histogram of attributes for the restaurants specified in {@code businessIds}.
     *
     * @param businessIds A list of business IDs for which we want to generate a histogram.
     * @return A histogram represented as a map of attributes to their counts.
     */
    @CrossOrigin
    @PostMapping(value = "${app.histogram_url}", produces = MediaType.APPLICATION_JSON_UTF8_VALUE)
    public Map<String, ImmutableList<AttributeCountModel>> getAttributeHistogram(@RequestBody InputHistogramModel businessIds) {
        Map<String, ImmutableList<AttributeCountModel>> formatted = new HashMap<>();
        formatted.put("children", ImmutableList.copyOf(cartogramService.getAttributeHistogram(businessIds.getBusinessIds())));
        return formatted;
    }

    @CrossOrigin
    @PostMapping(value = "${app.correlation_url}", produces = MediaType.APPLICATION_JSON_UTF8_VALUE)
    public List<CorrelationModel> getCorrelation(@RequestBody InputCorrelationModel correlationParams) {
        return heatMapService.getPearsonCorrelation(correlationParams.getBusinessIds(), correlationParams.getAttributeNames());
    }

    @CrossOrigin
    @GetMapping("${app.populate_temporal}")
    public List<BriefRestaurantModel> getTemporalPopulationData() {
        return temporalService.getRestaurantsSummary();
    }
}
