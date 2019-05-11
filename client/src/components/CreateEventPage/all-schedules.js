import React, { Component } from "react";
import ReactTable from 'react-table';
import API from "../../utils/API";
import {
    BrowserRouter as Router,
    Link,
   
  } from 'react-router-dom';


class AllSchedules extends Component {
    constructor(props) {
        super(props)
        this.state = {
            array: [],
            name: "",
            location: "",
            date: "",
            start: "",
            end: ""
        }
        this.getEvents.bind(this);
    };

    getEvents = () => {
        API.getAllEvents()
            .then(res => {
                // console.log(res)
                this.setState({
                    array: res.data
                });
            console.log(res)
            })
    }
    removeEvent = (eventId)=>{
        API.removeEvent(eventId)
            .then(res=>{
                API.getAllEvents()
                    .then(res=>{
                        this.setState({
                        array: res.data
                    })
                })
            })
    }

    componentDidMount = () => { this.getEvents(); }

    render() {
        const columns = [
            {
                id: "name",
                Header: "Event",
                accessor: "name"
            },
            {
                id: "location",
                Header: "Location",
                accessor: "location"
            },
            {
                id:"date",
                Header: "date",
                accessor: "date"
            },
            {
                id: "start",
                Header: "Event Start",
                accessor: "start"
            },
            {
                id: "end",
                Header: "Event End",
                accessor: "end"
            }, {
                Header: 'Delete',
                        id: 'deleteuser',
                        accessor: event => <button onClick={(e) => this.removeEvent(event.id)}>X</button>
            }
        ]

        return (
            <div>
                    <ReactTable
                        columns={columns}
                        minRows={0}
                        data={this.state.array}
                    />
            </div>
        )
    }
}
export default AllSchedules;