"use client";

import { useState, useEffect } from "react";

// Components
import { UserManagementHeader } from "@/components/portal/admin/managementpage/UserManagementHeader";
import { UserTable } from "@/components/portal/admin/managementpage/UserTable";
import { UserDetailsModal } from "@/components/portal/admin/managementpage/UserDetailsModal";
import { MessageModal } from "@/components/portal/admin/managementpage/MessageModal";
import { DeleteConfirmationModal } from "@/components/portal/admin/managementpage/DeleteConfirmationModal";
import { Pagination } from "@/components/portal/admin/managementpage/Pagination";
import { toast } from "sonner";

// Types
import {
  ClientWithStats,
  VendorWithStats,
  UserType,
  SortConfig,
} from "@/lib/types/user.types";
import {
  PaginatedApiResponse,
  Pagination as PaginationState,
} from "@/lib/types/apiResponse.types";

//Styles
import { montserrat } from "@/styles/fonts";

export default function ManagementPage() {
  const [userType, setUserType] = useState<UserType>("CLIENT");
  const [searchQuery, setSearchQuery] = useState("");
  const [sortConfig, setSortConfig] = useState<SortConfig | null>(null);
  const [pagination, setPagination] = useState<PaginationState>({
    totalItems: 0,
    totalPages: 1,
    currentPage: 1,
    pageSize: 10,
  });
  const [users, setUsers] = useState<ClientWithStats[] | VendorWithStats[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedUser, setSelectedUser] = useState<
    ClientWithStats | VendorWithStats | null
  >(null);
  const [userToMessage, setUserToMessage] = useState<
    ClientWithStats | VendorWithStats | null
  >(null);
  const [showMessageModal, setShowMessageModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [userToDelete, setUserToDelete] = useState<{
    id: string;
    type: UserType;
  } | null>(null);

  useEffect(() => {
    const fetchUsers = async () => {
      setLoading(true);
      try {
        const apiUrl =
          userType === "CLIENT" ? "/api/users/clients" : "/api/users/vendors";
        const params = new URLSearchParams({
          page: pagination.currentPage.toString(),
          limit: pagination.pageSize.toString(),
          search: searchQuery,
          sortField: sortConfig?.key || "",
          sortOrder: sortConfig?.direction || "",
        });
        const response = await fetch(`${apiUrl}?${params}`);
        if (!response.ok) throw new Error("Failed to fetch users");
        const data: PaginatedApiResponse<
          ClientWithStats[] | VendorWithStats[]
        > = await response.json();
        setUsers(data.data);
        setPagination({
          totalItems: data.pagination?.totalItems || 0,
          currentPage: data.pagination?.currentPage || 1,
          totalPages: data.pagination?.totalPages || 1,
          pageSize: data.pagination?.pageSize || 10,
        });
      } catch (error) {
        console.error("Error fetching users:", error);
        toast.error("Erreur lors de la récupération des utilisateurs");
      } finally {
        setLoading(false);
      }
    };
    fetchUsers();
  }, [
    userType,
    searchQuery,
    sortConfig,
    pagination.currentPage,
    pagination.pageSize,
  ]);

  const handleDelete = (id: string, type: UserType) => {
    setUserToDelete({ id, type });
    setShowDeleteModal(true);
  };

  const confirmDelete = async () => {
    if (!userToDelete) return;
    try {
      const response = await fetch(`/api/users/${userToDelete.id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || "Failed to delete user");
      }

      setUsers(
        users.filter((user) => user.id !== userToDelete.id) as typeof users
      );
      toast.success("Utilisateur supprimé avec succès");
    } catch (error) {
      console.error("Error deleting user:", error);
      toast.error(error instanceof Error ? error.message : "Erreur lors de la suppression de l'utilisateur");
    } finally {
      setShowDeleteModal(false);
      setUserToDelete(null);
    }
  };

  const handleSendMessage = async (userId: string, message: string) => {
    try {
      const response = await fetch("/api/notifications/admin-message", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId, text: message }),
      });
      if (!response.ok) throw new Error("Failed to send message");
      toast.success("Message envoyé avec succès");
    } catch (error) {
      console.error("Error sending message:", error);
      toast.error("Erreur lors de l'envoi du message");
    }
  };

  const handleExport = async () => {
    try {
      toast.info("Préparation de l'export en cours...");
      
      const apiUrl = userType === "CLIENT" ? "/api/users/clients" : "/api/users/vendors";
      const params = new URLSearchParams({
        page: "1",
        limit: "10000",
        search: searchQuery,
        sortField: sortConfig?.key || "",
        sortOrder: sortConfig?.direction || "",
      });
      
      const response = await fetch(`${apiUrl}?${params}`);
      if (!response.ok) throw new Error("Erreur de récupération pour l'export");
      
      const data = await response.json();
      const usersToExport = data.data;

      if (!usersToExport || usersToExport.length === 0) {
        toast.warning("Aucune donnée à exporter.");
        return;
      }

      let csvContent = "";
      
      if (userType === "CLIENT") {
        const headers = ["Nom", "Prénom", "Email", "Téléphone", "Date d'inscription", "Commandes", "Total Dépensé (FCFA)"];
        csvContent = [
          headers.join(","),
          ...(usersToExport as ClientWithStats[]).map((u) => {
            return [
              `"${(u.nom || "").replace(/"/g, '""')}"`,
              `"${(u.prenom || "").replace(/"/g, '""')}"`,
              `"${(u.email || "").replace(/"/g, '""')}"`,
              `"${(u.tel || "").replace(/"/g, '""')}"`,
              `"${new Date(u.dateCreation).toLocaleDateString("fr-FR")}"`,
              u.stats?.totalCommandes || 0,
              u.stats?.totalDepenses || 0,
            ].join(",");
          }),
        ].join("\n");
      } else {
        const headers = ["Nom Boutique", "Propriétaire", "Email", "Téléphone", "Date d'inscription", "Total Ventes (FCFA)", "Produits Vendus", "Total Produits"];
        csvContent = [
          headers.join(","),
          ...(usersToExport as VendorWithStats[]).map((u) => {
            return [
              `"${(u.vendeur?.nomBoutique || "").replace(/"/g, '""')}"`,
              `"${`${u.nom || ""} ${u.prenom || ""}`.trim().replace(/"/g, '""')}"`,
              `"${(u.email || "").replace(/"/g, '""')}"`,
              `"${(u.tel || "").replace(/"/g, '""')}"`,
              `"${new Date(u.dateCreation).toLocaleDateString("fr-FR")}"`,
              u.stats?.totalVentes || 0,
              u.stats?.produitsVendus || 0,
              u.stats?.totalProduits || 0,
            ].join(",");
          }),
        ].join("\n");
      }

      const blob = new Blob(["\ufeff", csvContent], { type: "text/csv;charset=utf-8;" });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.setAttribute("href", url);
      link.setAttribute("download", `export_${userType.toLowerCase()}s_${new Date().toISOString().split("T")[0]}.csv`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      toast.success("Export réussi !");
    } catch (error) {
      console.error("Export error:", error);
      toast.error("Erreur lors de l'export des données");
    }
  };

  return (
    <div
      className={`min-h-screen bg-gradient-to-br from-gray-50 to-gray-200 py-6 px-4 sm:px-6 lg:px-10 ${montserrat.className}`}
    >
      <div className="max-w-7xl mx-auto">
        <UserManagementHeader
          userType={userType}
          setUserType={setUserType}
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          sortConfig={sortConfig}
          setSortConfig={setSortConfig}
          onExport={handleExport}
        />
        <UserTable
          users={users}
          userType={userType}
          onDelete={handleDelete}
          onMessage={(user) => {
            setUserToMessage(user);
            setShowMessageModal(true);
          }}
          onSelectUser={setSelectedUser}
          loading={loading}
        />
        <Pagination
          currentPage={pagination.currentPage}
          totalPages={pagination.totalPages}
          onPageChange={(page) =>
            setPagination({ ...pagination, currentPage: page })
          }
        />
        {selectedUser && (
          <UserDetailsModal
            user={selectedUser}
            onClose={() => setSelectedUser(null)}
          />
        )}
        {showMessageModal && userToMessage && (
          <MessageModal
            user={userToMessage}
            onClose={() => {
              setShowMessageModal(false);
              setUserToMessage(null);
            }}
            onSend={handleSendMessage}
          />
        )}
        {showDeleteModal && (
          <DeleteConfirmationModal
            onConfirm={confirmDelete}
            onCancel={() => setShowDeleteModal(false)}
          />
        )}
      </div>
    </div>
  );
}
