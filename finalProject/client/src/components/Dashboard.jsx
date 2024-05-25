import React, { useState, useEffect } from "react";
import { Box, Card, CardContent, Grid, Typography, Stack } from "@mui/material";
import axios from "axios";
import { getAvailableRoomsCount } from "./Rooms";
import { Chart } from "react-google-charts";
import "./DashboardStyles.css";
import CountUp from "react-countup";
import Spinner from "./spinner/Spinner"; // Import the Spinner component

const Dashboard = () => {
  const [totalRooms, setTotalRooms] = useState(0);
  const [availableRooms, setAvailableRooms] = useState(0);
  const [totalBookings, setTotalBookings] = useState(0);
  const [data, setData] = useState([]); // State to hold the chart data
  const [loading, setLoading] = useState(true); // State for loading

  useEffect(() => {
    const fetchRoomsAndBookings = async () => {
      try {
        const roomsRes = await axios.get("http://localhost:5001/getRooms");
        const bookingsRes = await axios.get(
          "http://localhost:5001/getBookings"
        );
        const totalRoomsCount = roomsRes.data.length;
        const availableRoomsCount = getAvailableRoomsCount(
          roomsRes.data,
          bookingsRes.data
        );
        const totalBookingsCount = bookingsRes.data.length;

        setTotalRooms(totalRoomsCount);
        setAvailableRooms(availableRoomsCount);
        setTotalBookings(totalBookingsCount);

        // Prepare data for the chart
        const chartData = [
          ["Type", "Count", { role: "style" }],
          ["Available Rooms", availableRoomsCount, "#003f5c"],
          ["Occupied Rooms", totalRoomsCount - availableRoomsCount, "#ffa600"],
        ];

        setData(chartData);
        setLoading(false); // Set loading to false when data fetching is complete
      } catch (error) {
        console.error("Error fetching rooms and bookings:", error.message);
        setLoading(false); // Set loading to false on error
      }
    };

    fetchRoomsAndBookings();
  }, []);

  if (loading) {
    return <Spinner />; // Render spinner while loading
  }

  return (
    <div className="container">
      <Box height={10} />
      <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
        <Box sx={{ flexGrow: 1 }}>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <Stack spacing={2}>
                <Stack spacing={5} direction="row">
                  <Card
                    sx={{ minWidth: "31%", height: 150 }}
                    className="gradient1"
                  >
                    <CardContent>
                      <Typography
                        gutterBottom
                        variant="h5"
                        component="div"
                        sx={{ color: "#ffff" }}
                      >
                        <CountUp delay={0.9} end={totalRooms} duration={0.9} />
                      </Typography>
                      <Typography
                        gutterBottom
                        variant="body2"
                        component="div"
                        sx={{ color: "#ccd1d1" }}
                      >
                        Total Number of Rooms
                      </Typography>
                    </CardContent>
                  </Card>
                  <Card
                    sx={{ minWidth: "31%", height: 150 }}
                    className="gradient2"
                  >
                    <CardContent>
                      <Typography
                        gutterBottom
                        variant="h5"
                        component="div"
                        sx={{ color: "#ffff" }}
                      >
                        <CountUp
                          delay={0.9}
                          end={availableRooms}
                          duration={0.9}
                        />
                      </Typography>
                      <Typography
                        gutterBottom
                        variant="body2"
                        component="div"
                        sx={{ color: "#ccd1d1" }}
                      >
                        Number of Available Rooms
                      </Typography>
                    </CardContent>
                  </Card>
                  <Card
                    sx={{ minWidth: "31%", height: 150 }}
                    className="gradient3"
                  >
                    <CardContent>
                      <Typography
                        gutterBottom
                        variant="h5"
                        component="div"
                        sx={{ color: "#ffff" }}
                      >
                        <CountUp
                          delay={0.9}
                          end={totalBookings}
                          duration={0.9}
                        />
                      </Typography>
                      <Typography
                        gutterBottom
                        variant="body2"
                        component="div"
                        sx={{ color: "#ccd1d1" }}
                      >
                        Total Number of Bookings
                      </Typography>
                    </CardContent>
                  </Card>
                </Stack>
                <Card sx={{ height: "50vh" }}>
                  <CardContent>
                    <Chart
                      chartType="BarChart"
                      data={data}
                      options={{
                        chartArea: { width: "70%", height: "60%" },
                        legend: { position: "none" },
                        hAxis: {
                          title: "Room Count",
                          format: 0,
                        },
                        vAxis: {
                          title: "",
                        },
                      }}
                    />
                  </CardContent>
                </Card>
              </Stack>
            </Grid>
          </Grid>
        </Box>
      </Box>
    </div>
  );
};

export default Dashboard;
