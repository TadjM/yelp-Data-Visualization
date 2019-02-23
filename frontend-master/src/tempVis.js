import React, { Component } from 'react';
import TemporalChart from './temporalChart';
import './App.css';
import isEmpty from 'lodash/isEmpty';

var url = 'http://18.222.174.225:8080/api/temporal/?business_id=bid&start_date=year-month&months=tick';
const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

class TempPage extends Component {

  constructor(props) {
    super(props);
    this.state = {
      month: '01',
      year: '2015',
      tick: '2',
      bid: 'eUuKXhloFVHdQsLdodcLbw',
      data: [],
      restData: [],
    };
    this.changeQuery = this.changeQuery.bind(this);
  }

  componentDidMount() {
    var query = url.replace("month", this.state.month);
    query = query.replace("year", this.state.year);
    query = query.replace("tick", this.state.tick);
    query = query.replace("bid", this.state.bid);
    fetch(query)
      .then((response) => {
        return response.json();
      })
      .then((jsonData) => {
        this.setState({data: jsonData});
      });
    fetch('http://18.222.174.225:8080/api/populate_temporal')
      .then((response) => {
        return response.json();
      })
      .then((jsonData) => {
        this.setState({restData: jsonData});
      });
  }

  monthOptions() {
    var monthArr = [];
    for(let i = 1; i <= 12; i++) {
      if(i == this.state.month) {
        monthArr.push(<option key={i} value={i} selected>{monthNames[i-1]}</option>)
      } else {
        monthArr.push(<option key={i} value={i}>{monthNames[i-1]}</option>)
      }
    }
    return monthArr;
  }

  yearOptions() {
    var yearArr = [];
    for(let i = 2005; i <= 2018; i++) {
      if(i == this.state.year) {
        yearArr.push(<option key={i} value={i} selected>{i}</option>)
      } else {
        yearArr.push(<option key={i} value={i}>{i}</option>)
      }
    }
    return yearArr;
  }

  tickOptions() {
    var tickArr = [];
    for(let i = 1; i <= 6; i++) {
      if(i == this.state.tick) {
        tickArr.push(<option key={-i} value={i} selected>{i}</option>)
      } else {
        tickArr.push(<option key={-i} value={i}>{i}</option>)
      }
    }
    return tickArr;
  }

  restOptions() {
    var restArr = [];
    var bid;
    var restName;
    var size;
    for(let i = 0; i < this.state.restData.length; i++) {
      bid = this.state.restData[i].business_id;
      restName = this.state.restData[i].restaurant_name;
      if(bid == this.state.bid) {
        restArr.push(<option key={bid} value={bid} selected>{restName}</option>)
      } else {
        restArr.push(<option key={bid} value={bid}>{restName}</option>)
      }
    }
    return restArr;
  }

  changeQuery() {
    var newMonth = document.getElementById('month').value;
    var newYear = document.getElementById('year').value;
    var newTick = document.getElementById('tick').value;
    var newBid = document.getElementById('bid').value;
    var query = url.replace("month", newMonth);
    query = query.replace("year", newYear);
    query = query.replace("tick", newTick);
    query = query.replace("bid", this.state.bid);
    this.setState({
      month: newMonth,
      year: newYear,
      tick: newTick,
      bid: newBid}
    );
    fetch(query)
      .then((response) => {
        return response.json();
      })
      .then((jsonData) => {
        this.setState({data: jsonData});
      });
    console.log(this.state.restData);
  }

  render() {

    const { data } = this.state;
    const hasData = data && !isEmpty(data);
    return (
      <div className="Center">
        <h2>Temporal Bar Chart Using Yelp Data</h2>
        <div className="Menu">
          <p className="Label"> Restaurant: </p>
          <select id="bid">
            {this.restOptions()}
          </select>
        </div>

        <div className="Menu">
          <p className="Label"> Month: </p>
          <select id="month">
            {this.monthOptions()}
          </select>

          <p className="Label"> Year: </p>
          <select id="year">
            {this.yearOptions()}
          </select>
        </div>

        <div className="Menu">
          <p className="Label"> Number of Months Per Bar: </p>
          <select id="tick">
            {this.tickOptions()}
          </select>

          <button onClick={this.changeQuery}>Submit</button>
        </div>


        {hasData ? (
          <TemporalChart data={this.state.data} classname="vis"/>
          ) : (
          <p>Loading...</p>
        )}

        <p> This visualization uses Yelp data over a selected period of time to form a bar graph depicting the ratings of the restaurants.
            The user can select the restaurant, and the start month and year for the data. The 'Number of Months Per Bar' option, defaulted to 2, allows the user to choose how many months of ratings each bar represents.
            Hitting 'Submit' will refresh the bar chart with the new dataset that the user has requested.
        </p>
      </div>
    )
  }
}

export default TempPage;
