import { Settings as SettingsForm } from "../modules/settings/settings";

export default function Settings() {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        gap: "16px",
        height: "100%",
        overflow: "auto",
      }}
    >
      <SettingsForm />
    </div>
  );
}
