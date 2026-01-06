import { useState } from "react";
import { Layout } from "@/components/layout";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Plus, Trash2, Edit2, Package, X } from "lucide-react";

interface Supplier {
  id: string;
  name: string;
  crNumber?: string;
  vatNumber?: string;
  contactPerson?: string;
  phone?: string;
  email?: string;
  equipment?: string[];
}

const EQUIPMENT_LIST = [
  "Backfill",
  "Boom Truck",
  "Boom Truck 6*6",
  "Bulldozer",
  "Crane 100",
  "Crane 110",
  "Crane 160",
  "Crane 25",
  "Crane 30",
  "Crane 50",
  "Crane 90",
  "Forklift",
  "Heavy Driver",
  "JCP",
  "Low bed",
  "Manitift",
  "Prime Mover",
  "Prime mover 4*4",
  "Prime mover 6*6",
  "Shevol",
  "Special Low bed",
  "Trailer",
  "Trailer 4*4",
];

const INITIAL_SUPPLIERS: Supplier[] = [
  { id: "1", name: "Masar Al Metahidah", equipment: [] },
  { id: "2", name: "Engineering Intelligence", equipment: [] },
  { id: "3", name: "Sheikha Al-Mutairi", equipment: [] },
  { id: "4", name: "Nakilat Al Khair", equipment: [] },
  { id: "5", name: "Sword of Time Logistics Services", equipment: [] },
  { id: "6", name: "Seera Alraedah Cont. Est.", equipment: [] },
  { id: "7", name: "Rawafie Al Majd for Equipment Rental Est.", equipment: [] },
  { id: "8", name: "Quick Arrive for transportation Est.", equipment: [] },
  { id: "9", name: "Hamad Abdullah H . Al-Obaidan EST", equipment: [] },
  { id: "10", name: "Majed Sunhat Alotaibi EST", equipment: [] },
  {
    id: "11",
    name: "Balansia Alarbaia for General Contracting Est.",
    equipment: [],
  },
  {
    id: "12",
    name: "Abdullah Ibrahim Al-Subaie Contracting Est.",
    equipment: [],
  },
];

