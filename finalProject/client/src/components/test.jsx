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
import Spinner from "./spinner/Spinner";

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
  const [bookingCount, setBookingCount] = useState(0); // State variable to track booking count

  const getBookings = async () => {
    try {
      const res = await axios.get("http://localhost:5001/getBookings");
      setBookingData(res.data);
      setBookingCount(res.data.length); // Update booking count
      setLoading(false);
    } catch (error) {
      console.error("Error fetching bookings:", error.message);
      alert("Error fetching bookings. Please try again later.");
      setLoading(false);
    }
  };

  const handleSaveDialog = async () => {
    try {
      if (editingBooking) {
        await axios.patch(
          `http://localhost:5001/editBooking/${editingBooking._id}`,
          dialogData
        );
      } else {
        await axios.post("http://localhost:5001/addBooking", dialogData);
      }
      getBookings();
      handleCloseDialog();
    } catch (error) {
      console.error("Error saving booking:", error.message);
      alert("Error saving booking. Please try again later.");
    }
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

  useEffect(() => {
    getBookings();
    getRooms();
    getTenants();
  }, []);

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
    { accessorKey: "totalAmount", header: "Total Amount" },
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
        Add Booking
      </Button>
    ),
  });

  if (loading) {
    return <Spinner />; // Render spinner while loading
  }

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
            {rooms.map((room) => {
              const isRoomAvailable = !bookingData.some(
                (booking) => booking.room._id === room._id
              );
              if (isRoomAvailable) {
                return (
                  <MenuItem key={room._id} value={room._id}>
                    {room.roomName}
                  </MenuItem>
                );
              } else {
                return null;
              }
            })}
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
            {tenants.map((tenant) => {
              const isTenantAvailable = !bookingData.some(
                (booking) => booking.tenant._id === tenant._id
              );
              if (isTenantAvailable) {
                return (
                  <MenuItem key={tenant._id} value={tenant._id}>
                    {tenant.fullName} {tenant.lastName}
                  </MenuItem>
                );
              } else {
                return null;
              }
            })}
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
