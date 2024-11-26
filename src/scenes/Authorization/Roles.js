import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchRoles,
  addRole,
  editRole,
  deleteRole,
} from "../../features/users/rolesService";
import {
  Box,
  Button,
  TextField,
  Typography,
  CircularProgress,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  IconButton,
  Checkbox,
} from "@mui/material";
import { Edit, Delete } from "@mui/icons-material";
import { toast } from "react-toastify";

const Roles = () => {
  const dispatch = useDispatch();
  const { roles, loading, error } = useSelector((state) => state.roles);

  const [roleInput, setRoleInput] = useState("");

  const [editingRole, setEditingRole] = useState(null);
  const [permissions, setPermissions] = useState({
    read: false,
    write: false,
    delete: false,
  });

  useEffect(() => {
    dispatch(fetchRoles());
  }, [dispatch]);
  const handleAddOrEditRole = () => {
    if (!roleInput.trim()) {
      toast.error("Role name is required");
      return;
    }
  
    const isAnyPermissionSelected = Object.values(permissions).some((val) => val);
    if (!isAnyPermissionSelected) {
      toast.error("At least one permission must be selected");
      return;
    }
  
    // Creating the newRole object with permissions
    const newRole = {
      role: roleInput, // The role name directly
      read: permissions.read, // Directly assigning permissions
      write: permissions.write,
      delete: permissions.delete,
    };
  
    console.log(newRole);
  
    if (editingRole) {
      // Edit role
      const data = { id: editingRole.id, roles: newRole }; // Correcting the data structure
      console.log(data);
      dispatch(editRole(data)); // Dispatching the data with 'roles'
      setEditingRole(null);
    } else {
      // Add role
      dispatch(addRole(newRole));
    }
  
    setRoleInput("");
    setPermissions({ read: false, write: false, delete: false });
  };
  

  const handleEditClick = (role) => {
    setRoleInput(role.role); // Directly set the role name
    setEditingRole(role); // Set the full role object for later use
    setPermissions({
      read: role.read, // Set the permissions directly
      write: role.write,
      delete: role.delete,
    });
  };
  

  const handleDeleteRole = (id) => {
    if (window.confirm("Are you sure you want to delete this role?")) {
      dispatch(deleteRole(id));
    }
  };

  const handlePermissionChange = (key) => {
    setPermissions((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  return (
    <Box m="20px">
      <Typography variant="h4" gutterBottom>
        Roles
      </Typography>

      <Box display="flex" gap="10px" alignItems="center" mb="20px">
        <TextField
          label="Role Name"
          value={roleInput}
          onChange={(e) => setRoleInput(e.target.value)}
        />
        <Button
          variant="contained"
          color="primary"
          onClick={handleAddOrEditRole}
        >
          {editingRole ? "Edit Role" : "Add Role"}
        </Button>
        {editingRole && (
          <Button
            variant="outlined"
            color="secondary"
            onClick={() => {
              setEditingRole(null);
              setRoleInput("");
              setPermissions({ read: false, write: false, delete: false });
            }}
          >
            Cancel
          </Button>
        )}
      </Box>

      <Box display="flex" gap="10px" alignItems="center" mb="20px">
        <Typography>Permissions:</Typography>
        <Box display="flex" gap="10px" alignItems="center">
          <Checkbox
            checked={permissions.read}
            onChange={() => handlePermissionChange("read")}
            sx={{
              color: permissions.read ? "blue" : "inherit",
              "&.Mui-checked": {
                color: "white", // When checked, fill with white color
              },
            }}
          />
          <Typography>Read</Typography>
        </Box>
        <Box display="flex" gap="10px" alignItems="center">
          <Checkbox
            checked={permissions.write}
            onChange={() => handlePermissionChange("write")}
            sx={{
              color: permissions.write ? "green" : "inherit",
              "&.Mui-checked": {
                color: "white", // When checked, fill with white color
              },
            }}
          />
          <Typography>Write</Typography>
        </Box>
        <Box display="flex" gap="10px" alignItems="center">
          <Checkbox
            checked={permissions.delete}
            onChange={() => handlePermissionChange("delete")}
            sx={{
              color: permissions.delete ? "red" : "inherit",
              "&.Mui-checked": {
                color: "white", // When checked, fill with white color
              },
            }}
          />
          <Typography>Delete</Typography>
        </Box>
      </Box>

      {loading ? (
        <CircularProgress />
      ) : error ? (
        <Typography color="error">{error}</Typography>
      ) : (
        <Box sx={{ overflowX: 'auto', maxHeight: '350px' }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Role</TableCell>
              <TableCell>Read</TableCell>
              <TableCell>Write</TableCell>
              <TableCell>Delete</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
  {roles.map((item) => (
    <TableRow key={item.id}>
      <TableCell>{item.role}</TableCell> {/* Directly accessing the role name */}
      <TableCell>
        <Checkbox checked={item.read} disabled /> {/* Directly accessing permissions */}
      </TableCell>
      <TableCell>
        <Checkbox checked={item.write} disabled />
      </TableCell>
      <TableCell>
        <Checkbox checked={item.delete} disabled />
      </TableCell>
      <TableCell>
        <IconButton onClick={() => handleEditClick(item)}>
          <Edit color="secondary" />
        </IconButton>
        <IconButton onClick={() => handleDeleteRole(item.id)}>
          <Delete color="error" />
        </IconButton>
      </TableCell>
    </TableRow>
  ))}
</TableBody>

        </Table>
        </Box>
      )}
    </Box>
  );
};

export default Roles;
