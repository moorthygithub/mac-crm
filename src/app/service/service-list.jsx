import ApiErrorPage from "@/components/api-error/api-error";
import DataTable from "@/components/common/data-table";
import LoadingBar from "@/components/loader/loading-bar";
import { SERVICE_API } from "@/constants/apiConstants";
import { useGetApiMutation } from "@/hooks/useGetApiMutation";
import { Edit } from "lucide-react";

import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

const ServiceList = () => {
  const navigate = useNavigate();
  const {
    data: servicedata,
    isLoading,
    isError,
    refetch,
  } = useGetApiMutation({
    url: SERVICE_API.list,
    queryKey: ["service-list"],
  });
  console.log(servicedata?.data.data);

  const columns = [
    {
      header: "M Id",
      accessorKey: "m_id",
    },
    {
      header: "Name",
      accessorKey: "name",
      enableSorting: false,
    },
    {
      header: "Mobile",
      accessorKey: "mobile",
      enableSorting: false,
    },
    {
      header: "Area",
      accessorKey: "area",
      enableSorting: false,
    },
    {
      header: "Services",
      accessorKey: "services_name",
      enableSorting: false,
    },
    {
      header: "Hide Services",
      accessorKey: "hide_services_name",
      enableSorting: false,
    },

    {
      header: "Status",
      accessorKey: "status",
      cell: ({ row }) => (
        <span
          className={`px-2 py-1 rounded-full text-xs font-medium ${
            row.original.status === "Active"
              ? "bg-green-100 text-green-800"
              : "bg-red-100 text-red-800"
          }`}
        >
          {row.original.status}
        </span>
      ),
    },
    {
      header: "Actions",
      accessorKey: "actions",
      cell: ({ row }) => (
        <div className="flex gap-2">
          <Button
            size="icon"
            variant="outline"
            onClick={() => {
              navigate(`/client-list/edit/${row.original.id}`);
            }}
          >
            <Edit className="h-4 w-4" />
          </Button>
          <Button
            size="icon"
            variant="outline"
            onClick={() => {
              navigate(`/client-list/create-relation/`, {
                state: { m_id: row.original.m_id },
              });
            }}
          >
            <p className="h-4 w-4 flex justify-center">Add</p>
          </Button>
        </div>
      ),
      enableSorting: false,
    },
  ];
  if (isLoading) return <LoadingBar />;
  if (isError) return <ApiErrorPage onRetry={refetch} />;

  return (
    <>
      <DataTable
        data={servicedata}
        columns={columns}
        pageSize={50}
        searchPlaceholder="Search Service..."
        addButton={{
          onClick: () => {
            navigate("/service-list/create");
          },
          label: "Add Service",
        }}
      />
    </>
  );
};

export default ServiceList;
