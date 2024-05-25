import React, { useEffect, useState } from "react";
import {
  MaterialReactTable,
  useMaterialReactTable,
  MRT_EditActionButtons,
} from "material-react-table";
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  IconButton,
  Tooltip,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import axios from "axios";
import Spinner from "./spinner/Spinner";
import "./styles.css";

const Tenants = () => {
  const [tenantData, setTenantData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [openDeleteModal, setOpenDeleteModal] = useState(false);
  const [rowDataToDelete, setRowDataToDelete] = useState(null);

  const getTenants = async () => {
    try {
      const res = await axios.get("http://localhost:5001/getTenants");
      setTenantData(res.data);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching tenants:", error.message);
      alert("Error fetching tenants. Please try again later.");
      setLoading(false);
    }
  };

  useEffect(() => {
    getTenants();
  }, []);

  const createData = async (values) => {
    try {
      await axios.post("http://localhost:5001/addTenant", values);
      getTenants();
    } catch (error) {
      console.error("Error creating tenant:", error.message);
    }
  };

  const updateData = async (values) => {
    try {
      if (!values._id) {
        throw new Error("Invalid ID: _id is undefined or null");
      }
      await axios.patch(
        `http://localhost:5001/editTenant/${values._id}`,
        values
      );
      getRooms();
    } catch (error) {
      console.error("Error updating data:", error.response || error.message);
    }
  };

  const deleteData = async (id) => {
    try {
      await axios.delete(`http://localhost:5001/deleteTenant/${id}`);
      getTenants();
    } catch (error) {
      console.error("Error deleting tenant:", error.message);
    }
  };

  const handleCreateData = async ({ values, table }) => {
    createData(values);
    table.setCreatingRow(null);
  };

  const handleSaveData = async ({ row, values, table }) => {
    const newValues = { ...values, _id: row.original._id };
    await updateData(newValues);
    table.setEditingRow(null);
  };

  const openDeleteConfirmModal = (row) => {
    setRowDataToDelete(row);
    setOpenDeleteModal(true);
  };

  const handleConfirmDelete = () => {
    if (rowDataToDelete) {
      deleteData(rowDataToDelete.original._id);
      setOpenDeleteModal(false);
    }
  };

  const columns = [
    {
      accessorKey: "rowNumber",
      header: "#",
      enableEditing: false,
      Cell: ({ row }) => row.index + 1,
    },
    { accessorKey: "lastName", header: "Last Name" },
    { accessorKey: "fullName", header: "First Name" },
    { accessorKey: "age", header: "Age" },
    { accessorKey: "contactNo", header: "Contact No." },
    { accessorKey: "address", header: "Address" },
  ];

  const table = useMaterialReactTable({
    columns,
    data: tenantData,
    editDisplayMode: "modal",
    enableEditing: true,
    getRowId: (row) => row._id,
    muiToolbarAlertBannerProps: loading
      ? { color: "error", children: "Error loading data" }
      : undefined,
    muiTableContainerProps: { sx: { minHeight: "500px" } },
    onCreatingRowSave: handleCreateData,
    onEditingRowSave: handleSaveData,
    renderCreateRowDialogContent: ({ table, row, internalEditComponents }) => (
      <>
        <DialogTitle variant="h3" className="add-new">
          Add New Tenant
        </DialogTitle>
        <DialogContent
          sx={{ display: "flex", flexDirection: "column", gap: "1rem" }}
        >
          {internalEditComponents}
        </DialogContent>
        <DialogActions>
          <MRT_EditActionButtons variant="text" table={table} row={row} />
        </DialogActions>
      </>
    ),
    renderEditRowDialogContent: ({ table, row, internalEditComponents }) => (
      <>
        <DialogTitle variant="h3" className="edit-tenant">
          Edit Tenant
        </DialogTitle>
        <DialogContent
          sx={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}
        >
          {internalEditComponents}
        </DialogContent>
        <DialogActions>
          <MRT_EditActionButtons variant="text" table={table} row={row} />
        </DialogActions>
      </>
    ),
    renderRowActions: ({ row, table }) => (
      <Box sx={{ display: "flex", gap: "1rem" }}>
        <Tooltip title="Edit">
          <IconButton onClick={() => table.setEditingRow(row)}>
            <EditIcon />
          </IconButton>
        </Tooltip>
        <Tooltip title="Delete">
          <IconButton color="error" onClick={() => openDeleteConfirmModal(row)}>
            <DeleteIcon />
          </IconButton>
        </Tooltip>
      </Box>
    ),
    renderTopToolbarCustomActions: ({ table }) => (
      <Button
        variant="contained"
        sx={{
          backgroundColor: "#CF910C",
          "&:hover": {
            backgroundColor: "#E0A838",
          },
        }}
        onClick={() => table.setCreatingRow(true)}
      >
        Add New Tenant
      </Button>
    ),
  });

  if (loading) {
    return <Spinner />; // Render spinner while loading
  }

  return (
    <div>
      <MaterialReactTable table={table} />
      <Dialog
        open={openDeleteModal}
        onClose={() => setOpenDeleteModal(false)}
        aria-labelledby="delete-dialog-title"
        aria-describedby="delete-dialog-description"
      >
        <DialogTitle id="delete-dialog-title">Confirm Delete</DialogTitle>
        <DialogContent>
          <DialogContentText id="delete-dialog-description">
            Are you sure you want to delete this tenant?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDeleteModal(false)} color="primary">
            Cancel
          </Button>
          <Button onClick={handleConfirmDelete} color="primary" autoFocus>
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default Tenants;
