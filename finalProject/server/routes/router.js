const express = require("express");
const router = express.Router();
const { Rooms, Tenants, Booking } = require("../models/DormSchema");

// Route to get data for rooms
router.get("/getRooms", async (req, res) => {
  try {
    const roomsData = await Rooms.find();
    res.status(200).json(roomsData);
    // console.log("Fetched rooms data:", roomsData);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Route to get data for tenants
router.get("/getTenants", async (req, res) => {
  try {
    const tenantsData = await Tenants.find();
    res.status(200).json(tenantsData);
    // console.log("Fetched tenants data:", tenantsData);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Route to get data for bookings
router.get("/getBookings", async (req, res) => {
  try {
    const bookingsData = await Booking.find()
      .populate("room")
      .populate("tenant");
    res.status(200).json(bookingsData);
    // console.log("Fetched bookings data:", bookingsData);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.get("/getTenant/:id", async (req, res) => {
  try {
    const tenant = await Tenants.findById(req.params.id);
    if (!tenant) {
      return res.status(404).json({ message: "Tenant not found" });
    }
    res.status(200).json(tenant);
    console.log("Fetched tenant data:", tenant);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.get("/getRoom/:id", async (req, res) => {
  try {
    const room = await Rooms.findById(req.params.id);
    if (!room) {
      return res.status(404).json({ message: "Room not found" });
    }
    res.status(200).json(room);
    console.log("Fetched room data:", room);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.get("/getBooking/:id", async (req, res) => {
  try {
    const bookingData = await Booking.findById(req.params.id)
      .populate("room")
      .populate("tenant");
    if (!bookingData) {
      return res.status(404).json({ message: "Booking not found" });
    }
    res.status(200).json(bookingData);
    console.log("Fetched booking data:", bookingData);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Route to add a new room
router.post("/addRoom", async (req, res) => {
  try {
    const { roomNo, roomName, description, noOfBeds, ratePerMonth } = req.body;
    const room = new Rooms({
      roomNo,
      roomName,
      description,
      noOfBeds,
      ratePerMonth,
    });
    const newRoom = await room.save();
    res.status(201).json(newRoom);
    console.log("Added new room:", newRoom);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Route to add a new tenant
router.post("/addTenant", async (req, res) => {
  try {
    const { lastName, fullName, age, contactNo, address } = req.body;
    const tenant = new Tenants({ lastName, fullName, age, contactNo, address });
    const newTenant = await tenant.save();
    res.status(201).json(newTenant);
    console.log("Added new tenant:", newTenant);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Route to make a new booking
router.post("/addBooking", async (req, res) => {
  try {
    const { room, tenant, startDate, endDate, totalAmount } = req.body;

    const roomExists = await Rooms.findById(room);
    const tenantExists = await Tenants.findById(tenant);

    if (!roomExists || !tenantExists) {
      return res.status(404).json({ message: "Room or Tenant not found" });
    }

    const booking = new Booking({
      room,
      tenant,
      startDate,
      endDate,
      totalAmount,
    });
    const newBooking = await booking.save();
    res.status(201).json(newBooking);
    console.log("Added new booking:", newBooking);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

router.patch("/editRoom/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const updatedRoom = await Rooms.findOneAndUpdate({ _id: id }, req.body, {
      new: true,
    });

    if (!updatedRoom) {
      return res.status(404).json({ message: "Room not found" });
    }

    res.status(200).json(updatedRoom);
    console.log("Updated room:", updatedRoom);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.patch("/editTenant/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const updatedTenant = await Tenants.findByIdAndUpdate(id, req.body, {
      new: true,
    });

    if (!updatedTenant) {
      return res.status(404).json({ message: "Tenant not found" });
    }

    res.status(200).json(updatedTenant);
    console.log("Updated tenant:", updatedTenant);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.patch("/editBooking/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const updatedBooking = await Booking.findByIdAndUpdate(id, req.body, {
      new: true,
    });

    if (!updatedBooking) {
      return res.status(404).json({ message: "Booking not found" });
    }

    res.status(200).json(updatedBooking);
    console.log("Updated booking:", updatedBooking);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Route to delete a room
router.delete("/deleteRoom/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const deletedRoom = await Rooms.findByIdAndDelete(id);

    if (!deletedRoom) {
      return res.status(404).json({ message: "Room not found" });
    }

    res.status(200).json(deletedRoom);
    console.log("Deleted room:", deletedRoom);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Route to delete a tenant
router.delete("/deleteTenant/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const deletedTenant = await Tenants.findByIdAndDelete(id);

    if (!deletedTenant) {
      return res.status(404).json({ message: "Tenant not found" });
    }

    res.status(200).json(deletedTenant);
    console.log("Deleted tenant:", deletedTenant);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Route to delete a booking
router.delete("/deleteBooking/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const deletedBooking = await Booking.findByIdAndDelete(id);

    if (!deletedBooking) {
      return res.status(404).json({ message: "Booking not found" });
    }

    res.status(200).json(deletedBooking);
    console.log("Deleted booking:", deletedBooking);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
