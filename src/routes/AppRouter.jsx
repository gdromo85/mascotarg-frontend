import React from "react";
import { Routes, Route } from "react-router-dom";
import Layout from "../components/Layout";
import Home from "../pages/Home";
import Login from "../pages/Login";
import Register from "../pages/Register";
import Dashboard from "../pages/Dashboard";
import AddPet from "../pages/AddPet";
import PetDetail from "../pages/PetDetail";
import EditPet from "../pages/EditPet";
import AddMedicalRecord from "../pages/AddMedicalRecord";
import EditMedicalRecord from "../pages/EditMedicalRecord";
import VetDashboard from "../pages/VetDashboard";
import AdminDashboard from "../pages/AdminDashboard";
import VetAccess from "../pages/VetAccess";
import QRGeneralAccess from "../pages/QRGeneralAccess";
import ClinicalRecordDetail from "../pages/ClinicalRecordDetail";
import AddVetConsultation from "../pages/AddVetConsultation";
import NotFound from "../pages/NotFound";
import ProtectedRoute from "../components/ProtectedRoute";

function AppRouter() {
  return (
    <Routes>
      {/* Rutas especiales sin layout para acceso QR */}
      <Route path="/qr/vet-access" element={<VetAccess />} />
      <Route path="/qr/gral-access" element={<QRGeneralAccess />} />
      
      <Route element={<Layout />}>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        
        {/* Rutas protegidas */}
        <Route 
          path="/dashboard" 
          element={
            <ProtectedRoute allowedRoles={["CUIDADOR", "ADMIN"]}>
              <Dashboard />
            </ProtectedRoute>
          } 
        />
<Route
  path="/pets/new"
  element={
    <ProtectedRoute allowedRoles={["CUIDADOR", "ADMIN"]}>
      <AddPet />
    </ProtectedRoute>
  }
/>
<Route
  path="/add-pet"
  element={
    <ProtectedRoute allowedRoles={["CUIDADOR", "VET", "ADMIN"]}>
      <AddPet />
    </ProtectedRoute>
  }
/>
        <Route 
          path="/pets/:id" 
          element={
            <ProtectedRoute allowedRoles={["CUIDADOR", "VET", "ADMIN"]}>
              <PetDetail />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/pets/:id/edit" 
          element={
            <ProtectedRoute allowedRoles={["CUIDADOR", "ADMIN"]}>
              <EditPet />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/pets/:petId/medical-records/new" 
          element={
            <ProtectedRoute allowedRoles={["CUIDADOR", "VET", "ADMIN"]}>
              <AddMedicalRecord />
            </ProtectedRoute>
          } 
        />
        <Route
          path="/pets/:petId/clinical-records/:recordId"
          element={
            <ProtectedRoute allowedRoles={["CUIDADOR", "VET", "ADMIN"]}>
              <ClinicalRecordDetail />
            </ProtectedRoute>
          }
        />
        <Route
          path="/add-consultation/:petId?"
          element={
            <ProtectedRoute allowedRoles={["VET", "ADMIN"]}>
              <AddVetConsultation />
            </ProtectedRoute>
          }
        />
        <Route
          path="/vet-dashboard"
          element={
            <ProtectedRoute allowedRoles={["VET", "ADMIN"]}>
              <VetDashboard />
            </ProtectedRoute>
          }
        />
        <Route 
          path="/admin-dashboard" 
          element={
            <ProtectedRoute allowedRoles={["ADMIN"]}>
              <AdminDashboard />
            </ProtectedRoute>
          } 
        />
        
        <Route path="*" element={<NotFound />} />
      </Route>
    </Routes>
  );
}

export default AppRouter;
