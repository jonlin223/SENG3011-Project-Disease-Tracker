import React from 'react';
import NavBar from '../navbar';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Grid from '@mui/material/Grid';
import { styled } from '@mui/material/styles';
import { useState } from "react";
import { Card, CardHeader, Divider, Button } from "@mui/material";
import { MultiSelect } from "react-multi-select-component";


const Report = () => {
    const options = [
        { label: "Ebola 🍇", value: "ebola" },
        { label: " Heptatitis 🥭", value: "heptatitis" },
        { label: "Measles 🍓", value: "measles" },
        { label: "Listeriosis 🚀", value: "listeriosis" }
    ];
    const [disease, setDiseases] = useState("");
    const [selected, setSelected] = useState([]);
    const [report_date, setreport_date] = useState("");
    const [report_loc, setreport_loc] = useState("");


    let submitValues = (e) => {
        //Send data with API
        e.preventDefault();
        let i = []
        for (let j in selected) {
            i.push(selected[j].value);
        }
        if (!i.length || report_date === "" || report_loc === "") {
            alert("Empty Fields")
        } else {
            console.log("Test " + disease);
            console.log("Test " + selected);
            console.log(i);
            console.log("Test " + report_date);
            console.log("Test " + report_loc);
            const requestOptions = {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    "disease": i[0],
                    "report_date": report_date,
                    "report_loc": report_loc
                })
            };
            fetch('http://127.0.0.1:8000/reports/add', requestOptions)
                .then(response => {
                    console.log(response.json())
                });

            alert("Your report has been submitted!")

        }

    }
    return (
        <>
            <div>
                <NavBar />
            </div>
            <br />
            <Box sx={{ flexGrow: 1 }} border="primary" style={{ width: '100%' }}>
                <Grid container spacing={3}>
                    <Grid item xs>

                    </Grid>
                    <Grid item xs={6} >
                        <Item>
                            <Card body >
                                <CardHeader title="Report a Disease" ></CardHeader>
                                <Divider />
                                <div>
                                    <label>Enter your disease from the list:
                                        <MultiSelect
                                            name="symptoms"
                                            id="symptoms"
                                            options={options}
                                            value={selected}
                                            onChange={setSelected}
                                            labelledBy="Select"
                                        />
                                    </label>
                                </div>

                                <br>

                                </br>
                                <div>
                                    <label>Enter your event_date:
                                        <br />
                                        <input
                                            type="datetime-local"
                                            value={report_date}
                                            onChange={(e) => setreport_date(e.target.value)}
                                        />
                                    </label>
                                </div>
                                <div>
                                    <label>Enter your locations:
                                        <br />
                                        <input
                                            type="text"
                                            value={report_loc}
                                            onChange={(e) => setreport_loc(e.target.value)}
                                        />
                                    </label>
                                </div>

                                <div>
                                    <br />
                                    <Button
                                        variant="contained"
                                        type="submit"
                                        onClick={submitValues}
                                    >Submit

                                    </Button>

                                </div>
                                <br />
                            </Card>
                        </Item>
                    </Grid>

                    <Grid item xs>

                    </Grid>
                </Grid>
            </Box>


        </>
    );
}
export default Report;

const Item = styled(Paper)(({ theme }) => ({
    backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : '#fff',
    ...theme.typography.body2,
    padding: theme.spacing(1),
    textAlign: 'center',
    color: theme.palette.text.secondary,
}));
