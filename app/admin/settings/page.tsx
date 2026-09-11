import { DashHeader } from "@/components/dashboard/ui";
import { SettingsForm } from "@/components/admin/settings-form";
import { getSettings } from "@/lib/queries";
import { brand } from "@/lib/theme";

export default async function AdminSettingsPage() {
  const settings = await getSettings();
  const initial = {
    brand: settings?.brand ?? brand.name,
    tagline: settings?.tagline ?? brand.tagline,
    phones: (settings?.phones as string[]) ?? [],
    emails: (settings?.emails as string[]) ?? [],
    stats: (settings?.stats as { value: string; label: string }[]) ?? [],
  };
  return (
    <div>
      <DashHeader title="Settings" description="Brand, contact details and homepage stats." />
      <SettingsForm initial={initial} />
    </div>
  );
}
