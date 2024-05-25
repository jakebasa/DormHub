import React, { useEffect, useState } from "react";
import {
  MaterialReactTable,
  useMaterialReactTable,
} from "material-react-table";
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  TextField,
  MenuItem,
  IconButton,
  Tooltip,
} from "@mui/material";
import axios from "axios";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";

const Booking = () => {
  const [bookingData, setBookingData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [openDialog, setOpenDialog] = useState(false);
  const [dialogData, setDialogData] = useState({
    room: "",
    tenant: "",
    startDate: "",
    endDate: "",
    totalAmount: "",
  });
  const [rooms, setRooms] = useState([]);
  const [tenants, setTenants] = useState([]);
  const [editingBooking, setEditingBooking] = useState(null);
  const [openDeleteModal, setOpenDeleteModal] = useState(false);
  const [rowToDelete, setRowToDelete] = useState(null);

  const getBookings = async () => {
    try {
      const res = await axios.get("http://localhost:5001/getBookings");
      setBookingData(res.data);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching bookings:", error.message);
      alert("Error fetching bookings. Please try again later.");
      setLoading(false);
    }
  };

  const getRooms = async () => {
    try {
      const res = await axios.get("http://localhost:5001/getRooms");
      setRooms(res.data);
    } catch (error) {
      console.error("Error fetching rooms:", error.message);
      alert("Error fetching rooms. Please try again later.");
    }
  };

  const getTenants = async () => {
    try {
      const res = await axios.get("http://localhost:5001/getTenants");
      setTenants(res.data);
    } catch (error) {
      console.error("Error fetching tenants:", error.message);
      alert("Error fetching tenants. Please try again later.");
    }
  };

  useEffect(() => {
    getBookings();
    getRooms();
    getTenants();
  }, []);

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setDialogData({
      room: "",
      tenant: "",
      startDate: "",
      endDate: "",
      totalAmount: "",
    });
    setEditingBooking(null);
  };

  const handleSaveDialog = async () => {
    try {
      if (editingBooking) {
        await axios.patch(
          `http://localhost:5001/editBooking/${editingBooking._id}`,
          dialogData
        );
      } else {
        // Check if the selected room and tenant are available
        const isRoomAvailable = bookingData.every(
          (booking) => booking.room._id !== dialogData.room
        );
        const isTenantAvailable = bookingData.every(
          (booking) => booking.tenant._id !== dialogData.tenant
        );
        if (!isRoomAvailable) {
          alert(
            "The selected room is already booked. Please choose another room."
          );
          return;
        }
        if (!isTenantAvailable) {
          alert(
            "The selected tenant already has a booking. Please choose another tenant."
          );
          return;
        }

        // Calculate total amount based on room's rate per month and duration
        const room = rooms.find((room) => room._id === dialogData.room);
        const startDate = new Date(dialogData.startDate);
        const endDate = new Date(dialogData.endDate);
        const durationInDays = Math.floor(
          (endDate - startDate) / (1000 * 60 * 60 * 24)
        );
        const months = Math.ceil(durationInDays / 30); // If less than 30 days, count as 1 month
        const totalAmount = months * room.ratePerMonth;

        await axios.post("http://localhost:5001/addBooking", {
          ...dialogData,
          totalAmount: totalAmount,
        });
      }
      getBookings();
      handleCloseDialog();
    } catch (error) {
      console.error("Error saving booking:", error.message);
      alert("Error saving booking. Please try again later.");
    }
  };

  const handleOpenDialog = (booking) => {
    if (booking) {
      setEditingBooking(booking);
      setDialogData({
        room: booking.room._id,
        tenant: booking.tenant._id,
        startDate: booking.startDate,
        endDate: booking.endDate,
        totalAmount: booking.totalAmount,
      });
    } else {
      setEditingBooking(null);
      setDialogData({
        room: "",
        tenant: "",
        startDate: "",
        endDate: "",
        totalAmount: "",
      });
    }
    setOpenDialog(true);
  };

  const handleDeleteBooking = async () => {
    try {
      if (rowToDelete) {
        await axios.delete(
          `http://localhost:5001/deleteBooking/${rowToDelete._id}`
        );
        getBookings();
        setOpenDeleteModal(false);
      }
    } catch (error) {
      console.error("Error deleting booking:", error.message);
      alert("Error deleting booking. Please try again later.");
    }
  };

  const formatDate = (isoDate) => {
    return new Date(isoDate).toISOString().split("T")[0];
  };

  const columns = [
    {
      accessorKey: "actions",
      header: "Actions",
      Cell: ({ row }) => (
        <Box sx={{ display: "flex", gap: "1rem" }}>
          <Tooltip title="Edit">
            <IconButton onClick={() => handleOpenDialog(row.original)}>
              <EditIcon />
            </IconButton>
          </Tooltip>
          <Tooltip title="Delete">
            <IconButton
              color="error"
              onClick={() => {
                setRowToDelete(row.original);
                setOpenDeleteModal(true);
              }}
            >
              <DeleteIcon />
            </IconButton>
          </Tooltip>
        </Box>
      ),
    },
    {
      accessorKey: "room",
      header: "Room",
      Cell: ({ row }) => <span>{row.original.room.roomName}</span>,
    },
    {
      accessorKey: "tenant",
      header: "Tenant",
      Cell: ({ row }) => (
        <span>
          {row.original.tenant.fullName} {row.original.tenant.lastName}
        </span>
      ),
    },
    {
      accessorKey: "startDate",
      header: "Start Date",
      Cell: ({ row }) => <span>{formatDate(row.original.startDate)}</span>,
    },
    {
      accessorKey: "endDate",
      header: "End Date",
      Cell: ({ row }) => <span>{formatDate(row.original.endDate)}</span>,
    },
    {
      accessorKey: "totalAmount",
      header: "Total Amount",
    },
  ];

  const table = useMaterialReactTable({
    columns,
    data: bookingData,
    muiToolbarAlertBannerProps: loading
      ? { color: "error", children: "Error loading data" }
      : undefined,
    muiTableContainerProps: { sx: { minHeight: "500px" } },
    renderTopToolbarCustomActions: () => (
      <Button
        variant="contained"
        sx={{
          backgroundColor: "#CF910C",
          "&:hover": {
            backgroundColor: "#E0A838",
          },
        }}
        onClick={() => handleOpenDialog(null)}
      >
        Add New Booking
      </Button>
    ),
  });

  return (
    <div>
      <MaterialReactTable table={table} />
      <Dialog open={openDialog} onClose={handleCloseDialog}>
        <DialogTitle>
          {editingBooking ? "Edit Booking" : "Add Booking"}
        </DialogTitle>
        <DialogContent>
          <TextField
            select
            label="Room"
            fullWidth
            value={dialogData.room}
            onChange={(e) =>
              setDialogData({ ...dialogData, room: e.target.value })
            }
            sx={{ marginBottom: "20px" }}
          >
            {rooms.map((room) => (
              <MenuItem key={room._id} value={room._id}>
                {room.roomName}
              </MenuItem>
            ))}
          </TextField>
          <TextField
            select
            label="Tenant"
            fullWidth
            value={dialogData.tenant}
            onChange={(e) =>
              setDialogData({ ...dialogData, tenant: e.target.value })
            }
            sx={{ marginBottom: "20px" }}
          >
            {tenants.map((tenant) => (
              <MenuItem key={tenant._id} value={tenant._id}>
                {tenant.fullName} {tenant.lastName}
              </MenuItem>
            ))}
          </TextField>
          <TextField
            label="Start Date"
            type="date"
            fullWidth
            InputLabelProps={{
              shrink: true,
            }}
            value={dialogData.startDate}
            onChange={(e) =>
              setDialogData({ ...dialogData, startDate: e.target.value })
            }
            sx={{ marginBottom: "20px" }}
          />
          <TextField
            label="End Date"
            type="date"
            fullWidth
            InputLabelProps={{
              shrink: true,
            }}
            value={dialogData.endDate}
            onChange={(e) =>
              setDialogData({ ...dialogData, endDate: e.target.value })
            }
            sx={{ marginBottom: "20px" }}
          />
          <TextField
            label="Total Amount"
            type="number"
            fullWidth
            value={dialogData.totalAmount}
            disabled
            onChange={(e) =>
              setDialogData({ ...dialogData, totalAmount: e.target.value })
            }
            sx={{ marginBottom: "20px" }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Cancel</Button>
          <Button onClick={handleSaveDialog}>Save</Button>
        </DialogActions>
      </Dialog>

      <Dialog
        open={openDeleteModal}
        onClose={() => setOpenDeleteModal(false)}
        aria-labelledby="delete-dialog-title"
        aria-describedby="delete-dialog-description"
      >
        <DialogTitle id="delete-dialog-title">Confirm Delete</DialogTitle>
        <DialogContent>
          <DialogContentText id="delete-dialog-description">
            Are you sure you want to delete this booking?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDeleteModal(false)} color="primary">
            Cancel
          </Button>
          <Button onClick={handleDeleteBooking} color="primary" autoFocus>
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default Booking;
