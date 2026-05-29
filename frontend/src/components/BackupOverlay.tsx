import { useEffect, useState } from "react";
import { Spin } from "antd";
import type { BackupStatus } from "../types/electron";

export default function BackupOverlay() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    window.electronAPI?.onBackupStatus?.((status: BackupStatus) => {
      setVisible(status === "running");
    });
  }, []);

  if (!visible) return null;

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 9999,
        background: "rgba(0, 0, 0, 0.65)",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        gap: 20,
      }}
    >
      <Spin size="large" />
      <div style={{ color: "#fff", fontSize: 18 }}>
        Создаётся резервная копия базы данных…
      </div>
    </div>
  );
}
