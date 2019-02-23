package com.seniorDesign.storage;

import com.google.common.collect.ImmutableList;
import com.seniorDesign.models.TemporalModel;
import lombok.NonNull;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.util.List;
import java.util.Map;

public class TemporalMap {
    private final Logger logger = LoggerFactory.getLogger(TemporalMap.class);

    @NonNull
    private Map<String, TemporalModel> nameToData;

    public TemporalMap(Map<String, TemporalModel> nameToData) {
        this.nameToData = nameToData;
    }

    /**
     * retrieves a {@link TemporalModel} object given {@code businessIdDate}
     *
     * @param businessIdDate A concatenation of a restaurant's business ID and month of the review count.
     * @return The {@link TemporalModel} object identified by {@code nameAddress}.
     */
    public TemporalModel getTemporalModel(String businessIdDate) {
        return this.nameToData.get(businessIdDate);
    }

    /**
     * Given a specific restaurant (name and address concatenated together), a start date and number of months per tick,
     * gives back a list of rating counts for each rating, the average and total for 24 months.
     *
     * @param businessId The business ID of the restaurant.
     * @param startDate  The starting date (month) for the return data.
     * @param num_months number of months per ticks
     * @return An {@link List} of rating counts including average and total each month.
     */
    public List<TemporalModel> getTemporalModels(String businessId, String startDate, int num_months) {
        ImmutableList.Builder<TemporalModel> temporalModelsBuilder = ImmutableList.builder();

        String[] tokens = startDate.split("-");
        int year = Integer.parseInt((tokens[0]));
        int month = Integer.parseInt(tokens[1]);

        for (int i = 0; i < 12; i++) {
            int oneStarCountTotal = 0, twoStarCountTotal = 0, threeStarCountTotal = 0, fourStarCountTotal = 0, fiveStarCountTotal = 0;
            String tickStart = String.valueOf(year) + "-" + String.format("%02d", (month - 1) % 12 + 1);

            // accumulate star counts over `num_months` months and store them in `result`.
            TemporalModel result;
            for (int j = 0; j < num_months; j++) {
                String currentDate = String.valueOf(year) + "-" + String.format("%02d", (month - 1) % 12 + 1);
                result = this.getTemporalModel(businessId + "_" + currentDate);

                if (result == null) {
                    continue;
                }

                // accumulate star counts
                oneStarCountTotal += result.getOneStarCount();
                twoStarCountTotal += result.getTwoStarCount();
                threeStarCountTotal += result.getThreeStarCount();
                fourStarCountTotal += result.getFourStarCount();
                fiveStarCountTotal += result.getFiveStarCount();

                if (month % 12 == 0) {
                    year++;
                }
                month++;
            }

            temporalModelsBuilder.add(
                    new TemporalModel(tickStart, oneStarCountTotal, twoStarCountTotal, threeStarCountTotal, fourStarCountTotal, fiveStarCountTotal));
        }
        return temporalModelsBuilder.build();
    }
}
