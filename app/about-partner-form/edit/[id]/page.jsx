"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import toast, { Toaster } from "react-hot-toast";
import * as Yup from "yup";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";

export default function EditAboutPartnerForm({ params }) {
  const router = useRouter();
  const { id } = params; // Get the item ID from the URL
  const [isLoading, setIsLoading] = useState(true);
  const [itemData, setItemData] = useState(null);

  const validationSchema = Yup.object().shape({
    file: Yup.mixed().required("File is required"),
  });

  const formOptions = { resolver: yupResolver(validationSchema) };
  const { register, handleSubmit, formState: { errors }, setValue } = useForm(formOptions);

  useEffect(() => {
    const fetchAboutPartnerFormItem = async () => {
      try {
        const response = await fetch(`/api/about-partner-form/${id}`);
        if (!response.ok) {
          throw new Error("Failed to fetch about partner form item");
        }
        const data = await response.json();
        setItemData(data.data);
        // Set default value for the form
        setValue("file", data.data.file); // Assuming file path or URL is returned
      } catch (error) {
        console.error("Error fetching about partner form item:", error);
        toast.error("Failed to load about partner form item");
      } finally {
        setIsLoading(false);
      }
    };

    fetchAboutPartnerFormItem();
  }, [id, setValue]);

  const onSubmit = async (formData) => {
    const aboutData = new FormData();
    if (formData.file) {
      aboutData.append("file", formData.file[0]); // Only get the first file
    }

    try {
      const response = await fetch(`/api/about-partner-form/${id}`, {
        method: "PUT",
        body: aboutData,
      });

      if (!response.ok) {
        throw new Error("Failed to update about partner form item");
      }

      toast.success("About Partner form item updated successfully!");
      router.push("/about-partner-form");
    } catch (error) {
      console.error("Error updating about partner form item:", error);
      toast.error(`Failed to update about partner form item: ${error.message}`);
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="loader"></div> {/* Add your loading spinner here */}
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-gray-100 p-4">
      <h1 className="text-2xl font-bold mb-4 text-center">Edit Connect Partner Form</h1>
      <form onSubmit={handleSubmit(onSubmit)} className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4 space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">File</label>
          <input
            type="file"
            {...register("file")}
            className="mt-1 block w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 cursor-pointer"
          />
          {errors.file && <p className="text-red-500 text-sm mt-1">{errors.file.message}</p>}
        </div>

        <div>
          <button
            type="submit"
            className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-500 hover:bg-blue-600 focus:outline-none"
          >
            Update Connect Partner Form
          </button>
        </div>
      </form>
      <Toaster />
    </div>
  );
}
