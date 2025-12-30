import { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { Layout } from "@/components/layout";
import { ArrowLeft, Loader2, AlertCircle, MapPin } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { COW } from "@shared/api";
import { StatusBadge } from "@/components/cow/StatusBadge";
import { format } from "date-fns";

export default function COWDetail() {
  const { cowId } = useParams<{ cowId: string }>();
  const navigate = useNavigate();
  const [cow, setCow] = useState<COW | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchCOWDetail();
  }, [cowId]);

  async function fetchCOWDetail() {
    if (!cowId) return;
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`/api/cows/${cowId}`);
      if (!response.ok) {
        if (response.status === 404) {
          setError("COW not found");
        } else {
          throw new Error("Failed to fetch COW details");
        }
        return;
      }
      const data = await response.json();
      setCow(data.data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to fetch COW details");
    } finally {
      setLoading(false);
    }
  }

  if (loading) {
    return (
      <Layout>
        <div className="flex items-center justify-center py-12">
          <div className="text-center">
            <Loader2 size={32} className="animate-spin text-primary mx-auto mb-3" />
            <p className="text-muted-foreground">Loading COW details...</p>
          </div>
        </div>
      </Layout>
    );
  }

  if (error || !cow) {
    return (
      <Layout>
        <div className="space-y-4">
          <button
            onClick={() => navigate("/cows")}
            className="inline-flex items-center gap-2 px-3 py-2 text-sm font-medium text-primary hover:text-primary/80 transition-colors"
          >
            <ArrowLeft size={18} />
            Back to Registry
          </button>
          <div className="bg-red-50 border border-red-200 rounded-lg p-6 flex items-start gap-4">
            <AlertCircle size={24} className="text-red-600 flex-shrink-0" />
            <div>
              <h2 className="font-semibold text-red-900 mb-1">Error</h2>
              <p className="text-red-800">{error || "COW not found"}</p>
            </div>
          </div>
        </div>
      </Layout>
    );
  }

  const Field = ({
    label,
    value,
    unit,
  }: {
    label: string;
    value: any;
    unit?: string;
  }) => (
    <div>
      <p className="text-xs font-medium text-muted-foreground mb-1">{label}</p>
      <p className="text-sm font-medium text-foreground">
        {value || "—"} {unit && value ? unit : ""}
      </p>
    </div>
  );

  return (
    <Layout>
      <div className="space-y-6">
        <div className="flex items-start justify-between">
          <div>
            <button
              onClick={() => navigate("/cows")}
              className="inline-flex items-center gap-2 px-3 py-2 text-sm font-medium text-primary hover:text-primary/80 transition-colors mb-4"
            >
              <ArrowLeft size={18} />
              Back to Registry
            </button>
            <h1 className="text-3xl font-bold text-foreground mb-2">
              {cow.siteLabel || "COW"} ({cow.cowId})
            </h1>
            <div className="flex items-center gap-3 flex-wrap">
              <StatusBadge status={cow.siteStatus} />
              {cow.remote && (
                <span className="text-xs font-medium text-muted-foreground bg-muted px-2 py-1 rounded">
                  Remote Site
                </span>
              )}
              {cow.underReplacement && (
                <span className="text-xs font-medium text-amber-700 bg-amber-50 border border-amber-200 px-2 py-1 rounded">
                  Under Replacement
                </span>
              )}
            </div>
          </div>
        </div>

        <div className="bg-card border border-border rounded-lg p-6 grid grid-cols-1 md:grid-cols-4 gap-6">
          <Field label="Region" value={cow.region} />
          <Field label="City" value={cow.city} />
          <Field label="Location" value={cow.location} />
          <Field label="Vendor" value={cow.vendor} />
        </div>

        <Tabs defaultValue="general" className="w-full">
          <TabsList className="bg-muted border-b border-border rounded-none w-full grid w-full grid-cols-7">
            <TabsTrigger value="general">General</TabsTrigger>
            <TabsTrigger value="technology">Technology</TabsTrigger>
            <TabsTrigger value="power">Power</TabsTrigger>
            <TabsTrigger value="bbu">BBU</TabsTrigger>
            <TabsTrigger value="hvac">HVAC</TabsTrigger>
            <TabsTrigger value="security">Security</TabsTrigger>
            <TabsTrigger value="transport">Transport</TabsTrigger>
          </TabsList>

          <TabsContent value="general" className="bg-card border border-t-0 border-border rounded-b-lg p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <Field label="COW ID" value={cow.cowId} />
              <Field label="Site Label" value={cow.siteLabel} />
              <Field label="EBU / Non-EBU" value={cow.ebuNonEbu} />
              <Field label="Region" value={cow.region} />
              <Field label="District" value={cow.district} />
              <Field label="City" value={cow.city} />
              <Field label="Location" value={cow.location} />
              <Field label="Site Status" value={cow.siteStatus} />
              <Field label="Vendor" value={cow.vendor} />
              <Field label="COW Age" value={cow.cowAge} />
              <Field label="Remote / Metro" value={cow.remote ? "Remote" : "Metropolitan"} />

              {(cow.latitude || cow.longitude) && (
                <div className="md:col-span-2 lg:col-span-3">
                  <p className="text-xs font-medium text-muted-foreground mb-2">Location Coordinates</p>
                  <div className="flex items-center gap-2 text-sm font-medium text-foreground">
                    <MapPin size={16} className="text-primary" />
                    {cow.latitude}, {cow.longitude}
                  </div>
                </div>
              )}

              {cow.remarks && (
                <div className="md:col-span-2 lg:col-span-3">
                  <p className="text-xs font-medium text-muted-foreground mb-2">Remarks</p>
                  <p className="text-sm text-foreground bg-muted/50 p-3 rounded border border-border">
                    {cow.remarks}
                  </p>
                </div>
              )}
            </div>
          </TabsContent>

          <TabsContent value="technology" className="bg-card border border-t-0 border-border rounded-b-lg p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div>
                <p className="text-xs font-semibold text-muted-foreground mb-3 uppercase">Availability</p>
                <div className="space-y-3">
                  <Field label="2G" value={cow.availability2g || (cow.technology2g ? "Yes" : "—")} />
                  <Field label="3G" value={cow.availability3g || (cow.technology3g ? "Yes" : "—")} />
                  <Field label="LTE" value={cow.availabilityLte || (cow.technologyLte ? "Yes" : "—")} />
                  <Field label="5G" value={cow.availability5g || (cow.technology5g ? "Yes" : "—")} />
                </div>
              </div>

              <div>
                <p className="text-xs font-semibold text-muted-foreground mb-3 uppercase">Configuration</p>
                <div className="space-y-3">
                  <Field label="2G Config" value={cow.configuration2g} />
                  <Field label="3G Config" value={cow.configuration3g} />
                  <Field label="LTE Config" value={cow.configurationLte} />
                  <Field label="5G Config" value={cow.configuration5g} />
                </div>
              </div>

              <div>
                <p className="text-xs font-semibold text-muted-foreground mb-3 uppercase">Band Configuration</p>
                <div className="space-y-3">
                  <Field label="LTE Band Count" value={cow.lteBandCount} />
                  <Field label="5G Band Count" value={cow._5gBandCount} />
                  <Field label="LTE Config Level" value={cow.lteConfigurationLevel} />
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="power" className="bg-card border border-t-0 border-border rounded-b-lg p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div>
                <p className="text-xs font-semibold text-muted-foreground mb-3 uppercase">Status</p>
                <div className="space-y-3">
                  <Field label="PG Status" value={cow.pgStatus} />
                  <Field label="MDB Status" value={cow.mdbStatus} />
                  <Field label="MDB Type" value={cow.mdbType} />
                  <Field label="SEC Connection" value={cow.secConnection} />
                </div>
              </div>

              <div>
                <p className="text-xs font-semibold text-muted-foreground mb-3 uppercase">Generator</p>
                <div className="space-y-3">
                  <Field label="Genset Qty" value={cow.gensetQty} />
                  <Field label="Genset Make" value={cow.gensetMake} />
                  <Field label="Engine" value={cow.engine} />
                  <Field label="Alternator" value={cow.alternator} />
                </div>
              </div>

              <div>
                <p className="text-xs font-semibold text-muted-foreground mb-3 uppercase">Specs</p>
                <div className="space-y-3">
                  <Field label="Capacity" value={cow.capacity} />
                  <Field label="Fuel Tank Capacity" value={cow.fuelTankCapacity} />
                  <Field label="Cooling System" value={cow.coolingSystem} />
                  <Field label="Under Repairing/OVH" value={cow.underRepairingOvhauling} />
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="bbu" className="bg-card border border-t-0 border-border rounded-b-lg p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div>
                <p className="text-xs font-semibold text-muted-foreground mb-3 uppercase">BBU</p>
                <div className="space-y-3">
                  <Field label="Installed BBU" value={cow.installedBbu} />
                  <Field label="BBU Brand" value={cow.bbuBrand} />
                  <Field label="BBU Status" value={cow.bbuStatus} />
                  <Field label="Volt & Capacity" value={cow.voltCapacity} />
                </div>
              </div>

              <div>
                <p className="text-xs font-semibold text-muted-foreground mb-3 uppercase">Cells & Strings</p>
                <div className="space-y-3">
                  <Field label="No of Cells" value={cow.noOfCells} />
                  <Field label="No of Strings" value={cow.noOfStrings} />
                  <Field label="Backup Time" value={cow.backupTime} />
                </div>
              </div>

              <div>
                <p className="text-xs font-semibold text-muted-foreground mb-3 uppercase">DC Power</p>
                <div className="space-y-3">
                  <Field label="DC Power Brand" value={cow.dcPowerBrand} />
                  <Field label="Total Capacity" value={cow.totalCapacity} />
                  <Field label="Cabinet Status" value={cow.cabinetStatus} />
                  <Field label="Rectifiers Installed" value={cow.rectifiersInstalled} />
                  <Field label="Rectifiers Required" value={cow.rectifiersRequired} />
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="hvac" className="bg-card border border-t-0 border-border rounded-b-lg p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div>
                <p className="text-xs font-semibold text-muted-foreground mb-3 uppercase">Shelter</p>
                <div className="space-y-3">
                  <Field label="Shelter / Outdoor" value={cow.shelterOutdoor} />
                </div>
              </div>

              <div>
                <p className="text-xs font-semibold text-muted-foreground mb-3 uppercase">AC</p>
                <div className="space-y-3">
                  <Field label="AC Make" value={cow.acMake} />
                  <Field label="AC Type" value={cow.acType} />
                  <Field label="AC Capacity" value={cow.acCapacity} />
                  <Field label="AC Qty" value={cow.acQty} />
                  <Field label="AC Status #1" value={cow.acStatus1} />
                  <Field label="AC Status #2" value={cow.acStatus2} />
                </div>
              </div>

              <div>
                <p className="text-xs font-semibold text-muted-foreground mb-3 uppercase">HVAC</p>
                <div className="space-y-3">
                  <Field label="HVAC Brand" value={cow.hvacBrand} />
                  <Field label="HVAC Status" value={cow.hvacStatus} />
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="security" className="bg-card border border-t-0 border-border rounded-b-lg p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div>
                <p className="text-xs font-semibold text-muted-foreground mb-3 uppercase">Fire Panel</p>
                <div className="space-y-3">
                  <Field label="Fire Panel Type" value={cow.firePanelType} />
                  <Field label="Fire Panel Status" value={cow.firePanelStatus} />
                </div>
              </div>

              <div>
                <p className="text-xs font-semibold text-muted-foreground mb-3 uppercase">Cylinders</p>
                <div className="space-y-3">
                  <Field label="Cylinder Status" value={cow.cylinderStatus} />
                  <Field label="Manual / Auto" value={cow.manualAuto} />
                </div>
              </div>

              <div>
                <p className="text-xs font-semibold text-muted-foreground mb-3 uppercase">Other Security</p>
                <div className="space-y-3">
                  <Field label="Shelter Tube Rods" value={cow.shelterTubeRodsStatus} />
                  <Field label="Security Light Status" value={cow.securityLightStatus} />
                  <Field label="GPS Status" value={cow.gpsStatus} />
                  <Field label="Combination #" value={cow.combinationNumber} />
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="transport" className="bg-card border border-t-0 border-border rounded-b-lg p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div>
                <p className="text-xs font-semibold text-muted-foreground mb-3 uppercase">Tower</p>
                <div className="space-y-3">
                  <Field label="Tower Height" value={cow.towerHeight} unit="m" />
                  <Field label="Tower Type" value={cow.towerType} />
                  <Field label="Tower System" value={cow.towerSystem} />
                </div>
              </div>

              <div>
                <p className="text-xs font-semibold text-muted-foreground mb-3 uppercase">Vehicle</p>
                <div className="space-y-3">
                  <Field label="Vehicle Make" value={cow.vehicleMake} />
                  <Field label="Plate # (English)" value={cow.plateNumberEnglish} />
                  <Field label="Plate # (Arabic)" value={cow.plateNumberArabic} />
                </div>
              </div>

              <div>
                <p className="text-xs font-semibold text-muted-foreground mb-3 uppercase">Microwave Link</p>
                <div className="space-y-3">
                  <Field label="MW Dish" value={cow.mwDish} />
                  <Field label="MW Frequency" value={cow.mwFrequency} />
                  <Field label="MW Configuration" value={cow.mwConfiguration} />
                  <Field label="MW Link Type" value={cow.mwLinkType} />
                </div>
              </div>

              <div className="md:col-span-2 lg:col-span-3">
                <Field label="Last Deploy Date" value={cow.lastDeployDate} />
              </div>
            </div>
          </TabsContent>
        </Tabs>

        <div className="text-xs text-muted-foreground space-y-1 pt-4 border-t border-border">
          <p>Last synced from source: {format(new Date(cow.lastSyncedAt), "dd-MM-yyyy HH:mm")}</p>
          <p>Last updated: {format(new Date(cow.lastUpdatedAt), "dd-MM-yyyy HH:mm")}</p>
        </div>
      </div>
    </Layout>
  );
}
