const mongoose = require("mongoose");

const RoomSchema = new mongoose.Schema({
  roomNo: Number,
  roomName: String,
  description: String,
  ratePerMonth: Number,
});

const TenantSchema = new mongoose.Schema({
  lastName: String,
  fullName: String,
  age: Number,
  contactNo: Number,
  address: String,
});

const BookingSchema = new mongoose.Schema({
  room: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Rooms", // Referencing the Rooms model
    required: true,
  },
  tenant: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Tenants", // Referencing the Rooms model
    required: true,
  },
  startDate: {
    type: Date,
    required: true,
  },
  endDate: {
    type: Date,
    required: true,
  },
  totalAmount: Number,
});

const Rooms = mongoose.model("Rooms", RoomSchema, "rooms");
const Tenants = mongoose.model("Tenants", TenantSchema, "tenants");
const Booking = mongoose.model("Booking", BookingSchema, "bookings");

module.exports = { Rooms, Tenants, Booking };
