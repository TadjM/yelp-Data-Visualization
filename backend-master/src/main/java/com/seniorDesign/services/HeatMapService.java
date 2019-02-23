package com.seniorDesign.services;

import com.google.common.collect.ImmutableList;
import com.seniorDesign.models.CorrelationModel;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Random;

@Service
public class HeatMapService {
    public List<CorrelationModel> getPearsonCorrelation(List<String> businessId, List<String> attributes) {
        ImmutableList.Builder<CorrelationModel> correlationModelBuilder = ImmutableList.builder();
        businessId.forEach(bid -> attributes.forEach(attr ->
                correlationModelBuilder.add(new CorrelationModel(bid, attr, new Random().nextDouble() % 2 - 1))));
        return correlationModelBuilder.build();
    }
}
