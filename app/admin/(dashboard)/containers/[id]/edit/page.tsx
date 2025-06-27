"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import ContainerForm from "@/components/admin/containers/container-form";
import { containerService, Container } from "@/lib/services";
import { Loader2 } from "lucide-react";

export default function EditContainerPage() {
  const { id } = useParams<{ id: string }>();
  const [data, setData] = useState<Container | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    if (!id) return;
    (async () => {
      try {
        const res = await containerService.get(Number(id));
        if (!res) {
          router.push("/admin/containers");
          return;
        }
        setData(res);
      } catch (err) {
        console.error(err);
        router.push("/admin/containers");
      } finally {
        setLoading(false);
      }
    })();
  }, [id, router]);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="h-6 w-6 animate-spin" />
      </div>
    );
  }

  if (!data) return null;

  return <ContainerForm initialData={data} />;
} 