export default function Suppliers() {
  const [suppliers, setSuppliers] = useState<Supplier[]>(INITIAL_SUPPLIERS);
  const [formDialogOpen, setFormDialogOpen] = useState(false);
  const [detailDialogOpen, setDetailDialogOpen] = useState(false);
  const [selectedSupplier, setSelectedSupplier] = useState<Supplier | null>(
    null,
  );
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState<Supplier>({
    id: "",
    name: "",
    equipment: [],
  });

  const handleOpenFormDialog = (supplier?: Supplier) => {
    if (supplier) {
      setFormData({ ...supplier, equipment: supplier.equipment || [] });
      setEditingId(supplier.id);
    } else {
      setFormData({ id: "", name: "", equipment: [] });
      setEditingId(null);
    }
    setDetailDialogOpen(false);
    setFormDialogOpen(true);
  };

  const handleCloseFormDialog = () => {
    setFormDialogOpen(false);
    setFormData({ id: "", name: "", equipment: [] });
    setEditingId(null);
  };

  const handleOpenDetailDialog = (supplier: Supplier) => {
    setSelectedSupplier(supplier);
    setDetailDialogOpen(true);
  };

  const handleCloseDetailDialog = () => {
    setDetailDialogOpen(false);
    setSelectedSupplier(null);
  };

  const handleEquipmentChange = (equipment: string, checked: boolean) => {
    const currentEquipment = formData.equipment || [];
    if (checked) {
      setFormData({
        ...formData,
        equipment: [...currentEquipment, equipment],
      });
    } else {
      setFormData({
        ...formData,
        equipment: currentEquipment.filter((e) => e !== equipment),
      });
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.name.trim()) {
      alert("Supplier name is required");
      return;
    }

    if (editingId) {
      // Update existing supplier
      setSuppliers(
        suppliers.map((s) =>
          s.id === editingId
            ? {
                ...formData,
                id: editingId,
                equipment: formData.equipment || [],
              }
            : s,
        ),
      );
    } else {
      // Add new supplier
      const newSupplier: Supplier = {
        ...formData,
        id: Date.now().toString(),
        equipment: formData.equipment || [],
      };
      setSuppliers([...suppliers, newSupplier]);
    }

    handleCloseFormDialog();
  };

  const handleDelete = (id: string) => {
    if (confirm("Are you sure you want to delete this supplier?")) {
      setSuppliers(suppliers.filter((s) => s.id !== id));
      handleCloseDetailDialog();
    }
  };

  return (
    <Layout>
      <div className="space-y-6">
        {/* Header with ACES Branding */}
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <div className="w-2 h-8 bg-primary rounded-sm"></div>
              <h1 className="text-3xl font-bold text-foreground">
                Supplier Management
              </h1>
            </div>
            <p className="text-muted-foreground ml-5">
              ACES Supplier Registry • Manage supplier master data including
              names, CR/VAT numbers, contact details, equipment, and contract
              terms
            </p>
          </div>
          <Dialog open={formDialogOpen} onOpenChange={setFormDialogOpen}>
            <DialogTrigger asChild>
              <Button onClick={() => handleOpenFormDialog()} className="gap-2">
                <Plus size={18} />
                Add Supplier
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>
                  {editingId ? "Edit Supplier" : "Add New Supplier"}
                </DialogTitle>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-foreground block mb-2">
                    Supplier Name *
                  </label>
                  <Input
                    placeholder="Enter supplier name"
                    value={formData.name}
                    onChange={(e) =>
                      setFormData({ ...formData, name: e.target.value })
                    }
                    autoFocus
                  />
                </div>

                <div>
                  <label className="text-sm font-medium text-foreground block mb-2">
                    CR Number
                  </label>
                  <Input
                    placeholder="Commercial Registration number"
                    value={formData.crNumber || ""}
                    onChange={(e) =>
                      setFormData({ ...formData, crNumber: e.target.value })
                    }
                  />
                </div>

                <div>
                  <label className="text-sm font-medium text-foreground block mb-2">
                    VAT Number
                  </label>
                  <Input
                    placeholder="VAT identification number"
                    value={formData.vatNumber || ""}
                    onChange={(e) =>
                      setFormData({ ...formData, vatNumber: e.target.value })
                    }
                  />
                </div>

                <div>
                  <label className="text-sm font-medium text-foreground block mb-2">
                    Contact Person
                  </label>
                  <Input
                    placeholder="Primary contact person name"
                    value={formData.contactPerson || ""}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        contactPerson: e.target.value,
                      })
                    }
                  />
                </div>

                <div>
                  <label className="text-sm font-medium text-foreground block mb-2">
                    Phone
                  </label>
                  <Input
                    placeholder="Phone number"
                    value={formData.phone || ""}
                    onChange={(e) =>
                      setFormData({ ...formData, phone: e.target.value })
                    }
                  />
                </div>

                <div>
                  <label className="text-sm font-medium text-foreground block mb-2">
                    Email
                  </label>
                  <Input
                    placeholder="Email address"
                    type="email"
                    value={formData.email || ""}
                    onChange={(e) =>
                      setFormData({ ...formData, email: e.target.value })
                    }
                  />
                </div>

                <div>
                  <label className="text-sm font-medium text-foreground block mb-2">
                    Equipment Available
                  </label>
                  <div className="border border-border rounded-lg p-4 bg-secondary/20">
                    <ScrollArea className="h-48">
                      <div className="space-y-3 pr-4">
                        {EQUIPMENT_LIST.map((equipment) => (
                          <div
                            key={equipment}
                            className="flex items-center gap-3"
                          >
                            <Checkbox
                              id={equipment}
                              checked={(formData.equipment || []).includes(
                                equipment,
                              )}
                              onCheckedChange={(checked) =>
                                handleEquipmentChange(
                                  equipment,
                                  checked as boolean,
                                )
                              }
                            />
                            <label
                              htmlFor={equipment}
                              className="text-sm text-foreground cursor-pointer flex-1"
                            >
                              {equipment}
                            </label>
                          </div>
                        ))}
                      </div>
                    </ScrollArea>
                  </div>
                  <p className="text-xs text-muted-foreground mt-2">
                    Selected: {(formData.equipment || []).length} equipment
                  </p>
                </div>

                <div className="flex gap-3 pt-4">
                  <Button type="submit" className="flex-1">
                    {editingId ? "Update Supplier" : "Add Supplier"}
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={handleCloseFormDialog}
                    className="flex-1"
                  >
                    Cancel
                  </Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        {/* Suppliers Grid - ACES Themed Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
          {suppliers.length === 0 ? (
            <div className="col-span-full flex items-center justify-center min-h-96 text-center">
              <div className="space-y-2">
                <p className="text-lg font-semibold text-foreground">
                  No suppliers found
                </p>
                <p className="text-sm text-muted-foreground">
                  Click "Add Supplier" to create your first supplier
                </p>
              </div>
            </div>
          ) : (
            suppliers.map((supplier) => (
              <Card
                key={supplier.id}
                className="p-3 cursor-pointer border-2 border-primary/20 hover:border-primary hover:bg-primary/5 transition-all duration-200 relative overflow-hidden group"
                onClick={() => handleOpenDetailDialog(supplier)}
              >
                {/* ACES Frame Top-Left Accent */}
                <div className="absolute top-0 left-0 w-1 h-6 bg-primary rounded-br opacity-0 group-hover:opacity-100 transition-opacity"></div>
                {/* ACES Frame Top-Right Accent */}
                <div className="absolute top-0 right-0 w-1 h-6 bg-primary rounded-bl opacity-0 group-hover:opacity-100 transition-opacity"></div>

                <p className="text-sm font-medium text-foreground text-center truncate">
                  {supplier.name}
                </p>
                {supplier.equipment && supplier.equipment.length > 0 && (
                  <p className="text-xs text-muted-foreground text-center mt-2">
                    {supplier.equipment.length} equipment
                  </p>
                )}
              </Card>
            ))
          )}
        </div>

        {/* Summary */}
        {suppliers.length > 0 && (
          <Card className="p-4 bg-secondary/30">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-muted-foreground">
                  Total suppliers:{" "}
                  <span className="font-semibold text-foreground">
                    {suppliers.length}
                  </span>
                </p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">
                  Suppliers with equipment:{" "}
                  <span className="font-semibold text-foreground">
                    {
                      suppliers.filter(
                        (s) => s.equipment && s.equipment.length > 0,
                      ).length
                    }
                  </span>
                </p>
              </div>
            </div>
          </Card>
        )}

        {/* Supplier Detail Dialog */}
        <Dialog open={detailDialogOpen} onOpenChange={setDetailDialogOpen}>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            {selectedSupplier && (
              <>
                <DialogHeader>
                  <div className="flex items-start justify-between w-full">
                    <DialogTitle>{selectedSupplier.name}</DialogTitle>
                    <button
                      onClick={handleCloseDetailDialog}
                      className="mt-2 text-muted-foreground hover:text-foreground"
                    >
                      <X size={20} />
                    </button>
                  </div>
                </DialogHeader>

                <div className="space-y-6 py-4">
                  {/* Basic Information */}
                  <div className="space-y-3">
                    <h3 className="text-sm font-semibold text-foreground">
                      Basic Information
                    </h3>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      {selectedSupplier.crNumber && (
                        <div>
                          <p className="text-muted-foreground">CR Number</p>
                          <p className="font-medium text-foreground">
                            {selectedSupplier.crNumber}
                          </p>
                        </div>
                      )}
                      {selectedSupplier.vatNumber && (
                        <div>
                          <p className="text-muted-foreground">VAT Number</p>
                          <p className="font-medium text-foreground">
                            {selectedSupplier.vatNumber}
                          </p>
                        </div>
                      )}
                      {selectedSupplier.contactPerson && (
                        <div>
                          <p className="text-muted-foreground">Contact Person</p>
                          <p className="font-medium text-foreground">
                            {selectedSupplier.contactPerson}
                          </p>
                        </div>
                      )}
                      {selectedSupplier.phone && (
                        <div>
                          <p className="text-muted-foreground">Phone</p>
                          <p className="font-medium text-foreground">
                            {selectedSupplier.phone}
                          </p>
                        </div>
                      )}
                      {selectedSupplier.email && (
                        <div className="col-span-2">
                          <p className="text-muted-foreground">Email</p>
                          <p className="font-medium text-foreground break-all">
                            {selectedSupplier.email}
                          </p>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Equipment Section */}
                  <div className="space-y-3">
                    <div className="flex items-center gap-2">
                      <Package size={16} className="text-primary" />
                      <h3 className="text-sm font-semibold text-foreground">
                        Equipment ({selectedSupplier.equipment?.length || 0})
                      </h3>
                    </div>
                    {selectedSupplier.equipment && selectedSupplier.equipment.length > 0 ? (
                      <div className="grid grid-cols-2 gap-2">
                        {selectedSupplier.equipment.map((eq) => (
                          <div
                            key={eq}
                            className="text-sm bg-primary/10 text-primary px-3 py-2 rounded"
                          >
                            {eq}
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-sm text-muted-foreground italic">
                        No equipment assigned
                      </p>
                    )}
                  </div>

                  {/* Actions */}
                  <div className="flex gap-2 pt-4 border-t border-border">
                    <Button
                      onClick={() => handleOpenFormDialog(selectedSupplier)}
                      className="flex-1 gap-2"
                    >
                      <Edit2 size={16} />
                      Edit
                    </Button>
                    <Button
                      onClick={() => handleDelete(selectedSupplier.id)}
                      variant="outline"
                      className="gap-2 text-red-600 hover:text-red-700"
                    >
                      <Trash2 size={16} />
                      Delete
                    </Button>
                  </div>
                </div>
              </>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </Layout>
  );
}
