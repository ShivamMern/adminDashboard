import {
  Box,
  Typography,
  useTheme,
  Tooltip,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Button,
} from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import { tokens } from "../../theme";
import AdminPanelSettingsOutlinedIcon from "@mui/icons-material/AdminPanelSettingsOutlined";
import SecurityOutlinedIcon from "@mui/icons-material/SecurityOutlined";
import LockOpenOutlinedIcon from "@mui/icons-material/LockOpenOutlined";
import VisibilityOutlinedIcon from "@mui/icons-material/VisibilityOutlined";
import DeleteOutlinedIcon from "@mui/icons-material/DeleteOutlined";
import Header from "../../components/Header";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import { deleteUser, getUsers } from "../../features/users/userSlice";
import UserDetailsDialog from "./UserDetailsDialog";
import DeleteConfirmationDialog from "./DeleteConfirmationDialog";
import IsAdmin from "./IsAdmin";
import { fetchRoles } from "../../features/users/rolesService";

const Team = () => {
  const [userList, setUserList] = useState([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const dispatch = useDispatch();
  const [isEdit, setIsEdit] = useState(false);
  const { roles, loading, error } = useSelector((state) => state.roles);

  useEffect(() => {
    dispatch(fetchRoles());
  }, [dispatch]);
  const getuserData = async () => {
    try {
      const { payload } = await dispatch(getUsers());
      setUserList(payload);
    } catch (err) {
      toast.error("Something went wrong");
    }
  };

  useEffect(() => {
    getuserData();
  }, []);

  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [userIdToDelete, setUserIdToDelete] = useState(null);
  const [openEditModal, setOpenEditModal] = useState(false);
  const isAdminConfiguration = {
    name: "",
    email: "",
    role: "",
  };

  const handleEditSubmit = (values) => {
    console.log(values);
  
    // Find the role object for the selected id
    const selectedRole = roles.find((role) => role.id === values.role); // assuming values.role contains the role ID
  
    if (selectedRole) {
      // Check if the user has delete permission
      if (selectedRole.delete) {
        // User has delete permission
        setIsEdit(true); // Enable editing
        setOpenEditModal(false); // Close the edit modal
        setIsDeleteDialogOpen(true); // Open the delete dialog
      } else {
        // User does not have delete permission
        toast.error(
          "You don't have rights to delete the user profile. Only permission holder can delete user profiles."
        );
        setOpenEditModal(false); // Close the edit modal
      }
    } else {
      toast.error("Role not found");
      setOpenEditModal(false); // Close the edit modal
    }
  };
  


  // Function to open the delete dialog
  const handleDelete = (id) => {
    setUserIdToDelete(id);
    setOpenEditModal(true)
    // 

  };

  // Function to close the delete dialog
  const handleCloseDeleteDialog = () => {
    setIsDeleteDialogOpen(false);
  };

  // Function to confirm the deletion
  const handleConfirmDelete = async () => {
    try {
      if (userIdToDelete) {
        const result = await dispatch(deleteUser(userIdToDelete));
        getuserData()
        toast.success("User deleted successfully!");
      }
      setIsDeleteDialogOpen(false);
    } catch (error) {
      toast.error("Something went wrong");
    }
    // Close the dialog after confirmation
  };

  const columns = [
    { field: "id", headerName: "ID", width: 100 },
    {
      field: "firstName",
      headerName: "First Name",
      flex: 1,
      cellClassName: "name-column--cell",
    },
    {
      field: "lastName",
      headerName: "Last Name",
      flex: 1,
    },
    {
      field: "age",
      headerName: "Age",
      type: "number",
      headerAlign: "left",
      align: "left",
    },
    {
      field: "email",
      headerName: "Email",
      flex: 1,
    },
    {
      field: "contact",
      headerName: "Phone Number",
      flex: 1,
    },
    {
      field: "address1",
      headerName: "Address 1",
      flex: 1,
    },
    {
      field: "status",
      headerName: "Status",
      flex: 1,
      renderCell: ({ row: { status } }) => {
        let displayStatus = status ? status : "inactive"; // Default to "inactive" if status is unavailable
        let backgroundColor;
    
        // Assign colors based on the status
        switch (displayStatus.toLowerCase()) {
          case "active":
            backgroundColor = colors.greenAccent[600];
            break;
          case "inactive":
          default:
            backgroundColor =  colors.grey[600];
            break;
        }
    
        return (
          <Box
            width="100%"
            m="0 auto"
            p="5px"
            display="flex"
            alignItems="center"
            justifyContent="center"
            backgroundColor={backgroundColor}
            borderRadius="4px"
            sx={{
              overflow: "hidden", // Prevents overflow
              whiteSpace: "nowrap", // Prevents text from wrapping
              textOverflow: "ellipsis", // Adds ellipsis if text overflows
            }}
          >
            <Tooltip
              title={displayStatus.charAt(0).toUpperCase() + displayStatus.slice(1)}
              arrow
            >
              <Typography
                color={colors.grey[100]}
                sx={{
                  ml: "5px",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  whiteSpace: "nowrap",
                }}
              >
                {displayStatus.charAt(0).toUpperCase() + displayStatus.slice(1)}
              </Typography>
            </Tooltip>
          </Box>
        );
      },
    },
    
   
    {
      field: "role",
      headerName: "Role",
      flex: 1,
      renderCell: ({ row }) => {
        // Log the row data to check its structure   
        // Find the role object based on the id matching the row's role
        const role = roles.find((role) => role.id === row.role);
    
        // Check if the role was found
        if (!role) {
          return null; // Or display something else if the role is not found
        }
    
        let icon;
        let backgroundColor = colors.grey[600];
    
        // Define the icons and background colors based on the role name
        switch (role.role) {
          case "Admin":
            icon = <AdminPanelSettingsOutlinedIcon />;
            backgroundColor = colors.greenAccent[600];
            break;
          case "Manager":
            icon = <SecurityOutlinedIcon />;
            backgroundColor = colors.greenAccent[700];
            break;
          case "User":
            icon = <LockOpenOutlinedIcon />;
            backgroundColor = colors.greenAccent[700];
            break;
          case "Guest":
            icon = <VisibilityOutlinedIcon />;
            backgroundColor = colors.greenAccent[400];
            break;
          default:
            icon = <VisibilityOutlinedIcon />;
            backgroundColor = colors.grey[600];
            break;
        }
    
        return (
          <Box
            width="100%"
            m="0 auto"
            p="5px"
            display="flex"
            alignItems="center"
            justifyContent="center"
            backgroundColor={backgroundColor}
            borderRadius="4px"
            sx={{
              overflow: "hidden", // Prevents overflow
              whiteSpace: "nowrap", // Prevents text from wrapping
              textOverflow: "ellipsis", // Adds ellipsis if text overflows
            }}
          >
            <Tooltip title={role.role} arrow>
              <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                {icon}
                <Typography
                  color={colors.grey[100]}
                  sx={{
                    ml: "5px",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    whiteSpace: "nowrap",
                  }}
                >
                  {role.role} {/* Display the role name */}
                </Typography>
              </Box>
            </Tooltip>
          </Box>
        );
      }
    },
    
    
    
    {
      field: "actions",
      headerName: "Actions",
      flex: 1,
      sortable: false,
      renderCell: (params) => {
        return (
          <Box display="flex" justifyContent="center" gap="10px">
            <Tooltip title="View Details" arrow>
              <VisibilityOutlinedIcon
                sx={{ cursor: "pointer", color: colors.blueAccent[500] }}
                onClick={() => handleView(params.row)}
              />
            </Tooltip>
            <Tooltip title="Delete" arrow>
              <DeleteOutlinedIcon
                sx={{ cursor: "pointer", color: colors.redAccent[500] }}
                onClick={() => handleDelete(params.row.id)}
              />
            </Tooltip>
          </Box>
        );
      },
    },
  ];

  const handleView = (user) => {
    setSelectedUser(user);
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setSelectedUser(null);
    setIsEdit(false);
  };

  return (
    <Box m="20px">
      <Header title="TEAM" subtitle="Managing the Team Members" />
      <Box
        m="40px 0 0 0"
        height="75vh"
        sx={{
          "& .MuiDataGrid-root": {
            border: "none",
          },
          "& .MuiDataGrid-cell": {
            borderBottom: "none",
          },
          "& .name-column--cell": {
            color: colors.greenAccent[300],
          },
          "& .MuiDataGrid-columnHeaders": {
            backgroundColor: colors.blueAccent[700],
            borderBottom: "none",
          },
          "& .MuiDataGrid-virtualScroller": {
            backgroundColor: colors.primary[400],
          },
          "& .MuiDataGrid-footerContainer": {
            borderTop: "none",
            backgroundColor: colors.blueAccent[700],
          },
        }}
      >
        <DataGrid
          rows={userList}
          columns={columns}
          disableSelectionOnClick
          checkboxSelection={false}
        />
      </Box>

      {/* Dialog to show selected user details */}
      <UserDetailsDialog
        open={openDialog}
        roles={roles}
        getuserData={getuserData}
        onClose={handleCloseDialog}
        userDetails={selectedUser}
        setIsEdit={setIsEdit}
        isEdit={isEdit}
      />

      <DeleteConfirmationDialog
        open={isDeleteDialogOpen}
        onClose={handleCloseDeleteDialog}
        onConfirm={handleConfirmDelete}
      />

      <IsAdmin
        open={openEditModal}
        fromDelete={true}
        onClose={() => setOpenEditModal(false)}
        initialValues={isAdminConfiguration}
        onSubmit={handleEditSubmit}
        roles={roles}
        title="Delete Permission"
      />
    </Box>
  );
};

export default Team;
