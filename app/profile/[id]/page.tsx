"use client";
import { useState } from "react";
import { useParams } from "next/navigation";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import {
  Avatar,
  Card,
  CardContent,
  Typography,
  CircularProgress,
  Container,
  Grid,
  IconButton,
  Drawer,
  Box,
  TextField,
  Button,
} from "@mui/material";
import { styled } from "@mui/system";
import EditIcon from "@mui/icons-material/Edit";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css"; // Import toast styles

// Hero Section Styling
const HeroSection = styled("div")(({ theme }) => ({
  background: "linear-gradient(135deg, #007FFF, #00FF7F)",
  color: "white",
  textAlign: "center",
  padding: "4rem 2rem !important",
  borderRadius: "16px",
  boxShadow: "0 4px 20px rgba(0, 0, 0, 0.2)",
  position: "relative",
}));

// Styled Typography
const StyledHeading = styled(Typography)(({ theme }) => ({
  fontWeight: "bold",
  fontSize: "2.5rem",
  color: "#FFFFFF",
}));

const StyledSubHeading = styled(Typography)(({ theme }) => ({
  fontWeight: "300",
  fontSize: "1.25rem",
  color: "rgba(255, 255, 255, 0.9)",
  fontStyle: "italic",
}));

const SectionTitle = styled(Typography)(({ theme }) => ({
  fontWeight: "bold",
  fontSize: "1.75rem",
  color: "#1F2937",
  marginBottom: theme.spacing(2),
}));

const LabelText = styled(Typography)(({ theme }) => ({
  fontWeight: "600",
  fontSize: "1rem",
  color: "#374151",
}));

const ValueText = styled(Typography)(({ theme }) => ({
  fontSize: "1rem",
  color: "#4B5563",
}));

const fetchUserData = async (id) => {
  const response = await axios.get(`http://localhost:1000/users`);
  return response.data.find((user) => user.id === id);
};

const updateUser = async (updatedUser) => {
  await axios.put(`http://localhost:1000/users/${updatedUser.id}`, updatedUser);
};

export default function ProfilePage() {
  const { id } = useParams();
  const queryClient = useQueryClient();

  const {
    data: userData,
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ["user", id],
    queryFn: () => fetchUserData(id),
    enabled: !!id,
  });

  const mutation = useMutation({
    mutationFn: updateUser,
    onSuccess: () => {
      queryClient.invalidateQueries(["user", id]);
      toast.success("Profile updated successfully!"); // Trigger success toast
    },
  });

  const [isDrawerOpen, setDrawerOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    mobileNumber: "",
    profilePicture: "",
  });

  const handleEditClick = () => {
    if (userData) {
      setFormData(userData);
      setDrawerOpen(true);
    }
  };

  const handleSaveChanges = () => {
    mutation.mutate(formData);
    setDrawerOpen(false);
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <CircularProgress />
      </div>
    );
  }

  if (isError) {
    return (
      <p className="text-red-500 text-center mt-10">
        {(error as Error).message}
      </p>
    );
  }

  if (!userData) {
    return <p className="text-red-500 text-center mt-10">User not found.</p>;
  }

  return (
    <Container maxWidth="lg" className="py-10">
      <ToastContainer position="top-right" autoClose={3000} />{" "}
      {/* Toast Container */}
      <HeroSection>
        <Box sx={{ position: "relative", display: "inline-block" }}>
          <Avatar
            alt={userData.name}
            src={userData.profilePicture}
            sx={{
              width: 150,
              height: 150,
              margin: "0 auto 1rem",
              boxShadow: "0 4px 20px rgba(0, 0, 0, 0.2)",
            }}
          />
          <IconButton
            sx={{
              position: "absolute",
              bottom: 5,
              right: 5,
              background: "#FFF",
              border: "2px solid #6A0DAD",
              zIndex: 1000,
            }}
            onClick={handleEditClick}
          >
            <EditIcon color="primary" />
          </IconButton>
        </Box>

        <StyledHeading>Welcome, {userData.name}!</StyledHeading>
        <StyledSubHeading>
          "Your potential is endless. Keep striving!"
        </StyledSubHeading>
      </HeroSection>
      {/* User Details Section */}
      <section className="my-12">
        <SectionTitle sx={{ color: "#A445B2", textAlign: "center" }}>
          Contact Details
        </SectionTitle>
        <Grid container spacing={3} justifyContent="center" alignItems="center">
          <Grid item xs={12} md={6}>
            <Card className="shadow-md">
              <CardContent>
                <LabelText>Email</LabelText>
                <ValueText>{userData.email}</ValueText>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} md={6}>
            <Card className="shadow-md">
              <CardContent>
                <LabelText>Mobile Number</LabelText>
                <ValueText>{userData.mobileNumber}</ValueText>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </section>
      {/* Motivational Section */}
      <section
        className="mt-12 p-6 shadow-lg"
        style={{
          background: "linear-gradient(135deg, #007FFF, #00FF7F)",
          borderRadius: "16px",
        }}
      >
        <SectionTitle style={{ color: "white", textAlign: "center" }}>
          Stay Inspired!
        </SectionTitle>
        <Typography
          variant="body1"
          style={{ color: "rgba(255, 255, 255, 0.9)", textAlign: "center" }}
        >
          Keep setting and achieving goals. Every step forward counts toward a
          brighter future!
        </Typography>
      </section>
      <Drawer
        anchor="right"
        open={isDrawerOpen}
        onClose={() => setDrawerOpen(false)}
        sx={{
          "& .MuiDrawer-paper": {
            width: {
              xs: "100%",
              sm: "50%",
              md: "35%",
              lg: "25%",
            },
          },
        }}
      >
        <Box sx={{ width: "100%", p: 3 }}>
          <Typography
            variant="h6"
            gutterBottom
            sx={{ textAlign: "center", mb: 3 }}
          >
            Edit Profile
          </Typography>
          <Box sx={{ textAlign: "center", position: "relative" }}>
            <Avatar
              alt={formData.name}
              src={formData.profilePicture}
              sx={{
                width: 120,
                height: 120,
                margin: "0 auto 1rem",
                cursor: "pointer",
              }}
              onClick={() => document.getElementById("upload-image").click()}
            />
            <input
              id="upload-image"
              type="file"
              accept="image/*"
              style={{ display: "none" }}
              onChange={(e) => {
                const file = e.target.files[0];
                if (file) {
                  const reader = new FileReader();
                  reader.onload = () => {
                    setFormData({ ...formData, profilePicture: reader.result });
                  };
                  reader.readAsDataURL(file);
                }
              }}
            />
          </Box>
          <TextField
            label="Name"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            fullWidth
            margin="normal"
          />
          <TextField
            label="Email"
            value={formData.email}
            onChange={(e) =>
              setFormData({ ...formData, email: e.target.value })
            }
            fullWidth
            margin="normal"
          />
          <TextField
            label="Mobile Number"
            value={formData.mobileNumber}
            onChange={(e) =>
              setFormData({ ...formData, mobileNumber: e.target.value })
            }
            fullWidth
            margin="normal"
          />
          <Button
            variant="contained"
            color="primary"
            onClick={handleSaveChanges}
            fullWidth
            sx={{ mt: 2 }}
          >
            Save Changes
          </Button>
          <Button
            variant="outlined"
            onClick={() => setDrawerOpen(false)}
            fullWidth
            sx={{ mt: 1 }}
          >
            Cancel
          </Button>
        </Box>
      </Drawer>
    </Container>
  );
}
