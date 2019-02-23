package com.seniorDesign.models;

import com.fasterxml.jackson.annotation.JsonCreator;
import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.EqualsAndHashCode;
import lombok.Getter;

/**
 * This class represents one element of the data we want to return for the temporal visualization. It contains the
 * rating counts for each rating "level", the total number of ratings and average, for a single month (and the month
 * itself).
 */
@Getter
@EqualsAndHashCode
public class TemporalModel {
    private String month;
    private int oneStarCount;
    private int twoStarCount;
    private int threeStarCount;
    private int fourStarCount;
    private int fiveStarCount;
    private int total;
    private double average;

    @JsonCreator
    public TemporalModel(@JsonProperty("month") String month,
                         @JsonProperty("oneStarCount") int oneStarCount,
                         @JsonProperty("twoStarCount") int twoStarCount,
                         @JsonProperty("threeStarCount") int threeStarCount,
                         @JsonProperty("fourStarCount") int fourStarCount,
                         @JsonProperty("fiveStarCount") int fiveStarCount) {
        this.month = month;
        this.oneStarCount = oneStarCount;
        this.twoStarCount = twoStarCount;
        this.threeStarCount = threeStarCount;
        this.fourStarCount = fourStarCount;
        this.fiveStarCount = fiveStarCount;

        this.total = this.oneStarCount + this.twoStarCount + this.threeStarCount + this.fourStarCount + this.fiveStarCount;
        if (this.total != 0) {
            this.average = (this.oneStarCount + 2 * this.twoStarCount + 3 * this.threeStarCount + 4 * this.fourStarCount + 5 * this.fiveStarCount) / (float) this.total;
        } else {
            this.average = 0;
        }
    }
}
